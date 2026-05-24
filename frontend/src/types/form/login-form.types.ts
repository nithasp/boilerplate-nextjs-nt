import type { z } from "zod";
import type { loginFormSchema } from "@/app/(auth)/login/_schemas/login-form.schema";

export type LoginFormData = z.infer<typeof loginFormSchema>;
