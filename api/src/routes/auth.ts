import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { controllers } from "../controllers/index.js";

const router = express.Router();

router.post("/register", controllers.AuthController.register);
router.post("/login", controllers.AuthController.login);
router.post("/logout", authenticate, controllers.AuthController.logout);
router.get("/me", authenticate, controllers.AuthController.me);
router.post("/remember", controllers.AuthController.rememberLogin);

export default router;
