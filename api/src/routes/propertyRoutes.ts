import express from "express";
import { authenticate, optionalAuth } from "../middlewares/auth.middleware.js";
import { controllers } from "../controllers/index.js";

const router = express.Router();

router.get("/", optionalAuth, controllers.PropertyController.getProperties);
router.get("/:id", controllers.PropertyController.getProperty);

// protected routes
router.post("/", authenticate, controllers.PropertyController.createProperty);
router.put("/:id", authenticate, controllers.PropertyController.updateProperty);
router.delete(
  "/:id",
  authenticate,
  controllers.PropertyController.deleteProperty
);

// toggle status (hide/show)
router.patch(
  "/:id/status",
  authenticate,
  controllers.PropertyController.patchStatus
);

export default router;
