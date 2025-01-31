import express from "express";

import { deleteUser, getUser, imageActions, updateUser } from "../controllers/userController.js";

const router = express.Router();
router
  .get("/get", getUser)
  .patch("/update", updateUser)
  .delete("/delete", deleteUser)
  .patch("/imageActions", imageActions);

export default router;
