import express from "express";
import { addCategory, deleteCategory, getCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/get", getCategories).post("/add", addCategory).delete("/delete/:id", deleteCategory);

export default router;
