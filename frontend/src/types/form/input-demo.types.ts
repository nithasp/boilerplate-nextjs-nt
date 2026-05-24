import type { z } from "zod";
import type { formDemoSchema } from "@/app/(main)/dashboard/(playground)/form-demo/input/_schemas/input-demo.schema";

export type FormDemoFormData = z.infer<typeof formDemoSchema>;
export type FormDemoFormInput = z.input<typeof formDemoSchema>;
