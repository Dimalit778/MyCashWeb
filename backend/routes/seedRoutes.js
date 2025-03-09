import express from "express";
import Category from "../models/categorySchema.js";
import Transaction from "../models/transactionSchema.js";
import User from "../models/userSchema.js";
import { seedUserWithTransactions } from "../db/seedUserWithTransactions.js";

const router = express.Router();

router
  .post("/create", async (req, res) => {
    try {
      const { count, profileImage, targetMonth, type } = req.body;
      const testUser =
        (await User.findOne({ email: "cypress@gmail.com" })) ||
        (await User.create({
          firstName: "Test",
          lastName: "User",
          email: "cypress@gmail.com",
          password: "144695",
          imageUrl: profileImage ? profileImage : null,
        }));

      const data = await seedUserWithTransactions(testUser, count, targetMonth, type);

      res.status(200).json({ message: "Database seeded successfully", data });
    } catch (err) {
      console.error("Error seeding database:", err);
      res.status(500).json({ error: err.message });
    }
  })
  .delete("/clear", async (req, res) => {
    try {
      await Category.deleteMany({});
      await Transaction.deleteMany({});
      await User.deleteMany({});
      res.status(200).json({ message: "Database cleared successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
export default router;
