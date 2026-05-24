import type { z } from "zod";
import type { simpleFormSchema } from "@/app/(main)/dashboard/forms/simple/_schemas/simple-form.schema";

export type SimpleFormData = z.infer<typeof simpleFormSchema>;
