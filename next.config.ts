import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Flag images — used for country pills and country cards
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
