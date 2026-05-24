"use client";

import { useEffect } from "react";
import { NextIntlClientProvider, useTranslations } from "next-intl";

const messages = {
  en: {
    errors: {
      globalError: {
        code: "500",
        subtitle: "Application error",
        description: "A critical error occurred. Please try refreshing the page.",
        tryAgain: "Try Again",
      },
    },
  },
  th: {
    errors: {
      globalError: {
        code: "500",
        subtitle: "แอปพลิเคชันเกิดข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดร้ายแรง กรุณาลองโหลดหน้าใหม่",
        tryAgain: "ลองอีกครั้ง",
      },
    },
  },
};

function getLocaleFromCookie(): "en" | "th" {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
  const value = match?.[1];
  return value === "th" ? "th" : "en";
}

function GlobalErrorContent({ reset }: { reset: () => void }) {
  const t = useTranslations("errors.globalError");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "28rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "3.75rem",
            fontWeight: 800,
            color: "#dc2626",
          }}
        >
          {t("code")}
        </h1>
        <p
          style={{
            marginTop: "1rem",
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          {t("subtitle")}
        </p>
        <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>{t("description")}</p>
        <button
          onClick={reset}
          style={{
            marginTop: "2rem",
            backgroundColor: "#dc2626",
            color: "white",
            fontWeight: 500,
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          {t("tryAgain")}
        </button>
      </div>
    </div>
  );
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const locale = getLocaleFromCookie();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages[locale]}>
          <GlobalErrorContent reset={reset} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
