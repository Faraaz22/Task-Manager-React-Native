import { RequestHandler } from "express";
import { AppError } from "../../utils/AppError";
import { listTasksUseCase } from "./usecases/listTasks.usecase";
import { createTaskUseCase } from "./usecases/createTask.usecase";
import { updateTaskUseCase } from "./usecases/updateTask.usecase";
import { deleteTaskUseCase } from "./usecases/deleteTask.usecase";

const requireUserId = (req: Express.Request): string => {
  if (!req.userId) throw new AppError(401, "Unauthorized");
  return req.userId;
};

export const tasksController = {
  list: (async (req, res, next) => {
    try {
      const userId = requireUserId(req);
      const tasks = await listTasksUseCase(userId, req.query as any);
      res.json({ tasks });
    } catch (err) {
      next(err);
    }
  }) as RequestHandler,

  create: (async (req, res, next) => {
    try {
      const userId = requireUserId(req);
      const task = await createTaskUseCase(userId, req.body);
      res.status(201).json({ task });
    } catch (err) {
      next(err);
    }
  }) as RequestHandler,

  update: (async (req, res, next) => {
    try {
      const userId = requireUserId(req);
      const task = await updateTaskUseCase(userId, req.params.id, req.body);
      res.json({ task });
    } catch (err) {
      next(err);
    }
  }) as RequestHandler,

  remove: (async (req, res, next) => {
    try {
      const userId = requireUserId(req);
      await deleteTaskUseCase(userId, req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }) as RequestHandler,
};
