require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

/**
 * Seed script to create initial admin user
 * Usage: node scripts/seedAdmin.js
 */
const seedAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@nodelo.com' });

    if (existingAdmin) {
      console.log('❌ Admin user already exists');
      console.log(`   Email: ${existingAdmin.email}`);
      process.exit(1);
    }

    // Create admin user
    const admin = new User({
      email: process.env.ADMIN_EMAIL || 'admin@nodelo.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      name: process.env.ADMIN_NAME || 'Admin User',
      isActive: true,
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('\n⚠️  Please change the default password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

// Run seed
seedAdmin();

