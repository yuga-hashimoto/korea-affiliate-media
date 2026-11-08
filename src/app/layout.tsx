import type { Metadata } from "next";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  SITE,
  ga4MeasurementId,
  indexingEnabled,
  siteUrl,
} from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name}｜ソウル・釜山・済州の旅行ガイド`,
    template: `%s｜${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  referrer: "strict-origin-when-cross-origin",
  robots: indexingEnabled()
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE.name,
    title: `${SITE.name}｜ソウル・釜山・済州の旅行ガイド`,
    description: SITE.description,
    url: siteUrl(),
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "韓国旅行ノート｜ソウル・釜山・済州の旅行ガイド",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.xHandle,
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const ga4 = ga4MeasurementId();
  return (
    <html lang="ja">
      <head>
        {/* Impact.com（Airalo）のサイト所有権確認用。値は公開情報。 */}
        <meta
          name="impact-site-verification"
          content="4bf80c31-5629-48ea-9cdb-e8e521d001b6"
          {...{ value: "4bf80c31-5629-48ea-9cdb-e8e521d001b6" }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          本文へスキップ
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {ga4 ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}',{anonymize_ip:true});`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
