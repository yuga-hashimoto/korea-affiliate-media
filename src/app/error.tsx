"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] unhandled error", { digest: error.digest });
  }, [error]);

  return (
    <div className="container-page py-20 text-center">
      <p className="text-sm font-bold text-amber-700">ERROR</p>
      <h1 className="mt-2 text-3xl">表示中に問題が発生しました</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
        一時的なエラーの可能性があります。再読み込みしても解決しない場合は、
        しばらく時間をおいてからアクセスしてください。
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
        >
          再読み込み
        </button>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 no-underline"
        >
          トップへ
        </Link>
      </div>
    </div>
  );
}
