import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      max: 30,
      unique: true,
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
// Method to add a category
userSchema.methods.addCategory = function (type, category) {
  if (!this.categories.has(type)) {
    this.categories.set(type, []);
  }
  if (!this.categories.get(type).includes(category)) {
    this.categories.get(type).push(category);
  }
};

// Method to remove a category
userSchema.methods.removeCategory = function (type, category) {
  if (this.categories.has(type)) {
    this.categories.set(
      type,
      this.categories.get(type).filter((cat) => cat !== category)
    );
  }
};

const User = mongoose.model("User", userSchema);
export default User;
