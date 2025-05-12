// functions/recipeFunction.js

const Recipe = require("../model/recipeModel");

/**
 * Create a new recipe with the given fields
 * @param {Object} fields - Recipe data
 * @param {Object} chef - Authenticated chef
 * @returns {Promise<Object>} - Created recipe
 */
async function createRecipe(fields, chef) {
  const {
    title,
    description,
    cookingTime,
    steps = [],
    images = [],
    categoryName,
    tagNames = [],
  } = fields;

  // Validate required fields
  if (!title) throw new Error("Recipe title is required");
  if (!categoryName) throw new Error("Category is required");

  // Create new recipe - use data directly from Postman
  const recipe = new Recipe({
    title,
    description,
    cookingTime,
    steps,
    images,
    categoryName, // Use category name directly
    tagNames, // Use tag names directly
    chef: chef._id,
    chefUsername: chef.username,
    chefNumber: chef.chefNumber,
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
  if (!recipe) throw new Error("Recipe not found");

  // Verify authorization
  const chefIdStr = chef._id?.toString() || chef.chefId;
  const recipeChefStr = recipe.chef.toString();

  if (recipeChefStr !== chefIdStr) {
    throw new Error("Unauthorized: You can only edit your own recipes");
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
  if (!recipe) throw new Error("Recipe not found");

  // Debug logging to help identify issues
  console.log("Chef object:", JSON.stringify(chef, null, 2));
  console.log(
    "Chef ID from req.chef:",
    chef._id ? chef._id.toString() : "undefined"
  );
  console.log("Recipe Chef ID:", recipe.chef.toString());

  // Check if the chef trying to delete it is the owner
  // Use multiple methods to get chef ID for compatibility
  const chefIdStr = chef._id?.toString() || chef.chefId;
  const recipeChefStr = recipe.chef.toString();

  if (recipeChefStr !== chefIdStr) {
    throw new Error(
      `Unauthorized: You can only delete your own recipes. Recipe belongs to ${recipeChefStr}, but you are ${chefIdStr}`
    );
  }

  // Delete the recipe
  await recipe.deleteOne();

  return {
    deleted: true,
    recipeId,
  };
}

/**
 * Get popular recipes based on view count
 * @param {Number} limit - Maximum number of recipes to return
 * @returns {Promise<Array>} - Array of popular recipes
 */
async function getPopularRecipes(limit = 10) {
  try {
    // Find recipes sorted by view count in descending order
    const recipes = await Recipe.find()
      .sort({ viewCount: -1 }) // Sort by view count (highest first)
      .limit(limit); // Limit results

    return recipes;
  } catch (err) {
    console.error("Error fetching popular recipes:", err);
    throw err;
  }
}

/**
 * Toggle like for a recipe
 * @param {String} recipeId - ID of recipe to like/unlike
 * @param {Object} user - User who is liking/unliking
 * @returns {Promise<Object>} - Updated recipe with like status
 */
async function toggleLikeRecipe(recipeId, user) {
  // Find the recipe
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) throw new Error("Recipe not found");

  const userId = user._id.toString();

  // Check if user already liked this recipe
  const alreadyLiked = recipe.likes.some((id) => id.toString() === userId);

  // Check if user already disliked this recipe
  const alreadyDisliked = recipe.dislikes.some(
    (id) => id.toString() === userId
  );

  // Handle both cases
  if (alreadyLiked) {
    // If already liked, remove like (toggle off)
    recipe.likes = recipe.likes.filter((id) => id.toString() !== userId);
    await recipe.save();

    return {
      recipe,
      liked: false,
      disliked: alreadyDisliked,
    };
  } else {
    // If not already liked, add like and remove from dislikes if present
    recipe.likes.push(user._id);

    // Remove from dislikes if user previously disliked
    if (alreadyDisliked) {
      recipe.dislikes = recipe.dislikes.filter(
        (id) => id.toString() !== userId
      );
    }

    await recipe.save();

    return {
      recipe,
      liked: true,
      disliked: false,
    };
  }
}

/**
 * Toggle dislike for a recipe
 * @param {String} recipeId - ID of recipe to dislike/undislike
 * @param {Object} user - User who is disliking/undisliking
 * @returns {Promise<Object>} - Updated recipe with dislike status
 */
async function toggleDislikeRecipe(recipeId, user) {
  // Find the recipe
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) throw new Error("Recipe not found");

  const userId = user._id.toString();

  // Check if user already disliked this recipe
  const alreadyDisliked = recipe.dislikes.some(
    (id) => id.toString() === userId
  );

  // Check if user already liked this recipe
  const alreadyLiked = recipe.likes.some((id) => id.toString() === userId);

  // Handle both cases
  if (alreadyDisliked) {
    // If already disliked, remove dislike (toggle off)
    recipe.dislikes = recipe.dislikes.filter((id) => id.toString() !== userId);
    await recipe.save();

    return {
      recipe,
      liked: alreadyLiked,
      disliked: false,
    };
  } else {
    // If not already disliked, add dislike and remove from likes if present
    recipe.dislikes.push(user._id);

    // Remove from likes if user previously liked
    if (alreadyLiked) {
      recipe.likes = recipe.likes.filter((id) => id.toString() !== userId);
    }

    await recipe.save();

    return {
      recipe,
      liked: false,
      disliked: true,
    };
  }
}

/**
 * Get most liked recipes
 * @param {Number} limit - Maximum number of recipes to return
 * @returns {Promise<Array>} - Array of most liked recipes
 */
async function getMostLikedRecipes(limit = 10) {
  try {
    // Aggregate to add likeCount field and sort by it
    const recipes = await Recipe.aggregate([
      // Add fields for like and dislike counts
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          dislikeCount: { $size: "$dislikes" },
        },
      },
      // Sort by like count in descending order
      { $sort: { likeCount: -1 } },
      // Limit results
      { $limit: limit },
    ]);

    return recipes;
  } catch (err) {
    console.error("Error fetching most liked recipes:", err);
    throw err;
  }
}

// Export all function implementations
module.exports = {
  createRecipe,
  updateRecipeById,
  deleteRecipeById,
  getPopularRecipes,
  toggleLikeRecipe,
  toggleDislikeRecipe,
  getMostLikedRecipes
};