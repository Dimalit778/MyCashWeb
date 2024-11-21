import mongoose from "mongoose";

import { TRANSACTION_TYPES } from "../config/config.js";

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    categories: [
      {
        label: {
          type: String,
          required: [true, "Category label is required"],
          trim: true,
          minLength: [2, "Label must be at least 2 characters"],
          maxLength: [20, "Label cannot exceed 20 characters"],
        },
        type: {
          type: String,
          enum: {
            values: Object.values(TRANSACTION_TYPES),
            message: "{VALUE} is not a valid type",
          },
          required: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
