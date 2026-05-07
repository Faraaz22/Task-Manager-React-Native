import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task, UpdateTaskInput } from "@task-tracker/shared";
import { tasksApi } from "../api/tasks.api";
import { taskKeys } from "./useTasks";

interface Vars {
  id: string;
  input: UpdateTaskInput;
}

interface Ctx {
  snapshots: Array<[readonly unknown[], Task[] | undefined]>;
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation<Task, unknown, Vars, Ctx>({
    mutationFn: ({ id, input }) => tasksApi.update(id, input),
    onMutate: async ({ id, input }) => {
      await qc.cancelQueries({ queryKey: taskKeys.all });
      const snapshots = qc.getQueriesData<Task[]>({ queryKey: taskKeys.all });
      snapshots.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<Task[]>(
          key,
          data.map((t) => (t.id === id ? { ...t, ...input } : t))
        );
      });
      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
