import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <p className="text-sm font-bold text-brand-700">404</p>
      <h1 className="mt-2 text-3xl">ページが見つかりません</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
        掲載が終了したページ、またはURLが変更された可能性があります。
        下記から目的のページをお探しください。
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white no-underline"
        >
          トップへ
        </Link>
        <Link
          href="/articles"
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 no-underline"
        >
          記事一覧へ
        </Link>
      </div>
    </div>
  );
}
