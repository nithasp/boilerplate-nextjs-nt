"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import type { Task, TaskPriority, TaskStatus } from "@/types/task.types";

interface TaskCardProps {
  task: Task;
  isToggling: boolean;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const STATUS_STYLES: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: "Todo",
    className:
      "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  },
  in_progress: {
    label: "In Progress",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  done: {
    label: "Done",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
};

const PRIORITY_STYLES: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  low: {
    label: "Low",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  },
  medium: {
    label: "Medium",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  high: {
    label: "High",
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
};

function formatDueDate(value?: string | null): string | null {
  if (!value) return null;
  try {
    const date = new Date(value);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

function isOverdue(value?: string | null, completed?: boolean): boolean {
  if (!value || completed) return false;
  const due = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

export default function TaskCard({
  task,
  isToggling,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const status = STATUS_STYLES[task.status];
  const priority = PRIORITY_STYLES[task.priority];
  const dueLabel = formatDueDate(task.dueDate);
  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          disabled={isToggling}
          className="flex-shrink-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-60"
          aria-label={
            task.completed ? "Mark as not completed" : "Mark as completed"
          }
        >
          {task.completed ? (
            <CheckCircle className="!w-6 !h-6" />
          ) : (
            <RadioButtonUnchecked className="!w-6 !h-6" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-bold text-gray-900 dark:text-white line-clamp-2 ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </h3>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 mb-3 flex-1">
        {task.description?.trim() || "—"}
      </p>

      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${status.className}`}
        >
          {status.label}
        </span>
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priority.className}`}
        >
          {priority.label}
        </span>
        {dueLabel && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
              overdue
                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            <EventIcon className="!w-3 !h-3" />
            {dueLabel}
            {overdue && " (overdue)"}
          </span>
        )}
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
        >
          <EditIcon className="!w-3.5 !h-3.5" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label="Delete task"
          className="flex items-center justify-center px-3 py-2 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
        >
          <DeleteIcon className="!w-3.5 !h-3.5" />
        </button>
      </div>
    </div>
  );
}
