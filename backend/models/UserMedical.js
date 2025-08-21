const mongoose = require('mongoose');

const userMedicalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dob: { type: Date },
  allergies: [String],
  conditions: [String],
  medications: [String],
});

module.exports = mongoose.model('UserMedical', userMedicalSchema); 
