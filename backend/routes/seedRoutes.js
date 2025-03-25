import express from "express";
import { seedClearDb, seedTransactions, seedUserWithCategories } from "../controllers/seedDbController.js";

const router = express.Router();

router
  .post("/userAndCategories", seedUserWithCategories)
  .post("/transactions", seedTransactions)
  .delete("/clear", seedClearDb);

export default router;
