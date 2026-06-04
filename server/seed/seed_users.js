const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const User = require('../models/User');

const seedUsers = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/toursdb';
    console.log('Connecting to', uri);
    await mongoose.connect(uri);
    console.log('Connected!');

    // 1. Create or reset admin
    await User.deleteOne({ email: 'admin@toursandtravels.com' });
    const admin = new User({
      name: 'Admin User',
      email: 'admin@toursandtravels.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890'
    });
    await admin.save();
    console.log('Admin user seeded successfully!');

    // 2. Create or reset user rahul@example.com
    await User.deleteOne({ email: 'rahul@example.com' });
    const user = new User({
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      password: 'user123',
      role: 'user',
      phone: '9876543210'
    });
    await user.save();
    console.log('Demo user Rahul seeded successfully!');

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

seedUsers();
