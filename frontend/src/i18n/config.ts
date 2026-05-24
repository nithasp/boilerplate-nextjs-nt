import type { SupportedLocale } from "@/types/i18n.types";

export const locales = ["en", "th"] as const;

export const defaultLocale: SupportedLocale = "en";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export const localeLabels: Record<SupportedLocale, string> = {
  en: "English",
  th: "ไทย",
};

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return (
    typeof value === "string" && (locales as readonly string[]).includes(value)
  );
}
