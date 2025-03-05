import express from "express";

import Category from "../models/categorySchema.js";
import Transaction from "../models/transactionSchema.js";
import { seedDatabase } from "../db/seedDataBase.js";

const router = express.Router();
router.post("/seed-all", async (req, res) => {
  try {
    await seedDatabase();
    res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/seed-transactions", async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's categories
    const categories = await Category.find({ user: userId });
    // console.log("categories", categories);

    const incomeCategories = categories.filter((cat) => cat.type === "incomes");
    const expenseCategories = categories.filter((cat) => cat.type === "expenses");

    let transactions = [];

    // Helper function to get random date in 2025
    const getRandomDate = () => {
      const start = new Date("2025-01-01").getTime();
      const end = new Date("2025-12-31").getTime();
      return new Date(start + Math.random() * (end - start));
    };

    // // Helper function to get random amount
    const getRandomAmount = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    // // Generate 150 expense transactions
    for (let i = 0; i < 25; i++) {
      const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      transactions.push({
        description: `Transaction ${i + 1}`,
        amount: getRandomAmount(50, 5000),
        date: getRandomDate(),
        transactionType: "expenses",
        category: category.name,
        user: userId,
      });
    }

    // // Generate 50 income transactions
    for (let i = 0; i < 25; i++) {
      const category = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
      transactions.push({
        description: `Income ${i + 1}`,
        amount: getRandomAmount(3000, 10000),
        date: getRandomDate(),
        transactionType: "incomes",
        category: category.name,
        user: userId,
      });
    }

    const result = await Transaction.insertMany(transactions);
    res.json({
      success: true,
      transactionCount: result.length,
      transactions: transactions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/seed-categories", async (req, res) => {
  try {
    const userId = req.user._id;

    const categories = [
      // Income categories
      { name: "Salary", type: "incomes", user: userId },
      { name: "Investments", type: "incomes", user: userId },

      // Expense categories
      { name: "Home", type: "expenses", user: userId },
      { name: "Car", type: "expenses", user: userId },
      { name: "Shopping", type: "expenses", user: userId },
    ];

    const result = await Category.insertMany(categories);
    res.json({ success: true, categories: result.insertedIds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/delete-categories", async (req, res) => {
  try {
    const userId = req.user._id;

    await Category.deleteMany({ user: userId });
    res.status(200).json({ message: "Test data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/delete-transactions", async (req, res) => {
  try {
    const userId = req.user._id;

    await Transaction.deleteMany({ user: userId });
    res.status(200).json({ message: "Test data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
