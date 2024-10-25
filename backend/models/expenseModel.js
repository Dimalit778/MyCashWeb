import mongoose from "mongoose";

const expenseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
  },
  amount: {
    type: Number,
    required: true,
    maxLength: 20,
  },
  date: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxLength: 40,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
export default mongoose.model.Expenses || mongoose.model("Expense", expenseSchema);
