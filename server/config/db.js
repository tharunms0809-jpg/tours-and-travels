const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Reuse existing connection if already connected (important for serverless)
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/toursdb');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't call process.exit(1) in serverless - it kills the worker
    throw error;
  }
};

module.exports = connectDB;
