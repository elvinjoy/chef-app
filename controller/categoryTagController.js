const {
    createCategory,
    getAllCategories,
    createTag,
    getAllTags,
    deleteCategory,
    deleteTag, // ⬅️ Add this
  } = require('../helper/categoryTagFunction');
  
  // Create Category
  const createCategoryController = async (req, res) => {
    try {
      const result = await createCategory(req.body.name);
      res.status(201).json({ message: "Category created", data: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

  // Get Categories
  const getCategoriesController = async (req, res) => {
    try {
      const result = await getAllCategories();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  // Create Tag
  const createTagController = async (req, res) => {
    try {
      const result = await createTag(req.body.name);
      res.status(201).json({ message: "Tag created", data: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

  // Get Tags
  const getTagsController = async (req, res) => {
    try {
      const result = await getAllTags();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Delete Category
  const deleteCategoryController = async (req, res) => {
    try {
      const result = await deleteCategory(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const deleteTagController = async (req, res) => {
    try {
      const result = await deleteTag(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  module.exports = {
    createCategoryController,
    getCategoriesController,
    createTagController,
    getTagsController,
    deleteCategoryController,
    deleteTagController, // ⬅️ Export this too
  };
  