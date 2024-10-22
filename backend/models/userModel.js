import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 30,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profileImage: {
      type: String,
      default: null,
    },
    categories: {
      type: Map,
      of: [String],
      default: () => ({
        incomes: ["work", "other"],
        expenses: ["food", "entertainment", "other"],
      }),
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },

  { timestamps: true }
);
// Method to add a category// Method to add a category
userSchema.methods.addCategory = function (type, category) {
  // Validate type
  if (!["incomes", "expenses"].includes(type)) {
    throw new Error("Type must be 'incomes' or 'expenses'");
  }

  // Validate category
  if (!category || typeof category !== "string" || category.trim().length === 0) {
    throw new Error("Category must be a non-empty string");
  }

  const normalizedCategory = category.trim().toLowerCase();

  // Initialize array if doesn't exist
  if (!this.categories.has(type)) {
    this.categories.set(type, []);
  }

  const categories = this.categories.get(type);

  // Check for duplicate (case-insensitive)
  if (!categories.some((cat) => cat.toLowerCase() === normalizedCategory)) {
    categories.push(category.trim());
    this.markModified("categories"); // Important for Map updates
  }
};
// Method to remove a category
userSchema.methods.removeCategory = function (type, category) {
  // Validate type
  if (!["incomes", "expenses"].includes(type)) {
    throw new Error("Type must be 'incomes' or 'expenses'");
  }

  // Validate category
  if (!category || typeof category !== "string") {
    throw new Error("Category must be a string");
  }

  const normalizedCategory = category.trim().toLowerCase();

  if (this.categories.has(type)) {
    const categories = this.categories.get(type);

    // Prevent removing 'other' category
    if (normalizedCategory === "other") {
      throw new Error("Cannot remove the 'other' category");
    }

    // Remove category (case-insensitive)
    this.categories.set(
      type,
      categories.filter((cat) => cat.toLowerCase() !== normalizedCategory)
    );

    this.markModified("categories"); // Important for Map updates
  }
};
// Helper method to get categories
userSchema.methods.getCategories = function (type) {
  if (type && !["incomes", "expenses"].includes(type)) {
    throw new Error("Type must be 'incomes' or 'expenses'");
  }

  return type ? this.categories.get(type) : Object.fromEntries(this.categories);
};

const User = mongoose.model("User", userSchema);
export default User;
