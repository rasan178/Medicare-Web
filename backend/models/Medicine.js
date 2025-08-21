const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  dosage: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  prescriptionRequired: { type: Boolean, default: false },
  description: { type: String },
  image: { type: String },
  sold: { type: Number, default: 0 }, // For reports
});

module.exports = mongoose.model('Medicine', medicineSchema); 
