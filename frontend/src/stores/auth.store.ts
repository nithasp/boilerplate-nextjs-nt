import { create } from "zustand";
import {
  persist,
  type PersistStorage,
  type StorageValue,
} from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import { ROUTES } from "@/config/routes";
import { navigateTo } from "@/shared/utils/navigation";
import type {
  AuthState,
  AuthStore,
  PersistedAuth,
  User,
} from "@/types/auth.types";

const STORAGE_KEYS = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  user: "user_data",
} as const;

const INITIAL_STATE: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  status: "idle",
};

const writeOrRemove = (key: string, value: string | null) => {
  if (value) localStorage.setItem(key, value);
  else localStorage.removeItem(key);
};

const safeParseUser = (raw: string | null): User | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

const localStorageAdapter: PersistStorage<PersistedAuth> = {
  getItem: (): StorageValue<PersistedAuth> | null => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    const user = safeParseUser(localStorage.getItem(STORAGE_KEYS.user));

    if (!accessToken && !refreshToken && !user) return null;
    return { state: { accessToken, refreshToken, user }, version: 0 };
  },

  setItem: (_key, { state }) => {
    writeOrRemove(STORAGE_KEYS.accessToken, state.accessToken);
    writeOrRemove(STORAGE_KEYS.refreshToken, state.refreshToken);
    writeOrRemove(
      STORAGE_KEYS.user,
      state.user ? JSON.stringify(state.user) : null
    );
  },

  removeItem: () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  },
};

const noopStorage: PersistStorage<PersistedAuth> = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const storage =
  typeof window === "undefined" ? noopStorage : localStorageAdapter;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setCredentials: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          status: "authenticated",
        }),

      updateTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      logout: () => {
        useAuthStore.persist.clearStorage();
        set({ ...INITIAL_STATE, status: "unauthenticated" });
        navigateTo(ROUTES.login);
      },
    }),
    {
      name: "auth",
      storage,
      partialize: ({ user, accessToken, refreshToken }) => ({
        user,
        accessToken,
        refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.isAuthenticated = !!state.accessToken;
        state.status = state.accessToken ? "authenticated" : "unauthenticated";
      },
    }
  )
);

const selectAuthState = (s: AuthStore): AuthState => ({
  user: s.user,
  accessToken: s.accessToken,
  refreshToken: s.refreshToken,
  isAuthenticated: s.isAuthenticated,
  status: s.status,
});

const selectAuthActions = (s: AuthStore) => ({
  setCredentials: s.setCredentials,
  updateTokens: s.updateTokens,
  logout: s.logout,
});

export const useAuthState = () => useAuthStore(useShallow(selectAuthState));

export const useAuthActions = () =>
  useAuthStore(useShallow(selectAuthActions));
