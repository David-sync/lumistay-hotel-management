import { BadgeCheck, Phone, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getCustomers } from "@/lib/repository";

type CustomerRow = { id: string; name: string; phone: string; cccd: string; note: string };

export default async function CustomersPage() {
  const customers: CustomerRow[] = await getCustomers();
  const withPhone = customers.filter((customer) => Boolean(customer.phone)).length;
  const withIdentity = customers.filter((customer) => Boolean(customer.cccd)).length;
  return <div>
    <PageHeader title="Khách hàng" description="Tra cứu thông tin liên hệ và nhận diện trước khi phục vụ khách lưu trú." />
    <section className="mb-5 grid gap-2 sm:grid-cols-3"><Summary icon={Users} label="Tổng hồ sơ" value={customers.length} /><Summary icon={Phone} label="Có số liên hệ" value={withPhone} /><Summary icon={BadgeCheck} label="Đã có CCCD" value={withIdentity} /></section>
    <section className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]"><div className="border-b border-[#D8D2C7] px-4 py-3.5 sm:px-5"><h2 className="text-[15px] font-bold text-[#183B35]">Danh bạ khách lưu trú</h2><p className="mt-0.5 text-xs text-[#81796D]">Thông tin dùng tại quầy lễ tân</p></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-[12px]"><thead className="border-b border-[#D8D2C7] bg-[#F0EDE7] text-[10px] font-bold uppercase tracking-wide text-[#716B61]"><tr><th className="px-4 py-2.5">Mã khách</th><th className="px-4 py-2.5">Khách hàng</th><th className="px-4 py-2.5">Số điện thoại</th><th className="px-4 py-2.5">CCCD</th><th className="px-4 py-2.5">Ghi chú</th></tr></thead><tbody className="divide-y divide-[#E7E1D7]">{customers.map((customer) => <tr key={customer.id} className="hover:bg-[#F7F1E7]"><td className="px-4 py-3 font-bold text-[#183B35]">{customer.id}</td><td className="px-4 py-3 font-semibold text-[#25322D]">{customer.name}</td><td className="px-4 py-3 tabular-nums text-[#4E5852]">{customer.phone || "—"}</td><td className="px-4 py-3 text-[#4E5852]">{customer.cccd || "—"}</td><td className="px-4 py-3 text-[#716B61]">{customer.note || "—"}</td></tr>)}{customers.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-[#81796D]">Chưa có hồ sơ khách hàng.</td></tr> : null}</tbody></table></div></section>
  </div>;
}

function Summary({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) { return <article className="flex items-center gap-3 rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7] p-3"><span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#E7EEEA] text-[#183B35]"><Icon className="h-4 w-4" /></span><div><p className="text-[11px] text-[#81796D]">{label}</p><p className="mt-0.5 text-lg font-bold tabular-nums text-[#183B35]">{value}</p></div></article>; }
