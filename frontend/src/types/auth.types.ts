export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: AuthSession;
}

export type RegisterResponse = LoginResponse;

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

export interface LogoutRequest {
  refreshToken?: string | null;
}

export interface LogoutResponse {
  status: number;
  message: string;
  data: null;
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
  logout: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

export type PersistedAuth = Pick<
  AuthState,
  "user" | "accessToken" | "refreshToken"
>;

export type AuthError = {
  message?: string;
  translation?: string;
} & Record<string, unknown>;

export type LoginError = AuthError;
export type RegisterError = AuthError;
