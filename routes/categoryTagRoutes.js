const express = require('express');
const router = express.Router();
const {
  createCategoryController,
  getCategoriesController,
  createTagController,
  getTagsController,
  deleteCategoryController,
  deleteTagController, // ⬅️ Add this
} = require('../controller/categoryTagController');
const { adminProtect, adminOnly } = require('../middleware/adminMiddleware');

// CATEGORY ROUTES
router.post('/create-category',adminProtect,adminOnly, createCategoryController);
router.get('/allcategory',adminProtect,adminOnly, getCategoriesController);
router.delete('/delete-category/:id', deleteCategoryController);

// TAG ROUTES
router.post('/create-tag',adminProtect,adminOnly, createTagController);
router.get('/alltags',adminProtect,adminOnly, getTagsController);
router.delete('/delete-tag/:id', deleteTagController);
module.exports = router;
