"use server";

import { cookies } from "next/headers";
import {
  defaultLocale,
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
} from "./config";
import type { SupportedLocale } from "@/types/i18n.types";

export async function getLocale(): Promise<SupportedLocale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  return isSupportedLocale(value) ? value : defaultLocale;
}

export async function setLocale(locale: SupportedLocale): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
