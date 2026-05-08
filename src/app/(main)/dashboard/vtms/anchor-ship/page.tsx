"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useVtmsGetAnchorList } from "@/shared/hooks/queries";
import { AnchorShipData } from "@/types/vtms.types";
import {
  formatDate,
  getAnchorShipStatusColor,
} from "@/shared/utils/functions";
import { ROUTES } from "@/config/routes";
import DataTable, { TD_CLASS } from "../_components/data-table";

const SHORT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export default function AnchorShipPage() {
  const t = useTranslations("dashboard.anchorShip");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { data, isLoading } = useVtmsGetAnchorList();
  const anchorShips: AnchorShipData[] = data?.data?.data ?? [];
  const totalItems = data?.data?.totalItems ?? 0;
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
    { key: "id", label: t("table.id") },
    { key: "flag", label: t("table.flag") },
    { key: "vesselName", label: t("table.vesselName") },
    { key: "imoNumber", label: t("table.imoNumber") },
    { key: "vesselType", label: t("table.vesselType") },
    { key: "berth", label: t("table.berth") },
    { key: "anchorDate", label: t("table.anchorDate") },
    { key: "aweighDate", label: t("table.aweighDate") },
    { key: "duration", label: t("table.duration") },
    { key: "status", label: t("table.status") },
  ];

  return (
    <div className="anchor-ship p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <div className="text-sm text-gray-600">
          {t("summary", { total: totalItems, pages: totalPages })}
        </div>
      </div>

      <DataTable
        columns={columns}
        isEmpty={anchorShips.length === 0}
        emptyMessage={t("empty")}
      >
        {anchorShips.map((ship) => (
          <tr
            key={ship.id}
            onClick={() => router.push(ROUTES.anchorShipDetail(ship.id))}
            className="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td className={TD_CLASS}>{ship.id}</td>
            <td className={TD_CLASS}>
              {ship.vessel_flag && (
                <Image
                  src={ship.vessel_flag}
                  alt="flag"
                  width={24}
                  height={16}
                  className="rounded"
                />
              )}
            </td>
            <td className={TD_CLASS}>{ship.vessel_name}</td>
            <td className={TD_CLASS}>{ship.vessel_imo_number}</td>
            <td className={TD_CLASS}>{ship.vessel_type_name}</td>
            <td className={TD_CLASS}>{ship.berth_name}</td>
            <td className={TD_CLASS}>
              {formatDate(ship.anchor_date, "en-US", SHORT_DATE_OPTIONS)}
            </td>
            <td className={TD_CLASS}>
              {formatDate(ship.aweigh_date, "en-US", SHORT_DATE_OPTIONS)}
            </td>
            <td className={TD_CLASS}>{ship.duration || "-"}</td>
            <td className={TD_CLASS}>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getAnchorShipStatusColor(ship.status)}`}
              >
                {ship.status}
              </span>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
