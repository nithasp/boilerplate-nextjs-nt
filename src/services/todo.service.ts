import axios, { AxiosInstance } from "axios";
import { TodoDetailResponse, TodoListResponse } from "@/types/todo.types";

const todoApi: AxiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: { "Content-Type": "application/json" },
});

export const todoService = {
  getTodoList: async () => {
    const { data } = await todoApi.get<TodoListResponse>("/posts");
    return data;
  },

  getTodoDetail: async (id: string | number) => {
    const { data } = await todoApi.get<TodoDetailResponse>(`/posts/${id}`);
    return data;
  },
};

export default todoService;
