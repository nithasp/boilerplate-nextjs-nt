import { useQuery } from "@tanstack/react-query";
import { todoService } from "@/services/todo.service";
import { TodoDetailResponse, TodoListResponse } from "@/types/todo.types";
import { queryKeys } from "./query-keys";
import { isValidId } from "./query.utils";
import type { QueryOpts } from "@/types/query.types";

export const useGetTodoList = (
  options?: QueryOpts<TodoListResponse, ReturnType<typeof queryKeys.todos.list>>
) =>
  useQuery({
    queryKey: queryKeys.todos.list(),
    queryFn: () => todoService.getTodoList(),
    ...options,
  });

export const useGetTodoDetail = (
  id: string | number,
  options?: QueryOpts<
    TodoDetailResponse,
    ReturnType<typeof queryKeys.todos.detail>
  >
) =>
  useQuery({
    queryKey: queryKeys.todos.detail(id),
    queryFn: () => todoService.getTodoDetail(id),
    enabled: isValidId(id),
    ...options,
  });
