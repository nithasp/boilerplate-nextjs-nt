import type { Task, TaskForm } from "@/types/task.types";

export interface DialogTaskFormProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Task | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: TaskForm) => void;
}

export type DialogTaskFormValues = {
  title: string;
  description: string;
  status: TaskForm["status"];
  priority: TaskForm["priority"];
  dueDate: string;
  completed: boolean;
};
