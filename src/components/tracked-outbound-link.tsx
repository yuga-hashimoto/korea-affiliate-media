"use client";

import type { ReactNode } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function TrackedOutboundLink({
  href,
  isAffiliate,
  programId,
  articleSlug,
  className,
  children,
}: {
  href: string;
  isAffiliate: boolean;
  programId: string;
  articleSlug: string | null;
  className?: string;
  children: ReactNode;
}) {
  const handleClick = () => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "outbound_click", {
      program_id: programId,
      article_slug: articleSlug,
      affiliate: isAffiliate,
    });
    if (isAffiliate) {
      window.gtag("event", "affiliate_click", {
        program_id: programId,
        article_slug: articleSlug,
      });
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel={isAffiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
