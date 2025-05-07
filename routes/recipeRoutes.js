// routes/recipeRoutes.js

const express = require('express');
const multer = require('multer');

// Import controllers
const { 
  createRecipeController, 
  editRecipeController, 
  deleteRecipeController,
  getRecipeController,
  getPopularRecipesController // Add this controller
} = require('../controller/recipeController');

const { chefProtect } = require('../middleware/chefMiddleware');

// Multer setup
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Public routes (no authentication needed)
// Get popular recipes - must be before the /:id route to avoid conflict
router.get('/popular', getPopularRecipesController);

// Get single recipe and increment view count
router.get('/:id', getRecipeController);

// Protected routes (authentication required)
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