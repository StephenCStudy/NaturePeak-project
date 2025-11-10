import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { controllers } from "../controllers/index.js";

const router = express.Router();

router.post("/register", controllers.AuthController.register);
router.post("/login", controllers.AuthController.login);
router.get("/me", authenticate, controllers.AuthController.me);

export default router;
