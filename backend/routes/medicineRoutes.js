// routes/medicineRoutes.js - Updated
const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const adminMiddleware = require('../middleware/adminMiddleware');
const Order = require('../models/Order'); // Add this import

// Public routes - IMPORTANT: Put specific routes before parameterized ones
router.get('/', medicineController.getAllMedicines);
router.get('/categories', medicineController.getCategories);

// Public stats endpoint for homepage (no auth required) - MUST be before /:id route
router.get('/public/stats', async (req, res) => {
  try {
    console.log('Fetching public stats...');
    
    // Get total number of orders
    const totalOrders = await Order.countDocuments();
    console.log('Total orders:', totalOrders);
    
    // Get total number of medicines
    const Medicine = require('../models/Medicine'); // Import here if not globally available
    const totalMedicines = await Medicine.countDocuments();
    console.log('Total medicines:', totalMedicines);
    
    // Calculate total revenue from completed orders
    const revenueResult = await Order.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    console.log('Total revenue:', totalRevenue);

    const stats = {
      totalOrders,
      totalMedicines,
      totalRevenue: totalRevenue.toFixed(2)
    };

    console.log('Sending stats:', stats);
    
    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Public stats fetch error:', error);
    res.status(500).json({
      success: false,
      msg: 'Server error while fetching statistics',
      error: error.message
    });
  }
});

// This parameterized route MUST come after specific routes
router.get('/:id', medicineController.getMedicineById);

// Admin only routes
router.post('/', adminMiddleware, medicineController.addMedicine);
router.put('/:id', adminMiddleware, medicineController.updateMedicine);
router.delete('/:id', adminMiddleware, medicineController.deleteMedicine);
router.get('/admin/low-stock', adminMiddleware, medicineController.getLowStockMedicines);
router.put('/admin/bulk-stock', adminMiddleware, medicineController.bulkUpdateStock);

module.exports = router;