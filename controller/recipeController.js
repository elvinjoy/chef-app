// controller/recipeController.js

// Import the Recipe model for the getRecipeController
const Recipe = require('../model/recipeModel');

// Import the business logic functions
const { 
  createRecipe, 
  updateRecipeById, 
  deleteRecipeById, 
  getPopularRecipes 
} = require('../functions/recipeFunction');

/**
 * Create a new recipe
 */
async function createRecipeController(req, res) {
  try {
    // 1) Extract data from request body
    let { title, description, cookingTime, steps, category, tags } = req.body;

    // 2) Parse JSON-encoded arrays if sent as strings
    if (typeof steps === 'string') {
      try {
        steps = JSON.parse(steps);
      } catch (e) {
        steps = [steps]; // Treat as single step if not valid JSON
      }
    }
    
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        tags = tags.includes(',') ? tags.split(',').map(t => t.trim()) : [tags];
      }
    }

    // 3) Extract file paths from uploaded files
    const images = (req.files || []).map(f => f.path);

    // 4) Call business logic function with raw fields + authenticated chef
    const recipe = await createRecipe(
      { 
        title, 
        description, 
        cookingTime, 
        steps, 
        images, 
        categoryName: category, 
        tagNames: tags 
      },
      req.chef
    );

    return res.status(201).json({ 
      success: true, 
      message: 'Recipe created successfully',
      data: recipe 
    });
  } catch (err) {
    console.error('Create recipe error:', err);
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
}

/**
 * Edit an existing recipe
 */
async function editRecipeController(req, res) {
  try {
    const recipeId = req.params.id;
    let { title, description, cookingTime, steps, category, tags } = req.body;
    
    console.log('Received data for edit:', { 
      title, 
      description, 
      cookingTime, 
      steps: typeof steps, 
      tags: typeof tags 
    });

    // Parse JSON strings if needed
    try {
      if (typeof steps === 'string') {
        if (steps.trim().startsWith('[') && steps.trim().endsWith(']')) {
          steps = JSON.parse(steps);
        } else {
          steps = [steps]; // Treat as single step
        }
      }
      
      if (typeof tags === 'string') {
        if (tags.trim().startsWith('[') && tags.trim().endsWith(']')) {
          tags = JSON.parse(tags);
        } else {
          tags = tags.includes(',') ? tags.split(',').map(tag => tag.trim()) : [tags];
        }
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(400).json({ 
        success: false, 
        message: `Invalid JSON format: ${parseError.message}` 
      });
    }
    
    // Ensure arrays
    steps = Array.isArray(steps) ? steps : (steps ? [steps] : []);
    tags = Array.isArray(tags) ? tags : (tags ? [tags] : []);
    
    // Get new images from uploaded files
    const newImages = (req.files || []).map(f => f.path);

    // Call the business logic function
    try {
      const updatedRecipe = await updateRecipeById(
        recipeId,
        {
          title,
          description,
          cookingTime,
          steps,
          categoryName: category,
          tagNames: tags,
          newImages
        },
        req.chef
      );

      return res.status(200).json({ 
        success: true, 
        message: 'Recipe updated successfully',
        data: updatedRecipe 
      });
    } catch (err) {
      // Handle specific error types
      if (err.message === 'Recipe not found') {
        return res.status(404).json({ success: false, message: err.message });
      }
      if (err.message === 'Unauthorized' || err.message.includes('Unauthorized')) {
        return res.status(403).json({ success: false, message: err.message });
      }
      
      throw err; // Re-throw for the outer catch
    }
  } catch (err) {
    console.error('Edit recipe error:', err);
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
}

/**
 * Delete a recipe
 */
async function deleteRecipeController(req, res) {
  try {
    const recipeId = req.params.id;

    // Call the business logic function
    const result = await deleteRecipeById(recipeId, req.chef);

    return res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully',
      data: result
    });
  } catch (err) {
    console.error('Delete recipe error:', err.message);
    
    // Return appropriate status code based on error type
    if (err.message === 'Recipe not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    if (err.message.includes('Unauthorized')) {
      return res.status(403).json({ success: false, message: err.message });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
}

/**
 * Get a single recipe by ID and increment view count
 */
async function getRecipeController(req, res) {
  try {
    const recipeId = req.params.id;
    
    // Find recipe and increment view count atomically
    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $inc: { viewCount: 1 } }, // Increment viewCount by 1
      { new: true } // Return the updated document
    );
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (err) {
    console.error('Error fetching recipe:', err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

/**
 * Get popular recipes based on view count
 */
async function getPopularRecipesController(req, res) {
  try {
    // Get limit parameter from query or default to 10
    const limit = parseInt(req.query.limit) || 10;
    
    // Get popular recipes using the function
    const recipes = await getPopularRecipes(limit);
    
    return res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (err) {
    console.error('Error fetching popular recipes:', err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

module.exports = { 
  createRecipeController, 
  editRecipeController, 
  deleteRecipeController,
  getRecipeController,
  getPopularRecipesController
};