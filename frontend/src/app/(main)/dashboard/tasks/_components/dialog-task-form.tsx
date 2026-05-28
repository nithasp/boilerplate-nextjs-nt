"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import {
  DialogTaskFormProps,
  DialogTaskFormValues,
} from "../_types/dialog-task-form.types";

const DEFAULT_VALUES: DialogTaskFormValues = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  completed: false,
};

const STATUS_OPTIONS: { value: DialogTaskFormValues["status"]; label: string }[] =
  [
    { value: "todo", label: "Todo" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

const PRIORITY_OPTIONS: {
  value: DialogTaskFormValues["priority"];
  label: string;
}[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function DialogTaskForm({
  open,
  mode,
  initialData,
  isSubmitting,
  onClose,
  onSubmit,
}: DialogTaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DialogTaskFormValues>({ defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      reset({
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        status: initialData.status ?? "todo",
        priority: initialData.priority ?? "medium",
        dueDate: initialData.dueDate ?? "",
        completed: initialData.completed ?? false,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [open, mode, initialData, reset]);

  const handleFormSubmit = (values: DialogTaskFormValues) => {
    onSubmit({
      title: values.title,
      description: values.description.trim() || undefined,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate ? values.dueDate : null,
      completed: values.completed,
    });
  };

  if (!open) return null;

  const inputClass =
    "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {mode === "create" ? "Create New Task" : "Edit Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500"
            aria-label="Close dialog"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title", {
                  required: "Title is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Title is required",
                })}
                placeholder="e.g. Finish the quarterly report"
                className={inputClass}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Add details about this task..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select {...register("status")} className={inputClass}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Priority</label>
              <select {...register("priority")} className={inputClass}>
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Due Date</label>
              <input
                {...register("dueDate")}
                type="date"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register("completed")}
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mark as completed
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {mode === "create" ? "Create Task" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
