export type QueryParamValue = string | number | boolean | null | undefined;

export const buildQueryString = (
  params: Record<string, QueryParamValue>
): string => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};
