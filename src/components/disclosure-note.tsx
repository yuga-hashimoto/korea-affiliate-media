export function DisclosureNote({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={`rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 ${
        compact ? "" : "mt-4"
      }`}
    >
      <span className="font-semibold text-slate-700">広告について：</span>
      当サイトはアフィリエイト広告を利用する場合があります。掲載順位は、総額・条件・確認日時などの比較結果に基づき、報酬額では決定しません。
      提携が承認されていない事業者へのリンクは、公式ページへの通常リンクとして表示しています。
    </p>
  );
}
