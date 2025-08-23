const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');

// Public routes
router.get('/public', testimonialController.getPublicTestimonials);
router.post('/', testimonialController.createTestimonial);

// Basic admin routes (without auth middleware for now - you can add it later)
router.get('/admin/all', testimonialController.getAllTestimonials);
router.put('/admin/:id/approve', testimonialController.approveTestimonial);
router.put('/admin/:id/toggle-visibility', testimonialController.toggleTestimonialVisibility);
router.delete('/admin/:id', testimonialController.deleteTestimonial);

module.exports = router;