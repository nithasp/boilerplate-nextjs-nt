import type { Task } from "@/types/task.types";

export interface DialogDeleteTaskProps {
  open: boolean;
  task: Task | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
