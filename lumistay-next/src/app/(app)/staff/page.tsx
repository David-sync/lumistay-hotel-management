import { KeyRound, ShieldCheck, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getStaff } from "@/lib/repository";

type StaffRow = { manv: string; name: string; role: string; account: string; permission: string };

export default async function StaffPage() {
  const staff: StaffRow[] = await getStaff();
  const roles = new Set(staff.map((row) => row.role)).size;
  const accounts = staff.filter((row) => Boolean(row.account)).length;
  return <div>
    <PageHeader title="Nhân viên" description="Danh sách nhân sự, vai trò và phạm vi nghiệp vụ tại khách sạn." />
    <section className="mb-5 grid gap-2 sm:grid-cols-3"><Summary icon={UsersRound} label="Nhân viên" value={staff.length} /><Summary icon={ShieldCheck} label="Vai trò" value={roles} /><Summary icon={KeyRound} label="Tài khoản hoạt động" value={accounts} /></section>
    <section className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]"><div className="border-b border-[#D8D2C7] px-4 py-3.5 sm:px-5"><h2 className="text-[15px] font-bold text-[#183B35]">Danh sách nhân sự</h2><p className="mt-0.5 text-xs text-[#81796D]">Phân công theo trách nhiệm vận hành</p></div><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-[12px]"><thead className="border-b border-[#D8D2C7] bg-[#F0EDE7] text-[10px] font-bold uppercase tracking-wide text-[#716B61]"><tr><th className="px-4 py-2.5">Mã NV</th><th className="px-4 py-2.5">Nhân viên</th><th className="px-4 py-2.5">Tài khoản</th><th className="px-4 py-2.5">Vai trò</th><th className="px-4 py-2.5">Quyền chính</th></tr></thead><tbody className="divide-y divide-[#E7E1D7]">{staff.map((row) => <tr key={row.manv} className="hover:bg-[#F7F1E7]"><td className="px-4 py-3 font-bold text-[#183B35]">{row.manv}</td><td className="px-4 py-3 font-semibold text-[#25322D]">{row.name}</td><td className="px-4 py-3 text-[#4E5852]">{row.account || "Chưa cấp"}</td><td className="px-4 py-3"><span className="rounded-[4px] border border-[#C8D8D0] bg-[#EEF4F0] px-2 py-1 text-[10px] font-bold text-[#183B35]">{row.role}</span></td><td className="px-4 py-3 text-[#716B61]">{row.permission}</td></tr>)}{staff.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-[#81796D]">Chưa có dữ liệu nhân viên.</td></tr> : null}</tbody></table></div></section>
  </div>;
}

function Summary({ icon: Icon, label, value }: { icon: typeof UsersRound; label: string; value: number }) { return <article className="flex items-center gap-3 rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7] p-3"><span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#E7EEEA] text-[#183B35]"><Icon className="h-4 w-4" /></span><div><p className="text-[11px] text-[#81796D]">{label}</p><p className="mt-0.5 text-lg font-bold tabular-nums text-[#183B35]">{value}</p></div></article>; }
