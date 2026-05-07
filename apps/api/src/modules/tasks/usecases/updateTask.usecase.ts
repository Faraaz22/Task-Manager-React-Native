import type { Task, UpdateTaskInput } from "@task-tracker/shared";
import { AppError } from "../../../utils/AppError";
import { tasksService } from "../tasks.service";

export async function updateTaskUseCase(
  userId: string,
  taskId: string,
  input: UpdateTaskInput
): Promise<Task> {
  const updated = await tasksService.updateForUser(userId, taskId, input);
  if (!updated) {
    throw new AppError(404, "Task not found");
  }
  return updated;
}
