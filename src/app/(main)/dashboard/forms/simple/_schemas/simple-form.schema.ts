import { z } from "zod";

export const simpleFormSchema = z.object({
  fullName: z
    .string()
    .min(3, "Min 3 characters")
    .max(50, "Max 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Letters only"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .regex(
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
      "Invalid phone number"
    ),
  department: z.string().min(1, "Please select a department"),
  priority: z.number().min(1, "Please select a priority level"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  message: z
    .string()
    .min(10, "Min 10 characters")
    .max(500, "Max 500 characters"),
});
