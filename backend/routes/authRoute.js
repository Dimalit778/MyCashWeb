import express from "express";
import { login, logout, signup } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/logout", logout);
router.post("/login", login);
// router.post('/googleAuth', googleAuth);

export default router;
