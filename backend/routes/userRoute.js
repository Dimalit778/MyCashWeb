import express from "express";

import { deleteImage, deleteUser, getUser, updateUser, uploadImage } from "../controllers/userController.js";

const router = express.Router();
router
  .get("/profile", getUser)
  .patch("/update", updateUser)
  .delete("/profile", deleteUser)
  .post("/profile/image", uploadImage)
  .delete("/profile/image", deleteImage);

export default router;
