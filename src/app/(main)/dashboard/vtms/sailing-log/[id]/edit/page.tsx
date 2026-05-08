"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useVtmsGetDocumentDetail } from "@/shared/hooks/queries";
import { DocumentDetail } from "@/types/vtms.types";
import { ROUTES } from "@/config/routes";
import {
  DateTimeField,
  EditableField,
  SelectField,
} from "../../../_components/editable-field";
import {
  ErrorState,
  LoadingState,
  NoDataState,
} from "../../../_components/page-states";

type FormState = DocumentDetail;
type FormUpdater = (prev: FormState) => FormState;

export default function SailingLogEditPage() {
  const t = useTranslations("dashboard.sailingLog.detail");
  const tCommon = useTranslations("common");
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [formData, setFormData] = useState<FormState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, error: queryError } = useVtmsGetDocumentDetail(id);

  useEffect(() => {
    if (data?.data) setFormData((prev) => prev ?? data.data);
  }, [data]);

  if (isLoading) return <LoadingState label={tCommon("loading")} />;

  if (queryError) {
    const message =
      (queryError as { message?: string })?.message ||
      "Failed to fetch document detail";
    return <ErrorState prefix={t("errorPrefix")} message={message} />;
  }

  if (!formData) return <NoDataState label={t("noData")} />;

  const updateForm = (updater: FormUpdater) =>
    setFormData((prev) => (prev ? updater(prev) : prev));

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    updateForm((prev) => ({ ...prev, [field]: value }));

  const updateVessel = <K extends keyof FormState["vessel"]>(
    field: K,
    value: FormState["vessel"][K]
  ) =>
    updateForm((prev) => ({
      ...prev,
      vessel: { ...prev.vessel, [field]: value },
    }));

  const updateAgency = <K extends keyof FormState["agency"]>(
    field: K,
    value: FormState["agency"][K]
  ) =>
    updateForm((prev) => ({
      ...prev,
      agency: { ...prev.agency, [field]: value },
    }));

  const updateBerth = (
    index: number,
    field: keyof FormState["berths"][number],
    value: string
  ) =>
    updateForm((prev) => {
      const berths = [...prev.berths];
      berths[index] = { ...berths[index], [field]: value };
      return { ...prev, berths };
    });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      alert("Changes saved successfully! (Note: API integration pending)");
      router.push(ROUTES.sailingLogDetail(id));
    } catch {
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

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
        <div className="flex gap-2">
          <button
            onClick={() => router.push(ROUTES.sailingLogDetail(id))}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {tCommon("cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? t("saving") : t("saveChanges")}
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        {t("title", { docNumber: formData.docNumber })}
        <span className="text-sm text-blue-600 ml-2">{t("editMode")}</span>
      </h1>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-black">
          {t("sections.documentInfo")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField
            label={f.documentNumber}
            value={formData.docNumber}
            onChange={(v) => updateField("docNumber", v)}
          />
          <EditableField
            label={f.status}
            value={formData.statusDescription}
            onChange={(v) => updateField("statusDescription", v)}
          />
          <DateTimeField
            label={f.requestDate}
            value={formData.requestDate}
            onChange={(v) => updateField("requestDate", v)}
          />
          <EditableField
            label={f.vesselStatus}
            value={formData.vesselStatusDes}
            onChange={(v) => updateField("vesselStatusDes", v)}
          />
          <DateTimeField
            label={f.estimatedArrival}
            value={formData.estimatedArrival}
            onChange={(v) => updateField("estimatedArrival", v)}
          />
          <DateTimeField
            label={f.estimatedDeparture}
            value={formData.estimatedDeparture}
            onChange={(v) => updateField("estimatedDeparture", v)}
          />
          <EditableField
            label={f.berthDues}
            type="number"
            value={formData.berthDues}
            onChange={(v) => updateField("berthDues", Number(v))}
          />
          <SelectField
            label={f.newShip}
            value={formData.isNewShip ? "true" : "false"}
            onChange={(v) => updateField("isNewShip", v === "true")}
            options={[
              { value: "true", label: tCommon("yes") },
              { value: "false", label: tCommon("no") },
            ]}
          />
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-black">
          {t("sections.vesselInfo")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField
            label={f.vesselName}
            value={formData.vessel.vesselName}
            onChange={(v) => updateVessel("vesselName", v)}
          />
          <EditableField
            label={f.vesselType}
            value={formData.vessel.vesselTypeName}
            onChange={(v) => updateVessel("vesselTypeName", v)}
          />
          <EditableField
            label={f.imoNumber}
            value={formData.vessel.vesselImoNumber}
            onChange={(v) => updateVessel("vesselImoNumber", v)}
          />
          <EditableField
            label={f.officialNumber}
            value={formData.vessel.vesselOfficialNumber}
            onChange={(v) => updateVessel("vesselOfficialNumber", v)}
          />
          <EditableField
            label={f.callSign}
            value={formData.vessel.vesselCallSign}
            onChange={(v) => updateVessel("vesselCallSign", v)}
          />
          <EditableField
            label={f.flag}
            value={formData.vessel.vesselFlagName}
            onChange={(v) => updateVessel("vesselFlagName", v)}
          />
          <EditableField
            label={f.owner}
            value={formData.vessel.vesselOwner}
            onChange={(v) => updateVessel("vesselOwner", v)}
          />
          <EditableField
            label={f.grossTonnage}
            type="number"
            value={formData.vessel.vesselGrossTonnage}
            onChange={(v) => updateVessel("vesselGrossTonnage", Number(v))}
          />
          <EditableField
            label={f.netTonnage}
            type="number"
            value={formData.vessel.vesselNetTonnage}
            onChange={(v) => updateVessel("vesselNetTonnage", Number(v))}
          />
          <EditableField
            label={f.lengthOverall}
            type="number"
            value={formData.vessel.vesselLengthOverall}
            onChange={(v) => updateVessel("vesselLengthOverall", Number(v))}
          />
          <EditableField
            label={f.breadthExtreme}
            type="number"
            value={formData.vessel.vesselBreadthExtreme}
            onChange={(v) => updateVessel("vesselBreadthExtreme", Number(v))}
          />
          <EditableField
            label={f.depth}
            type="number"
            value={formData.vessel.vesselDepth}
            onChange={(v) => updateVessel("vesselDepth", Number(v))}
          />
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-black">
          {t("sections.agencyInfo")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField
            label={f.agencyName}
            value={formData.agency.name}
            onChange={(v) => updateAgency("name", v)}
          />
          <EditableField
            label={f.company}
            value={formData.agency.company}
            onChange={(v) => updateAgency("company", v)}
          />
          <EditableField
            label={f.phone}
            type="tel"
            value={formData.agency.phone}
            onChange={(v) => updateAgency("phone", v)}
          />
          <EditableField
            label={f.email}
            type="email"
            value={formData.agency.email}
            onChange={(v) => updateAgency("email", v)}
          />
          <EditableField
            label={f.address}
            value={formData.agency.address}
            onChange={(v) => updateAgency("address", v)}
          />
          <EditableField
            label={f.subdistrict}
            value={formData.agency.subdistrict}
            onChange={(v) => updateAgency("subdistrict", v)}
          />
          <EditableField
            label={f.district}
            value={formData.agency.district}
            onChange={(v) => updateAgency("district", v)}
          />
          <EditableField
            label={f.province}
            value={formData.agency.province}
            onChange={(v) => updateAgency("province", v)}
          />
          <EditableField
            label={f.postcode}
            value={formData.agency.postcode}
            onChange={(v) => updateAgency("postcode", v)}
          />
        </div>
      </section>

      {formData.berths && formData.berths.length > 0 && (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-black">
            {t("sections.berthsInfo")}
          </h2>
          {formData.berths.map((berth, index) => (
            <div
              key={berth.id}
              className="mb-6 pb-6 border-b last:border-b-0 last:mb-0 last:pb-0"
            >
              <h3 className="font-medium mb-3">
                {t("berthNumber", { number: index + 1 })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableField
                  label={f.berthNameTh}
                  value={berth.berthNameTh}
                  onChange={(v) => updateBerth(index, "berthNameTh", v)}
                />
                <EditableField
                  label={f.berthNameEn}
                  value={berth.berthNameEn}
                  onChange={(v) => updateBerth(index, "berthNameEn", v)}
                />
                <EditableField
                  label={f.purposeType}
                  value={berth.purposeTypeName}
                  onChange={(v) => updateBerth(index, "purposeTypeName", v)}
                />
                <EditableField
                  label={f.purpose}
                  value={berth.purposeName}
                  onChange={(v) => updateBerth(index, "purposeName", v)}
                />
                <DateTimeField
                  label={f.estimatedArrival}
                  value={berth.estimatedArrival}
                  onChange={(v) => updateBerth(index, "estimatedArrival", v)}
                />
                <DateTimeField
                  label={f.estimatedDeparture}
                  value={berth.estimatedDeparture}
                  onChange={(v) => updateBerth(index, "estimatedDeparture", v)}
                />
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
