import { ConciergeBell, DoorOpen, ReceiptText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getServiceUsages } from "@/lib/repository";
import type { ServiceUsage } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default async function ServicesPage() {
  const services: ServiceUsage[] = await getServiceUsages();
  const roomCount = new Set(services.map((item) => item.room)).size;
  const total = services.reduce((sum, item) => sum + item.amount, 0);
  return <div>
    <PageHeader title="Dịch vụ" description="Theo dõi các khoản phát sinh theo phòng và khách đang lưu trú." />
    <section className="mb-5 grid gap-2 sm:grid-cols-3"><Summary icon={ConciergeBell} label="Lượt dịch vụ" value={String(services.length)} /><Summary icon={DoorOpen} label="Phòng phát sinh" value={String(roomCount)} /><Summary icon={ReceiptText} label="Tổng thành tiền" value={formatCurrency(total)} /></section>
    <section className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]"><div className="border-b border-[#D8D2C7] px-4 py-3.5 sm:px-5"><h2 className="text-[15px] font-bold text-[#183B35]">Dịch vụ phát sinh</h2><p className="mt-0.5 text-xs text-[#81796D]">Các khoản cần được ghi nhận vào hóa đơn</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-[12px]"><thead className="border-b border-[#D8D2C7] bg-[#F0EDE7] text-[10px] font-bold uppercase tracking-wide text-[#716B61]"><tr><th className="px-4 py-2.5">Dịch vụ</th><th className="px-4 py-2.5">Phòng</th><th className="px-4 py-2.5">Khách</th><th className="px-4 py-2.5 text-right">SL</th><th className="px-4 py-2.5 text-right">Thành tiền</th><th className="px-4 py-2.5">Thời gian</th></tr></thead><tbody className="divide-y divide-[#E7E1D7]">{services.map((item) => <tr key={item.id} className="hover:bg-[#F7F1E7]"><td className="px-4 py-3 font-semibold text-[#25322D]">{item.serviceName}</td><td className="px-4 py-3 text-[#4E5852]">{item.room}</td><td className="px-4 py-3 text-[#4E5852]">{item.guest}</td><td className="px-4 py-3 text-right tabular-nums text-[#4E5852]">{item.quantity}</td><td className="px-4 py-3 text-right font-bold tabular-nums text-[#183B35]">{formatCurrency(item.amount)}</td><td className="px-4 py-3 text-[#81796D]">{item.time}</td></tr>)}{services.length === 0 ? <tr><td colSpan={6} className="px-4 py-10 text-center text-[#81796D]">Chưa có dịch vụ phát sinh.</td></tr> : null}</tbody></table></div></section>
  </div>;
}

function Summary({ icon: Icon, label, value }: { icon: typeof ConciergeBell; label: string; value: string }) { return <article className="flex items-center gap-3 rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7] p-3"><span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#E7EEEA] text-[#183B35]"><Icon className="h-4 w-4" /></span><div><p className="text-[11px] text-[#81796D]">{label}</p><p className="mt-0.5 text-base font-bold tabular-nums text-[#183B35]">{value}</p></div></article>; }
