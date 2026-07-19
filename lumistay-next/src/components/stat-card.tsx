import type { Stat } from "@/lib/types";
import { cn } from "@/lib/utils";

const toneMap = {
  good: "border-[#BBD2C1] bg-[#EFF6F0] text-[#356B4C]",
  warn: "border-[#E4CBA4] bg-[#FBF4E8] text-[#9A6A2F]",
  danger: "border-[#E3BFB7] bg-[#FBEEEB] text-[#A34E3E]",
  neutral: "border-[#C8D8D0] bg-[#EEF4F0] text-[#183B35]",
};

export function StatCard({ stat }: { stat: Stat }) {
  const tone = stat.tone ?? "neutral";
  return <article className="relative overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7] p-3"><span className={cn("absolute inset-x-0 top-0 h-0.5", tone === "good" ? "bg-[#4D805C]" : tone === "warn" ? "bg-[#9A6A2F]" : tone === "danger" ? "bg-[#A34E3E]" : "bg-[#183B35]")} /><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-[11px] font-medium text-[#716B61]">{stat.label}</p><p className="mt-1 text-xl font-bold tracking-tight tabular-nums text-[#183B35]">{stat.value}</p></div>{stat.trend ? <span className={cn("whitespace-nowrap rounded-[3px] border px-1.5 py-0.5 text-[9px] font-bold", toneMap[tone])}>{stat.trend}</span> : null}</div><p className="mt-1.5 truncate text-[11px] text-[#81796D]">{stat.hint}</p></article>;
}
