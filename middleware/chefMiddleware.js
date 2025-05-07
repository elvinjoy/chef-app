// middleware/chefMiddleware.js
const jwt = require('jsonwebtoken');
const Chef = require('../model/chefModel');
const { CHEF_JWT_SECRET } = process.env;

async function chefProtect(req, res, next) {
  try {
    // Get token from authorization header
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token missing' 
      });
    }
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, CHEF_JWT_SECRET);
      console.log('Decoded token in middleware:', decoded);
    } catch (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    
    // Find chef by ID from token
    const chef = await Chef.findById(decoded.chefId);
    
    if (!chef) {
      console.log('Chef not found with ID:', decoded.chefId);
      return res.status(401).json({ 
        success: false, 
        message: 'Chef not found' 
      });
    }
    
    // Set chef data consistently on req object
    req.chef = {
      _id: chef._id,
      chefId: chef._id.toString(), // String version for comparisons
      username: chef.username,
      email: chef.email,
      chefNumber: chef.chefNumber,
      role: chef.role
    };
    
    console.log('Chef authenticated:', req.chef.username);
    console.log('Chef ID for comparison:', req.chef.chefId);
    
    next();
  } catch (err) {
    console.error('chefProtect error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
}

module.exports = { chefProtect };