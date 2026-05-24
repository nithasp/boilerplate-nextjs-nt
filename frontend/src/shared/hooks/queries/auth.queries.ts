import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { login } from "@/services/auth.service";
import {
  LoginError,
  LoginRequest,
  LoginResponse,
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
