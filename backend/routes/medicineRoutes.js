const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', medicineController.getAllMedicines);
router.post('/', adminMiddleware, medicineController.addMedicine);
router.put('/:id', adminMiddleware, medicineController.updateMedicine);
router.delete('/:id', adminMiddleware, medicineController.deleteMedicine);

module.exports = router; 
