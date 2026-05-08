export const siteConfig = {
  name: "PMIS Boilerplate",
  shortName: "PMIS",
  description:
    "Port Management Information System boilerplate built with Next.js App Router.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/opengraph-image.png",
  locale: "en-US",
  authors: [{ name: "PMIS Team" }],
} as const;
