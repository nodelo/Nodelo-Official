const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },
    senderType: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for user messages
    },
    senderName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      maxlength: [10000, 'Message cannot exceed 10000 characters'],
    },
    // File attachments (Cloudinary URLs)
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['image', 'video', 'pdf', 'document'],
          required: true,
        },
        fileName: {
          type: String,
        },
        fileSize: {
          type: Number, // in bytes
        },
        publicId: {
          type: String, // Cloudinary public ID
        },
      },
    ],
    // Message metadata
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    // For admin replies to contact forms
    isReplyToContact: {
      type: Boolean,
      default: false,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ isRead: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

