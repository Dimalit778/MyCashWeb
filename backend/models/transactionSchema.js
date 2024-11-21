import mongoose from "mongoose";
import { TRANSACTION_TYPES } from "../config/config.js";
const transactionSchema = mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Transaction label is required"],
      trim: true,
      minLength: [2, "label must be at least 2 characters"],
      maxLength: [20, "label cannot exceed 20 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: "Amount must be greater than 0",
      },
    },

    description: {
      type: String,
      maxLength: [40, "Description cannot exceed 40 characters"],
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
      index: true,
    },

    categoryLabel: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ user: 1, type: 1, date: -1 });
transactionSchema.index({ user: 1, date: -1 });

// Static method for Monthly summary
transactionSchema.statics.getMonthlyStats = async function (userId, type, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const result = await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $facet: {
        totalAmount: [
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ],
        byCategory: [
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $addFields: {
              categoryName: { $arrayElemAt: ["$category.name", 0] },
              categoryColor: { $arrayElemAt: ["$category.color", 0] },
            },
          },
          { $sort: { total: -1 } },
        ],
        transactions: [
          { $sort: { date: -1 } },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $addFields: {
              categoryName: { $arrayElemAt: ["$category.name", 0] },
              categoryColor: { $arrayElemAt: ["$category.color", 0] },
            },
          },
        ],
      },
    },
    {
      $project: {
        totalAmount: { $ifNull: [{ $arrayElemAt: ["$totalAmount.total", 0] }, 0] },
        byCategory: 1,
        transactions: 1,
      },
    },
  ]);

  return result[0] || { totalAmount: 0, byCategory: [], transactions: [] };
};

// Static method for Yearly summary

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
export default Transaction;
