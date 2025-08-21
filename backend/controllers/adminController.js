const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const UserMedical = require('../models/UserMedical');
const bcrypt = require('bcryptjs');
const reportGenerator = require('../utils/reportGenerator');

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        msg: 'Please provide username and password' 
      });
    }

    // Find admin by username (using your existing model structure)
    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        msg: 'Invalid username or password' 
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        msg: 'Invalid username or password' 
      });
    }

    // Create session
    req.session.adminId = admin._id;
    req.session.isAdmin = true;
    
    // Save session explicitly to ensure it's stored
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ 
          success: false,
          msg: 'Error creating session' 
        });
      }
      
      res.json({ 
        success: true,
        msg: 'Admin logged in successfully',
        admin: {
          id: admin._id,
          username: admin.username
        }
      });
    });
    
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Admin logout
exports.adminLogout = (req, res) => {
  try {
    if (!req.session) {
      return res.status(400).json({ 
        success: false,
        msg: 'No active session found' 
      });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ 
          success: false,
          msg: 'Error logging out' 
        });
      }
      
      res.clearCookie('connect.sid');
      res.json({ 
        success: true,
        msg: 'Admin logged out successfully' 
      });
    });
  } catch (err) {
    console.error('Admin logout error:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Server error during logout',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .populate('items.medicineId', 'name brand')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Error fetching orders',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Validate ObjectId format
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        msg: 'Invalid order ID format' 
      });
    }
    
    const order = await Order.findById(orderId)
      .populate('userId', 'name email phone address')
      .populate('items.medicineId', 'name brand dosage');
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        msg: 'Order not found' 
      });
    }

    const medical = await UserMedical.findOne({ userId: order.userId._id });
    
    res.json({ 
      success: true,
      order, 
      medical 
    });
  } catch (err) {
    console.error('Get order details error:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Error fetching order details',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Approve order
exports.approveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Validate ObjectId format
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        msg: 'Invalid order ID format' 
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId, 
      { status: 'Ready to Checkout' },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        msg: 'Order not found' 
      });
    }
    
    res.json({ 
      success: true,
      msg: 'Order approved successfully',
      order 
    });
  } catch (err) {
    console.error('Approve order error:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Error approving order',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Decline order
exports.declineOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    // Validate ObjectId format
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        msg: 'Invalid order ID format' 
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId, 
      { 
        status: 'Declined',
        declineReason: reason || 'No reason provided'
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        msg: 'Order not found' 
      });
    }
    
    res.json({ 
      success: true,
      msg: 'Order declined successfully',
      order 
    });
  } catch (err) {
    console.error('Decline order error:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Error declining order',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Generate reports
exports.generateReport = async (req, res) => {
  try {
    const { type } = req.query;
    
    if (!['pdf', 'excel'].includes(type)) {
      return res.status(400).json({ 
        success: false,
        msg: 'Invalid report type. Use "pdf" or "excel"' 
      });
    }

    const orders = await Order.find().populate('items.medicineId', 'name');
    const medicines = await Medicine.find();

    // Calculate analytics
    const paidOrders = orders.filter(o => o.status === 'Paid');
    const revenue = paidOrders.reduce((acc, order) => acc + (order.total || 0), 0);
    
    // Top selling medicines
    const medicineStats = {};
    paidOrders.forEach(order => {
      order.items.forEach(item => {
        const medicineId = item.medicineId?._id?.toString();
        const medicineName = item.medicineId?.name || 'Unknown';
        if (medicineId) {
          medicineStats[medicineId] = medicineStats[medicineId] || { name: medicineName, sold: 0 };
          medicineStats[medicineId].sold += item.quantity || 0;
        }
      });
    });
    
    const topSelling = Object.values(medicineStats)
      .sort((a, b) => b.sold - a.sold)[0] || { name: 'None', sold: 0 };
    
    const stockLevels = medicines.map(m => ({ 
      name: m.name, 
      stock: m.stock || 0,
      price: m.price || 0
    }));
    
    const approvedCount = orders.filter(o => 
      ['Ready to Checkout', 'Paid'].includes(o.status)
    ).length;
    const declinedCount = orders.filter(o => o.status === 'Declined').length;
    const totalReviewed = approvedCount + declinedCount;
    const approvalRatio = totalReviewed > 0 ? (approvedCount / totalReviewed) : 0;

    const reportData = { 
      revenue: revenue.toFixed(2),
      topSelling: topSelling.name,
      topSellingSold: topSelling.sold,
      stockLevels,
      approvalRatio: approvalRatio.toFixed(2),
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      approvedCount,
      declinedCount,
      generatedAt: new Date().toISOString()
    };

    if (type === 'pdf') {
      const pdfPath = await reportGenerator.generatePDF(reportData);
      res.download(pdfPath, 'pharmacy-report.pdf');
    } else if (type === 'excel') {
      const excelPath = await reportGenerator.generateExcel(reportData);
      res.download(excelPath, 'pharmacy-report.xlsx');
    }
  } catch (err) {
    console.error('Generate report error:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Error generating report',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalMedicines = await Medicine.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending Verification' });
    const paidOrders = await Order.find({ status: 'Paid' });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + (order.total || 0), 0);
    
    res.json({
      success: true,
      stats: {
        totalOrders,
        totalMedicines,
        pendingOrders,
        totalRevenue: totalRevenue.toFixed(2),
        recentOrders: await Order.find()
          .populate('userId', 'name')
          .sort({ createdAt: -1 })
          .limit(5),
        lowStockMedicines: await Medicine.find({ stock: { $lte: 10 } })
          .sort({ stock: 1 })
          .limit(10)
      }
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Error fetching dashboard stats',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};