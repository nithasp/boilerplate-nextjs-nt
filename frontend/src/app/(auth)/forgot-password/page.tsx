"use client";

import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");

  return (
    <div className="forgot-password">
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
    </div>
  );
}
