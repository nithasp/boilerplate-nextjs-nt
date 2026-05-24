import * as z from "zod";

const phoneRegex =
  /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const zipRegex = /^\d{5}(-\d{4})?$/;
const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
const referralRegex = /^[A-Z0-9]{6}$/;

const optionalString = (validator: z.ZodString) =>
  validator.optional().or(z.literal(""));

export const mockupFormBaseSchema = z.object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name should only contain letters"),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Last name should only contain letters"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must not exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .toLowerCase(),

    confirmEmail: z
      .string()
      .min(1, "Please confirm your email")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(
        passwordRegex,
        "Password must contain uppercase, lowercase, number, and special character"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(phoneRegex, "Please enter a valid phone number"),

    alternatePhone: optionalString(
      z.string().regex(phoneRegex, "Please enter a valid phone number")
    ),

    age: z.coerce
      .number()
      .int("Age must be a whole number")
      .min(18, "You must be at least 18 years old")
      .max(120, "Please enter a valid age"),

    yearsOfExperience: z.coerce
      .number()
      .int("Experience must be a whole number")
      .min(0, "Experience cannot be negative")
      .max(50, "Please enter valid years of experience")
      .optional(),

    salary: z.coerce
      .number()
      .positive("Salary must be a positive number")
      .min(1000, "Salary must be at least 1,000")
      .max(10000000, "Please enter a valid salary")
      .optional(),

    website: optionalString(
      z.string().url("Please enter a valid URL (e.g., https://example.com)")
    ),

    linkedinProfile: optionalString(
      z
        .string()
        .url("Please enter a valid LinkedIn URL")
        .refine(
          (url) => url === "" || url.includes("linkedin.com"),
          "URL must be a LinkedIn profile"
        )
    ),

    githubProfile: optionalString(
      z
        .string()
        .url("Please enter a valid GitHub URL")
        .refine(
          (url) => url === "" || url.includes("github.com"),
          "URL must be a GitHub profile"
        )
    ),

    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        return today.getFullYear() - birthDate.getFullYear() >= 18;
      }, "You must be at least 18 years old"),

    bio: z
      .string()
      .min(50, "Bio must be at least 50 characters")
      .max(500, "Bio must not exceed 500 characters"),

    address: z
      .string()
      .min(10, "Please provide a complete address (minimum 10 characters)")
      .max(200, "Address is too long"),

    coverLetter: optionalString(
      z
        .string()
        .min(100, "Cover letter must be at least 100 characters")
        .max(2000, "Cover letter must not exceed 2000 characters")
    ),

    zipCode: z
      .string()
      .min(1, "Zip code is required")
      .regex(
        zipRegex,
        "Please enter a valid zip code (e.g., 12345 or 12345-6789)"
      ),

    ssn: optionalString(
      z.string().regex(ssnRegex, "SSN must be in format XXX-XX-XXXX")
    ),

    companyName: optionalString(
      z
        .string()
        .min(2, "Company name must be at least 2 characters")
        .max(100, "Company name is too long")
    ),

    jobTitle: optionalString(
      z
        .string()
        .min(2, "Job title must be at least 2 characters")
        .max(100, "Job title is too long")
    ),

    skills: z
      .string()
      .min(10, "Please describe your skills (minimum 10 characters)")
      .max(500, "Skills description is too long"),

    referralCode: optionalString(
      z
        .string()
        .regex(
          referralRegex,
          "Referral code must be 6 uppercase letters/numbers"
        )
    ),
});

export const mockupFormSchema = mockupFormBaseSchema
  .refine((data) => data.email === data.confirmEmail, {
    message: "Email addresses do not match",
    path: ["confirmEmail"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
