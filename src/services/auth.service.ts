import api from "@/lib/axios";
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/types/auth.types";

export const login = async (payload: LoginRequest) => {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
};

export const refreshToken = async (payload: RefreshTokenRequest) => {
  const { data } = await api.post<RefreshTokenResponse>("/refresh", payload);
  return data;
};

export const authService = { login, refreshToken };

export default authService;
