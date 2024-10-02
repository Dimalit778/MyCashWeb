import Expense from "../models/expenseModel.js";
import expenseSchema from "../models/expenseModel.js";

// Get All User Expenses
export const getAllExpenses = async (req, res) => {
  const userId = req.user._id;

  try {
    const result = await Expense.find({ user: userId });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get One Expense
export const getExpense = async (req, res) => {
  const expenseId = req.params.id;
  try {
    const result = await Expense.findOne({ _id: expenseId });

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "expense not found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Add Expense
export const addExpense = async (req, res) => {
  const userId = req.user._id;

  const { title, amount, category, date } = req.body;

  const expense = expenseSchema({
    title,
    amount,
    date,
    category,
    user: userId,
  });

  try {
    // Validations
    if (!title || !date || !category) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || typeof amount !== "number") {
      return res.status(400).json({ message: "Amount must be a positive number!" });
    }

    await expense.save();
    res.status(200).json({ expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Expense
export const updateExpense = async (req, res) => {
  const expenseId = req.params.id;
  try {
    const result = await Expense.findOneAndUpdate({ _id: expenseId }, req.body, { new: true });

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "expense not found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
  const expenseId = req.params.id;
  try {
    await Expense.findByIdAndDelete(expenseId);
    res.status(200).json({ message: "Expense Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
