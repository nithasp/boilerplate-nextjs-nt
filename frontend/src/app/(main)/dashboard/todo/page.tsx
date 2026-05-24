"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetTodoList } from "@/shared/hooks/queries";
import { ROUTES } from "@/config/routes";

const PAGE_SIZE = 9;

export default function TodoPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: todos = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetTodoList();

  const userIds = useMemo(
    () => Array.from(new Set(todos.map((t) => t.userId))).sort((a, b) => a - b),
    [todos]
  );

  const filteredTodos = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return todos.filter((todo) => {
      const matchUser = userId === "all" || todo.userId === userId;
      const matchSearch =
        !keyword ||
        todo.title.toLowerCase().includes(keyword) ||
        todo.body.toLowerCase().includes(keyword);
      return matchUser && matchSearch;
    });
  }, [todos, search, userId]);

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pagedTodos = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredTodos.slice(start, start + PAGE_SIZE);
  }, [filteredTodos, safeCurrentPage]);

  const handleResetFilters = () => {
    setSearch("");
    setUserId("all");
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Todo List
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Powered by{" "}
            <a
              href="https://jsonplaceholder.typicode.com/posts"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              jsonplaceholder.typicode.com/posts
            </a>{" "}
            via TanStack Query + Axios
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title or body..."
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              User ID
            </label>
            <div className="flex gap-2">
              <select
                value={userId}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserId(value === "all" ? "all" : Number(value));
                  setCurrentPage(1);
                }}
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All users</option>
                {userIds.map((id) => (
                  <option key={id} value={id}>
                    User #{id}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Failed to fetch todos</p>
          <p className="text-sm mt-1">
            {(error as { message?: string })?.message || "Unknown error"}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No todos match your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pagedTodos.map((todo) => (
              <button
                key={todo.id}
                type="button"
                onClick={() => router.push(ROUTES.todoDetail(todo.id))}
                className="text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    User #{todo.userId}
                  </span>
                  <span className="text-xs text-gray-400">#{todo.id}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white capitalize line-clamp-2 mb-2">
                  {todo.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 whitespace-pre-line">
                  {todo.body}
                </p>
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(safeCurrentPage - 1) * PAGE_SIZE + 1}-
                {Math.min(safeCurrentPage * PAGE_SIZE, filteredTodos.length)} of{" "}
                {filteredTodos.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-200 px-2">
                  Page {safeCurrentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safeCurrentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
