import incomeSchema from "../models/incomeModel.js";
import Income from "../models/incomeModel.js";
import User from "../models/userModel.js";

// Get All User Incomes
export const getAllIncomes = async (req, res) => {
  const userId = req.id;
  try {
    const result = await Income.find({ user: userId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get One Income
export const getIncome = async (req, res) => {
  const incomeId = req.params.id;
  try {
    const result = await Income.findOne({ _id: incomeId });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Income not found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Add Income
export const addIncome = async (req, res) => {
  const userId = req.id;
  const { title, amount, category, date } = req.body;
  const income = incomeSchema({
    title,
    amount,
    date,
    category,
    user: userId,
  });
  try {
    if (!title || !date || !category) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || typeof amount !== "number") {
      return res.status(400).json({ message: "Amount must be a positive number!" });
    }
    await income.save();
    res.status(200).json({ message: "Income Added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Income
export const updateIncome = async (req, res) => {
  const incomeId = req.params.id;
  try {
    const result = await Income.findOneAndUpdate({ _id: incomeId }, req.body, {
      new: true,
    });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Income not found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete Income
export const deleteIncome = async (req, res) => {
  const incomeId = req.params.id;
  try {
    await Income.findByIdAndDelete(incomeId);
    res.status(200).json({ message: "Income Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
