"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { setLocale } from "@/i18n/locale";
import { locales, localeLabels } from "@/i18n/config";
import type { SupportedLocale } from "@/types/i18n.types";

export default function LocaleSwitcher() {
  const t = useTranslations("locale");
  const currentLocale = useLocale() as SupportedLocale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (locale: SupportedLocale) => {
    if (locale === currentLocale) return;

    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  };

  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={t("switchLabel")}>
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => handleSwitch(locale)}
            disabled={isPending || isActive}
            aria-pressed={isActive}
            className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
              isActive
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            }`}
          >
            {localeLabels[locale]}
          </button>
        );
      })}
    </div>
  );
}
