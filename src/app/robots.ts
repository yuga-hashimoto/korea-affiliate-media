import type { MetadataRoute } from "next";
import { indexingEnabled, siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (!indexingEnabled()) {
    // Preview / ステージングでは全面 noindex。
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
