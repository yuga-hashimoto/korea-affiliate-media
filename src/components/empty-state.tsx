export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
      <p className="font-semibold text-slate-800">{title}</p>
      <div className="mt-2 text-sm leading-6 text-slate-600">{children}</div>
      <p className="mt-3 text-xs text-slate-500">
        価格情報が確認できない間は、推測値を表示しません。UNKNOWNは「0円」ではありません。
      </p>
    </div>
  );
}
