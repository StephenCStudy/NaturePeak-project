// Khai báo các endpoint API (file này là user endpoint api) và liên kết với controller tương ứng
import express from "express";
import { controllers } from "../controllers/index.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", controllers.UserController.getUsers);
router.post("/", controllers.UserController.createUser);
router.get(
  "/password/current",
  authenticate,
  controllers.UserController.getCurrentPassword
);
router.post(
  "/password/verify",
  authenticate,
  controllers.UserController.verifyPassword
);
router.put(
  "/profile/me",
  authenticate,
  controllers.UserController.updateProfile
); // Must be before /:id
router.put(
  "/password/change",
  authenticate,
  controllers.UserController.changePassword
);
router.put("/:id", authenticate, controllers.UserController.updateUser);

export default router;
