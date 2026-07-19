import { cn } from "@/lib/utils";

function badgeTone(status: string) {
  if (status === "Trống" || status === "Đã thanh toán") return "border-[#BBD2C1] bg-[#EFF6F0] text-[#356B4C]";
  if (status === "Đang thuê" || status === "Đã nhận phòng") return "border-[#BCD6D1] bg-[#EEF5F3] text-[#28635D]";
  if (status === "Đã đặt" || status === "Chờ nhận phòng") return "border-[#E4CBA4] bg-[#FBF4E8] text-[#9A6A2F]";
  if (status === "Chờ trả phòng" || status === "Chưa thanh toán") return "border-[#E3BFB7] bg-[#FBEEEB] text-[#A34E3E]";
  return "border-[#D8D2C7] bg-[#F0EDE7] text-[#716B61]";
}

function dotTone(status: string) {
  if (status === "Trống" || status === "Đã thanh toán") return "bg-[#4D805C]";
  if (status === "Đang thuê" || status === "Đã nhận phòng") return "bg-[#2D6964]";
  if (status === "Đã đặt" || status === "Chờ nhận phòng") return "bg-[#B27B32]";
  if (status === "Chờ trả phòng" || status === "Chưa thanh toán") return "bg-[#A34E3E]";
  return "bg-[#8B887F]";
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-[4px] border px-2 py-0.5 text-[10px] font-bold", badgeTone(status), className)}><span className={cn("h-1.5 w-1.5 rounded-full", dotTone(status))} />{status}</span>;
}
