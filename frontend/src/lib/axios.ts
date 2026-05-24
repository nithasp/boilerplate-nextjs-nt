"use client";

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import ToastNotification from "@/lib/toast";
import { isAuthEndpoint, logout } from "@/shared/utils/auth";
import { useAuthStore } from "@/stores/auth.store";
import { RefreshTokenResponse } from "@/types/auth.types";
import { ApiResponse } from "@/types/api.types";
import { env } from "@/env";

const api: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse & { error?: { message?: string } }>) => {
    if (!error.response) return Promise.reject(error);

    const { status, data } = error.response;
    const errorMsg = data?.error?.message || data?.message;
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const shouldRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url);

    if (shouldRefresh) {
      originalRequest._retry = true;

      refreshPromise ||= (async () => {
        try {
          const refreshTokenValue = localStorage.getItem("refresh_token");
          if (!refreshTokenValue) throw new Error("No refresh token");

          const { data: refreshResponse } =
            await axios.post<RefreshTokenResponse>(
              `${env.NEXT_PUBLIC_API_URL}/refresh`,
              { refreshToken: refreshTokenValue }
            );

          const { accessToken, refreshToken: newRefreshToken } =
            refreshResponse?.data || {};
          if (!accessToken || !newRefreshToken) {
            throw new Error("Invalid token response");
          }

          useAuthStore.getState().updateTokens(accessToken, newRefreshToken);
          return accessToken;
        } catch (err) {
          logout();
          throw err;
        } finally {
          refreshPromise = null;
        }
      })();

      try {
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        return Promise.reject({
          message: "Authentication failed. Redirecting to login...",
          skipToast: true,
        });
      }
    }

    const skipToast =
      (error as unknown as { skipToast?: boolean }).skipToast ||
      isAuthEndpoint(originalRequest?.url);

    if (errorMsg && !skipToast) {
      ToastNotification.error(errorMsg);
    }
    return Promise.reject({ message: errorMsg });
  }
);

export default api;
