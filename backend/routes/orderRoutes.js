const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, orderController.uploadPrescription, orderController.createOrder);
router.get('/', authMiddleware, orderController.getUserOrders);
router.post('/checkout', authMiddleware, orderController.checkout);
router.put('/status', authMiddleware, orderController.updateOrderStatus); // User can update tracking if needed

module.exports = router; 
