import api from "@/lib/axios";
import {
  buildQueryString,
  type QueryParamValue,
} from "@/shared/utils/query-params";
import { DocumentListResponse } from "@/types/vtms.types";

type Params = Record<string, QueryParamValue>;

export const documentService = {
  getDocumentList: async (params?: Params) => {
    const { data } = await api.get<DocumentListResponse>(
      `/admin/documents${params ? buildQueryString(params) : ""}`,
    );
    return data;
  },

  getDraft: async <T = unknown>() => {
    const { data } = await api.get<T>("/admin/documents/draft");
    return data;
  },

  getVesselDocVesselList: async <T = unknown>() => {
    const { data } = await api.get<T>("/admin/documents/vessel/1");
    return data;
  },

  getAisLogs: async <T = unknown>() => {
    const { data } = await api.get<T>("/admin/ais/logs");
    return data;
  },
};

export default documentService;
