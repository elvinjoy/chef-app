// controller/commentController.js
const { 
    addComment, 
    deleteComment, 
    getRecipeComments,
    getUserComment,
    editComment
  } = require('../helper/commentFunction');
  const User = require('../model/userModel'); // Add this import
  
  /**
   * Add a comment to a recipe
   */
  async function addCommentController(req, res) {
    try {
      const { text } = req.body;
      const recipeId = req.params.recipeId;
      
      // Ensure comment text is provided
      if (!text || text.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Comment text is required'
        });
      }
  
      // In your userMiddleware, the req.userId is set from the token
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      // Create a user object with the data we have from the middleware
      // Instead of fetching from the database which expects ObjectId
      const user = { 
        _id: req.userId,
        username: req.username || 'User',  // Use default if not provided
        userNumber: req.userNumber || req.userId // Use userId as userNumber if not provided
      };
      
      // Call business logic function with manually created user object
      const comment = await addComment(recipeId, user, text);
      
      return res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: comment
      });
    } catch (err) {
      console.error('Add comment error:', err);
      
      // Handle specific error types
      if (err.message === 'Recipe not found') {
        return res.status(404).json({ 
          success: false, 
          message: err.message 
        });
      }
      
      if (err.message.includes('already commented')) {
        return res.status(400).json({ 
          success: false, 
          message: err.message 
        });
      }
  
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
  
  /**
   * Delete a comment
   */
  async function deleteCommentController(req, res) {
    try {
      const commentId = req.params.commentId;
      
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      // Create a user object
      const user = { _id: req.userId };
      
      // Call business logic function
      const result = await deleteComment(commentId, user);
      
      return res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
        data: result
      });
    } catch (err) {
      console.error('Delete comment error:', err);
      
      // Handle specific error types
      if (err.message === 'Comment not found') {
        return res.status(404).json({ 
          success: false, 
          message: err.message 
        });
      }
      
      if (err.message.includes('Unauthorized')) {
        return res.status(403).json({ 
          success: false, 
          message: err.message 
        });
      }
      
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
  
  /**
   * Get all comments for a recipe
   */
  async function getRecipeCommentsController(req, res) {
    try {
      const recipeId = req.params.recipeId;
      
      // Get pagination parameters from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      // Call business logic function
      const result = await getRecipeComments(recipeId, { page, limit });
      
      return res.status(200).json({
        success: true,
        count: result.comments.length,
        pagination: result.pagination,
        data: result.comments
      });
    } catch (err) {
      console.error('Get comments error:', err);
      
      // Handle recipe not found error
      if (err.message === 'Recipe not found') {
        return res.status(404).json({ 
          success: false, 
          message: err.message 
        });
      }
      
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
  
  /**
   * Get user's comment for a recipe
   */
  async function getUserCommentController(req, res) {
    try {
      const recipeId = req.params.recipeId;
      
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      // Create a user object
      const user = { _id: req.userId };
      
      // Call business logic function
      const comment = await getUserComment(recipeId, user);
      
      return res.status(200).json({
        success: true,
        data: comment
      });
    } catch (err) {
      console.error('Get user comment error:', err);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  async function editCommentController(req, res) {
    try {
      const commentId = req.params.commentId;
      const { text } = req.body;
      
      // Ensure comment text is provided
      if (!text || text.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Comment text is required'
        });
      }
  
      // Determine if the request is from admin or regular user
      const isAdmin = !!req.admin;
      
      // Get user ID from either user middleware or admin middleware
      const userId = req.userId || (req.admin && req.admin._id);
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
  
      // Create a user object
      const user = { _id: userId };
      
      // Call business logic function
      const updatedComment = await editComment(commentId, user, text, isAdmin);
      
      return res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: updatedComment
      });
    } catch (err) {
      console.error('Edit comment error:', err);
      
      // Handle specific error types
      if (err.message === 'Comment not found') {
        return res.status(404).json({ 
          success: false, 
          message: err.message 
        });
      }
      
      if (err.message.includes('Unauthorized')) {
        return res.status(403).json({ 
          success: false, 
          message: err.message 
        });
      }
      
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
  
  module.exports = {
    addCommentController,
    deleteCommentController,
    getRecipeCommentsController,
    getUserCommentController,
    editCommentController
  };