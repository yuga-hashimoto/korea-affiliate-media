import type { ReactNode } from "react";

type Tone = "brand" | "amber" | "slate" | "red" | "green";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-800 border-brand-200",
  amber: "bg-amber-50 text-amber-900 border-amber-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
  red: "bg-red-50 text-red-800 border-red-200",
  green: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

export function Badge({
  children,
  tone = "slate",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
