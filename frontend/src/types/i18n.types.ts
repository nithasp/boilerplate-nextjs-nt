import type { locales } from "@/i18n/config";

export type SupportedLocale = (typeof locales)[number];

export type MessageTree = Record<string, unknown>;
