export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  status?: number;
  message?: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export type AuthStatus = "idle" | "authenticated" | "unauthenticated";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  status: AuthStatus;
}

export interface AuthActions {
  setCredentials: (
    user: User,
    accessToken: string,
    refreshToken: string
  ) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions;

export type PersistedAuth = Pick<
  AuthState,
  "user" | "accessToken" | "refreshToken"
>;

export type LoginError = {
  message?: string;
  translation?: string;
} & Record<string, unknown>;
