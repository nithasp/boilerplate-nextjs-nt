import React from "react";

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function DetailSection({
  title,
  children,
  className = "mb-6",
}: DetailSectionProps) {
  return (
    <section
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-black">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </section>
  );
}
