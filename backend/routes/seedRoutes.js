import express from "express";
import { clearDb, seedTransactions, seedUserWithCategories } from "../controllers/seedDbController.js";

const router = express.Router();

router
  .post("/userAndCategories", seedUserWithCategories)
  .post("/transactions", seedTransactions)
  .delete("/clear", clearDb);

export default router;
