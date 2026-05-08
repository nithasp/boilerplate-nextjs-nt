"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors.error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-extrabold text-red-600 dark:text-red-400">
          {t("title")}
        </h1>
        <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
          {t("subtitle")}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {error.message || t("fallbackMessage")}
        </p>
        <button
          onClick={reset}
          className="mt-8 inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md"
        >
          {t("tryAgain")}
        </button>
      </div>
    </div>
  );
}
