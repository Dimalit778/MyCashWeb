import express from "express";

import {
  addTransaction,
  deleteTransaction,
  getMonthlyTransactions,
  getOneTransaction,
  getYearlyStats,
  updateTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router
  .get("/monthly", getMonthlyTransactions)
  .get("/yearly", getYearlyStats)
  .get("/getOne/:id", getOneTransaction)
  .post("/add", addTransaction)
  .patch("/update", updateTransaction) // cahnage to req.body
  .delete("/delete/:id", deleteTransaction);

export default router;
