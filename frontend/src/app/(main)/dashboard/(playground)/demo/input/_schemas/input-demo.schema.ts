import * as z from "zod";

export const inputDemoSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(3, "Full name must be at least 3 characters")
      .max(50, "Full name must be less than 50 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Full name must contain letters only"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),

    confirmPassword: z.string(),

    phone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
      .optional()
      .or(z.literal("")),

    age: z.coerce
      .number({ error: "Age must be a number" })
      .min(18, "Must be at least 18 years old")
      .max(120, "Please enter a valid age")
      .optional(),

    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),

    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),

    address: z.string().min(10, "Address must be at least 10 characters").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
