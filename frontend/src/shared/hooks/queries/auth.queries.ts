import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { login, logout, register } from "@/services/auth.service";
import {
  LoginError,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RegisterError,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth.types";

export const useLogin = (
  options?: Omit<
    UseMutationOptions<LoginResponse, LoginError, LoginRequest>,
    "mutationFn"
  >
) =>
  useMutation<LoginResponse, LoginError, LoginRequest>({
    mutationFn: login,
    ...options,
  });

export const useRegister = (
  options?: Omit<
    UseMutationOptions<RegisterResponse, RegisterError, RegisterRequest>,
    "mutationFn"
  >
) =>
  useMutation<RegisterResponse, RegisterError, RegisterRequest>({
    mutationFn: register,
    ...options,
  });

export const useLogout = (
  options?: Omit<
    UseMutationOptions<LogoutResponse, LoginError, LogoutRequest>,
    "mutationFn"
  >
) =>
  useMutation<LogoutResponse, LoginError, LogoutRequest>({
    mutationFn: logout,
    ...options,
  });
