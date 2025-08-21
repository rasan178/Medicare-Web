module.exports = (req, res, next) => {
  if (!req.session.adminId) return res.status(401).json({ msg: 'Unauthorized' });
  next();
}; 
