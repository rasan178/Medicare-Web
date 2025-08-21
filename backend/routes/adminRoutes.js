const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/login', adminController.adminLogin);
router.post('/logout', adminController.adminLogout);
router.get('/orders', adminMiddleware, adminController.getAllOrders);
router.get('/orders/:orderId', adminMiddleware, adminController.getOrderDetails);
router.post('/orders/:orderId/approve', adminMiddleware, adminController.approveOrder);
router.post('/orders/:orderId/decline', adminMiddleware, adminController.declineOrder);
router.get('/reports', adminMiddleware, adminController.generateReport);

module.exports = router; 
