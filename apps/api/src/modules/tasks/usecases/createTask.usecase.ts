import type { CreateTaskInput, Task } from "@task-tracker/shared";
import { tasksService } from "../tasks.service";

export async function createTaskUseCase(
  userId: string,
  input: CreateTaskInput
): Promise<Task> {
  return tasksService.createForUser(userId, input);
}
