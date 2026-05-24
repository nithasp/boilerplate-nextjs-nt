"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useVtmsGetAnchorDetail } from "@/shared/hooks/queries";
import {
  formatDateTime,
  getAnchorShipStatusColor,
} from "@/shared/utils/functions";
import DetailField from "../../_components/detail-field";
import DetailSection from "../../_components/detail-section";
import {
  ErrorState,
  LoadingState,
  NoDataState,
} from "../../_components/page-states";

export default function AnchorShipDetailPage() {
  const t = useTranslations("dashboard.anchorShip.detail");
  const tCommon = useTranslations("common");
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data, isLoading, error: queryError } = useVtmsGetAnchorDetail(id);
  const anchorDetail = data?.data ?? null;

  if (isLoading) return <LoadingState label={tCommon("loading")} />;

  if (queryError) {
    const message =
      (queryError as { message?: string })?.message ||
      "Failed to fetch anchor detail";
    return <ErrorState prefix={t("errorPrefix")} message={message} />;
  }

  if (!anchorDetail) return <NoDataState label={t("noData")} />;

  const f = t.raw("fields") as Record<string, string>;

  return (
    <div className="anchor-ship-detail p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        {t("backToList")}
      </button>

      <h1 className="text-2xl font-bold mb-6">
        {t("title", { id: anchorDetail.id })}
      </h1>

      <DetailSection title={t("sections.anchorInfo")}>
        <DetailField
          label={f.status}
          value={
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getAnchorShipStatusColor(anchorDetail.status)}`}
            >
              {anchorDetail.status}
            </span>
          }
        />
        <DetailField label={f.voyage} value={anchorDetail.voyage} />
        <DetailField
          label={f.pilotDate}
          value={formatDateTime(anchorDetail.pilot_date)}
        />
        <DetailField
          label={f.anchorDate}
          value={formatDateTime(anchorDetail.anchor_date)}
        />
        <DetailField
          label={f.aweighDate}
          value={formatDateTime(anchorDetail.aweigh_date)}
        />
        <DetailField label={f.berth} value={anchorDetail.anchors.berth_name} />
        <DetailField label={f.latitude} value={anchorDetail.latitude} />
        <DetailField label={f.longitude} value={anchorDetail.longitude} />
        <DetailField label={f.grossTonnage} value={anchorDetail.gross_tonnage} />
        <DetailField label={f.depth} value={anchorDetail.depth} />
        <DetailField label={f.lastPort} value={anchorDetail.port_last_name} />
        <DetailField label={f.nextPort} value={anchorDetail.port_next_name} />
        <DetailField
          label={f.remark}
          value={anchorDetail.remark || "-"}
          className="md:col-span-2"
        />
      </DetailSection>

      <DetailSection title={t("sections.vesselInfo")} className="">
        <DetailField label={f.vesselName} value={anchorDetail.vessel.name} />
        <DetailField
          label={f.vesselType}
          value={anchorDetail.vessel.vessel_type}
        />
        <DetailField label={f.owner} value={anchorDetail.vessel.owner} />
        <DetailField
          label={f.flag}
          value={
            <div className="flex items-center gap-2">
              {anchorDetail.vessel.vessel_flag.image_path && (
                <Image
                  src={anchorDetail.vessel.vessel_flag.image_path}
                  alt={anchorDetail.vessel.vessel_flag.name}
                  width={24}
                  height={16}
                  className="rounded"
                />
              )}
              <span>{anchorDetail.vessel.vessel_flag.name}</span>
            </div>
          }
        />
        <DetailField label={f.imoNumber} value={anchorDetail.vessel.imo_number} />
        <DetailField
          label={f.mmsiNumber}
          value={anchorDetail.vessel.mmsi_number || "-"}
        />
        <DetailField
          label={f.officialNumber}
          value={anchorDetail.vessel.official_number}
        />
        <DetailField label={f.callSign} value={anchorDetail.vessel.call_sign} />
        <DetailField
          label={f.grossTonnage}
          value={anchorDetail.vessel.gross_tonnage}
        />
        <DetailField
          label={f.netTonnage}
          value={anchorDetail.vessel.net_tonnage}
        />
        <DetailField
          label={f.loadWeight}
          value={anchorDetail.vessel.load_weight}
        />
        <DetailField
          label={f.lengthOverall}
          value={anchorDetail.vessel.length_overall}
        />
        <DetailField
          label={f.breadthExtreme}
          value={anchorDetail.vessel.breadth_extreme}
        />
        <DetailField label={f.depth} value={anchorDetail.vessel.depth} />
        <DetailField
          label={f.mainEngine}
          value={anchorDetail.vessel.main_engine || "-"}
        />
        <DetailField
          label={f.bandAndModel}
          value={anchorDetail.vessel.band_and_model || "-"}
        />
        {anchorDetail.vessel.license_expired_date && (
          <DetailField
            label={f.licenseExpiredDate}
            value={formatDateTime(anchorDetail.vessel.license_expired_date)}
          />
        )}
      </DetailSection>
    </div>
  );
}
