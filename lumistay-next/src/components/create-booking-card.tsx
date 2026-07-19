import Link from "next/link";
import { ArrowRight, BedDouble, CalendarCheck, UserRoundCheck } from "lucide-react";

const checks = [
  { label: "Hồ sơ khách", detail: "Xác nhận CCCD và số điện thoại", href: "/customers", icon: UserRoundCheck },
  { label: "Phòng sẵn sàng", detail: "Trạng thái Trống và buồng Sạch", href: "/rooms", icon: BedDouble },
  { label: "Thời gian lưu trú", detail: "Kiểm tra ngày đến và ngày đi", href: "/rooms", icon: CalendarCheck },
];

export function CreateBookingCard() {
  return (
    <aside className="ops-card p-5">
      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ops-accent">Kiểm tra trước khi đặt</p>
        <h2 className="mt-1 text-base font-bold text-slate-900">Điều kiện tạo booking</h2>
        <p className="mt-1 text-sm text-slate-500">Hoàn tất ba bước kiểm tra để tránh trùng phòng.</p>
      </div>
      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
        {checks.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link key={`${item.label}-${index}`} href={item.href} className="group flex items-center gap-3 p-3.5 transition hover:bg-slate-50">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-ops-primary"><Icon className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-800">{item.label}</span><span className="block text-xs text-slate-500">{item.detail}</span></span>
              <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-ops-primary" />
            </Link>
          );
        })}
      </div>
      <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2.5">
        <p className="font-mono text-[10px] font-semibold text-slate-500">AUDIT: USP_TIM_PHONG_TRONG_THEO_LOAI_P → USP_DAT_PHONG</p>
      </div>
    </aside>
  );
}
