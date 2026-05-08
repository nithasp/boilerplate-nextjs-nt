import { getTranslations } from "next-intl/server";

export default async function BacksideManagementPage() {
  const t = await getTranslations("dashboard.backsideManagement");

  return (
    <div className="backside-management">
      <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
      <p className="text-gray-600 dark:text-gray-400">{t("subtitle")}</p>
    </div>
  );
}
