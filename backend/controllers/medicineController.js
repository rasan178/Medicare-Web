const Medicine = require('../models/Medicine');

// Get all medicines with filtering and pagination
exports.getAllMedicines = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search, 
      prescriptionRequired,
      minPrice,
      maxPrice,
      inStock
    } = req.query;

    // Build filter query
    const filter = {};
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (prescriptionRequired !== undefined) {
      filter.prescriptionRequired = prescriptionRequired === 'true';
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 per page
    const skip = (pageNum - 1) * limitNum;

    // Get medicines with pagination
    const medicines = await Medicine.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination info
    const total = await Medicine.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      medicines,
      pagination: {
        current: pageNum,
        pages: totalPages,
        total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (err) {
    console.error('Get medicines error:', err);
    res.status(500).json({ msg: 'Error fetching medicines' });
  }
};

// Get single medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({ msg: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (err) {
    console.error('Get medicine by ID error:', err);
    res.status(500).json({ msg: 'Error fetching medicine' });
  }
};

// Add new medicine (Admin only)
exports.addMedicine = async (req, res) => {
  try {
    const { 
      name, 
      brand, 
      dosage, 
      price, 
      stock, 
      category, 
      prescriptionRequired, 
      description, 
      image,
      expiryDate,
      manufacturer
    } = req.body;

    // Validation
    if (!name || !brand || !dosage || !price || !stock || !category) {
      return res.status(400).json({ 
        msg: 'Please provide all required fields: name, brand, dosage, price, stock, category' 
      });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({ msg: 'Price and stock cannot be negative' });
    }

    // Check if medicine with same name, brand, and dosage already exists
    const existingMedicine = await Medicine.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
      brand: { $regex: `^${brand}$`, $options: 'i' },
      dosage: { $regex: `^${dosage}$`, $options: 'i' }
    });

    if (existingMedicine) {
      return res.status(400).json({ 
        msg: 'Medicine with same name, brand, and dosage already exists' 
      });
    }

    const medicine = new Medicine({
      name: name.trim(),
      brand: brand.trim(),
      dosage: dosage.trim(),
      price: parseFloat(price),
      stock: parseInt(stock),
      category: category.trim(),
      prescriptionRequired: prescriptionRequired === true || prescriptionRequired === 'true',
      description: description?.trim() || '',
      image: image?.trim() || '',
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      manufacturer: manufacturer?.trim() || '',
      createdAt: new Date()
    });

    await medicine.save();
    
    res.status(201).json({ 
      msg: 'Medicine added successfully',
      medicine 
    });
  } catch (err) {
    console.error('Add medicine error:', err);
    res.status(500).json({ msg: 'Error adding medicine' });
  }
};

// Update medicine (Admin only)
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.sold; // Sold count is managed by orders

    // Validate numeric fields
    if (updates.price !== undefined) {
      updates.price = parseFloat(updates.price);
      if (updates.price < 0) {
        return res.status(400).json({ msg: 'Price cannot be negative' });
      }
    }

    if (updates.stock !== undefined) {
      updates.stock = parseInt(updates.stock);
      if (updates.stock < 0) {
        return res.status(400).json({ msg: 'Stock cannot be negative' });
      }
    }

    // Handle boolean fields
    if (updates.prescriptionRequired !== undefined) {
      updates.prescriptionRequired = updates.prescriptionRequired === true || updates.prescriptionRequired === 'true';
    }

    // Handle expiry date
    if (updates.expiryDate) {
      updates.expiryDate = new Date(updates.expiryDate);
    }

    updates.updatedAt = new Date();

    const medicine = await Medicine.findByIdAndUpdate(id, updates, { 
      new: true,
      runValidators: true 
    });

    if (!medicine) {
      return res.status(404).json({ msg: 'Medicine not found' });
    }

    res.json({ 
      msg: 'Medicine updated successfully',
      medicine 
    });
  } catch (err) {
    console.error('Update medicine error:', err);
    res.status(500).json({ msg: 'Error updating medicine' });
  }
};

// Delete medicine (Admin only)
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    
    const medicine = await Medicine.findByIdAndDelete(id);
    if (!medicine) {
      return res.status(404).json({ msg: 'Medicine not found' });
    }

    res.json({ 
      msg: 'Medicine deleted successfully',
      deletedMedicine: {
        id: medicine._id,
        name: medicine.name,
        brand: medicine.brand
      }
    });
  } catch (err) {
    console.error('Delete medicine error:', err);
    res.status(500).json({ msg: 'Error deleting medicine' });
  }
};

// Get medicine categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Medicine.distinct('category');
    res.json(categories.filter(cat => cat).sort());
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ msg: 'Error fetching categories' });
  }
};

// Get low stock medicines (Admin only)
exports.getLowStockMedicines = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    
    const lowStockMedicines = await Medicine.find({ 
      stock: { $lte: parseInt(threshold) } 
    }).sort({ stock: 1 });

    res.json({
      threshold: parseInt(threshold),
      count: lowStockMedicines.length,
      medicines: lowStockMedicines
    });
  } catch (err) {
    console.error('Get low stock medicines error:', err);
    res.status(500).json({ msg: 'Error fetching low stock medicines' });
  }
};

// Bulk update stock (Admin only)
exports.bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body; // Array of {id, stock}
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ msg: 'Please provide valid updates array' });
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        const { id, stock } = update;
        
        if (!id || stock === undefined || stock < 0) {
          errors.push({ id, error: 'Invalid update data' });
          continue;
        }

        const medicine = await Medicine.findByIdAndUpdate(
          id,
          { stock: parseInt(stock), updatedAt: new Date() },
          { new: true }
        );

        if (!medicine) {
          errors.push({ id, error: 'Medicine not found' });
        } else {
          results.push({
            id: medicine._id,
            name: medicine.name,
            oldStock: medicine.stock,
            newStock: parseInt(stock)
          });
        }
      } catch (err) {
        errors.push({ id: update.id, error: err.message });
      }
    }

    res.json({
      msg: 'Bulk stock update completed',
      updated: results.length,
      errors: errors.length,
      results,
      errors
    });
  } catch (err) {
    console.error('Bulk update stock error:', err);
    res.status(500).json({ msg: 'Error updating stock' });
  }
};