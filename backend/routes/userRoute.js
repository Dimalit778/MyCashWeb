import express from "express";

import { deleteImage, uploadImage } from "../controllers/imageController.js";
import { deleteUser, getAll, getUser, updateUser } from "../controllers/userController.js";

const router = express.Router();
router.get("/getAll", getAll);
router.patch("/updateUser", updateUser);
router.get("/getUser", getUser);
router.post("/uploadImage", uploadImage);
router.post("/deleteImage", deleteImage);
router.post("/deleteUser", deleteUser);

export default router;
