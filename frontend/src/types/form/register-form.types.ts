import type { z } from "zod";
import type { registerFormSchema } from "@/app/(auth)/register/_schemas/register-form.schema";

export type RegisterFormData = z.infer<typeof registerFormSchema>;
