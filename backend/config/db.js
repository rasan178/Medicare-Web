const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmacy';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Connected to: ${mongoURI}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });
    
    // Handle app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔐 MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('💡 Make sure MongoDB is running on your system');
    process.exit(1);
  }
};

module.exports = connectDB;