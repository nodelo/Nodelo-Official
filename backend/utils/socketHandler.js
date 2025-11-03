const Message = require('../models/Message');
const Chat = require('../models/Chat');

/**
 * Initialize Socket.io handlers for real-time chat
 */
const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join chat room
    socket.on('joinChat', async (chatId) => {
      socket.join(`chat-${chatId}`);
      console.log(`Socket ${socket.id} joined chat-${chatId}`);

      // Emit chat joined confirmation
      socket.emit('chatJoined', { chatId });
    });

    // Leave chat room
    socket.on('leaveChat', (chatId) => {
      socket.leave(`chat-${chatId}`);
      console.log(`Socket ${socket.id} left chat-${chatId}`);
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { chatId, isTyping, userName } = data;
      socket.to(`chat-${chatId}`).emit('userTyping', {
        chatId,
        isTyping,
        userName,
      });
    });

    // Stop typing
    socket.on('stopTyping', (data) => {
      const { chatId } = data;
      socket.to(`chat-${chatId}`).emit('userTyping', {
        chatId,
        isTyping: false,
      });
    });

    // Mark message as read
    socket.on('markRead', async (data) => {
      try {
        const { chatId, messageIds, senderType } = data;

        if (messageIds && messageIds.length > 0) {
          await Message.updateMany(
            {
              _id: { $in: messageIds },
              chatId,
            },
            {
              isRead: true,
              readAt: new Date(),
            }
          );
        } else {
          // Mark all unread messages from other party
          // If senderType is 'user', mark admin's messages. If 'admin', mark user's messages.
          const senderTypeToMark = senderType === 'user' ? 'admin' : 'user';
          
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
        }

        // Update chat unread count
        const chat = await Chat.findById(chatId);
        if (chat) {
          if (senderType === 'user') {
            // User marking as read - clear user's unread count (admin's messages were read)
            chat.unreadCount.user = 0;
          } else {
            // Admin marking as read - clear admin's unread count (user's messages were read)
            chat.unreadCount.admin = 0;
          }
          await chat.save();
        }

        // Notify other users
        io.to(`chat-${chatId}`).emit('messagesRead', { chatId });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket;

