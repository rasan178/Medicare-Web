const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  profession: {
    type: String,
    trim: true,
    maxlength: 100,
    default: ''
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
testimonialSchema.index({ isApproved: 1, isVisible: 1, createdAt: -1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);