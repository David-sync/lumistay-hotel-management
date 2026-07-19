import type { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OperationButton, type OperationAction } from "./operation-button";
import { StatusBadge } from "./status-badge";

const actionByStatus: Partial<Record<Invoice["trangThai"], { action: OperationAction; label: string; procedure: string }>> = {
  "Chưa thanh toán": { action: "pay", label: "Thanh toán", procedure: "USP_THANH_TOAN_HD" },
  "Đã thanh toán": { action: "checkout", label: "Trả phòng", procedure: "USP_TRA_PHONG" },
};

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <section className="ops-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Sổ hóa đơn</h2>
          <p className="mt-0.5 text-xs text-slate-500">Theo dõi tiền phòng, dịch vụ và trạng thái thu</p>
        </div>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-semibold text-slate-500">HOADON · CTHD_PHG · CTHD_DV</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-5 py-3">Hóa đơn</th>
              <th scope="col" className="px-5 py-3">Khách / phòng</th>
              <th scope="col" className="px-5 py-3">Nhân viên</th>
              <th scope="col" className="px-5 py-3 text-right">Tiền phòng</th>
              <th scope="col" className="px-5 py-3 text-right">Dịch vụ</th>
              <th scope="col" className="px-5 py-3 text-right">Tổng cộng</th>
              <th scope="col" className="px-5 py-3">Trạng thái</th>
              <th scope="col" className="px-5 py-3">Xử lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {invoices.map((invoice) => {
              const operation = actionByStatus[invoice.trangThai];
              return (
                <tr key={invoice.maHd} className="align-top transition hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{invoice.maHd}</p>
                    <p className="mt-1 text-xs text-slate-500">{invoice.maBooking} · {formatDate(invoice.ngay)}</p>
                    {operation ? <p className="mt-1 font-mono text-[10px] text-slate-400">{operation.procedure}</p> : null}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{invoice.khachHang}</p>
                    <p className="mt-1 text-xs text-slate-500">Phòng {invoice.soPhong}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{invoice.nhanVien}</td>
                  <td className="px-5 py-4 text-right tabular-nums text-slate-600">{formatCurrency(invoice.tienPhong)}</td>
                  <td className="px-5 py-4 text-right tabular-nums text-slate-600">{formatCurrency(invoice.tienDichVu)}</td>
                  <td className="px-5 py-4 text-right font-bold tabular-nums text-slate-900">{formatCurrency(invoice.tong)}</td>
                  <td className="px-5 py-4"><StatusBadge status={invoice.trangThai} /></td>
                  <td className="px-5 py-4">
                    {operation ? (
                      <OperationButton action={operation.action} identifier={invoice.maHd} bookingId={invoice.maBooking} label={operation.label} className={operation.action === "checkout" ? "bg-slate-700 hover:bg-slate-800" : undefined} />
                    ) : (
                      <span className="text-xs text-slate-400">Không có thao tác</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {invoices.length === 0 ? <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-500">Không có hóa đơn cần hiển thị.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
