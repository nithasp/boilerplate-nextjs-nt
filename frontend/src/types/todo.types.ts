export interface TodoItem {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type TodoListResponse = TodoItem[];

export type TodoDetailResponse = TodoItem;
