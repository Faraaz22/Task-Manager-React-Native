import { Types } from "mongoose";
import { TaskModel } from "./task.model";
import type { Task } from "./tasks.types";

const toTask = (doc: any): Task => ({
  id: String(doc._id),
  title: doc.title,
  description: doc.description ?? undefined,
  completed: Boolean(doc.completed),
  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt.toISOString(),
});

const isValidId = (id: string) => Types.ObjectId.isValid(id);

export const tasksService = {
  async listForUser(userId: string, filter: { completed?: boolean }): Promise<Task[]> {
    const query: Record<string, unknown> = { userId };
    if (typeof filter.completed === "boolean") {
      query.completed = filter.completed;
    }
    const docs = await TaskModel.find(query).sort({ createdAt: -1 });
    return docs.map(toTask);
  },

  async createForUser(
    userId: string,
    data: { title: string; description?: string }
  ): Promise<Task> {
    const doc = await TaskModel.create({ ...data, userId });
    return toTask(doc);
  },

  async updateForUser(
    userId: string,
    taskId: string,
    data: { title?: string; description?: string; completed?: boolean }
  ): Promise<Task | null> {
    if (!isValidId(taskId)) return null;
    const doc = await TaskModel.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: data },
      { new: true }
    );
    return doc ? toTask(doc) : null;
  },

  async deleteForUser(userId: string, taskId: string): Promise<boolean> {
    if (!isValidId(taskId)) return false;
    const res = await TaskModel.deleteOne({ _id: taskId, userId });
    return res.deletedCount === 1;
  },
};
