"use client";

import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SearchIcon from "@mui/icons-material/Search";
import {
  useCreateTask,
  useDeleteTask,
  useGetTasks,
  useUpdateTask,
} from "@/shared/hooks/queries";
import { Task, TaskForm, TaskStatus } from "@/types/task.types";
import ToastNotification from "@/lib/toast";
import Loading from "@/shared/components/loading/loading";
import DialogDeleteTask from "./_components/dialog-delete-task";
import DialogTaskForm from "./_components/dialog-task-form";
import TaskCard from "./_components/task-card";

const PAGE_SIZE = 12;

type StatusFilter = "all" | TaskStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetTasks();

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const tasks = data?.data ?? [];

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchSearch =
        !kw ||
        task.title.toLowerCase().includes(kw) ||
        (task.description ?? "").toLowerCase().includes(kw);
      return matchStatus && matchSearch;
    });
  }, [tasks, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    return { total, completed, inProgress };
  }, [tasks]);

  const handleOpenCreate = () => {
    setFormMode("create");
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setFormMode("edit");
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleOpenDelete = (task: Task) => {
    setDeletingTask(task);
    setDeleteOpen(true);
  };

  const handleToggleComplete = (task: Task) => {
    if (task.id == null) return;
    const nextCompleted = !task.completed;
    setTogglingId(task.id);
    updateMutation.mutate(
      {
        id: task.id,
        payload: {
          completed: nextCompleted,
          status: nextCompleted ? "done" : task.status === "done" ? "todo" : task.status,
        },
      },
      {
        onSuccess: () => {
          ToastNotification.success(
            nextCompleted ? "Task marked as complete." : "Task reopened."
          );
        },
        onError: () => {
          ToastNotification.error("Failed to update task.");
        },
        onSettled: () => setTogglingId(null),
      }
    );
  };

  const handleFormSubmit = (payload: TaskForm) => {
    if (formMode === "create") {
      createMutation.mutate(payload, {
        onSuccess: () => {
          ToastNotification.success("Task created successfully!");
          setFormOpen(false);
        },
        onError: () => {
          ToastNotification.error("Failed to create task.");
        },
      });
      return;
    }

    if (editingTask?.id == null) return;
    updateMutation.mutate(
      { id: editingTask.id, payload },
      {
        onSuccess: () => {
          ToastNotification.success("Task updated successfully!");
          setFormOpen(false);
        },
        onError: () => {
          ToastNotification.error("Failed to update task.");
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingTask?.id) return;
    deleteMutation.mutate(deletingTask.id, {
      onSuccess: () => {
        ToastNotification.success("Task deleted successfully!");
        setDeleteOpen(false);
        setDeletingTask(null);
      },
      onError: () => {
        ToastNotification.error("Failed to delete task.");
      },
    });
  };

  const crudLabel = createMutation.isPending
    ? "Creating task..."
    : updateMutation.isPending && togglingId === null
      ? "Saving changes..."
      : deleteMutation.isPending
        ? "Deleting task..."
        : null;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tasks
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your tasks via{" "}
            <span className="font-medium text-blue-600 dark:text-blue-400">
              Tasks API
            </span>{" "}
            — TanStack Query + Axios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-60 transition-colors"
          >
            {isFetching ? (
              <Loading
                variant="spinner"
                size="xs"
                inline
                label="Refreshing..."
              />
            ) : (
              "Refresh"
            )}
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <AddIcon fontSize="small" />
            New Task
          </button>
        </div>
      </div>

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Total
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              In Progress
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {stats.inProgress}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Completed
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.completed}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 !w-4 !h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by title or description..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => {
                  setStatusFilter(filter.value);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === filter.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!isLoading && !isError && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Showing{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {tasks.length}
          </span>{" "}
          tasks
        </p>
      )}

      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-20">
          <Loading variant="spinner" size="lg" label="Loading tasks..." />
        </div>
      ) : isError ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl">
          <p className="font-semibold">Failed to fetch tasks</p>
          <p className="text-sm mt-1">
            {(error as { message?: string })?.message ?? "Unknown error"}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center">
          <AssignmentTurnedInIcon className="text-gray-300 dark:text-gray-600 mx-auto mb-3 !w-12 !h-12" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {tasks.length === 0
              ? "No tasks yet"
              : "No tasks match your filters"}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {tasks.length === 0
              ? "Click \"New Task\" to create your first one."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      ) : (
        <>
          <div className="relative">
            {isFetching && (
              <Loading
                overlay
                variant="spinner"
                size="md"
                label="Refreshing..."
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paged.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isToggling={togglingId === task.id}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-200 px-2">
                  Page {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safePage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <DialogTaskForm
        open={formOpen}
        mode={formMode}
        initialData={editingTask}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
      <DialogDeleteTask
        open={deleteOpen}
        task={deletingTask}
        isDeleting={deleteMutation.isPending}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingTask(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      {crudLabel && (
        <Loading
          fullScreen
          variant="spinner"
          size="lg"
          label={crudLabel}
          className="z-[200]"
        />
      )}
    </div>
  );
}
