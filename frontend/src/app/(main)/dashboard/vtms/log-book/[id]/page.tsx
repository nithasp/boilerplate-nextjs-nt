"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useVtmsGetLogBookDetail } from "@/shared/hooks/queries";
import {
  formatDateTime,
  getLogBookStatusColor,
} from "@/shared/utils/functions";
import DetailField from "../../_components/detail-field";
import DetailSection from "../../_components/detail-section";
import {
  ErrorState,
  LoadingState,
  NoDataState,
} from "../../_components/page-states";
import DataTable, { TD_CLASS } from "../../_components/data-table";

export default function LogBookDetailPage() {
  const t = useTranslations("dashboard.logBook.detail");
  const tCommon = useTranslations("common");
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data, isLoading, error: queryError } = useVtmsGetLogBookDetail(id);
  const logBookDetail = data?.data ?? null;

  if (isLoading) return <LoadingState label={tCommon("loading")} />;

  if (queryError) {
    const message =
      (queryError as { message?: string })?.message ||
      "Failed to fetch log book detail";
    return <ErrorState prefix={t("errorPrefix")} message={message} />;
  }

  if (!logBookDetail) return <NoDataState label={t("noData")} />;

  const f = t.raw("fields") as Record<string, string>;
  const pt = t.raw("productTable") as Record<string, string>;

  const productColumns = [
    { key: "productType", label: pt.productType },
    { key: "group", label: pt.group },
    { key: "purpose", label: pt.purpose },
    { key: "mTonQty", label: pt.mTonQty },
    { key: "rTonQty", label: pt.rTonQty },
    { key: "packageAmount", label: pt.packageAmount },
    { key: "receiver", label: pt.receiver },
  ];

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        {t("backToList")}
      </button>

      <h1 className="text-2xl font-bold mb-6">
        {t("title", { id: logBookDetail.id })}
      </h1>

      <DetailSection title={t("sections.logBookInfo")}>
        <DetailField
          label={f.status}
          value={
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getLogBookStatusColor(logBookDetail.status)}`}
            >
              {logBookDetail.status}
            </span>
          }
        />
        <DetailField label={f.voyage} value={logBookDetail.voyage} />
        <DetailField
          label={f.documentNumber}
          value={logBookDetail.document_number || "-"}
        />
        <DetailField
          label={f.agencyName}
          value={logBookDetail.agency_name || "-"}
        />
        <DetailField
          label={f.grossTonnage}
          value={logBookDetail.gross_tonnage}
        />
        <DetailField label={f.depth} value={logBookDetail.depth} />
        <DetailField
          label={f.lastPort}
          value={logBookDetail.port_name_last}
        />
        <DetailField
          label={f.nextPort}
          value={logBookDetail.port_name_next}
        />
      </DetailSection>

      <DetailSection title={t("sections.vesselInfo")}>
        <DetailField label={f.vesselName} value={logBookDetail.vessel.name} />
        <DetailField
          label={f.vesselType}
          value={logBookDetail.vessel.vessel_type}
        />
        <DetailField label={f.owner} value={logBookDetail.vessel.owner} />
        <DetailField
          label={f.flag}
          value={
            <div className="flex items-center gap-2">
              {logBookDetail.vessel.vessel_flag.image_path && (
                <Image
                  src={logBookDetail.vessel.vessel_flag.image_path}
                  alt={logBookDetail.vessel.vessel_flag.name}
                  width={24}
                  height={16}
                  className="rounded"
                />
              )}
              <span>{logBookDetail.vessel.vessel_flag.name}</span>
            </div>
          }
        />
        <DetailField
          label={f.imoNumber}
          value={logBookDetail.vessel.imo_number}
        />
        <DetailField
          label={f.mmsiNumber}
          value={logBookDetail.vessel.mmsi_number || "-"}
        />
        <DetailField
          label={f.officialNumber}
          value={logBookDetail.vessel.official_number}
        />
        <DetailField
          label={f.callSign}
          value={logBookDetail.vessel.call_sign}
        />
        <DetailField
          label={f.grossTonnage}
          value={logBookDetail.vessel.gross_tonnage}
        />
        <DetailField
          label={f.netTonnage}
          value={logBookDetail.vessel.net_tonnage}
        />
        <DetailField
          label={f.loadWeight}
          value={logBookDetail.vessel.load_weight}
        />
        <DetailField
          label={f.lengthOverall}
          value={logBookDetail.vessel.length_overall}
        />
        <DetailField
          label={f.breadthExtreme}
          value={logBookDetail.vessel.breadth_extreme}
        />
        <DetailField label={f.depth} value={logBookDetail.vessel.depth} />
        <DetailField
          label={f.mainEngine}
          value={logBookDetail.vessel.main_engine || "-"}
        />
        <DetailField
          label={f.bandAndModel}
          value={logBookDetail.vessel.band_and_model || "-"}
        />
        {logBookDetail.vessel.license_expired_date && (
          <DetailField
            label={f.licenseExpiredDate}
            value={formatDateTime(logBookDetail.vessel.license_expired_date)}
          />
        )}
      </DetailSection>

      {logBookDetail.details && logBookDetail.details.length > 0 && (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-black">
            {t("sections.berthDetails")}
          </h2>
          {logBookDetail.details.map((detail, index) => (
            <div
              key={index}
              className="mb-6 pb-6 border-b last:border-b-0 last:mb-0 last:pb-0"
            >
              <h3 className="font-medium mb-3">
                {t("berthNumber", { number: index + 1 })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailField label={f.berthName} value={detail.berth_name} />
                <DetailField label={f.jettyName} value={detail.jetty_name} />
                <DetailField label={f.purpose} value={detail.purpose_name} />
                <DetailField
                  label={f.cargoType}
                  value={detail.cargo_type_name || "-"}
                />
                <DetailField
                  label={f.mooringDate}
                  value={formatDateTime(detail.mooring_date)}
                />
                <DetailField
                  label={f.departureDate}
                  value={formatDateTime(detail.departure_date)}
                />
              </div>
            </div>
          ))}
        </section>
      )}

      {logBookDetail.products && logBookDetail.products.length > 0 && (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-black">
            {t("sections.products")}
          </h2>
          <DataTable
            columns={productColumns}
            isEmpty={false}
          >
            {logBookDetail.products.map((product, index) => (
              <tr key={product.id || index}>
                <td className={TD_CLASS}>{product.productTypeName}</td>
                <td className={TD_CLASS}>{product.productGroupName}</td>
                <td className={TD_CLASS}>{product.purposeName}</td>
                <td className={TD_CLASS}>{product.mTonQty}</td>
                <td className={TD_CLASS}>{product.rTonQty}</td>
                <td className={TD_CLASS}>{product.packageAmount}</td>
                <td className={TD_CLASS}>{product.receiver}</td>
              </tr>
            ))}
          </DataTable>
        </section>
      )}
    </div>
  );
}
