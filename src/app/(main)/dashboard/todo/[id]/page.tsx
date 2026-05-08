"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetTodoDetail } from "@/shared/hooks/queries";

export default function TodoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    data: todo,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetTodoDetail(id);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span aria-hidden>&#8592;</span>
        <span>Back to list</span>
      </button>

      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10/12" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-9/12" />
          </div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Failed to load todo</p>
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
      ) : !todo ? (
        <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">Todo not found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                User #{todo.userId}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full">
                Post #{todo.id}
              </span>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize mb-4">
            {todo.title}
          </h1>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line leading-relaxed">
              {todo.body}
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div>
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Post ID
              </dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">
                {todo.id}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                User ID
              </dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">
                {todo.userId}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
