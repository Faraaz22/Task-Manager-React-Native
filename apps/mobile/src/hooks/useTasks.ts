import { useQuery } from "@tanstack/react-query";
import type { Task } from "@task-tracker/shared";
import { tasksApi, type TasksFilter } from "../api/tasks.api";

export const taskKeys = {
  all: ["tasks"] as const,
  list: (filter: TasksFilter) => [...taskKeys.all, { filter }] as const,
};

export function useTasks(filter: TasksFilter = "all") {
  return useQuery<Task[]>({
    queryKey: taskKeys.list(filter),
    queryFn: () => tasksApi.list(filter),
  });
}
