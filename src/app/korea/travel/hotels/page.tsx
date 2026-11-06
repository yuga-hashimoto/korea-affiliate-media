import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { CATEGORY_META } from "@/lib/categories";

const meta = CATEGORY_META.hotel;

export const metadata: Metadata = {
  title: `${meta.label}ガイド｜ソウルのホテル選び`,
  description: meta.description,
  alternates: { canonical: meta.href },
};

export default function Page() {
  return (
    <CategoryPage
      category="hotel"
      extraLinks={[
        { href: "/articles/myeongdong-guide", label: "明洞の歩き方｜泊まるなら" },
        { href: "/articles/hongdae-guide", label: "弘大エリアガイド" },
      ]}
    />
  );
}
