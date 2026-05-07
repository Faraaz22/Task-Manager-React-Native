import type { Task, TaskFilterInput } from "@task-tracker/shared";
import { tasksService } from "../tasks.service";

export async function listTasksUseCase(
  userId: string,
  filter: TaskFilterInput
): Promise<Task[]> {
  const completed =
    filter.completed === "true" ? true : filter.completed === "false" ? false : undefined;
  return tasksService.listForUser(userId, { completed });
}
