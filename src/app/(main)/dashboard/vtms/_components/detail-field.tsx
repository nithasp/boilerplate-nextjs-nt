import React from "react";

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export default function DetailField({
  label,
  value,
  className,
}: DetailFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <p className="text-gray-900">{value}</p>
    </div>
  );
}
