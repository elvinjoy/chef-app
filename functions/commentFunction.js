// functions/commentFunction.js
const Comment = require("../model/commentModel");
const Recipe = require("../model/recipeModel");

async function addComment(recipeId, user, text) {
  // Check if recipe exists
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new Error("Recipe not found");
  }

  // Get user details
  const userId = user._id;
  const username = user.username;
  const userNumber = user.userNumber;

  if (!username || !userNumber) {
    throw new Error("User details not found");
  }

  try {
    // Try to create a new comment
    const comment = await Comment.create({
      recipe: recipeId,
      user: userId, // This can now be a string ID
      username,
      userNumber,
      text,
    });

    return comment;
  } catch (err) {
    // Handle duplicate comment error
    if (err.code === 11000) {
      // Find and update the existing comment
      const existingComment = await Comment.findOneAndUpdate(
        { recipe: recipeId, user: userId },
        { text, updatedAt: Date.now() },
        { new: true }
      );

      if (existingComment) {
        return existingComment;
      }

      throw new Error("You have already commented on this recipe");
    }
    throw err;
  }
}

/**
 * Delete a comment
 * @param {String} commentId - ID of the comment to delete
 * @param {Object} user - User deleting the comment (must be owner)
 * @returns {Promise<Object>} - Deletion result
 */
async function deleteComment(commentId, user) {
  const userId = user._id;

  // Find the comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  // Check if the user owns the comment (comparing as strings)
  if (String(comment.user) !== String(userId)) {
    throw new Error("Unauthorized: You can only delete your own comments");
  }

  // Delete the comment
  await comment.deleteOne();

  return { deleted: true, commentId };
}

/**
 * Get all comments for a recipe
 * @param {String} recipeId - Recipe ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Array>} - Comments for the recipe
 */
async function getRecipeComments(recipeId, options = {}) {
  const { page = 1, limit = 10, sort = "-createdAt" } = options;

  // Check if recipe exists
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new Error("Recipe not found");
  }

  // Get comments with pagination
  const comments = await Comment.find({ recipe: recipeId })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  // Get total count for pagination
  const total = await Comment.countDocuments({ recipe: recipeId });

  return {
    comments,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get user's comment for a recipe
 * @param {String} recipeId - Recipe ID
 * @param {Object} user - User object
 * @returns {Promise<Object>} - User's comment or null
 */
async function getUserComment(recipeId, user) {
  const userId = user._id;

  // Find user's comment for this recipe
  const comment = await Comment.findOne({
    recipe: recipeId,
    user: userId,
  });

  return comment;
}

async function editComment(commentId, user, text, isAdmin = false) {
  // Find the comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  const userId = user._id;

  // Check authorization - allow edit if admin or comment owner
  if (!isAdmin && String(comment.user) !== String(userId)) {
    throw new Error("Unauthorized: You can only edit your own comments");
  }

  // Update the comment
  comment.text = text;
  comment.updatedAt = Date.now();

  // If an admin is editing someone else's comment, add an admin edit flag
  if (isAdmin && String(comment.user) !== String(userId)) {
    comment.adminEdited = true;
    comment.lastEditedBy = "Admin";
  }

  await comment.save();

  return comment;
}

module.exports = {
  addComment,
  deleteComment,
  getRecipeComments,
  getUserComment,
  editComment,
};
