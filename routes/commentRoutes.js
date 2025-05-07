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


router.get('/allcommentsforrecipe/:recipeId', getRecipeCommentsController);

// Protected routes - require authentication
router.post('/addcomment/:recipeId', protect, addCommentController);
router.put('/editcomment/:commentId', protect, editCommentController);
router.delete('/deletecomment/:commentId', protect, deleteCommentController);
router.get('/user/recipe/:recipeId', protect, getUserCommentController);

module.exports = router;