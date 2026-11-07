import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

/**
 * 通常は Next.js サーバーで動作し、Cloudflare Pages へ配信するときは
 * STATIC_EXPORT=true で静的書き出し（out/）を行う。
 */
const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        images: { remotePatterns: [] },
      }),
  poweredByHeader: false,
  reactStrictMode: true,
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=(), payment=()",
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
