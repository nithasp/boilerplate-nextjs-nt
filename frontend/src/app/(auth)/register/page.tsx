"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Input from "@/shared/components/form/input";
import Button from "@/shared/components/form/button";
import { useRegister } from "@/shared/hooks/queries";
import { useAuthStore } from "@/stores";
import ToastNotification from "@/lib/toast";
import { ROUTES } from "@/config/routes";
import { registerFormSchema } from "./_schemas/register-form.schema";
import type { RegisterFormData } from "@/types/form/register-form.types";
import type { RegisterError } from "@/types/auth.types";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const [generalError, setGeneralError] = useState("");

  const registerMutation = useRegister();
  const isSubmitting = registerMutation.isPending;

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (formData: RegisterFormData) => {
    setGeneralError("");

    const { confirmPassword: _confirmPassword, ...payload } = formData;

    registerMutation.mutate(payload, {
      onSuccess: (response) => {
        const { accessToken, refreshToken, user } = response.data;
        useAuthStore.getState().setCredentials(user, accessToken, refreshToken);
        ToastNotification.success(response.message || t("successMessage"));
        router.push(ROUTES.dashboard);
      },
      onError: (error: RegisterError) => {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-10">
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
            <div className="grid grid-cols-2 gap-3">
              <Input
                name="firstName"
                control={control}
                label={t("firstName")}
                type="text"
                placeholder={t("firstNamePlaceholder")}
                disabled={isSubmitting}
                required
                borderColor="black"
                placeholderColor="black"
                labelColor="black"
              />
              <Input
                name="lastName"
                control={control}
                label={t("lastName")}
                type="text"
                placeholder={t("lastNamePlaceholder")}
                disabled={isSubmitting}
                required
                borderColor="black"
                placeholderColor="black"
                labelColor="black"
              />
            </div>

            <Input
              name="username"
              control={control}
              label={t("username")}
              type="text"
              placeholder={t("usernamePlaceholder")}
              autoComplete="username"
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
              autoComplete="new-password"
              disabled={isSubmitting}
              required
              borderColor="black"
              placeholderColor="black"
              labelColor="black"
            />

            <Input
              name="confirmPassword"
              control={control}
              label={t("confirmPassword")}
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              autoComplete="new-password"
              disabled={isSubmitting}
              required
              borderColor="black"
              placeholderColor="black"
              labelColor="black"
            />

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
              {isSubmitting ? t("creatingAccount") : t("createAccount")}
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t("haveAccount")}{" "}
            </span>
            <a
              href={ROUTES.login}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t("signIn")}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
