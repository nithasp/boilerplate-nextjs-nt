import api from "@/lib/axios";
import {
  buildQueryString,
  type QueryParamValue,
} from "@/shared/utils/query-params";
import {
  AnchorDetailResponse,
  AnchorListResponse,
  DocumentDetailResponse,
  DocumentListResponse,
  LogBookDetailResponse,
  LogBookListResponse,
} from "@/types/vtms.types";

type Params = Record<string, QueryParamValue>;
type Id = string | number;

const getList = async <T>(url: string, params?: Params) => {
  const { data } = await api.get<T>(
    `${url}${params ? buildQueryString(params) : ""}`
  );
  return data;
};

const getById = async <T>(url: string, id: Id) => {
  const { data } = await api.get<T>(`${url}/${id}`);
  return data;
};

export const vtmsService = {
  getDocumentList: (params?: Params) =>
    getList<DocumentListResponse>("/admin/documents", params),

  getAnchorList: (params?: Params) =>
    getList<AnchorListResponse>("/admin/vtms/anchor", params),

  getLogBookList: (params?: Params) =>
    getList<LogBookListResponse>("/admin/vtms/log-book", params),

  getDocumentDetail: (id: Id) =>
    getById<DocumentDetailResponse>("/admin/documents", id),

  getAnchorDetail: (id: Id) =>
    getById<AnchorDetailResponse>("/admin/vtms/anchor", id),

  getLogBookDetail: (id: Id) =>
    getById<LogBookDetailResponse>("/admin/vtms/log-book", id),
};

export default vtmsService;
