// routes/commentRoutes.js
const express = require('express');
const router = express.Router();

const {
  addCommentController,
  editCommentController,
  deleteCommentController,
  getRecipeCommentsController,
  getUserCommentController
} = require('../controller/commentController');

const { protect } = require('../middleware/userMiddleware');

// Custom middleware to handle both admin and user authentication
const jwt = require('jsonwebtoken');
const Admin = require('../model/adminModel');
const User = require('../model/userModel');
const { ADMIN_JWT_SECRET, USER_JWT_SECRET } = process.env;

const anyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Try verifying as admin
    const decodedAdmin = jwt.verify(token, ADMIN_JWT_SECRET);
    const admin = await Admin.findById(decodedAdmin.adminId);
    if (admin) {
      req.admin = admin;
      return next();
    }
  } catch (err) {
    // Not an admin token - continue
  }

  try {
    // Try verifying as user
    const decodedUser = jwt.verify(token, USER_JWT_SECRET);
    const user = await User.findById(decodedUser.userId);
    if (user) {
      req.user = user;
      return next();
    }
  } catch (err) {
    // Not a valid user token either
  }

  return res.status(401).json({ success: false, message: 'Authentication failed' });
};

// Public route - Get all comments for a recipe
router.get('/allcommentsforrecipe/:recipeId', getRecipeCommentsController);

// Protected routes - require authentication
router.post('/addcomment/:recipeId', protect, addCommentController);
router.put('/editcomment/:commentId', anyAuth, editCommentController);
router.delete('/deletecomment/:commentId', protect, deleteCommentController);
router.get('/user/recipe/:recipeId', protect, getUserCommentController);

module.exports = router;