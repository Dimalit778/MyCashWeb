import Category from "../models/categorySchema.js";

import { CATEGORY_LIMITS } from "../config/config.js";

const getCategories = async (req, res) => {
  try {
    const userCategories = await Category.findOne({ user: req.user._id });

    if (!userCategories) {
      return res.status(404).json({
        success: false,
        message: "Categories not found",
      });
    }

    const categories = userCategories.categories;
    const maxCategories = CATEGORY_LIMITS[req.user.subscription];
    res.json({ categories, maxCategories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addCategory = async (req, res) => {
  try {
    const { label, type } = req.body;
    const userCategories = await Category.findOne({ user: req.user._id });

    // Validate unique label
    const isDuplicate = userCategories.categories
      .filter((cat) => cat.type === type)
      .some((cat) => cat.label.toLowerCase() === label.toLowerCase());

    if (isDuplicate) {
      return res.status(400).json({ message: "Category label must be unique" });
    }

    // Check limit
    const typeCategories = userCategories.categories.filter((cat) => cat.type === type);
    const limit = CATEGORY_LIMITS[req.user.subscription];

    if (typeCategories.length >= limit) {
      return res.status(400).json({ message: `Cannot add more than ${limit} categories` });
    }

    userCategories.categories.push({ label, type });
    await userCategories.save();

    res.json({ categories: userCategories.categories });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userCategories = await Category.findOne({ user: req.user._id });

    const category = userCategories.categories.id(id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    if (category.isDefault) return res.status(400).json({ message: "Cannot delete default category" });

    userCategories.categories.pull(id);
    await userCategories.save();

    res.json({ categories: userCategories.categories });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getCategories, addCategory, deleteCategory };
