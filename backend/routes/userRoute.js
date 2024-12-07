import express from "express";

import { deleteImage, deleteUser, getUser, updateUser } from "../controllers/userController.js";

const router = express.Router();
router
  .get("/get", getUser)
  .patch("/update", updateUser)
  .delete("/delete", deleteUser)
  .delete("/deleteImage", deleteImage);

export default router;
