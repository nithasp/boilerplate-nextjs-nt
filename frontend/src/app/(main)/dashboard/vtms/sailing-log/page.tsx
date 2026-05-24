"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useGetDocumentList } from "@/shared/hooks/queries";
import { SailingLogData } from "@/types/vtms.types";
import {
  formatDate,
  getStatusColor,
  getVesselStatusColor,
} from "@/shared/utils/functions";
import { ROUTES } from "@/config/routes";
import DataTable, { TD_CLASS } from "../_components/data-table";

export default function SailingLogPage() {
  const t = useTranslations("dashboard.sailingLog");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useGetDocumentList();
  const sailingLogs: SailingLogData[] = data?.data?.data ?? [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateAndClose = (path: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    router.push(path);
  };

  const toggleMenu = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{t("errors.fetchFailed")}</p>
        </div>
      </div>
    );
  }

  const columns = [
    { key: "docNumber", label: t("table.docNumber") },
    { key: "vesselName", label: t("table.vesselName") },
    { key: "imoNumber", label: t("table.imoNumber") },
    { key: "eta", label: t("table.eta") },
    { key: "berth", label: t("table.berth") },
    { key: "status", label: t("table.status") },
    { key: "vesselStatus", label: t("table.vesselStatus") },
    { key: "actions", label: t("table.actions"), align: "center" as const },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <DataTable
        columns={columns}
        isEmpty={sailingLogs.length === 0}
        emptyMessage={t("empty")}
      >
        {sailingLogs.map((log) => (
          <tr
            key={log.id}
            onClick={() => router.push(ROUTES.sailingLogDetail(log.id))}
            className="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td className={TD_CLASS}>{log.docNumber}</td>
            <td className={TD_CLASS}>{log.vesselName}</td>
            <td className={TD_CLASS}>{log.imoNumber}</td>
            <td className={TD_CLASS}>{formatDate(log.eta)}</td>
            <td className={TD_CLASS}>{log.berthNames}</td>
            <td className={TD_CLASS}>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}
              >
                {log.statusDes}
              </span>
            </td>
            <td className={TD_CLASS}>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getVesselStatusColor(log.vesselStatus)}`}
              >
                {log.vesselStatusDes}
              </span>
            </td>
            <td className={`${TD_CLASS} relative`}>
              <div className="flex justify-center">
                <button
                  onClick={(e) => toggleMenu(log.id, e)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  aria-label={t("actions.options")}
                >
                  <MoreVertIcon fontSize="small" />
                </button>
                {openMenuId === log.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-8 top-8 z-10 w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
                  >
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={navigateAndClose(
                            ROUTES.sailingLogDetail(log.id)
                          )}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {t("actions.view")}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={navigateAndClose(
                            ROUTES.sailingLogEdit(log.id)
                          )}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {t("actions.edit")}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                        >
                          {t("actions.delete")}
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
