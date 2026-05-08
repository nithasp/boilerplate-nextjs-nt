"use client";

import React from "react";
import Sidebar from "@/shared/components/sidebar/sidebar";
import Navbar from "@/shared/components/navbar/navbar";
import { useAuthGuard } from "@/shared/hooks/use-auth";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthGuard();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64 transition-all duration-300">
        <Navbar />
        <main className="flex-1">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
