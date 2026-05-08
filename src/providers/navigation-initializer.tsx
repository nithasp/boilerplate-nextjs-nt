"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setNavigationRouter } from "@/shared/utils/navigation";

export default function NavigationInitializer() {
  const router = useRouter();

  useEffect(() => {
    setNavigationRouter(router);
  }, [router]);

  return null;
}
