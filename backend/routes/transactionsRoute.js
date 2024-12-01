import express from "express";

import {
  addTransaction,
  deleteTransaction,
  getMonthlyData,
  getMonthlyTransactions,
  getOneTransaction,
  getYear,
  getYearlyStats,
  updateTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router
  .get("/monthly", getMonthlyTransactions)
  .get("/monthlyData", getMonthlyData)
  .get("/yearly", getYearlyStats)
  .get("/all", getYear)
  .get("/getOne/:id", getOneTransaction)
  .post("/add", addTransaction)
  .patch("/update", updateTransaction) // change to req.body
  .delete("/delete/:id", deleteTransaction);

export default router;
