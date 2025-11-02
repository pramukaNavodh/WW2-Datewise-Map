import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // ADD THIS: Block Grammarly & prevent hydration mismatch
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Grammarly-Disabled",
            value: "true",
          },
        ],
      },
    ];
  },

  // OPTIONAL: Suppress known extension attributes during hydration (Next.js 13.4+)
  experimental: {
    // Uncomment if you're on Next.js >= 13.4 and want extra safety
    // ignoreDuringHydration: [
    //   "data-new-gr-c-s-check-loaded",
    //   "data-gr-ext-installed",
    // ],
  },
};

export default nextConfig;