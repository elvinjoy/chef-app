// model/commentModel.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  // Support for both ObjectId and string IDs
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // Store user details for easy display
  username: {
    type: String,
    required: true
  },
  userNumber: {
    type: String,
    required: true
  },
  // The actual comment text
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  // Tracking for admin edits
  adminEdited: {
    type: Boolean,
    default: false
  },
  lastEditedBy: {
    type: String,
    default: null
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
});

// Compound index to ensure one comment per user per recipe
commentSchema.index({ recipe: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Comment', commentSchema);