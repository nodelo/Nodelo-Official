const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    // Contact form submission this chat is related to (optional - can start chat without contact)
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      default: null,
    },
    // User information (from contact form or chat init)
    userId: {
      type: String, // Can be email or custom ID
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    // Admin assigned to this chat
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    adminName: {
      type: String,
      default: null,
    },
    // Chat metadata
    status: {
      type: String,
      enum: ['active', 'resolved', 'archived'],
      default: 'active',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    lastMessageBy: {
      type: String,
      enum: ['user', 'admin'],
    },
    unreadCount: {
      user: { type: Number, default: 0 },
      admin: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
chatSchema.index({ contactId: 1 });
chatSchema.index({ adminId: 1 });
chatSchema.index({ userId: 1 });
chatSchema.index({ status: 1 });
chatSchema.index({ lastMessageAt: -1 });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

