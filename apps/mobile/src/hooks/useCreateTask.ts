import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskInput, Task } from "@task-tracker/shared";
import { tasksApi } from "../api/tasks.api";
import { taskKeys } from "./useTasks";

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation<Task, unknown, CreateTaskInput>({
    mutationFn: (input) => tasksApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
