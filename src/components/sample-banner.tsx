import { Badge } from "./badge";

export function SampleBanner() {
  return (
    <div
      role="note"
      className="mb-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="amber">SAMPLE</Badge>
        <p className="font-semibold">このページの価格・クーポンは表示検証用のサンプルです</p>
      </div>
      <p className="mt-2 leading-6">
        実在の企業の販売価格ではありません。公開時には、提携・引用が許可された公式情報と確認日時に置き換えます。
        未確認の項目は 0 円にせず UNKNOWN と表示し、確定した「最安」とは書きません。
      </p>
    </div>
  );
}
