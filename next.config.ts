import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Claude's preview server sets NEXT_DIST_DIR so it builds into its own folder.
  // Two `next dev` processes sharing one .next folder corrupt each other's cache.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      {
        // Flag images (country filter chips, office cards)
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
  },
  // The page used to live at /capabilities. Keep old links and search results working
  // in every language (English has no prefix, Spanish and Chinese do).
  async redirects() {
    return [
      { source: "/capabilities", destination: "/client-impact", permanent: true },
      { source: "/capabilities/:slug*", destination: "/client-impact/:slug*", permanent: true },
      { source: "/:locale(es|zh)/capabilities", destination: "/:locale/client-impact", permanent: true },
      {
        source: "/:locale(es|zh)/capabilities/:slug*",
        destination: "/:locale/client-impact/:slug*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
