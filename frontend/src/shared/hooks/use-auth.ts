"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useAuthState } from "@/stores";
import { ROUTES } from "@/config/routes";

export const useAuth = () => {
  const { user, isAuthenticated, status } = useAuthState();
  const logout = useAuthStore((s) => s.logout);

  return {
    user,
    isAuthenticated,
    loading: status === "idle",
    logout,
  };
};

export const useAuthGuard = () => {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() =>
      setHasHydrated(true)
    );
    return unsub;
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) router.replace(ROUTES.login);
  }, [hasHydrated, router]);
};
