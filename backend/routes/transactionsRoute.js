import express from "express";

import {
  addTransaction,
  deleteTransaction,
  getMonthlyTransactions,
  getYearlyTransactions,
  updateTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router

  .get("/monthly", getMonthlyTransactions)
  .get("/yearly", getYearlyTransactions)
  .post("/add", addTransaction)
  .patch("/update", updateTransaction)
  .delete("/delete/:id/:type", deleteTransaction);

export default router;
