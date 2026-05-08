import React from "react";

const INPUT_CLASS =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

interface EditableFieldProps {
  label: string;
  value: string | number | undefined;
  type?: React.HTMLInputTypeAttribute;
  onChange: (value: string) => void;
  className?: string;
}

export function EditableField({
  label,
  value,
  type = "text",
  onChange,
  className,
}: EditableFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLASS}
      />
    </div>
  );
}

interface DateTimeFieldProps {
  label: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  className?: string;
}

export function DateTimeField({
  label,
  value,
  onChange,
  className,
}: DateTimeFieldProps) {
  return (
    <EditableField
      label={label}
      value={value ? value.slice(0, 16) : ""}
      type="datetime-local"
      onChange={onChange}
      className={className}
    />
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  className,
}: SelectFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLASS}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
