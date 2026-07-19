import type { Stat } from "@/lib/types";
import { cn } from "@/lib/utils";

const toneMap = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warn: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  neutral: "border-blue-200 bg-blue-50 text-blue-700",
};

const barMap = { good: "bg-emerald-500", warn: "bg-amber-500", danger: "bg-rose-500", neutral: "bg-blue-500" };

export function StatCard({ stat }: { stat: Stat }) {
  const tone = stat.tone ?? "neutral";
  return (
    <article className="ops-card relative overflow-hidden p-4 sm:p-5">
      <span className={cn("absolute inset-x-0 top-0 h-1", barMap[tone])} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><p className="text-xs font-medium text-slate-500">{stat.label}</p><p className="mt-1 text-2xl font-bold tracking-tight tabular-nums text-slate-950">{stat.value}</p></div>
        {stat.trend ? <span className={cn("whitespace-nowrap rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide", toneMap[tone])}>{stat.trend}</span> : null}
      </div>
      <p className="mt-2 truncate text-xs text-slate-400">{stat.hint}</p>
    </article>
  );
}
