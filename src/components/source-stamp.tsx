import { formatJstDateTime } from "@/lib/dates";
import type { SourceEvidence } from "@/lib/domain";

export function SourceStamp({
  evidence,
  stale = false,
}: {
  evidence: SourceEvidence;
  stale?: boolean;
}) {
  return (
    <div className="mt-2 text-xs leading-5 text-slate-500">
      <span className="font-semibold text-slate-600">出典:</span>{" "}
      <a
        href={evidence.sourceUrl}
        rel="noopener noreferrer nofollow"
        target="_blank"
        className="break-all text-brand-700"
      >
        {evidence.sourceUrl}
      </a>
      <span className="mx-1">/</span>
      確認日時: <time dateTime={evidence.checkedAt}>{formatJstDateTime(evidence.checkedAt)}</time>
      {evidence.sample ? (
        <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-900">
          SAMPLE
        </span>
      ) : null}
      {stale ? (
        <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 font-semibold text-red-800">
          要再確認
        </span>
      ) : null}
      {evidence.note ? <p className="mt-1 text-slate-500">{evidence.note}</p> : null}
    </div>
  );
}
