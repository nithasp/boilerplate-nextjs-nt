"use client";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DialogDeleteTaskProps } from "../_types/dialog-delete-task.types";

export default function DialogDeleteTask({
  open,
  task,
  isDeleting,
  onClose,
  onConfirm,
}: DialogDeleteTaskProps) {
  if (!open || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
            <DeleteForeverIcon className="text-red-600 dark:text-red-400 !w-7 !h-7" />
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
            Delete Task
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-1">
            Are you sure you want to delete
          </p>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center mb-4 truncate px-4">
            &ldquo;{task.title}&rdquo;
          </p>
          <p className="text-xs text-red-500 text-center mb-6">
            This action cannot be undone.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
