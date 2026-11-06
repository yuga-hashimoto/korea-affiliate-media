import type { NextConfig } from "next";

/**
 * セキュリティヘッダーと画像設定。
 * 本番ドメイン切替は未承認のため、canonical は環境変数で切り替える。
 */
const nextConfig: NextConfig = {
  // E2E などでビルド成果物を分離する（dev/preview との競合防止）
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // 商品画像の利用許諾が未確認のため、外部画像の最適化は有効化しない。
    remotePatterns: [],
  },
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
};

export default nextConfig;
