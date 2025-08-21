const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const multer = require('multer');
const path = require('path');
const Stripe = require('stripe');
const stripe = Stripe('your_stripe_secret_key');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

exports.uploadPrescription = upload.single('prescription');

exports.createOrder = async (req, res) => {
  const { items, requiresPrescription } = req.body;
  const prescription = req.file ? req.file.path : null;

  if (requiresPrescription && !prescription) return res.status(400).json({ msg: 'Prescription required' });

  try {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const order = new Order({
      userId: req.session.userId,
      items,
      total,
      status: requiresPrescription ? 'Pending Verification' : 'Ready to Checkout',
      prescription,
    });
    await order.save();
    res.json({ msg: 'Order created', orderId: order._id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.session.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.checkout = async (req, res) => {
  const { orderId, paymentMethod, deliveryMethod } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (order.status !== 'Ready to Checkout') return res.status(400).json({ msg: 'Invalid status' });

    // Simulate payment with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.total * 100,
      currency: 'usd',
      payment_method: paymentMethod,
      confirm: true,
    });

    if (paymentIntent.status === 'succeeded') {
      order.status = 'Paid';
      order.deliveryMethod = deliveryMethod;
      await order.save();

      // Reduce stock
      for (let item of order.items) {
        const medicine = await Medicine.findById(item.medicineId);
        medicine.stock -= item.quantity;
        await medicine.save();
      }

      res.json({ msg: 'Payment successful' });
    } else {
      res.status(400).json({ msg: 'Payment failed' });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ msg: 'Status updated' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
