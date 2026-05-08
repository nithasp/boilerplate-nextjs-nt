export const formatDate = (
  dateString: string,
  locale: string = "en-GB",
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return date.toLocaleDateString(locale, options || defaultOptions);
};

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_COLORS = {
  document: {
    Approved: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800",
  },
  vessel: {
    Berth: "bg-blue-100 text-blue-800",
    PendingBerth: "bg-yellow-100 text-yellow-800",
  },
  anchor: {
    anchored: "bg-blue-100 text-blue-800",
    aweigh: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    departing: "bg-yellow-100 text-yellow-800",
  },
  logBook: {
    arrival: "bg-green-100 text-green-800",
    departure: "bg-blue-100 text-blue-800",
    mooring: "bg-yellow-100 text-yellow-800",
  },
} as const;

const FALLBACK_COLOR = "bg-gray-100 text-gray-800";

export const getStatusColor = (status: string): string =>
  STATUS_COLORS.document[status as keyof typeof STATUS_COLORS.document] ??
  FALLBACK_COLOR;

export const getVesselStatusColor = (status: string): string =>
  STATUS_COLORS.vessel[status as keyof typeof STATUS_COLORS.vessel] ??
  FALLBACK_COLOR;

export const getAnchorShipStatusColor = (status: string): string =>
  STATUS_COLORS.anchor[
    status?.toLowerCase() as keyof typeof STATUS_COLORS.anchor
  ] ?? FALLBACK_COLOR;

export const getLogBookStatusColor = (status: string): string =>
  STATUS_COLORS.logBook[
    status?.toLowerCase() as keyof typeof STATUS_COLORS.logBook
  ] ?? FALLBACK_COLOR;
