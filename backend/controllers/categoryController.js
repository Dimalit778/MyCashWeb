import Category from "../models/categorySchema.js";
import { CATEGORY_LIMITS } from "../config/config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
const getCategories = asyncHandler(async (req, res) => {
  const userCategories = await Category.findOne({ user: req.user._id });

  if (!userCategories) {
    throw new ApiError(404, "Categories not found");
  }

  const categories = userCategories.categories;
  const maxCategories = CATEGORY_LIMITS[req.user.subscription];

  return res.status(200).json(new ApiResponse(200, { categories, maxCategories }));
});

const addCategory = asyncHandler(async (req, res) => {
  const { name, type } = req.body;

  if (!name || name.length < 2 || name.length > 20) {
    throw new ApiError(400, "Name must be between 2 and 20 characters");
  }

  const userCategories = await Category.findOne({ user: req.user._id });

  const isDuplicate = userCategories.categories
    .filter((cat) => cat.type === type)
    .some((cat) => cat.name.toLowerCase() === name.toLowerCase());

  if (isDuplicate) {
    throw new ApiError(400, "Category name must be unique");
  }

  const typeCategories = userCategories.categories.filter((cat) => cat.type === type);
  const limit = CATEGORY_LIMITS[req.user.subscription];

  if (typeCategories.length >= limit) {
    throw new ApiError(400, `Cannot add more than ${limit} categories`);
  }

  userCategories.categories.push({ name, type });
  await userCategories.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { categories: userCategories.categories }, "Category added successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userCategories = await Category.findOne({ user: req.user._id });

  const category = userCategories.categories.id(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (category.isDefault) {
    throw new ApiError(400, "Cannot delete default category");
  }

  userCategories.categories.pull(id);
  await userCategories.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { categories: userCategories.categories }, "Category deleted successfully"));
});

export { getCategories, addCategory, deleteCategory };
