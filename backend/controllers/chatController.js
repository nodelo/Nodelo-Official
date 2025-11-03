const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Contact = require('../models/Contact');
const User = require('../models/User');
const { uploadMultipleFiles } = require('../utils/cloudinaryUpload');
const { sendAdminReplyEmail } = require('../utils/email');

/**
 * Create or get existing chat from contact
 */
const createChatFromContact = async (req, res) => {
  try {
    const { contactId, adminId } = req.body;

    if (!contactId) {
      return res.status(400).json({
        success: false,
        error: 'Contact ID is required',
      });
    }

    // Find contact
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({ contactId });
    if (chat) {
      return res.json({
        success: true,
        message: 'Chat already exists',
        data: await Chat.findById(chat._id).populate('adminId', 'name email'),
      });
    }

    // Assign admin (use provided adminId or assign to requesting admin)
    const assignedAdminId = adminId || req.user._id;

    // Get admin info
    const admin = await User.findById(assignedAdminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found',
      });
    }

    // Create chat
    chat = new Chat({
      contactId,
      userId: contact.email,
      userName: contact.name,
      userEmail: contact.email,
      adminId: assignedAdminId,
      adminName: admin.name || admin.email,
      status: 'active',
    });

    await chat.save();

    // Update contact with chat link
    contact.chatId = chat._id;
    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: await Chat.findById(chat._id).populate('adminId', 'name email'),
    });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * Create new chat (without contact)
 */
const createChat = async (req, res) => {
  try {
    const { userName, userEmail, adminId } = req.body;

    if (!userName || !userEmail) {
      return res.status(400).json({
        success: false,
        error: 'User name and email are required',
      });
    }

    const assignedAdminId = adminId || req.user._id;
    const admin = await User.findById(assignedAdminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found',
      });
    }

    const chat = new Chat({
      userId: userEmail,
      userName,
      userEmail: userEmail.toLowerCase(),
      adminId: assignedAdminId,
      adminName: admin.name || admin.email,
      status: 'active',
    });

    await chat.save();

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: await Chat.findById(chat._id).populate('adminId', 'name email'),
    });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * Get all chats (admin)
 */
const getAllChats = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const query = {};
    if (status && ['active', 'resolved', 'archived'].includes(status)) {
      query.status = status;
    }

    // For non-admin, filter by userId
    if (req.query.userEmail) {
      query.userEmail = req.query.userEmail.toLowerCase();
    }

    const skip = (pageNum - 1) * limitNum;

    const [chats, total] = await Promise.all([
      Chat.find(query)
        .populate('adminId', 'name email')
        .populate('contactId', 'name email message')
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Chat.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: chats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * Get single chat with messages
 */
const getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50, userEmail } = req.query;

    const chat = await Chat.findById(id)
      .populate('adminId', 'name email')
      .populate('contactId', 'name email message');

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat not found',
      });
    }

    // Authorization: Non-admin users can only view their own chats
    if (!req.user) {
      // User request - must match email
      const requestEmail = userEmail || req.body.userEmail;
      if (!requestEmail || requestEmail.toLowerCase() !== chat.userEmail) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to view this chat',
        });
      }
    }

    // Get messages
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [messages, totalMessages] = await Promise.all([
      Message.find({ chatId: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('senderId', 'name email'),
      Message.countDocuments({ chatId: id }),
    ]);

    res.json({
      success: true,
      data: {
        chat,
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalMessages,
          pages: Math.ceil(totalMessages / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * Send message (with file upload support)
 * If chatId is not provided, creates a new chat automatically
 */
const sendMessage = async (req, res) => {
  try {
    const { chatId, content, senderType, senderName, userEmail, userName } = req.body;

    let chat;

    // If no chatId provided, create a new chat for the user
    if (!chatId) {
      // Require userEmail and userName for creating new chat
      if (!userEmail || !userName) {
        return res.status(400).json({
          success: false,
          error: 'Email and name are required to start a new conversation',
        });
      }

      // Check if chat already exists for this user
      chat = await Chat.findOne({ userEmail: userEmail.toLowerCase() });
      
      if (!chat) {
        // Create new chat
        chat = new Chat({
          userId: userEmail.toLowerCase(),
          userName: userName,
          userEmail: userEmail.toLowerCase(),
          status: 'active',
          lastMessageAt: new Date(),
          lastMessageBy: 'user',
          unreadCount: { user: 0, admin: 1 },
        });
        await chat.save();
      }
    } else {
      // Find existing chat
      chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({
          success: false,
          error: 'Chat not found',
        });
      }
    }

    // Determine sender info
    let actualSenderType = senderType;
    let actualSenderName = senderName;
    let actualSenderId = null;

    if (req.user) {
      // Admin sending
      actualSenderType = 'admin';
      actualSenderName = req.user.name || req.user.email;
      actualSenderId = req.user._id;
    } else {
      // User sending
      actualSenderType = 'user';
      actualSenderName = senderName || userName || chat.userName;
      // Verify email matches chat (only if chatId was provided)
      if (chatId && userEmail && userEmail.toLowerCase() !== chat.userEmail) {
        return res.status(403).json({
          success: false,
          error: 'Email does not match chat',
        });
      }
    }

    // Handle file uploads
    let attachments = [];
    if (req.files && req.files.length > 0) {
      try {
        attachments = await uploadMultipleFiles(req.files);
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return res.status(500).json({
          success: false,
          error: 'Failed to upload files. Please try again.',
        });
      }
    }

    if (!content && attachments.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message content or file is required',
      });
    }

    // Create message
    const message = new Message({
      chatId: chat._id,
      senderType: actualSenderType,
      senderId: actualSenderId,
      senderName: actualSenderName,
      content: content || '',
      attachments,
    });

    await message.save();

    // Update chat
    chat.lastMessageAt = new Date();
    chat.lastMessageBy = actualSenderType;
    if (actualSenderType === 'user') {
      chat.unreadCount.admin = (chat.unreadCount.admin || 0) + 1;
    } else {
      chat.unreadCount.user = (chat.unreadCount.user || 0) + 1;
    }
    await chat.save();

    // Populate message for response
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email');

    // Emit socket event (handled in socket handler)
    req.io?.to(`chat-${chat._id}`).emit('newMessage', populatedMessage);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        ...populatedMessage.toObject(),
        chatId: chat._id,
      },
      chat: {
        _id: chat._id,
        userName: chat.userName,
        userEmail: chat.userEmail,
        status: chat.status,
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * Admin reply to contact (with email notification)
 */
const replyToContact = async (req, res) => {
  try {
    const { contactId, message, chatId } = req.body;

    if (!contactId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Contact ID and message are required',
      });
    }

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }

    // Get or create chat
    let chat = chatId ? await Chat.findById(chatId) : await Chat.findOne({ contactId });
    
    if (!chat) {
      // Create chat
      const admin = await User.findById(req.user._id);
      chat = new Chat({
        contactId,
        userId: contact.email,
        userName: contact.name,
        userEmail: contact.email,
        adminId: req.user._id,
        adminName: admin.name || admin.email,
        status: 'active',
      });
      await chat.save();
      contact.chatId = chat._id;
    }

    // Create message
    const replyMessage = new Message({
      chatId: chat._id,
      senderType: 'admin',
      senderId: req.user._id,
      senderName: req.user.name || req.user.email,
      content: message,
      isReplyToContact: true,
    });

    await replyMessage.save();

    // Update chat
    chat.lastMessageAt = new Date();
    chat.lastMessageBy = 'admin';
    chat.unreadCount.user = (chat.unreadCount.user || 0) + 1;
    await chat.save();

    // Update contact
    contact.status = 'replied';
    contact.repliedBy = req.user._id;
    contact.replyCount = (contact.replyCount || 0) + 1;
    await contact.save();

    // Send email notification
    try {
      await sendAdminReplyEmail({
        to: contact.email,
        userName: contact.name,
        adminName: req.user.name || req.user.email,
        message: message,
        originalMessage: contact.message,
      });
      replyMessage.emailSent = true;
      await replyMessage.save();
    } catch (emailError) {
      console.error('Failed to send reply email:', emailError);
      // Don't fail the request
    }

    // Emit socket event
    req.io?.to(`chat-${chat._id}`).emit('newMessage', replyMessage);

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        message: replyMessage,
        chat,
      },
    });
  } catch (error) {
    console.error('Error replying to contact:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * Mark messages as read
 */
const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        error: 'Chat ID is required',
      });
    }

    // Mark messages as read
    // If admin is marking, mark user's messages. If user is marking, mark admin's messages.
    const senderTypeToMark = req.user ? 'user' : 'admin';
    
    await Message.updateMany(
      {
        chatId,
        senderType: senderTypeToMark,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    // Update unread count
    const chat = await Chat.findById(chatId);
    if (chat) {
      if (req.user) {
        // Admin marking as read - clear admin's unread count
        chat.unreadCount.admin = 0;
      } else {
        // User marking as read - clear user's unread count
        chat.unreadCount.user = 0;
      }
      await chat.save();
    }

    res.json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * Update chat status
 */
const updateChatStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status && !['active', 'resolved', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
      });
    }

    const chat = await Chat.findByIdAndUpdate(
      id,
      { status: status || chat.status },
      { new: true }
    ).populate('adminId', 'name email');

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat not found',
      });
    }

    res.json({
      success: true,
      message: 'Chat status updated',
      data: chat,
    });
  } catch (error) {
    console.error('Error updating chat:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

module.exports = {
  createChatFromContact,
  createChat,
  getAllChats,
  getChatById,
  sendMessage,
  replyToContact,
  markAsRead,
  updateChatStatus,
};

