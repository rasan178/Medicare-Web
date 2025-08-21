// routes/orderRoutes.js - Updated
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, orderController.uploadPrescription, orderController.createOrder);
router.get('/', authMiddleware, orderController.getUserOrders);
router.get('/stats', authMiddleware, orderController.getOrderStats);
router.get('/:orderId', authMiddleware, orderController.getOrderDetails);
router.post('/checkout', authMiddleware, orderController.checkout);
router.put('/status', authMiddleware, orderController.updateOrderStatus);
router.delete('/:orderId/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;