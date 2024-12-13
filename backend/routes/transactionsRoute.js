import express from "express";

import {
  addTransaction,
  deleteTransaction,
  getMonthlyData,
  getOneTransaction,
  getYearlyData,
  updateTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router

  .get("/monthly", getMonthlyData)
  .get("/yearly", getYearlyData)
  .get("/getOne/:id", getOneTransaction)
  .post("/add", addTransaction)
  .patch("/update", updateTransaction) // change to req.body
  .delete("/delete/:id", deleteTransaction);

export default router;
