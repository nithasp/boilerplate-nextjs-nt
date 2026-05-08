import type { z } from "zod";
import type { inputDemoSchema } from "@/app/(main)/dashboard/(playground)/demo/input/_schemas/input-demo.schema";

export type InputDemoFormData = z.infer<typeof inputDemoSchema>;
export type InputDemoFormInput = z.input<typeof inputDemoSchema>;
