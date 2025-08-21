// routes/authRoutes.js - Updated
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/medical', authMiddleware, authController.updateMedical);
router.get('/check', authController.checkAuth); // Check authentication status

module.exports = router;