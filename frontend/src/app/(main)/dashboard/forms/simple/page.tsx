"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import SendIcon from "@mui/icons-material/Send";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Input from "@/shared/components/form/input";
import Select from "@/shared/components/form/select";
import Button from "@/shared/components/form/button";
import ToastNotification from "@/lib/toast";
import { simpleFormSchema } from "./_schemas/simple-form.schema";
import type { SimpleFormData } from "@/types/form/simple-form.types";

const departmentOptions = [
  { id: "sales", name: "Sales" },
  { id: "support", name: "Customer Support" },
  { id: "technical", name: "Technical Team" },
  { id: "billing", name: "Billing" },
  { id: "general", name: "General Inquiry" },
];

const priorityOptions = [
  { id: 1, name: "Low" },
  { id: 2, name: "Medium" },
  { id: 3, name: "High" },
  { id: 4, name: "Urgent" },
];

const categoryOptions = [
  { id: "bug", name: "Bug Report" },
  { id: "feature", name: "Feature Request" },
  { id: "question", name: "Question" },
  { id: "feedback", name: "Feedback" },
  { id: "other", name: "Other" },
];

const DEFAULT_VALUES: SimpleFormData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  department: "",
  priority: 0,
  categories: [],
  message: "",
};

export default function SimpleFormPage() {
  const t = useTranslations("dashboard.forms.simple");
  const [submittedData, setSubmittedData] = useState<SimpleFormData | null>(
    null
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
  } = useForm<SimpleFormData>({
    resolver: zodResolver(simpleFormSchema),
    mode: "onSubmit",
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = async (data: SimpleFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      ToastNotification.success(t("notifications.submitSuccess"));
      setSubmittedData(data);
    } catch {
      ToastNotification.error(t("notifications.submitError"));
    }
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
    ToastNotification.info(t("notifications.reset"));
  };

  const errorCount = Object.keys(errors).length;

  const submitLabel = isSubmitting
    ? t("actions.submitting")
    : !isValid && errorCount > 0
      ? t("actions.submitWithErrors", { count: errorCount })
      : t("actions.submitValid");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="!bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6 grid grid-cols-1 gap-4"
          >
            <Input
              name="fullName"
              control={control}
              label={t("fields.fullName")}
              placeholder={t("fields.fullNamePlaceholder")}
              required
            />
            <Input
              name="email"
              control={control}
              label={t("fields.email")}
              type="email"
              placeholder={t("fields.emailPlaceholder")}
              required
            />
            <Input
              name="phoneNumber"
              control={control}
              label={t("fields.phone")}
              type="tel"
              placeholder={t("fields.phonePlaceholder")}
              required
            />
            <Select
              name="department"
              control={control}
              label={t("fields.department")}
              placeholder={t("fields.departmentPlaceholder")}
              options={departmentOptions}
              required
              helperText={t("fields.departmentHelper")}
            />
            <Select
              name="priority"
              control={control}
              label={t("fields.priority")}
              placeholder={t("fields.priorityPlaceholder")}
              options={priorityOptions}
              required
              size="small"
            />
            <Select
              name="categories"
              control={control}
              label={t("fields.categories")}
              placeholder={t("fields.categoriesPlaceholder")}
              options={categoryOptions}
              multiple
              required
              helperText={t("fields.categoriesHelper")}
            />
            <Input
              name="message"
              control={control}
              label={t("fields.message")}
              placeholder={t("fields.messagePlaceholder")}
              required
              multiline
              rows={4}
              maxRows={8}
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                text={submitLabel}
                endIcon={!isSubmitting ? <SendIcon /> : undefined}
                color="primary"
                size="large"
                fullWidth
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting || !isDirty}
                text={t("actions.reset")}
                startIcon={<RestartAltIcon />}
                variant="outlined"
                size="large"
                className="sm:w-auto"
              />
            </div>
          </form>
        </div>

        {submittedData && (
          <div className="!bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("results.title")}
            </h2>
            <div className="space-y-3">
              {[
                { label: t("results.fullName"), value: submittedData.fullName },
                { label: t("results.email"), value: submittedData.email },
                { label: t("results.phone"), value: submittedData.phoneNumber },
                {
                  label: t("results.department"),
                  value: departmentOptions.find(
                    (d) => d.id === submittedData.department
                  )?.name,
                },
                {
                  label: t("results.priority"),
                  value: priorityOptions.find(
                    (p) => p.id === submittedData.priority
                  )?.name,
                },
                {
                  label: t("results.categories"),
                  value: submittedData.categories
                    .map(
                      (cat) => categoryOptions.find((c) => c.id === cat)?.name
                    )
                    .join(", "),
                },
                { label: t("results.message"), value: submittedData.message },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {label}:
                  </span>{" "}
                  <span className="text-gray-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
