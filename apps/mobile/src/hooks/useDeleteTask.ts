import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@task-tracker/shared";
import { tasksApi } from "../api/tasks.api";
import { taskKeys } from "./useTasks";

interface Ctx {
  snapshots: Array<[readonly unknown[], Task[] | undefined]>;
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation<void, unknown, string, Ctx>({
    mutationFn: (id) => tasksApi.remove(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: taskKeys.all });
      const snapshots = qc.getQueriesData<Task[]>({ queryKey: taskKeys.all });
      snapshots.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<Task[]>(
          key,
          data.filter((t) => t.id !== id)
        );
      });
      return { snapshots };
    },
    onError: (_err, _id, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
