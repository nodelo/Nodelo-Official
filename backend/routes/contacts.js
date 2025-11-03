const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');
const { authenticate } = require('../middleware/auth');

// Public route - Contact form submission
router.post('/', createContact);

// Admin routes (protected with authentication)
router.get('/', authenticate, getAllContacts);
router.get('/:id', authenticate, getContactById);
router.patch('/:id', authenticate, updateContact);
router.delete('/:id', authenticate, deleteContact);

module.exports = router;

