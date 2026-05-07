import { Router } from "express";
import { validate } from "../../middleware/validate";
import { signupSchema, loginSchema } from "./auth.schema";
import { authController } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), authController.signup);
authRouter.post("/login", validate(loginSchema), authController.login);
