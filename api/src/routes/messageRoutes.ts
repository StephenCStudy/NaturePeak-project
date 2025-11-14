import { Router } from "express";
import { MessageController } from "../controllers/cores/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected routes - cần đăng nhập
router.post("/", authenticate, MessageController.sendMessage);
router.get("/my-messages", authenticate, MessageController.getMyMessages);
router.patch("/:id/read", authenticate, MessageController.markAsRead);
router.delete("/:id", authenticate, MessageController.deleteMessage);

// Agent tools - public endpoints (xác thực qua email đại lý)
router.post("/from-agent", MessageController.sendMessageFromAgent);
router.get("/sent-by-agent", MessageController.getMessagesSentByAgent);
router.get("/agent-contacts", MessageController.getAgentContacts);
router.get("/for-agent", MessageController.getMessagesForAgent);
router.delete("/agent/:id", MessageController.deleteMessageByAgent);

export default router;
