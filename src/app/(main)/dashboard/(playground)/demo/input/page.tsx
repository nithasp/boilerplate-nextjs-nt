"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/shared/components/form/input";
import ToastNotification from "@/lib/toast";
import { inputDemoSchema } from "./_schemas/input-demo.schema";
import type {
  InputDemoFormData,
  InputDemoFormInput,
} from "@/types/form/input-demo.types";

export default function InputDemoPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InputDemoFormInput, unknown, InputDemoFormData>({
    resolver: zodResolver(inputDemoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      website: "",
      bio: "",
      address: "",
    },
  });

  const onSubmit = async (data: InputDemoFormData) => {
    console.log("Form submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    ToastNotification.success("Form submitted successfully!");
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Input Component Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Showcasing the reusable Input component with MUI, styled-components, react-hook-form, and zod validation
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <Input
                  name="fullName"
                  control={control}
                  label="Full Name"
                  placeholder="John Doe"
                  required
                  helperText="Enter your first and last name"
                />

                <Input
                  name="email"
                  control={control}
                  label="Email Address"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                  autoComplete="email"
                  helperText="We'll never share your email with anyone"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Security
              </h2>
              <div className="space-y-4">
                <Input
                  name="password"
                  control={control}
                  label="Password"
                  type="password"
                  placeholder="Enter a strong password"
                  required
                  autoComplete="new-password"
                  helperText="Must be at least 8 characters with uppercase, lowercase, and number"
                />

                <Input
                  name="confirmPassword"
                  control={control}
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="phone"
                  control={control}
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  helperText="Optional: Include country code"
                />

                <Input
                  name="age"
                  control={control}
                  label="Age"
                  type="number"
                  placeholder="18"
                  inputProps={{ min: 18, max: 120 }}
                  helperText="Must be 18 or older"
                />
              </div>

              <div className="mt-4">
                <Input
                  name="website"
                  control={control}
                  label="Website"
                  type="url"
                  placeholder="https://example.com"
                  helperText="Optional: Your personal or company website"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Additional Details
              </h2>
              <div className="space-y-4">
                <Input
                  name="bio"
                  control={control}
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  multiline
                  rows={4}
                  maxRows={8}
                  helperText="Optional: Maximum 500 characters"
                />

                <Input
                  name="address"
                  control={control}
                  label="Address"
                  placeholder="123 Main St, City, State, ZIP"
                  multiline
                  rows={3}
                  helperText="Optional: Your full address"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Form"}
              </button>
              <button
                type="button"
                onClick={() => reset()}
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>
          </form>

          {Object.keys(errors).length > 0 && (
            <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h3 className="text-red-800 dark:text-red-400 font-semibold mb-2">
                Validation Errors:
              </h3>
              <pre className="text-sm text-red-600 dark:text-red-400 overflow-auto">
                {JSON.stringify(errors, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
