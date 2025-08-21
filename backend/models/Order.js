const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    quantity: Number,
    price: Number,
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending Verification' },
  prescription: { type: String },
  paymentId: { type: String },
  deliveryMethod: { type: String }, // Delivery or Pickup
  trackingStatus: { type: String, default: 'Processing' },
});

module.exports = mongoose.model('Order', orderSchema); 
