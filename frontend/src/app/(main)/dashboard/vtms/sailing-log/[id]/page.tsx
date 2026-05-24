"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useVtmsGetDocumentDetail } from "@/shared/hooks/queries";
import { formatDateTime, getStatusColor } from "@/shared/utils/functions";
import { ROUTES } from "@/config/routes";
import DetailField from "../../_components/detail-field";
import DetailSection from "../../_components/detail-section";
import {
  ErrorState,
  LoadingState,
  NoDataState,
} from "../../_components/page-states";

export default function SailingLogDetailPage() {
  const t = useTranslations("dashboard.sailingLog.detail");
  const tCommon = useTranslations("common");
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data, isLoading, error: queryError } = useVtmsGetDocumentDetail(id);
  const documentDetail = data?.data ?? null;

  if (isLoading) return <LoadingState label={tCommon("loading")} />;

  if (queryError) {
    const message =
      (queryError as { message?: string })?.message ||
      "Failed to fetch document detail";
    return <ErrorState prefix={t("errorPrefix")} message={message} />;
  }

  if (!documentDetail) return <NoDataState label={t("noData")} />;

  const f = t.raw("fields") as Record<string, string>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push(ROUTES.sailingLog)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {t("backToList")}
        </button>
        <button
          onClick={() => router.push(ROUTES.sailingLogEdit(id))}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          {t("editButton")}
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        {t("title", { docNumber: documentDetail.docNumber })}
      </h1>

      <DetailSection title={t("sections.documentInfo")}>
        <DetailField label={f.documentNumber} value={documentDetail.docNumber} />
        <DetailField
          label={f.status}
          value={
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(documentDetail.status)}`}
            >
              {documentDetail.statusDescription}
            </span>
          }
        />
        <DetailField
          label={f.requestDate}
          value={formatDateTime(documentDetail.requestDate)}
        />
        <DetailField
          label={f.vesselStatus}
          value={documentDetail.vesselStatusDes}
        />
        <DetailField
          label={f.estimatedArrival}
          value={formatDateTime(documentDetail.estimatedArrival)}
        />
        <DetailField
          label={f.estimatedDeparture}
          value={formatDateTime(documentDetail.estimatedDeparture)}
        />
        <DetailField label={f.berthDues} value={documentDetail.berthDues} />
        <DetailField
          label={f.newShip}
          value={documentDetail.isNewShip ? tCommon("yes") : tCommon("no")}
        />
      </DetailSection>

      <DetailSection title={t("sections.vesselInfo")}>
        <DetailField
          label={f.vesselName}
          value={documentDetail.vessel.vesselName}
        />
        <DetailField
          label={f.vesselType}
          value={documentDetail.vessel.vesselTypeName}
        />
        <DetailField
          label={f.imoNumber}
          value={documentDetail.vessel.vesselImoNumber}
        />
        <DetailField
          label={f.officialNumber}
          value={documentDetail.vessel.vesselOfficialNumber}
        />
        <DetailField
          label={f.callSign}
          value={documentDetail.vessel.vesselCallSign}
        />
        <DetailField label={f.flag} value={documentDetail.vessel.vesselFlagName} />
        <DetailField label={f.owner} value={documentDetail.vessel.vesselOwner} />
        <DetailField
          label={f.grossTonnage}
          value={documentDetail.vessel.vesselGrossTonnage}
        />
        <DetailField
          label={f.netTonnage}
          value={documentDetail.vessel.vesselNetTonnage}
        />
        <DetailField
          label={f.lengthOverall}
          value={documentDetail.vessel.vesselLengthOverall}
        />
        <DetailField
          label={f.breadthExtreme}
          value={documentDetail.vessel.vesselBreadthExtreme}
        />
        <DetailField label={f.depth} value={documentDetail.vessel.vesselDepth} />
      </DetailSection>

      <DetailSection title={t("sections.agencyInfo")}>
        <DetailField label={f.agencyName} value={documentDetail.agency.name} />
        <DetailField label={f.company} value={documentDetail.agency.company} />
        <DetailField label={f.phone} value={documentDetail.agency.phone} />
        <DetailField label={f.email} value={documentDetail.agency.email} />
        <DetailField
          label={f.address}
          value={`${documentDetail.agency.address}, ${documentDetail.agency.subdistrict}, ${documentDetail.agency.district}, ${documentDetail.agency.province} ${documentDetail.agency.postcode}`}
          className="md:col-span-2"
        />
      </DetailSection>

      {documentDetail.berths && documentDetail.berths.length > 0 && (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-black">
            {t("sections.berthsInfo")}
          </h2>
          {documentDetail.berths.map((berth, index) => (
            <div
              key={berth.id}
              className="mb-6 pb-6 border-b last:border-b-0 last:mb-0 last:pb-0"
            >
              <h3 className="font-medium mb-3">
                {t("berthNumber", { number: index + 1 })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailField label={f.berthNameTh} value={berth.berthNameTh} />
                <DetailField label={f.berthNameEn} value={berth.berthNameEn} />
                <DetailField
                  label={f.purposeType}
                  value={berth.purposeTypeName}
                />
                <DetailField label={f.purpose} value={berth.purposeName} />
                <DetailField
                  label={f.estimatedArrival}
                  value={formatDateTime(berth.estimatedArrival)}
                />
                <DetailField
                  label={f.estimatedDeparture}
                  value={formatDateTime(berth.estimatedDeparture)}
                />
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
