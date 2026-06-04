const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const User = require('../models/User');

const checkDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/toursdb';
    console.log('Connecting to', uri);
    await mongoose.connect(uri);
    console.log('Connected!');
    
    const users = await User.find({});
    console.log('Users found:', users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

checkDB();
