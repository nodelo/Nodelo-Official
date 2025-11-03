const Contact = require('../models/Contact');
const { sendContactNotification, sendContactConfirmation } = require('../utils/email');

/**
 * Create a new contact form submission
 */
const createContact = async (req, res) => {
  try {
    const { name, email, company, projectType, budget, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters',
      });
    }

    // Create contact submission
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company ? company.trim() : undefined,
      projectType: projectType || undefined,
      budget: budget || undefined,
      message: message.trim(),
    });

    // Save to database
    await contact.save();

    // Send notification email (to admin)
    try {
      await sendContactNotification({
        name: contact.name,
        email: contact.email,
        company: contact.company,
        projectType: contact.projectType,
        budget: contact.budget,
        message: contact.message,
      });
      contact.emailSent = true;
      await contact.save();
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if email fails - submission is saved
    }

    // Send confirmation email to user (non-blocking)
    sendContactConfirmation({
      name: contact.name,
      email: contact.email,
    }).catch((err) => {
      console.error('Failed to send confirmation email:', err);
      // Silent fail - optional feature
    });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
      },
    });
  } catch (error) {
    console.error('Error creating contact:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors,
      });
    }

    // Handle duplicate email (if unique index is added later)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A submission with this email already exists',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while processing your request',
    });
  }
};

/**
 * Get all contact submissions (for admin - will add auth later)
 */
const getAllContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build query
    const query = {};
    if (status && ['new', 'replied', 'archived'].includes(status)) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (pageNum - 1) * limitNum;

    // Get contacts and total count
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-__v'), // Exclude version field
      Contact.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * Get single contact by ID (for admin - will add auth later)
 */
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id).select('-__v');

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid contact ID',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * Update contact submission (for admin)
 */
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status if provided
    if (status && !['new', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: new, replied, or archived',
      });
    }

    // Build update object
    const updateData = {};
    if (status) updateData.status = status;

    // Update contact
    const contact = await Contact.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid contact ID',
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * Delete contact submission (for admin)
 */
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid contact ID',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};

