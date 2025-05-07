// controller/commentController.js
const { 
    addComment, 
    deleteComment, 
    getRecipeComments,
    getUserComment,
    editComment
  } = require('../functions/commentFunction');
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

  const editCommentController = async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
  
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ success: false, message: "Comment not found" });
      }
  
      const userTrying = req.user;
      const adminTrying = req.admin;
  
      const isOwner = userTrying && String(comment.user) === String(userTrying._id);
      const isAdmin = !!adminTrying;
  
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: "Unauthorized to edit this comment" });
      }
  
      comment.text = text;
      comment.updatedAt = new Date();
  
      if (isAdmin && !isOwner) {
        comment.adminEdited = true;
        comment.lastEditedBy = "Admin";
      } else {
        comment.adminEdited = false;
        comment.lastEditedBy = userTrying?.username || "User";
      }
  
      await comment.save();
  
      return res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        comment
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  
  module.exports = {
    addCommentController,
    deleteCommentController,
    getRecipeCommentsController,
    getUserCommentController,
    editCommentController
  };