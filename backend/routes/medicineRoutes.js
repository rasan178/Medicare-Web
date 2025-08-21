// routes/medicineRoutes.js - Updated
const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', medicineController.getAllMedicines);
router.get('/categories', medicineController.getCategories);
router.get('/:id', medicineController.getMedicineById);

// Admin only routes
router.post('/', adminMiddleware, medicineController.addMedicine);
router.put('/:id', adminMiddleware, medicineController.updateMedicine);
router.delete('/:id', adminMiddleware, medicineController.deleteMedicine);
router.get('/admin/low-stock', adminMiddleware, medicineController.getLowStockMedicines);
router.put('/admin/bulk-stock', adminMiddleware, medicineController.bulkUpdateStock);

module.exports = router;