// routes/recipeRoutes.js

const express = require('express');
const multer = require('multer');

// Import controllers
const { 
  createRecipeController, 
  editRecipeController, 
  deleteRecipeController,
  getRecipeController,
  getPopularRecipesController,
  likeRecipeController,
  dislikeRecipeController,
  getMostLikedRecipesController,
  getRecipeLikeStatusController,
} = require('../controller/recipeController');

const { chefProtect } = require('../middleware/chefMiddleware');
const { protect } = require('../middleware/userMiddleware');

// Multer setup
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Public routes (no authentication needed)
// Get most liked recipes
router.get('/most-liked', getMostLikedRecipesController);

// Get popular recipes by view count
router.get('/popular', getPopularRecipesController);

// Protected routes for like/dislike functionality
router.post('/like/:id', protect, likeRecipeController);
router.post('/dislike/:id', protect, dislikeRecipeController);
router.get('/like-status/:id', protect, getRecipeLikeStatusController);

// Get single recipe and increment view count
// This needs to be after all other specific routes to avoid conflicts
router.get('/:id', getRecipeController);

// Protected routes for CRUD operations
router.post(
  '/create',
  chefProtect,
  upload.array('images', 3),
  createRecipeController
);

router.put(
  '/edit/:id',
  chefProtect,
  upload.array('images', 3),
  editRecipeController
);

router.delete(
  '/delete/:id',
  chefProtect,
  deleteRecipeController
);

module.exports = router;