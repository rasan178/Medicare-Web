 const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const UserMedical = require('../models/UserMedical');
const bcrypt = require('bcryptjs');
const reportGenerator = require('../utils/reportGenerator');

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    req.session.adminId = admin._id;
    res.json({ msg: 'Admin logged in' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.adminLogout = (req, res) => {
  req.session.destroy();
  res.json({ msg: 'Admin logged out' });
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId).populate('userId');
    const medical = await UserMedical.findOne({ userId: order.userId._id });
    res.json({ order, medical });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.approveOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    await Order.findByIdAndUpdate(orderId, { status: 'Ready to Checkout' });
    res.json({ msg: 'Order approved' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.declineOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    await Order.findByIdAndUpdate(orderId, { status: 'Declined' });
    res.json({ msg: 'Order declined' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.generateReport = async (req, res) => {
  const { type } = req.query; // pdf or excel
  try {
    const orders = await Order.find();
    const medicines = await Medicine.find();

    // Simple analytics
    const revenue = orders.reduce((acc, order) => order.status === 'Paid' ? acc + order.total : acc, 0);
    const topSelling = medicines.sort((a, b) => b.sold - a.sold)[0]; // Assume sold field added to Medicine
    const stockLevels = medicines.map(m => ({ name: m.name, stock: m.stock }));
    const approved = orders.filter(o => o.status === 'Ready to Checkout' || o.status === 'Paid').length;
    const declined = orders.filter(o => o.status === 'Declined').length;

    const data = { revenue, topSelling: topSelling?.name, stockLevels, ratio: approved / (approved + declined) };

    if (type === 'pdf') {
      const pdfPath = await reportGenerator.generatePDF(data);
      res.download(pdfPath);
    } else if (type === 'excel') {
      const excelPath = await reportGenerator.generateExcel(data);
      res.download(excelPath);
    } else {
      res.status(400).json({ msg: 'Invalid type' });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
