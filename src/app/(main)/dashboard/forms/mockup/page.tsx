"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Input from "@/shared/components/form/input";
import ToastNotification from "@/lib/toast";
import {
  mockupFormBaseSchema,
  mockupFormSchema,
} from "./_schemas/mockup-form.schema";
import type {
  MockupFormData,
  MockupFormInput,
} from "@/types/form/mockup-form.types";

const VALIDATION_FEATURES = [
  { icon: "✅", title: "Required Fields", desc: "Min/max length validation" },
  { icon: "📧", title: "Email Validation", desc: "Format + confirmation match" },
  { icon: "🔑", title: "Password Rules", desc: "Complex regex patterns" },
  { icon: "📱", title: "Phone Numbers", desc: "International format" },
  { icon: "🔢", title: "Number Ranges", desc: "Min/max with type checking" },
  { icon: "🌐", title: "URL Validation", desc: "Format + domain specific" },
  { icon: "📅", title: "Date Validation", desc: "Age calculation" },
  { icon: "✍️", title: "Text Areas", desc: "Character count limits" },
  { icon: "🎭", title: "Regex Patterns", desc: "Custom format validation" },
  { icon: "🔗", title: "Field Matching", desc: "Confirm field validation" },
  { icon: "⚙️", title: "Optional Fields", desc: "Conditional validation" },
  { icon: "🎨", title: "Real-time", desc: "onChange validation" },
];

const DEFAULT_VALUES: MockupFormInput = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  confirmEmail: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  alternatePhone: "",
  age: "",
  yearsOfExperience: "",
  salary: "",
  dateOfBirth: "",
  website: "",
  linkedinProfile: "",
  githubProfile: "",
  bio: "",
  address: "",
  coverLetter: "",
  zipCode: "",
  ssn: "",
  companyName: "",
  jobTitle: "",
  skills: "",
  referralCode: "",
};

const StatCard = ({
  value,
  label,
  colorClass,
}: {
  value: React.ReactNode;
  label: string;
  colorClass: string;
}) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
    <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);

export default function MockupFormPage() {
  const t = useTranslations("dashboard.forms.mockup");
  const [submittedData, setSubmittedData] = useState<MockupFormData | null>(
    null
  );
  const [showResults, setShowResults] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    watch,
    reset,
  } = useForm<MockupFormInput, unknown, MockupFormData>({
    resolver: zodResolver(mockupFormSchema),
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = async (data: MockupFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      ToastNotification.success(t("notifications.submitSuccess"));
      setSubmittedData(data);
      setShowResults(true);
      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      ToastNotification.error(t("notifications.submitError"));
    }
  };

  const handleReset = () => {
    reset();
    setShowResults(false);
    setSubmittedData(null);
    ToastNotification.info(t("notifications.reset"));
  };

  const errorCount = Object.keys(errors).length;
  const totalFields = Object.keys(mockupFormBaseSchema.shape).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            {t("subtitle")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Using{" "}
            <span className="font-semibold">
              MUI + styled-components + react-hook-form + zod
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            value={totalFields}
            label={t("stats.totalFields")}
            colorClass="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            value={errorCount}
            label={t("stats.validationErrors")}
            colorClass="text-red-600 dark:text-red-400"
          />
          <StatCard
            value={isValid ? "✓" : "✗"}
            label={t("stats.formValid")}
            colorClass="text-green-600 dark:text-green-400"
          />
          <StatCard
            value={isDirty ? "✓" : "✗"}
            label={t("stats.formModified")}
            colorClass="text-purple-600 dark:text-purple-400"
          />
        </div>

        <div className="!bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 !text-black">
                {t("sections.additionalInfo")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t("sections.additionalInfoSubtitle")}
              </p>
              <div className="space-y-6">
                <Input
                  name="bio"
                  control={control}
                  label={t("fields.bio")}
                  placeholder={t("fields.bioPlaceholder")}
                  required
                  multiline
                  rows={5}
                  maxRows={10}
                  helperText={t("fields.bioHelper", {
                    count: watch("bio")?.length || 0,
                  })}
                  disabled={isSubmitting}
                />
                <Input
                  name="coverLetter"
                  control={control}
                  label={t("fields.coverLetter")}
                  placeholder={t("fields.coverLetterPlaceholder")}
                  multiline
                  rows={8}
                  maxRows={15}
                  helperText={t("fields.coverLetterHelper", {
                    count: watch("coverLetter")?.length || 0,
                  })}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {t("actions.submitting")}
                    </span>
                  ) : !isValid && errorCount > 0 ? (
                    t("actions.submitWithErrors", { count: errorCount })
                  ) : (
                    t("actions.submitValid")
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting || !isDirty}
                  className="flex-1 sm:flex-initial px-8 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold text-lg rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {t("actions.reset")}
                </button>
              </div>

              {errorCount > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-400 text-sm font-medium">
                    {t("validationWarning", { count: errorCount })}
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {showResults && submittedData && (
          <div
            id="results"
            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-2xl p-8 border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-green-800 dark:text-green-400">
                    {t("results.title")}
                  </h2>
                  <p className="text-green-600 dark:text-green-500">
                    {t("results.subtitle")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("results.dataLabel")}
              </h3>
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 max-h-96">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t("sections.validationTypes")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VALIDATION_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="text-2xl">{feature.icon}</div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
