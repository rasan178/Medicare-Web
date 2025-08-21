 const User = require('../models/User');
const UserMedical = require('../models/UserMedical');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, phone, address });
    await user.save();

    const medical = new UserMedical({ userId: user._id });
    await medical.save();

    req.session.userId = user._id;
    res.json({ msg: 'Registered and logged in' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    req.session.userId = user._id;
    res.json({ msg: 'Logged in' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ msg: 'Logged out' });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    const medical = await UserMedical.findOne({ userId: req.session.userId });
    res.json({ user, medical });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateMedical = async (req, res) => {
  const { dob, allergies, conditions, medications } = req.body;
  try {
    let medical = await UserMedical.findOne({ userId: req.session.userId });
    if (!medical) medical = new UserMedical({ userId: req.session.userId });

    medical.dob = dob;
    medical.allergies = allergies;
    medical.conditions = conditions;
    medical.medications = medications;
    await medical.save();
    res.json({ msg: 'Medical info updated' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
