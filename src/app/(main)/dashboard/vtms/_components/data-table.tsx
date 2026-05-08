import React from "react";

const TH_CLASS =
  "px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider";
const TH_CENTER = `${TH_CLASS} text-center`;
export const TD_CLASS = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center";
}

interface DataTableProps {
  columns: Column[];
  emptyMessage?: string;
  isEmpty: boolean;
  children: React.ReactNode;
}

export default function DataTable({
  columns,
  emptyMessage,
  isEmpty,
  children,
}: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.align === "center" ? TH_CENTER : TH_CLASS}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isEmpty ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
