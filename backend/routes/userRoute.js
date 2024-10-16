import express from "express";

import { deleteImage, uploadImage } from "../controllers/imageController.js";
import { addCategory, deleteCategory, deleteUser, getUser, updateUser } from "../controllers/userController.js";

const router = express.Router();
router.get("/getUser", getUser);
router.patch("/updateUser", updateUser);
router.post("/uploadImage", uploadImage);
router.post("/deleteImage", deleteImage);
router.post("/deleteUser", deleteUser);
router.post("/addCategory", addCategory);
router.post("/deleteCategory", deleteCategory);

export default router;
