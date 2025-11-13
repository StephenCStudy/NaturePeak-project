import express from "express";
import { AgentController } from "../controllers/cores/agent.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/by-email", AgentController.getAgentByEmail);
router.get("/", AgentController.getAgents);
router.get("/:id", AgentController.getAgent);

// Protected routes (require authentication)
router.post("/", authenticate, AgentController.createAgent);
router.put("/:id", authenticate, AgentController.updateAgent);
router.delete("/:id", authenticate, AgentController.deleteAgent);

export default router;
