export function DisclosureNote({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={`rounded-2xl border border-[#efdfd3] bg-paper px-3 py-2.5 text-[11px] leading-5 text-slate-600 sm:px-4 sm:py-3 sm:text-xs sm:leading-6 ${
        compact ? "" : "mt-4"
      }`}
    >
      <span className="font-semibold text-brand-700">広告について：</span>
      当サイトはアフィリエイト広告を利用する場合があります。記事内容・紹介する場所は編集部の判断で作成し、報酬額によって内容を変更しません。
      提携が承認されていない事業者へのリンクは、公式ページへの通常リンクとして表示しています。
    </p>
  );
}
