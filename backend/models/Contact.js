const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    projectType: {
      type: String,
      enum: ['starter-site', 'mvp-web-app', 'dapp-contract', 'support-ops', 'other', ''],
      trim: true,
    },
    budget: {
      type: String,
      enum: ['under-1k', '1k-5k', '5k-10k', '10k-25k', '25k-plus', ''],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'replied', 'archived'],
      default: 'new',
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    // Link to chat if conversation started
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      default: null,
    },
    // Admin who replied
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    replyCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });
contactSchema.index({ email: 1 });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;

