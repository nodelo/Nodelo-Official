const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createChatFromContact,
  createChat,
  getAllChats,
  getChatById,
  sendMessage,
  replyToContact,
  markAsRead,
  updateChatStatus,
} = require('../controllers/chatController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum file size is 50MB.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Maximum 5 files per request.',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected file field.',
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    });
  }
  if (err) {
    // Handle file type errors
    if (err.message && err.message.includes('not allowed')) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: 'File upload error',
    });
  }
  next();
};

// Public routes (for users to send messages) - must come before protected routes
// Add optionalAuth to detect admin authentication (if token is present)
router.post('/message', optionalAuth, upload.array('files', 5), handleMulterError, sendMessage);
router.get('/user/:userEmail', getAllChats); // Get chats for user by email

// Protected routes (require admin authentication)
router.post('/from-contact', authenticate, createChatFromContact);
router.post('/reply-contact', authenticate, replyToContact);
router.post('/mark-read', authenticate, markAsRead);
router.post('/', authenticate, createChat);
router.get('/', authenticate, getAllChats);
router.get('/:id', optionalAuth, getChatById); // Allow users to view their own chats (with email validation)
router.post('/:id/message', optionalAuth, upload.array('files', 5), handleMulterError, sendMessage); // Optional auth for users
router.patch('/:id/status', authenticate, updateChatStatus);

module.exports = router;

