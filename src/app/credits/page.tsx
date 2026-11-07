import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "画像クレジット",
  description:
    "韓国旅行ノートで使用している写真の出典とライセンス（CC0）を掲載します。",
  alternates: { canonical: "/credits" },
};

const credits = [
  {
    use: "トップページ（漢江・ソウル）",
    file: "hero-seoul.jpg",
    author: "USAGI_POST",
    source:
      "https://commons.wikimedia.org/wiki/File:Han_River_Seoul_skyline_Pixabay_1214950.jpg",
  },
  {
    use: "ソウル（明洞）",
    file: "seoul.jpg",
    author: "lumoplank",
    source:
      "https://commons.wikimedia.org/wiki/File:Myeongdong,_Seoul_-_Myeongdong3165.jpg",
  },
  {
    use: "釜山（市街）",
    file: "busan.jpg",
    author: "Hoil Ryu ckhi",
    source:
      "https://commons.wikimedia.org/wiki/File:Busan_Tower_cityscape_(Unsplash).jpg",
  },
  {
    use: "済州（海岸）",
    file: "jeju.jpg",
    author: "lumoplank",
    source:
      "https://commons.wikimedia.org/wiki/File:Beaches_of_Jeju_-_JejuBeaches2458.jpg",
  },
  {
    use: "グルメ",
    file: "korean-food.jpg",
    author: "Syced",
    source:
      "https://commons.wikimedia.org/wiki/File:Korean_food_at_Tteokbokki_restaurant_in_Shin-Okubo.jpg",
  },
];

export default function CreditsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Credits"
        title="画像クレジット"
        lead="本サイトの写真は、Wikimedia Commons で CC0（パブリックドメイン）として公開されている素材を使用しています。"
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/credits", label: "画像クレジット" }]} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-[#efdfd3] text-xs text-slate-600">
                <th scope="col" className="px-3 py-3">用途</th>
                <th scope="col" className="px-3 py-3">作者</th>
                <th scope="col" className="px-3 py-3">ライセンス</th>
                <th scope="col" className="px-3 py-3">出典</th>
              </tr>
            </thead>
            <tbody>
              {credits.map((credit) => (
                <tr key={credit.file} className="border-b border-[#efdfd3] align-top">
                  <td className="px-3 py-3">{credit.use}</td>
                  <td className="px-3 py-3">{credit.author}</td>
                  <td className="px-3 py-3">CC0</td>
                  <td className="px-3 py-3">
                    <a
                      href={credit.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-brand-700 underline"
                    >
                      Wikimedia Commons
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-xs leading-6 text-slate-600">
          画像はトリミング・リサイズのみ行っています。人物が特定できる写真や、店舗の商品写真は使用していません。
        </p>
      </div>
    </>
  );
}
