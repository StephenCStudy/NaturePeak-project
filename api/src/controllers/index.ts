import { AuthController } from "./cores/auth.controller.js";
import { PropertyController } from "./cores/property.controller.js";
import { UserController } from "./cores/user.controller.js";

export const controllers = {
    AuthController: AuthController,
    PropertyController: PropertyController,
    UserController: UserController,
};