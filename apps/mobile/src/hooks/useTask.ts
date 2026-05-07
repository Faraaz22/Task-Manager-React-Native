import { useQueryClient } from "@tanstack/react-query";
import type { Task } from "@task-tracker/shared";
import { taskKeys } from "./useTasks";

export function useTask(id: string | undefined): Task | null {
  const qc = useQueryClient();
  if (!id) return null;
  const entries = qc.getQueriesData<Task[]>({ queryKey: taskKeys.all });
  for (const [, list] of entries) {
    const found = list?.find((t) => t.id === id);
    if (found) return found;
  }
  return null;
}
