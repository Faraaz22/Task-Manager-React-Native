import { AppError } from "../../../utils/AppError";
import { tasksService } from "../tasks.service";

export async function deleteTaskUseCase(userId: string, taskId: string): Promise<void> {
  const removed = await tasksService.deleteForUser(userId, taskId);
  if (!removed) {
    throw new AppError(404, "Task not found");
  }
}
