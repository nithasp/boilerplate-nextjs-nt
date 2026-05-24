"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useVtmsGetLogBookList } from "@/shared/hooks/queries";
import { LogBookData } from "@/types/vtms.types";
import { formatDate } from "@/shared/utils/functions";
import { ROUTES } from "@/config/routes";
import DataTable, { TD_CLASS } from "../_components/data-table";

const STATUS_STYLES: Record<string, string> = {
  Arrival: "bg-green-100 text-green-800",
  Departure: "bg-blue-100 text-blue-800",
};
const FALLBACK_STATUS_STYLE = "bg-gray-100 text-gray-800";

export default function LogBookPage() {
  const t = useTranslations("dashboard.logBook");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useVtmsGetLogBookList({ page: currentPage });
  const logBooks: LogBookData[] = data?.data?.data ?? [];
  const totalPages = data?.data?.totalPages ?? 0;

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">{tCommon("loading")}</div>
        </div>
      </div>
    );
  }

  const columns = [
    { key: "documentNumber", label: t("table.documentNumber") },
    { key: "status", label: t("table.status") },
    { key: "vesselName", label: t("table.vesselName") },
    { key: "vesselType", label: t("table.vesselType") },
    { key: "berthJetty", label: t("table.berthJetty") },
    { key: "agency", label: t("table.agency") },
    { key: "mooringDate", label: t("table.mooringDate") },
    { key: "departureDate", label: t("table.departureDate") },
  ];

  const renderStatusLabel = (status: string) =>
    status === "Arrival"
      ? t("status.arrival")
      : status === "Departure"
        ? t("status.departure")
        : status;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <DataTable
        columns={columns}
        isEmpty={logBooks.length === 0}
        emptyMessage={t("empty") ?? "No data"}
      >
        {logBooks.map((log) => (
          <tr
            key={log.id}
            onClick={() => router.push(ROUTES.logBookDetail(log.id))}
            className="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td className={TD_CLASS}>{log.document_number}</td>
            <td className={TD_CLASS}>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  STATUS_STYLES[log.status] ?? FALLBACK_STATUS_STYLE
                }`}
              >
                {renderStatusLabel(log.status)}
              </span>
            </td>
            <td className={TD_CLASS}>
              <div className="flex items-center">
                {log.vessel_flag && (
                  <img
                    src={log.vessel_flag}
                    alt="flag"
                    className="w-6 h-4 mr-2 object-cover"
                  />
                )}
                {log.vessel_name}
              </div>
            </td>
            <td className={TD_CLASS}>{log.vessel_type_name}</td>
            <td className={TD_CLASS}>
              <div>{log.berth_name}</div>
              <div className="text-xs text-gray-500">{log.jetty_name}</div>
            </td>
            <td className={TD_CLASS}>{log.agency_name}</td>
            <td className={TD_CLASS}>
              {log.mooring_date ? formatDate(log.mooring_date) : "-"}
            </td>
            <td className={TD_CLASS}>
              {log.departure_date ? formatDate(log.departure_date) : "-"}
            </td>
          </tr>
        ))}
      </DataTable>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("pagination.previous")}
          </button>
          <span className="text-sm text-gray-700">
            {t("pagination.pageOf", {
              current: currentPage,
              total: totalPages,
            })}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("pagination.next")}
          </button>
        </div>
      )}
    </div>
  );
}
