import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { Task, TaskForm } from "@/types/task.types";
import { ApiResponse } from "@/types/api.types";
import type { QueryOpts } from "@/types/query.types";
import { queryKeys } from "./query-keys";
import { isValidId } from "./query.utils";

type Id = string | number;

export const useGetTasks = (
  options?: QueryOpts<
    ApiResponse<Task[]>,
    ReturnType<typeof queryKeys.tasks.list>
  >
) =>
  useQuery({
    queryKey: queryKeys.tasks.list(),
    queryFn: () => taskService.getTasks(),
    ...options,
  });

export const useGetTaskById = (
  id: Id,
  options?: QueryOpts<
    ApiResponse<Task>,
    ReturnType<typeof queryKeys.tasks.detail>
  >
) =>
  useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => taskService.getTaskById(id),
    enabled: isValidId(id),
    ...options,
  });

const useInvalidateTaskList = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.tasks.list(),
    });
};

export const useCreateTask = () => {
  const invalidate = useInvalidateTaskList();
  return useMutation({
    mutationFn: (payload: TaskForm) => taskService.createTask(payload),
    onSuccess: () => invalidate(),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Id; payload: Partial<TaskForm> }) =>
      taskService.updateTask(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.list(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.detail(variables.id),
      });
    },
  });
};

export const useDeleteTask = () => {
  const invalidate = useInvalidateTaskList();
  return useMutation({
    mutationFn: (id: Id) => taskService.deleteTask(id),
    onSuccess: () => invalidate(),
  });
};
