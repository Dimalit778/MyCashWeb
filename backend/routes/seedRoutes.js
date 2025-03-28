import express from "express";
import {
  seedClearDb,
  seedMultipleUsers,
  seedTransactions,
  seedUserWithCategories,
} from "../controllers/seedDbController.js";

const router = express.Router();

router
  .post("/userAndCategories", seedUserWithCategories)
  .post("/transactions", seedTransactions)
  .post("/multipleUsers", seedMultipleUsers)
  .delete("/clear", seedClearDb);

export default router;
