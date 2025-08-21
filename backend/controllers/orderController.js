const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  try {
    await fs.access('uploads');
  } catch (error) {
    await fs.mkdir('uploads', { recursive: true });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadsDir();
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prescription-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

exports.uploadPrescription = upload.single('prescription');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryMethod } = req.body;
    const prescription = req.file ? req.file.path : null;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'Please provide valid items' });
    }

    // Validate and process items
    let total = 0;
    let requiresPrescription = false;
    const processedItems = [];

    for (const item of items) {
      if (!item.medicineId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ msg: 'Invalid item data' });
      }

      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return res.status(404).json({ msg: `Medicine not found: ${item.medicineId}` });
      }

      if (medicine.stock < item.quantity) {
        return res.status(400).json({ 
          msg: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}` 
        });
      }

      if (medicine.prescriptionRequired) {
        requiresPrescription = true;
      }

      const itemTotal = medicine.price * item.quantity;
      total += itemTotal;

      processedItems.push({
        medicineId: medicine._id,
        quantity: parseInt(item.quantity),
        price: medicine.price,
        name: medicine.name // For easier reference
      });
    }

    // Check prescription requirement
    if (requiresPrescription && !prescription) {
      return res.status(400).json({ 
        msg: 'Prescription is required for some medicines in your order' 
      });
    }

    // Create order
    const order = new Order({
      userId: req.session.userId,
      items: processedItems,
      total: parseFloat(total.toFixed(2)),
      status: requiresPrescription ? 'Pending Verification' : 'Ready to Checkout',
      prescription,
      deliveryMethod: deliveryMethod || 'Delivery',
      createdAt: new Date()
    });

    await order.save();
    
    // Populate the order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.medicineId', 'name brand dosage');

    res.status(201).json({ 
      msg: 'Order created successfully',
      orderId: order._id,
      order: populatedOrder,
      requiresPrescription,
      status: order.status
    });
  } catch (err) {
    console.error('Create order error:', err);
    // Clean up uploaded file if order creation failed
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkErr) {
        console.error('Failed to clean up uploaded file:', unlinkErr);
      }
    }
    res.status(500).json({ msg: 'Error creating order' });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.session.userId })
      .populate('items.medicineId', 'name brand dosage image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({ msg: 'Error fetching orders' });
  }
};

// Get single order details
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.session.userId 
    }).populate('items.medicineId', 'name brand dosage image price');

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Get order details error:', err);
    res.status(500).json({ msg: 'Error fetching order details' });
  }
};

// Checkout order (simplified without Stripe for now)
exports.checkout = async (req, res) => {
  try {
    const { orderId, paymentMethod, deliveryMethod } = req.body;
    
    if (!orderId || !paymentMethod) {
      return res.status(400).json({ msg: 'Please provide order ID and payment method' });
    }

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.session.userId 
    }).populate('items.medicineId');

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (order.status !== 'Ready to Checkout') {
      return res.status(400).json({ 
        msg: `Cannot checkout order with status: ${order.status}` 
      });
    }

    // Simulate payment processing
    // In production, integrate with actual payment gateway
    const paymentSuccessful = await simulatePayment(paymentMethod, order.total);
    
    if (!paymentSuccessful) {
      return res.status(400).json({ msg: 'Payment failed. Please try again.' });
    }

    // Update order status and reduce stock
    order.status = 'Paid';
    order.deliveryMethod = deliveryMethod || order.deliveryMethod;
    order.paymentId = `sim_${Date.now()}`; // Simulated payment ID
    order.trackingStatus = 'Processing';

    // Reduce medicine stock
    for (const item of order.items) {
      const medicine = await Medicine.findById(item.medicineId._id);
      if (medicine) {
        medicine.stock = Math.max(0, medicine.stock - item.quantity);
        medicine.sold = (medicine.sold || 0) + item.quantity;
        await medicine.save();
      }
    }

    await order.save();

    res.json({ 
      msg: 'Payment successful! Order confirmed.',
      orderId: order._id,
      paymentId: order.paymentId,
      trackingStatus: order.trackingStatus
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ msg: 'Error processing payment' });
  }
};

// Update order status (for admin or delivery updates)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, trackingStatus } = req.body;
    
    if (!orderId || !status) {
      return res.status(400).json({ msg: 'Please provide order ID and status' });
    }

    const validStatuses = [
      'Pending Verification', 'Ready to Checkout', 'Paid', 
      'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Declined'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    // Find order - admin can update any order, users can only update their own
    const query = req.session.isAdmin 
      ? { _id: orderId }
      : { _id: orderId, userId: req.session.userId };
    
    const order = await Order.findOneAndUpdate(
      query,
      { 
        status,
        ...(trackingStatus && { trackingStatus }),
        updatedAt: new Date()
      },
      { new: true }
    ).populate('items.medicineId', 'name brand');

    if (!order) {
      return res.status(404).json({ msg: 'Order not found or access denied' });
    }

    res.json({ 
      msg: 'Order status updated successfully',
      order 
    });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ msg: 'Error updating order status' });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.session.userId 
    }).populate('items.medicineId');

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['Pending Verification', 'Ready to Checkout', 'Processing'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({ 
        msg: `Cannot cancel order with status: ${order.status}` 
      });
    }

    // If order was paid, restore stock
    if (order.status === 'Paid' || order.status === 'Processing') {
      for (const item of order.items) {
        const medicine = await Medicine.findById(item.medicineId._id);
        if (medicine) {
          medicine.stock += item.quantity;
          medicine.sold = Math.max(0, (medicine.sold || 0) - item.quantity);
          await medicine.save();
        }
      }
    }

    order.status = 'Cancelled';
    order.cancelReason = reason || 'Cancelled by user';
    order.cancelledAt = new Date();
    await order.save();

    res.json({ 
      msg: 'Order cancelled successfully',
      orderId: order._id 
    });
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ msg: 'Error cancelling order' });
  }
};

// Simulate payment processing (replace with real payment gateway)
const simulatePayment = async (paymentMethod, amount) => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // 95% success rate for simulation
      const success = Math.random() > 0.05;
      resolve(success);
    }, 1000);
  });
};

// Get order statistics for user
exports.getOrderStats = async (req, res) => {
  try {
    const userId = req.session.userId;
    
    const stats = await Order.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments({ userId });
    const totalSpent = await Order.aggregate([
      { $match: { userId, status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      totalOrders,
      totalSpent: totalSpent[0]?.total || 0,
      statusBreakdown: stats
    });
  } catch (err) {
    console.error('Order stats error:', err);
    res.status(500).json({ msg: 'Error fetching order statistics' });
  }
};