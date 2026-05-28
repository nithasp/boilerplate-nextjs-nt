import api from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { Task, TaskForm } from "@/types/task.types";

type Id = string | number;

export const taskService = {
  getTasks: async () => {
    const { data } = await api.get<ApiResponse<Task[]>>("/tasks");
    return data;
  },

  getTaskById: async (id: Id) => {
    const { data } = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return data;
  },

  createTask: async (payload: TaskForm) => {
    const { data } = await api.post<ApiResponse<Task>>("/tasks", payload);
    return data;
  },

  updateTask: async (id: Id, payload: Partial<TaskForm>) => {
    const { data } = await api.put<ApiResponse<Task>>(`/tasks/${id}`, payload);
    return data;
  },

  deleteTask: async (id: Id) => {
    const { data } = await api.delete<ApiResponse>(`/tasks/${id}`);
    return data;
  },
};

export default taskService;
