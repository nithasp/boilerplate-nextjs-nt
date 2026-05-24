import type { UseQueryOptions } from "@tanstack/react-query";

export type QueryOpts<TData, TKey extends readonly unknown[]> = Omit<
  UseQueryOptions<TData, unknown, TData, TKey>,
  "queryKey" | "queryFn"
>;
