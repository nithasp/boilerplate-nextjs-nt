"use client";

import { ToastProvider } from "@/lib/toast";
import { QueryProvider } from "./query-provider";
import NavigationInitializer from "./navigation-initializer";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NavigationInitializer />
      {children}
      <ToastProvider />
    </QueryProvider>
  );
}

export { NavigationInitializer, QueryProvider };
