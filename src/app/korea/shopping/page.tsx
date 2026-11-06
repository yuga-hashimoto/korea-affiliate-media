import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { CATEGORY_META } from "@/lib/categories";

const meta = CATEGORY_META["shopping"];

export const metadata: Metadata = {
  title: `${meta.label}`,
  description: meta.description,
  alternates: { canonical: meta.href },
};

export default function Page() {
  return <CategoryPage category="shopping" />;
}
