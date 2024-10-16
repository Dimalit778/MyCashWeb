import express from "express";

import {
  addTransaction,
  deleteTransaction,
  getMonthlyTransactions,
  getYearlyTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

router

  .get("/monthly", getMonthlyTransactions)
  .get("/yearly", getYearlyTransactions)
  .post("/add", addTransaction)
  .delete("/delete/:type/:id", deleteTransaction);

export default router;
