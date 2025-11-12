import { Router } from "express";
import { MessageController } from "../controllers/cores/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected routes - cần đăng nhập
router.post("/", authenticate, MessageController.sendMessage);
router.get("/my-messages", authenticate, MessageController.getMyMessages);
router.patch("/:id/read", authenticate, MessageController.markAsRead);
router.delete("/:id", authenticate, MessageController.deleteMessage);

export default router;
