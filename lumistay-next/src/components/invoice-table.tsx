"use client";

import { useMemo, useState } from "react";
import type { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OperationButton, type OperationAction } from "./operation-button";
import { StatusBadge } from "./status-badge";

const actionByStatus: Partial<Record<Invoice["trangThai"], { action: OperationAction; label: string }>> = {
  "Chưa thanh toán": { action: "pay", label: "Thu tiền" },
  "Đã thanh toán": { action: "checkout", label: "Trả phòng" },
};

const statuses = ["Tất cả", "Chưa thanh toán", "Đã thanh toán", "Đã hủy"] as const;

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Invoice["trangThai"] | "Tất cả">("Tất cả");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return invoices.filter((invoice) => {
      const matchesStatus = status === "Tất cả" || invoice.trangThai === status;
      const matchesQuery = !normalized || [invoice.maHd, invoice.maBooking, invoice.khachHang, String(invoice.soPhong)].some((value) => value.toLowerCase().includes(normalized));
      return matchesStatus && matchesQuery;
    });
  }, [invoices, query, status]);

  return (
    <section className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]">
      <div className="flex flex-col gap-3 border-b border-[#D8D2C7] px-4 py-3.5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div><h2 className="text-[15px] font-bold text-[#183B35]">Sổ thu ngân</h2><p className="mt-0.5 text-xs text-[#81796D]">{filtered.length} / {invoices.length} hóa đơn</p></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="invoice-search">Tìm hóa đơn</label>
          <input id="invoice-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm khách, mã hoặc phòng" className="h-8 w-full rounded-[4px] border border-[#CFC8BC] bg-white px-2.5 text-xs text-[#25322D] outline-none placeholder:text-[#9A9286] focus:border-[#183B35] sm:w-52" />
          <label className="sr-only" htmlFor="invoice-status">Lọc trạng thái</label>
          <select id="invoice-status" value={status} onChange={(event) => setStatus(event.target.value as Invoice["trangThai"] | "Tất cả")} className="h-8 rounded-[4px] border border-[#CFC8BC] bg-white px-2 text-xs text-[#25322D] outline-none focus:border-[#183B35]">{statuses.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-[12px]">
          <thead className="border-b border-[#D8D2C7] bg-[#F0EDE7] text-[10px] font-bold uppercase tracking-wide text-[#716B61]">
            <tr><th scope="col" className="px-4 py-2.5">Hóa đơn</th><th scope="col" className="px-4 py-2.5">Khách / phòng</th><th scope="col" className="px-4 py-2.5">Ngày</th><th scope="col" className="px-4 py-2.5 text-right">Tiền phòng</th><th scope="col" className="px-4 py-2.5 text-right">Dịch vụ</th><th scope="col" className="px-4 py-2.5 text-right">Tổng</th><th scope="col" className="px-4 py-2.5">Trạng thái</th><th scope="col" className="px-4 py-2.5">Xử lý</th></tr>
          </thead>
          <tbody className="divide-y divide-[#E7E1D7] bg-[#FBFAF7]">
            {filtered.map((invoice) => {
              const operation = actionByStatus[invoice.trangThai];
              return <tr key={invoice.maHd} className="align-middle transition hover:bg-[#F7F1E7]">
                <td className="px-4 py-3"><p className="font-bold text-[#183B35]">{invoice.maHd}</p><p className="mt-0.5 text-[10px] text-[#81796D]">{invoice.maBooking}</p></td>
                <td className="px-4 py-3"><p className="font-semibold text-[#25322D]">{invoice.khachHang}</p><p className="mt-0.5 text-[10px] text-[#81796D]">Phòng {invoice.soPhong}</p></td>
                <td className="px-4 py-3 text-[#4E5852]">{formatDate(invoice.ngay)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-[#4E5852]">{formatCurrency(invoice.tienPhong)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-[#4E5852]">{formatCurrency(invoice.tienDichVu)}</td>
                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#183B35]">{formatCurrency(invoice.tong)}</td>
                <td className="px-4 py-3"><StatusBadge status={invoice.trangThai} /></td>
                <td className="px-4 py-3">{operation ? <OperationButton action={operation.action} identifier={invoice.maHd} bookingId={invoice.maBooking} label={operation.label} className={operation.action === "checkout" ? "bg-[#5B625D] hover:bg-[#424A45]" : undefined} /> : <span className="text-[11px] text-[#9A9286]">—</span>}</td>
              </tr>;
            })}
            {filtered.length === 0 ? <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-[#81796D]">Không có hóa đơn phù hợp.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
