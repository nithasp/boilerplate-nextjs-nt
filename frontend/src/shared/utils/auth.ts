const AUTH_PATTERNS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/refresh",
  "/auth/forgot-password",
];

export const isAuthEndpoint = (url?: string): boolean =>
  !!url && AUTH_PATTERNS.some((p) => url.includes(p));

export const logout = () => {
  import("@/stores/auth.store").then(({ useAuthStore }) => {
    useAuthStore.getState().logout();
  });
};
