// model/recipeModel.js
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
  
  // New view count field with default value of 0
  viewCount: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipe", recipeSchema);