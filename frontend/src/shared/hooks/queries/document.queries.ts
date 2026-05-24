import { useQuery } from "@tanstack/react-query";
import { documentService } from "@/services/document.service";
import { DocumentListResponse } from "@/types/vtms.types";
import type { QueryOpts } from "@/types/query.types";
import type { QueryParamValue } from "@/shared/utils/query-params";
import { queryKeys } from "./query-keys";

type Params = Record<string, QueryParamValue>;

export const useGetDocumentList = (
  params?: Params,
  options?: QueryOpts<
    DocumentListResponse,
    ReturnType<typeof queryKeys.documents.list>
  >
) =>
  useQuery({
    queryKey: queryKeys.documents.list(params),
    queryFn: () => documentService.getDocumentList(params),
    ...options,
  });

export const useGetDraft = <T = unknown>(
  options?: QueryOpts<T, ReturnType<typeof queryKeys.documents.draft>>
) =>
  useQuery({
    queryKey: queryKeys.documents.draft(),
    queryFn: () => documentService.getDraft<T>(),
    ...options,
  });

export const useGetVesselDocVesselList = <T = unknown>(
  options?: QueryOpts<
    T,
    ReturnType<typeof queryKeys.documents.vesselDocVesselList>
  >
) =>
  useQuery({
    queryKey: queryKeys.documents.vesselDocVesselList(),
    queryFn: () => documentService.getVesselDocVesselList<T>(),
    ...options,
  });

export const useGetAisLogs = <T = unknown>(
  options?: QueryOpts<T, ReturnType<typeof queryKeys.documents.aisLogs>>
) =>
  useQuery({
    queryKey: queryKeys.documents.aisLogs(),
    queryFn: () => documentService.getAisLogs<T>(),
    ...options,
  });
