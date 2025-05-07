// functions/recipeFunction.js

const Recipe = require('../model/recipeModel');

/**
 * Create a new recipe with the given fields
 * @param {Object} fields - Recipe data
 * @param {Object} chef - Authenticated chef
 * @returns {Promise<Object>} - Created recipe
 */
async function createRecipe(fields, chef) {
  const {
    title, description, cookingTime,
    steps = [], images = [],
    categoryName, tagNames = []
  } = fields;

  // Validate required fields
  if (!title) throw new Error('Recipe title is required');
  if (!categoryName) throw new Error('Category is required');

  // Create new recipe - use data directly from Postman
  const recipe = new Recipe({
    title,
    description,
    cookingTime,
    steps,
    images,
    categoryName,  // Use category name directly
    tagNames,      // Use tag names directly
    chef: chef._id,
    chefUsername: chef.username,
    chefNumber: chef.chefNumber
  });

  await recipe.save();
  return recipe;
}

/**
 * Update an existing recipe
 * @param {String} recipeId - ID of recipe to update
 * @param {Object} updates - Fields to update
 * @param {Object} chef - Authenticated chef
 * @returns {Promise<Object>} - Updated recipe
 */
async function updateRecipeById(recipeId, updates, chef) {
  // Find the recipe
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) throw new Error('Recipe not found');

  // Verify authorization
  const chefIdStr = chef._id?.toString() || chef.chefId;
  const recipeChefStr = recipe.chef.toString();
  
  if (recipeChefStr !== chefIdStr) {
    throw new Error('Unauthorized: You can only edit your own recipes');
  }

  // Update image fields if new images provided
  if (updates.newImages && updates.newImages.length > 0) {
    recipe.images = [...recipe.images, ...updates.newImages];
  }

  // Update fields directly from request data without validation against collections
  if (updates.title) recipe.title = updates.title;
  if (updates.description) recipe.description = updates.description;
  if (updates.cookingTime) recipe.cookingTime = updates.cookingTime;
  if (updates.steps) recipe.steps = updates.steps;
  if (updates.categoryName) recipe.categoryName = updates.categoryName; // Use category name directly
  if (updates.tagNames) recipe.tagNames = updates.tagNames; // Use tag names directly

  await recipe.save();
  return recipe;
}

/**
 * Delete a recipe
 * @param {String} recipeId - ID of recipe to delete
 * @param {Object} chef - Authenticated chef
 * @returns {Promise<Object>} - Deletion result
 */
async function deleteRecipeById(recipeId, chef) {
  // Find the recipe
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) throw new Error('Recipe not found');

  // Debug logging to help identify issues
  console.log('Chef object:', JSON.stringify(chef, null, 2));
  console.log('Chef ID from req.chef:', chef._id ? chef._id.toString() : 'undefined');
  console.log('Recipe Chef ID:', recipe.chef.toString());
  
  // Check if the chef trying to delete it is the owner
  // Use multiple methods to get chef ID for compatibility
  const chefIdStr = (chef._id?.toString()) || chef.chefId;
  const recipeChefStr = recipe.chef.toString();
  
  if (recipeChefStr !== chefIdStr) {
    throw new Error(`Unauthorized: You can only delete your own recipes. Recipe belongs to ${recipeChefStr}, but you are ${chefIdStr}`);
  }

  // Delete the recipe
  await recipe.deleteOne();

  return { 
    deleted: true, 
    recipeId 
  };
}

async function getPopularRecipes(limit = 10) {
    try {
      // Find recipes sorted by view count in descending order
      const recipes = await Recipe.find()
        .sort({ viewCount: -1 }) // Sort by view count (highest first)
        .limit(limit);           // Limit results
        
      return recipes;
    } catch (err) {
      console.error('Error fetching popular recipes:', err);
      throw err;
    }
  }

module.exports = { 
  createRecipe, 
  updateRecipeById, 
  deleteRecipeById,
  getPopularRecipes 
};