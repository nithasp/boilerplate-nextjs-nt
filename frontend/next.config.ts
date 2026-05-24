import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true, // Keep enabled for better development experience
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pmis-apidev.wisdomcloud.net',
        pathname: '/data/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
