import { z } from "zod";

export const registerFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(100, "First name is too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(100, "Last name is too long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(100, "Username is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
