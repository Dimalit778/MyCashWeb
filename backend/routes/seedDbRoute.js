import express from "express";
import User from "../models/userSchema.js";
import Category from "../models/categorySchema.js";
import Transaction from "../models/transactionSchema.js";
import { testCategories, testTransactions, testUser } from "../db/seedDB.js";

const router = express.Router();
router.get("/getExpenses", async (req, res) => {
  try {
    const user = await User.findOne({ email: testUser.email });
    const transactions = await Transaction.find({ user: user._id, transactionType: "expenses" });
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/getIncomes", async (req, res) => {
  try {
    const user = await User.findOne({ email: testUser.email });
    const transactions = await Transaction.find({ user: user._id, transactionType: "incomes" });
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/create", async (req, res) => {
  try {
    const user = await User.findOne({ email: testUser.email });
    const categories = await Category.findOne({ user: user._id });
    // Add user and category IDs to transactions
    const transactionsWithRefs = testTransactions.map((trans) => ({
      ...trans,
      user: user._id,
      category: {
        id: categories.categories.find((cat) => cat.type === trans.transactionType && cat.name === trans.category.name)
          ?._id,
        name: categories.categories.find(
          (cat) => cat.type === trans.transactionType && cat.name === trans.category.name
        )?.name,
      },
    }));

    // Create transactions using Mongoose create
    const transactions = await Transaction.create(transactionsWithRefs);

    res.status(200).json({
      message: "Test data seeded",
      user,
      // categories,
      transactions,
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ error: error.message });
  }
});
router.delete("/clear", async (req, res) => {
  try {
    const user = await User.findOne({ email: testUser.email });

    await Transaction.deleteMany({ user: user._id });
    res.status(200).json({ message: "Test data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
