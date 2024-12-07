import mongoose from "mongoose";
import { TRANSACTION_TYPES } from "../config/config.js";
const transactionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    transactionType: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
      index: true,
    },

    category: {
      id: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String, required: true },
    },
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

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
export default Transaction;
