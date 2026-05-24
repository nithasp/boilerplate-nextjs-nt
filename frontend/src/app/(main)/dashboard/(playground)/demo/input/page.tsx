"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import SendIcon from "@mui/icons-material/Send";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Input from "@/shared/components/form/input";
import Button from "@/shared/components/form/button";
import ToastNotification from "@/lib/toast";
import { inputDemoSchema } from "./_schemas/input-demo.schema";
import type {
  InputDemoFormData,
  InputDemoFormInput,
} from "@/types/form/input-demo.types";

const INPUT_COLORS = {
  borderColor: "#cbd5e1",
  labelColor: "#1e293b",
  placeholderColor: "#94a3b8",
} as const;

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  accent: string;
  children: React.ReactNode;
};

function FormSection({ icon, title, accent, children }: SectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-200">
        <span
          className="flex items-center justify-center w-10 h-10 rounded-lg text-white shadow-sm"
          style={{ backgroundColor: accent }}
        >
          {icon}
        </span>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function InputDemoPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InputDemoFormInput, unknown, InputDemoFormData>({
    resolver: zodResolver(inputDemoSchema),
    mode: "onChange",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-blue-700 bg-blue-100 rounded-full uppercase">
            Component Playground
          </span>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Input Component Demo
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Showcasing the reusable Input component with MUI, styled-components,
            react-hook-form, and zod validation.
          </p>
        </div>

        <div className="!bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
            <FormSection
              icon={<PersonOutlineIcon fontSize="small" />}
              title="Basic Information"
              accent="#2563eb"
            >
              <div className="space-y-4">
                <Input
                  name="fullName"
                  control={control}
                  label="Full Name"
                  placeholder="John Doe"
                  required
                  {...INPUT_COLORS}
                />

                <Input
                  name="email"
                  control={control}
                  label="Email Address"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                  autoComplete="email"
                  {...INPUT_COLORS}
                />
              </div>
            </FormSection>

            <FormSection
              icon={<LockOutlinedIcon fontSize="small" />}
              title="Security"
              accent="#7c3aed"
            >
              <div className="space-y-4">
                <Input
                  name="password"
                  control={control}
                  label="Password"
                  type="password"
                  placeholder="Enter a strong password"
                  required
                  autoComplete="new-password"
                  {...INPUT_COLORS}
                />

                <Input
                  name="confirmPassword"
                  control={control}
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                  {...INPUT_COLORS}
                />
              </div>
            </FormSection>

            <FormSection
              icon={<ContactPhoneOutlinedIcon fontSize="small" />}
              title="Contact Information"
              accent="#0891b2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="phone"
                  control={control}
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...INPUT_COLORS}
                />

                <Input
                  name="age"
                  control={control}
                  label="Age"
                  type="number"
                  placeholder="18"
                  inputProps={{ min: 18, max: 120 }}
                  {...INPUT_COLORS}
                />
              </div>

              <div className="mt-4">
                <Input
                  name="website"
                  control={control}
                  label="Website"
                  type="url"
                  placeholder="https://example.com"
                  {...INPUT_COLORS}
                />
              </div>
            </FormSection>

            <FormSection
              icon={<NotesOutlinedIcon fontSize="small" />}
              title="Additional Details"
              accent="#ea580c"
            >
              <div className="space-y-4">
                <Input
                  name="bio"
                  control={control}
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  multiline
                  rows={4}
                  maxRows={8}
                  {...INPUT_COLORS}
                />

                <Input
                  name="address"
                  control={control}
                  label="Address"
                  placeholder="123 Main St, City, State, ZIP"
                  multiline
                  rows={3}
                  {...INPUT_COLORS}
                />
              </div>
            </FormSection>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                text={isSubmitting ? "Submitting..." : "Submit Form"}
                endIcon={!isSubmitting ? <SendIcon /> : undefined}
                color="primary"
                size="large"
                fullWidth
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => reset()}
                disabled={isSubmitting}
                text="Reset"
                startIcon={<RestartAltIcon />}
                variant="outlined"
                size="large"
                className="sm:w-auto"
              />
            </div>
          </form>

          {Object.keys(errors).length > 0 && (
            <div className="mt-8 p-5 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <ErrorOutlineIcon className="text-red-600" fontSize="small" />
                <h3 className="text-red-800 font-semibold">
                  Validation Errors
                </h3>
              </div>
              <pre className="text-sm text-red-700 overflow-auto bg-white/60 rounded-lg p-3 border border-red-100">
                {JSON.stringify(errors, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
