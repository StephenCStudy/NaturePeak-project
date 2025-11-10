// Khai báo các endpoint API (file này là user endpoint api) và liên kết với controller tương ứng
import express from "express";
import { controllers } from "../controllers/index.js";

const router = express.Router();

router.get("/", controllers.UserController.getUsers);
router.post("/", controllers.UserController.createUser);

export default router;
