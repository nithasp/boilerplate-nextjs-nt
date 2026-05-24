"use client";

import {
  toast,
  ToastContainer,
  ToastOptions,
  TypeOptions,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const config: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const createToast =
  (type: TypeOptions) =>
  (message: string, options?: ToastOptions) =>
    toast(message, { ...config, type, ...options });

export const ToastNotification = {
  success: createToast("success"),
  error: createToast("error"),
  info: createToast("info"),
  warning: createToast("warning"),
  dismiss: toast.dismiss,
};

type ApiErrorLike =
  | string
  | {
      translation?: string;
      message?: string;
      response?: { data?: { translation?: string; message?: string } };
      data?: { translation?: string; message?: string };
    }
  | null
  | undefined;

export const handleApiError = (
  error: ApiErrorLike,
  fallback = "An unexpected error occurred"
) => {
  const errorMessage =
    (typeof error === "string" && error) ||
    (typeof error === "object" && error
      ? error.translation ||
        error.message ||
        error.response?.data?.translation ||
        error.response?.data?.message ||
        error.data?.translation ||
        error.data?.message
      : null) ||
    fallback;

  ToastNotification.error(errorMessage);
  return errorMessage;
};

export const ToastProvider = () => (
  <ToastContainer {...config} style={{ zIndex: 9999 }} />
);

export default ToastNotification;
