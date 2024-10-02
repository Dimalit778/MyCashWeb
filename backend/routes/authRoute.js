import express from "express";
import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyEmail,
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();
router.get("/checkAuth", protectRoute, checkAuth);

router.post("/signup", signup);
router.post("/logout", logout);
router.post("/login", login);
// router.post('/googleAuth', googleAuth);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
