const Category = require('../model/categoryModel');
const Tag = require('../model/tagModel');

// Normalize input name
const normalizeName = (name) => name.trim().toLowerCase();

// Create Category
const createCategory = async (name) => {
  if (!name) throw new Error('Category name is required');

  const normalized = normalizeName(name);
  const exists = await Category.findOne({ name: { $regex: `^${normalized}$`, $options: 'i' } });
  if (exists) throw new Error('Category already exists');

  return await Category.create({ name: normalized });
};

// Get All Categories
const getAllCategories = async () => {
  return await Category.find({});
};

// Create Tag
const createTag = async (name) => {
  if (!name) throw new Error('Tag name is required');

  const normalized = normalizeName(name);
  const exists = await Tag.findOne({ name: { $regex: `^${normalized}$`, $options: 'i' } });
  if (exists) throw new Error('Tag already exists');

  return await Tag.create({ name: normalized });
};

// Get All Tags
const getAllTags = async () => {
  return await Tag.find({});
};

// Delete Category
const deleteCategory = async (categoryId) => {
    const deleted = await Category.findByIdAndDelete(categoryId);
    if (!deleted) throw new Error("Category not found");
    return { message: "Category deleted successfully" };
  };
  


  // Delete Tag
const deleteTag = async (tagId) => {
  const deleted = await Tag.findByIdAndDelete(tagId);
  if (!deleted) throw new Error("Tag not found");
  return { message: "Tag deleted successfully" };
};

module.exports = {
  createCategory,
  getAllCategories,
  createTag,
  getAllTags,
  deleteCategory,
  deleteTag, // ⬅️ Export here
};

  
