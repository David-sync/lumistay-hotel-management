import type { Booking } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OperationButton, type OperationAction } from "./operation-button";
import { StatusBadge } from "./status-badge";

const actionByStatus: Partial<Record<Booking["trangThai"], { action: OperationAction; label: string; procedure: string }>> = {
  "Chờ nhận phòng": { action: "check-in", label: "Nhận phòng", procedure: "USP_NHAN_PHONG" },
  "Đã nhận phòng": { action: "create-invoice", label: "Lập hóa đơn", procedure: "USP_LAP_HOA_DON" },
};

export function BookingTable({ bookings }: { bookings: Booking[] }) {
  return (
    <section className="ops-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Danh sách đặt phòng</h2>
          <p className="mt-0.5 text-xs text-slate-500">{bookings.length} hồ sơ trong hàng đợi vận hành</p>
        </div>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-semibold text-slate-500">BOOKING · CTBK</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-5 py-3">Mã booking</th>
              <th scope="col" className="px-5 py-3">Khách hàng</th>
              <th scope="col" className="px-5 py-3">Phòng</th>
              <th scope="col" className="px-5 py-3">Lưu trú</th>
              <th scope="col" className="px-5 py-3 text-right">Tiền cọc</th>
              <th scope="col" className="px-5 py-3">Trạng thái</th>
              <th scope="col" className="px-5 py-3">Xử lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {bookings.map((booking) => {
              const operation = actionByStatus[booking.trangThai];
              return (
                <tr key={booking.maSo} className="align-top transition hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{booking.maSo}</p>
                    <p className="mt-1 font-mono text-[10px] text-slate-400">{operation?.procedure || booking.procedure}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{booking.khachHang}</p>
                    <p className="mt-1 text-xs text-slate-500">{booking.soDienThoai || "Chưa có SĐT"}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">Phòng {booking.soPhong}</p>
                    <p className="mt-1 text-xs text-slate-500">{booking.loaiPhong}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    <p>{formatDate(booking.ngayDen)} – {formatDate(booking.ngayDi)}</p>
                    <p className="mt-1 text-xs text-slate-500">Dự kiến {formatCurrency(booking.tongDuKien)}</p>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums text-slate-800">{formatCurrency(booking.tienCoc)}</td>
                  <td className="px-5 py-4"><StatusBadge status={booking.trangThai} /></td>
                  <td className="px-5 py-4">
                    {operation ? (
                      <OperationButton action={operation.action} identifier={booking.maSo} label={operation.label} />
                    ) : (
                      <span className="text-xs text-slate-400">Không có thao tác</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {bookings.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">Không có booking cần hiển thị.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
