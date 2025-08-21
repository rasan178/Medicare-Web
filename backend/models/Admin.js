const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Pre-populate an admin if needed, but for now assume manual creation

module.exports = mongoose.model('Admin', adminSchema); 
