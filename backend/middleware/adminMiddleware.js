// middleware/adminMiddleware.js
const Admin = require('../models/Admin');

const adminMiddleware = async (req, res, next) => {
  try {
    // Check if session exists
    if (!req.session || !req.session.adminId) {
      return res.status(401).json({ 
        success: false,
        msg: 'Admin authentication required' 
      });
    }

    // Check if admin flag is set in session
    if (!req.session.isAdmin) {
      return res.status(403).json({ 
        success: false,
        msg: 'Admin access denied' 
      });
    }

    // Verify admin exists (using your existing simple model structure)
    const admin = await Admin.findById(req.session.adminId);
    if (!admin) {
      // Clear invalid session
      req.session.destroy();
      return res.status(401).json({ 
        success: false,
        msg: 'Admin account not found' 
      });
    }

    // Add admin to request object
    req.admin = admin;
    next();

  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ 
      success: false,
      msg: 'Authentication error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = adminMiddleware;