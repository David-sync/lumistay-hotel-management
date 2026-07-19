"use client";

import { useMemo, useState } from "react";
import type { Booking } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OperationButton, type OperationAction } from "./operation-button";
import { StatusBadge } from "./status-badge";

const actionByStatus: Partial<Record<Booking["trangThai"], { action: OperationAction; label: string }>> = {
  "Chờ nhận phòng": { action: "check-in", label: "Nhận phòng" },
  "Đã nhận phòng": { action: "create-invoice", label: "Lập hóa đơn" },
};

const statuses = ["Tất cả", "Chờ nhận phòng", "Đã nhận phòng", "Chờ trả phòng", "Đã hủy"] as const;

export function BookingTable({ bookings }: { bookings: Booking[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Booking["trangThai"] | "Tất cả">("Tất cả");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesStatus = status === "Tất cả" || booking.trangThai === status;
      const matchesQuery = !normalized || [booking.maSo, booking.khachHang, booking.soDienThoai, String(booking.soPhong)].some((value) => value.toLowerCase().includes(normalized));
      return matchesStatus && matchesQuery;
    });
  }, [bookings, query, status]);

  return (
    <section className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]">
      <div className="flex flex-col gap-3 border-b border-[#D8D2C7] px-4 py-3.5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div><h2 className="text-[15px] font-bold text-[#183B35]">Sổ đặt phòng</h2><p className="mt-0.5 text-xs text-[#81796D]">{filtered.length} / {bookings.length} hồ sơ</p></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="booking-search">Tìm đặt phòng</label>
          <input id="booking-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên, mã hoặc phòng" className="h-8 w-full rounded-[4px] border border-[#CFC8BC] bg-white px-2.5 text-xs text-[#25322D] outline-none placeholder:text-[#9A9286] focus:border-[#183B35] sm:w-52" />
          <label className="sr-only" htmlFor="booking-status">Lọc trạng thái</label>
          <select id="booking-status" value={status} onChange={(event) => setStatus(event.target.value as Booking["trangThai"] | "Tất cả")} className="h-8 rounded-[4px] border border-[#CFC8BC] bg-white px-2 text-xs text-[#25322D] outline-none focus:border-[#183B35]">{statuses.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-[12px]">
          <thead className="border-b border-[#D8D2C7] bg-[#F0EDE7] text-[10px] font-bold uppercase tracking-wide text-[#716B61]">
            <tr><th scope="col" className="px-4 py-2.5">Booking</th><th scope="col" className="px-4 py-2.5">Khách</th><th scope="col" className="px-4 py-2.5">Phòng</th><th scope="col" className="px-4 py-2.5">Lưu trú</th><th scope="col" className="px-4 py-2.5 text-right">Dự kiến</th><th scope="col" className="px-4 py-2.5">Trạng thái</th><th scope="col" className="px-4 py-2.5">Xử lý</th></tr>
          </thead>
          <tbody className="divide-y divide-[#E7E1D7] bg-[#FBFAF7]">
            {filtered.map((booking) => {
              const operation = actionByStatus[booking.trangThai];
              return <tr key={booking.maSo} className="align-middle transition hover:bg-[#F7F1E7]">
                <td className="px-4 py-3"><p className="font-bold text-[#183B35]">{booking.maSo}</p><p className="mt-0.5 text-[10px] text-[#81796D]">Cọc {formatCurrency(booking.tienCoc)}</p></td>
                <td className="px-4 py-3"><p className="font-semibold text-[#25322D]">{booking.khachHang}</p><p className="mt-0.5 text-[10px] text-[#81796D]">{booking.soDienThoai || "Chưa có SĐT"}</p></td>
                <td className="px-4 py-3"><p className="font-semibold text-[#25322D]">{booking.soPhong}</p><p className="mt-0.5 text-[10px] text-[#81796D]">{booking.loaiPhong}</p></td>
                <td className="px-4 py-3 text-[#4E5852]"><p>{formatDate(booking.ngayDen)} – {formatDate(booking.ngayDi)}</p><p className="mt-0.5 text-[10px] text-[#81796D]">{booking.nextAction}</p></td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-[#25322D]">{formatCurrency(booking.tongDuKien)}</td>
                <td className="px-4 py-3"><StatusBadge status={booking.trangThai} /></td>
                <td className="px-4 py-3">{operation ? <OperationButton action={operation.action} identifier={booking.maSo} label={operation.label} /> : <span className="text-[11px] text-[#9A9286]">—</span>}</td>
              </tr>;
            })}
            {filtered.length === 0 ? <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-[#81796D]">Không có booking phù hợp.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
