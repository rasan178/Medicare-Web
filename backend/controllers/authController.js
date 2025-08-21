const User = require('../models/User');
const UserMedical = require('../models/UserMedical');
const bcrypt = require('bcryptjs');

// User registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({ 
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone?.trim() || '',
      address: address?.trim() || ''
    });
    
    await user.save();

    // Create medical record
    const medical = new UserMedical({ userId: user._id });
    await medical.save();

    // Create session
    req.session.userId = user._id;
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    res.status(201).json({ 
      msg: 'User registered and logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user._id;
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    res.json({ 
      msg: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

// User logout
exports.logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ msg: 'Error logging out' });
      }
      res.clearCookie('connect.sid');
      res.json({ msg: 'Logged out successfully' });
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ msg: 'Server error during logout' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const medical = await UserMedical.findOne({ userId: req.session.userId });
    
    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      },
      medical: medical || {}
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ msg: 'Error fetching profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      {
        ...(name && { name: name.trim() }),
        ...(phone && { phone: phone.trim() }),
        ...(address && { address: address.trim() })
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ 
      msg: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ msg: 'Error updating profile' });
  }
};

// Update medical information
exports.updateMedical = async (req, res) => {
  try {
    const { dob, allergies, conditions, medications } = req.body;
    
    let medical = await UserMedical.findOne({ userId: req.session.userId });
    
    if (!medical) {
      medical = new UserMedical({ userId: req.session.userId });
    }

    // Update fields
    if (dob !== undefined) medical.dob = dob;
    if (allergies !== undefined) {
      medical.allergies = Array.isArray(allergies) 
        ? allergies.filter(a => a.trim()) 
        : allergies.split(',').map(a => a.trim()).filter(a => a);
    }
    if (conditions !== undefined) {
      medical.conditions = Array.isArray(conditions) 
        ? conditions.filter(c => c.trim()) 
        : conditions.split(',').map(c => c.trim()).filter(c => c);
    }
    if (medications !== undefined) {
      medical.medications = Array.isArray(medications) 
        ? medications.filter(m => m.trim()) 
        : medications.split(',').map(m => m.trim()).filter(m => m);
    }

    await medical.save();
    
    res.json({ 
      msg: 'Medical information updated successfully',
      medical
    });
  } catch (err) {
    console.error('Update medical error:', err);
    res.status(500).json({ msg: 'Error updating medical information' });
  }
};

// Check authentication status
exports.checkAuth = (req, res) => {
  try {
    if (req.session.userId) {
      res.json({ 
        authenticated: true,
        user: req.session.user 
      });
    } else {
      res.json({ authenticated: false });
    }
  } catch (err) {
    console.error('Check auth error:', err);
    res.status(500).json({ msg: 'Error checking authentication' });
  }
};