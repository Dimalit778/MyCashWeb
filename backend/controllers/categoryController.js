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
    const { name, type } = req.body;
    if (!name || name.length < 2 || name.length > 20) {
      return res.status(400).json({
        message: "Name must be between 2 and 20 characters",
      });
    }

    const userCategories = await Category.findOne({ user: req.user._id });
    const isDuplicate = userCategories.categories
      .filter((cat) => cat.type === type)
      .some((cat) => cat.name.toLowerCase() === name.toLowerCase());

    if (isDuplicate) {
      return res.status(400).json({ message: "Category name must be unique" });
    }
    const typeCategories = userCategories.categories.filter((cat) => cat.type === type);
    const limit = CATEGORY_LIMITS[req.user.subscription];

    if (typeCategories.length >= limit) {
      return res.status(400).json({ message: `Cannot add more than ${limit} categories` });
    }

    userCategories.categories.push({ name, type });
    await userCategories.save();
    return res.status(200).json({
      message: "Category added successfully",
      categories: userCategories.categories,
    });
  } catch (error) {
    console.error("Add category error:", error);
    return res.status(500).json({ message: "Server error adding category" });
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
