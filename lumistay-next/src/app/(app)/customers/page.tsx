import { BadgeCheck, Phone, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getCustomers } from "@/lib/repository";

type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  cccd: string;
  note: string;
};

export default async function CustomersPage() {
  const customers: CustomerRow[] = await getCustomers();
  const withPhone = customers.filter((customer) => Boolean(customer.phone)).length;
  const withIdentity = customers.filter((customer) => Boolean(customer.cccd)).length;

  return (
    <div>
      <PageHeader eyebrow="Guest records" title="Hồ sơ khách hàng" description="Thông tin nhận diện và liên hệ phục vụ quy trình lưu trú." />
      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <Summary icon={Users} label="Tổng hồ sơ" value={customers.length} />
        <Summary icon={Phone} label="Có số liên hệ" value={withPhone} />
        <Summary icon={BadgeCheck} label="Đã có CCCD" value={withIdentity} />
      </section>
      <section className="ops-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5"><div><h2 className="text-base font-bold text-slate-900">Danh bạ khách lưu trú</h2><p className="mt-0.5 text-xs text-slate-500">Tra cứu nhanh trước khi tạo booking</p></div><span className="rounded bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-500">KHACHHANG</span></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Mã khách</th><th className="px-5 py-3">Khách hàng</th><th className="px-5 py-3">Số điện thoại</th><th className="px-5 py-3">CCCD</th><th className="px-5 py-3">Ghi chú vận hành</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => <tr key={customer.id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-bold text-slate-900">{customer.id}</p><p className="mt-1 font-mono text-[9px] text-slate-400">USP_THEM_KHACH_HANG</p></td><td className="px-5 py-4 font-semibold text-slate-800">{customer.name}</td><td className="px-5 py-4 tabular-nums text-slate-600">{customer.phone || "—"}</td><td className="px-5 py-4 font-mono text-xs text-slate-600">{customer.cccd || "—"}</td><td className="px-5 py-4 text-slate-500">{customer.note || "—"}</td></tr>)}
              {customers.length === 0 ? <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">Chưa có hồ sơ khách hàng.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Summary({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return <article className="ops-card flex items-center gap-3 p-4"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-ops-primary"><Icon className="h-5 w-5" /></span><div><p className="text-xs text-slate-500">{label}</p><p className="mt-0.5 text-xl font-bold tabular-nums text-slate-900">{value}</p></div></article>;
}
