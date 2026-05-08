"use client";

import { useTranslations } from "next-intl";

export default function AdminPage() {
  const t = useTranslations("admin");

  return (
    <div className="admin">
      <h1>{t("heading")}</h1>
      <p>{t("subtitle")}</p>
    </div>
  );
}
