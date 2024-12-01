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
        name: {
          type: String,
          required: [true, "Category name is required"],
          trim: true,
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
