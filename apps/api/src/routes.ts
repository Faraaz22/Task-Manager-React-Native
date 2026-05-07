import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes";
import { tasksRouter } from "./modules/tasks/tasks.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/tasks", tasksRouter);
