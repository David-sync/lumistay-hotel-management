import { cn, statusTone } from "@/lib/utils";

function dotTone(status: string) {
  if (status === "Trống" || status === "Đã thanh toán") return "bg-emerald-500";
  if (status === "Đang thuê" || status === "Đã nhận phòng") return "bg-sky-500";
  if (status === "Đã đặt" || status === "Chờ nhận phòng") return "bg-amber-500";
  if (status === "Chờ trả phòng" || status === "Chưa thanh toán") return "bg-rose-500";
  return "bg-slate-400";
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold", statusTone(status), className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotTone(status))} aria-hidden="true" />
      {status}
    </span>
  );
}
