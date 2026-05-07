import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from "@task-tracker/shared";
import { apiClient } from "./client";

export type TasksFilter = "all" | "pending" | "completed";

export const tasksApi = {
  list: async (filter: TasksFilter): Promise<Task[]> => {
    const params: Record<string, string> = {};
    if (filter === "pending") params.completed = "false";
    if (filter === "completed") params.completed = "true";
    const { data } = await apiClient.get<{ tasks: Task[] }>("/tasks", { params });
    return data.tasks;
  },
  create: async (input: CreateTaskInput): Promise<Task> => {
    const { data } = await apiClient.post<{ task: Task }>("/tasks", input);
    return data.task;
  },
  update: async (id: string, input: UpdateTaskInput): Promise<Task> => {
    const { data } = await apiClient.patch<{ task: Task }>(`/tasks/${id}`, input);
    return data.task;
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
