// Khai báo các endpoint API (file này là user endpoint api) và liên kết với controller tương ứng

import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);

export default router;
