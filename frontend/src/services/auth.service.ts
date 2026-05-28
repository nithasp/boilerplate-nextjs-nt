import api from "@/lib/axios";
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth.types";

export const login = async (payload: LoginRequest) => {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
};

export const register = async (payload: RegisterRequest) => {
  const { data } = await api.post<RegisterResponse>("/auth/register", payload);
  return data;
};

export const refreshToken = async (payload: RefreshTokenRequest) => {
  const { data } = await api.post<RefreshTokenResponse>(
    "/auth/refresh",
    payload
  );
  return data;
};

export const logout = async (payload: LogoutRequest) => {
  const { data } = await api.post<LogoutResponse>("/auth/logout", payload);
  return data;
};

export const authService = { login, register, refreshToken, logout };

export default authService;
