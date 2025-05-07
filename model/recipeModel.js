// model/recipeModel.js - Update the schema
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  images: {
    type: [String],
    required: [true, "At least 1 image is required"],
    validate: {
      validator: function (arr) {
        return arr.length <= 3;
      },
      message: "Max 3 images allowed",
    },
  },
  steps: [{ type: String, required: true }],
  
  // store the raw category string
  categoryName: { type: String, required: true },
  
  // store the raw tag strings
  tagNames: [{ type: String }],
  
  chef: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  chefUsername: { type: String, required: true },
  chefNumber: { type: String, required: true },
  
  // View count field
  viewCount: { type: Number, default: 0 },
  
  // Changed the type to support both ObjectIds and string IDs
  likes: { 
    type: [mongoose.Schema.Types.Mixed], 
    default: [] 
  },
  dislikes: { 
    type: [mongoose.Schema.Types.Mixed], 
    default: [] 
  },
  
  createdAt: { type: Date, default: Date.now },
});

// Virtual property for like count
recipeSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual property for dislike count
recipeSchema.virtual('dislikeCount').get(function() {
  return this.dislikes.length;
});

// Ensure virtuals are included when converting to JSON
recipeSchema.set('toJSON', { virtuals: true });
recipeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Recipe", recipeSchema);
