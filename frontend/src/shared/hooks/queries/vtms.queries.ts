import { useQuery } from "@tanstack/react-query";
import { vtmsService } from "@/services/vtms.service";
import {
  AnchorDetailResponse,
  AnchorListResponse,
  DocumentDetailResponse,
  DocumentListResponse,
  LogBookDetailResponse,
  LogBookListResponse,
} from "@/types/vtms.types";
import type { QueryOpts } from "@/types/query.types";
import type { QueryParamValue } from "@/shared/utils/query-params";
import { queryKeys } from "./query-keys";
import { isValidId } from "./query.utils";

type Params = Record<string, QueryParamValue>;

export const useVtmsGetDocumentList = (
  params?: Params,
  options?: QueryOpts<
    DocumentListResponse,
    ReturnType<typeof queryKeys.vtms.documentList>
  >
) =>
  useQuery({
    queryKey: queryKeys.vtms.documentList(params),
    queryFn: () => vtmsService.getDocumentList(params),
    ...options,
  });

export const useVtmsGetAnchorList = (
  params?: Params,
  options?: QueryOpts<
    AnchorListResponse,
    ReturnType<typeof queryKeys.vtms.anchorList>
  >
) =>
  useQuery({
    queryKey: queryKeys.vtms.anchorList(params),
    queryFn: () => vtmsService.getAnchorList(params),
    ...options,
  });

export const useVtmsGetLogBookList = (
  params?: Params,
  options?: QueryOpts<
    LogBookListResponse,
    ReturnType<typeof queryKeys.vtms.logBookList>
  >
) =>
  useQuery({
    queryKey: queryKeys.vtms.logBookList(params),
    queryFn: () => vtmsService.getLogBookList(params),
    ...options,
  });

export const useVtmsGetDocumentDetail = (
  id: string | number,
  options?: QueryOpts<
    DocumentDetailResponse,
    ReturnType<typeof queryKeys.vtms.documentDetail>
  >
) =>
  useQuery({
    queryKey: queryKeys.vtms.documentDetail(id),
    queryFn: () => vtmsService.getDocumentDetail(id),
    enabled: isValidId(id),
    ...options,
  });

export const useVtmsGetAnchorDetail = (
  id: string | number,
  options?: QueryOpts<
    AnchorDetailResponse,
    ReturnType<typeof queryKeys.vtms.anchorDetail>
  >
) =>
  useQuery({
    queryKey: queryKeys.vtms.anchorDetail(id),
    queryFn: () => vtmsService.getAnchorDetail(id),
    enabled: isValidId(id),
    ...options,
  });

export const useVtmsGetLogBookDetail = (
  id: string | number,
  options?: QueryOpts<
    LogBookDetailResponse,
    ReturnType<typeof queryKeys.vtms.logBookDetail>
  >
) =>
  useQuery({
    queryKey: queryKeys.vtms.logBookDetail(id),
    queryFn: () => vtmsService.getLogBookDetail(id),
    enabled: isValidId(id),
    ...options,
  });
