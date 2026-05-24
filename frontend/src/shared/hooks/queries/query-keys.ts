import type { QueryParamValue } from "@/shared/utils/query-params";

type Params = Record<string, QueryParamValue>;

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
  },
  documents: {
    all: ["documents"] as const,
    list: (params?: Params) => ["documents", "list", params ?? {}] as const,
    draft: () => ["documents", "draft"] as const,
    vesselDocVesselList: () => ["documents", "vessel-doc-vessel"] as const,
    aisLogs: () => ["documents", "ais-logs"] as const,
  },
  vtms: {
    all: ["vtms"] as const,
    documentList: (params?: Params) =>
      ["vtms", "document-list", params ?? {}] as const,
    anchorList: (params?: Params) =>
      ["vtms", "anchor-list", params ?? {}] as const,
    logBookList: (params?: Params) =>
      ["vtms", "log-book-list", params ?? {}] as const,
    documentDetail: (id: string | number) =>
      ["vtms", "document-detail", String(id)] as const,
    anchorDetail: (id: string | number) =>
      ["vtms", "anchor-detail", String(id)] as const,
    logBookDetail: (id: string | number) =>
      ["vtms", "log-book-detail", String(id)] as const,
  },
  todos: {
    all: ["todos"] as const,
    list: () => ["todos", "list"] as const,
    detail: (id: string | number) => ["todos", "detail", String(id)] as const,
  },
  advancedProducts: {
    all: ["advanced-products"] as const,
    list: () => ["advanced-products", "list"] as const,
    detail: (id: string | number) =>
      ["advanced-products", "detail", String(id)] as const,
  },
  cart: {
    all: ["cart"] as const,
    list: () => ["cart", "list"] as const,
  },
} as const;
