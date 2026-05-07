import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import { validate } from "../../middleware/validate";
import {
  createTaskSchema,
  updateTaskSchema,
  taskFilterSchema,
} from "./tasks.schema";
import { tasksController } from "./tasks.controller";

export const tasksRouter = Router();

tasksRouter.use(authGuard);

tasksRouter.get("/", validate(taskFilterSchema, "query"), tasksController.list);
tasksRouter.post("/", validate(createTaskSchema), tasksController.create);
tasksRouter.patch("/:id", validate(updateTaskSchema), tasksController.update);
tasksRouter.delete("/:id", tasksController.remove);
