import { ConciergeBell, DoorOpen, ReceiptText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getServiceUsages } from "@/lib/repository";
import type { ServiceUsage } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default async function ServicesPage() {
  const services: ServiceUsage[] = await getServiceUsages();
  const roomCount = new Set(services.map((item) => item.room)).size;
  const total = services.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <PageHeader eyebrow="In-house services" title="Dịch vụ đang sử dụng" description="Theo dõi chi phí phát sinh theo phòng và khách lưu trú." />
      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <Summary icon={ConciergeBell} label="Lượt dịch vụ" value={String(services.length)} />
        <Summary icon={DoorOpen} label="Phòng phát sinh" value={String(roomCount)} />
        <Summary icon={ReceiptText} label="Tổng thành tiền" value={formatCurrency(total)} />
      </section>
      <section className="ops-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5"><div><h2 className="text-base font-bold text-slate-900">Nhật ký sử dụng dịch vụ</h2><p className="mt-0.5 text-xs text-slate-500">Chi tiết phát sinh trong thời gian lưu trú</p></div><span className="rounded bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-500">SUDUNG_DV · CTHD_DV</span></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Mã sử dụng</th><th className="px-5 py-3">Dịch vụ</th><th className="px-5 py-3">Phòng</th><th className="px-5 py-3">Khách hàng</th><th className="px-5 py-3 text-right">Số lượng</th><th className="px-5 py-3 text-right">Thành tiền</th><th className="px-5 py-3">Thời gian</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-bold text-slate-900">{item.id}</p><p className="mt-1 font-mono text-[9px] text-slate-400">USP_THUE_DICH_VU</p></td><td className="px-5 py-4 font-semibold text-slate-800">{item.serviceName}</td><td className="px-5 py-4 text-slate-600">Phòng {item.room}</td><td className="px-5 py-4 text-slate-600">{item.guest}</td><td className="px-5 py-4 text-right tabular-nums text-slate-600">{item.quantity}</td><td className="px-5 py-4 text-right font-bold tabular-nums text-slate-900">{formatCurrency(item.amount)}</td><td className="px-5 py-4 tabular-nums text-slate-500">{item.time}</td></tr>)}
              {services.length === 0 ? <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-500">Chưa có dịch vụ phát sinh.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Summary({ icon: Icon, label, value }: { icon: typeof ConciergeBell; label: string; value: string }) {
  return <article className="ops-card flex items-center gap-3 p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-ops-primary"><Icon className="h-5 w-5" /></span><div><p className="text-xs text-slate-500">{label}</p><p className="mt-0.5 text-lg font-bold tabular-nums text-slate-900">{value}</p></div></article>;
}
