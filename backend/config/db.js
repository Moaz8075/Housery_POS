const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri, {
      // connection options are auto-handled in mongoose v6+
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
