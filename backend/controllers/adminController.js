const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const UserMedical = require('../models/UserMedical');
const bcrypt = require('bcryptjs');
const reportGenerator = require('../utils/reportGenerator');

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    req.session.adminId = admin._id;
    req.session.isAdmin = true;
    
    res.json({ 
      msg: 'Admin logged in successfully',
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

// Admin logout
exports.adminLogout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ msg: 'Error logging out' });
      }
      res.clearCookie('connect.sid');
      res.json({ msg: 'Admin logged out successfully' });
    });
  } catch (err) {
    console.error('Admin logout error:', err);
    res.status(500).json({ msg: 'Server error during logout' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .populate('items.medicineId', 'name brand')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ msg: 'Error fetching orders' });
  }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('userId', 'name email phone address')
      .populate('items.medicineId', 'name brand dosage');
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    const medical = await UserMedical.findOne({ userId: order.userId._id });
    
    res.json({ order, medical });
  } catch (err) {
    console.error('Get order details error:', err);
    res.status(500).json({ msg: 'Error fetching order details' });
  }
};

// Approve order
exports.approveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findByIdAndUpdate(
      orderId, 
      { status: 'Ready to Checkout' },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    res.json({ 
      msg: 'Order approved successfully',
      order 
    });
  } catch (err) {
    console.error('Approve order error:', err);
    res.status(500).json({ msg: 'Error approving order' });
  }
};

// Decline order
exports.declineOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body; // Optional decline reason
    
    const order = await Order.findByIdAndUpdate(
      orderId, 
      { 
        status: 'Declined',
        declineReason: reason || 'No reason provided'
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    res.json({ 
      msg: 'Order declined successfully',
      order 
    });
  } catch (err) {
    console.error('Decline order error:', err);
    res.status(500).json({ msg: 'Error declining order' });
  }
};

// Generate reports
exports.generateReport = async (req, res) => {
  try {
    const { type } = req.query; // pdf or excel
    
    if (!['pdf', 'excel'].includes(type)) {
      return res.status(400).json({ msg: 'Invalid report type. Use "pdf" or "excel"' });
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
    res.status(500).json({ msg: 'Error generating report' });
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
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ msg: 'Error fetching dashboard stats' });
  }
};