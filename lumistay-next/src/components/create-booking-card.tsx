import Link from "next/link";
import { ArrowRight, BedDouble, CalendarCheck, UserRoundCheck } from "lucide-react";

const checks = [
  { label: "Hồ sơ khách", detail: "Xác nhận CCCD và số điện thoại", href: "/customers", icon: UserRoundCheck },
  { label: "Phòng sẵn sàng", detail: "Chỉ chọn phòng trống và sạch", href: "/rooms", icon: BedDouble },
  { label: "Ngày lưu trú", detail: "Kiểm tra ngày đến và ngày đi", href: "/rooms", icon: CalendarCheck },
];

export function CreateBookingCard() {
  return (
    <aside className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]">
      <div className="border-b border-[#D8D2C7] px-4 py-3.5"><h2 className="text-[15px] font-bold text-[#183B35]">Trước khi tạo đặt phòng</h2><p className="mt-1 text-xs leading-5 text-[#81796D]">Ba bước kiểm tra nhanh để tránh trùng phòng.</p></div>
      <div className="divide-y divide-[#E7E1D7]">
        {checks.map((item) => { const Icon = item.icon; return <Link key={item.label} href={item.href} className="group flex items-center gap-3 px-4 py-3 transition hover:bg-[#F7F1E7]"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#E7EEEA] text-[#183B35]"><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-[#25322D]">{item.label}</span><span className="block text-[11px] text-[#81796D]">{item.detail}</span></span><ArrowRight className="h-3.5 w-3.5 text-[#9A9286] transition group-hover:translate-x-0.5 group-hover:text-[#9A6A2F]" /></Link>; })}
      </div>
    </aside>
  );
}
