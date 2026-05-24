const required = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const optional = (value: string | undefined): string | undefined =>
  value && value.length > 0 ? value : undefined;

export const env = {
  NEXT_PUBLIC_API_URL: required(
    "NEXT_PUBLIC_API_URL",
    process.env.NEXT_PUBLIC_API_URL
  ),
  NEXT_PUBLIC_SITE_URL: optional(process.env.NEXT_PUBLIC_SITE_URL),
  NODE_ENV: process.env.NODE_ENV ?? "development",
} as const;
