import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/config/routes";

export default async function NotFound() {
  const t = await getTranslations("errors.notFound");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-blue-600 dark:text-blue-400 tracking-widest">
          {t("code")}
        </h1>
        <div className="bg-blue-600 px-2 text-sm rounded rotate-12 absolute text-white">
          {t("badge")}
        </div>
        <p className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white">
          {t("title")}
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("description")}
        </p>
        <Link
          href={ROUTES.home}
          className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md"
        >
          {t("goHome")}
        </Link>
      </div>
    </div>
  );
}
