import type { z } from "zod";
import type { mockupFormSchema } from "@/app/(main)/dashboard/forms/mockup/_schemas/mockup-form.schema";

export type MockupFormData = z.infer<typeof mockupFormSchema>;
export type MockupFormInput = z.input<typeof mockupFormSchema>;
