import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  patchStatus,
} from "../controllers/property.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);

// protected routes
router.post("/", authenticate, createProperty);
router.put("/:id", authenticate, updateProperty);
router.delete("/:id", authenticate, deleteProperty);

// toggle status (hide/show)
router.patch("/:id/status", authenticate, patchStatus);

export default router;
