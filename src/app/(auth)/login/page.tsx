"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Input from "@/shared/components/form/input";
import Button from "@/shared/components/form/button";
import { useLogin } from "@/shared/hooks/queries";
import { useAuthStore } from "@/stores";
import ToastNotification from "@/lib/toast";
import { ROUTES } from "@/config/routes";
import { loginFormSchema } from "./_schemas/login-form.schema";
import type { LoginFormData } from "@/types/form/login-form.types";
import type { LoginError } from "@/types/auth.types";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const [generalError, setGeneralError] = useState("");

  const loginMutation = useLogin();
  const isSubmitting = loginMutation.isPending;

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (formData: LoginFormData) => {
    setGeneralError("");

    loginMutation.mutate(formData, {
      onSuccess: (response) => {
        const { accessToken, refreshToken, user } = response.data;
        useAuthStore.getState().setCredentials(user, accessToken, refreshToken);
        ToastNotification.success(response.message || t("successMessage"));
        router.push(ROUTES.dashboard);
      },
      onError: (error: LoginError) => {
        const errorMessage =
          error?.translation ||
          error?.message ||
          (error?.data as { message?: string })?.message ||
          t("errors.default");
        setGeneralError(errorMessage);
        ToastNotification.error(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4">
            <Input
              name="username"
              control={control}
              label={t("username")}
              type="text"
              placeholder={t("usernamePlaceholder")}
              disabled={isSubmitting}
              required
              borderColor="black"
              placeholderColor="black"
              labelColor="black"
            />

            <Input
              name="password"
              control={control}
              label={t("password")}
              type="password"
              placeholder={t("passwordPlaceholder")}
              autoComplete="current-password"
              disabled={isSubmitting}
              required
              borderColor="black"
              placeholderColor="black"
              labelColor="black"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  {t("rememberMe")}
                </label>
              </div>

              <a
                href={ROUTES.forgotPassword}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t("forgotPassword")}
              </a>
            </div>

            {generalError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {generalError}
              </div>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              loading={isSubmitting}
              fullWidth
            >
              {isSubmitting ? t("signingIn") : t("signIn")}
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t("noAccount")}{" "}
            </span>
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t("signUp")}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
