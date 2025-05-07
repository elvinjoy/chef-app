const jwt = require('jsonwebtoken');
const Admin = require('../model/adminModel');
const { ADMIN_JWT_SECRET } = require('../config/config');

const adminProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Not authorized, token missing");

    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) throw new Error("Admin not found");

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ error: "Admin not authorized" });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
};

module.exports = { adminProtect, adminOnly };
