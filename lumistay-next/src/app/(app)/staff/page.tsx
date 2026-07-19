import { KeyRound, ShieldCheck, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getStaff } from "@/lib/repository";

type StaffRow = {
  manv: string;
  name: string;
  role: string;
  account: string;
  permission: string;
};

export default async function StaffPage() {
  const staff: StaffRow[] = await getStaff();
  const roles = new Set(staff.map((row) => row.role)).size;
  const accounts = staff.filter((row) => Boolean(row.account)).length;

  return (
    <div>
      <PageHeader eyebrow="Workforce" title="Nhân viên và phân quyền" description="Danh sách tài khoản, vai trò và phạm vi nghiệp vụ được giao." />
      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <Summary icon={UsersRound} label="Nhân viên" value={staff.length} />
        <Summary icon={ShieldCheck} label="Vai trò" value={roles} />
        <Summary icon={KeyRound} label="Tài khoản hoạt động" value={accounts} />
      </section>
      <section className="ops-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5"><div><h2 className="text-base font-bold text-slate-900">Danh sách nhân sự</h2><p className="mt-0.5 text-xs text-slate-500">Phân quyền theo trách nhiệm vận hành</p></div><span className="rounded bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-500">NHANVIEN · TAIKHOAN</span></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Mã NV</th><th className="px-5 py-3">Nhân viên</th><th className="px-5 py-3">Tài khoản</th><th className="px-5 py-3">Vai trò</th><th className="px-5 py-3">Quyền chính</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((row) => <tr key={row.manv} className="hover:bg-slate-50"><td className="px-5 py-4 font-bold text-slate-900">{row.manv}</td><td className="px-5 py-4 font-semibold text-slate-800">{row.name}</td><td className="px-5 py-4"><span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">{row.account || "Chưa cấp"}</span></td><td className="px-5 py-4"><span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{row.role}</span></td><td className="px-5 py-4 text-slate-500">{row.permission}</td></tr>)}
              {staff.length === 0 ? <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">Chưa có dữ liệu nhân viên.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Summary({ icon: Icon, label, value }: { icon: typeof UsersRound; label: string; value: number }) {
  return <article className="ops-card flex items-center gap-3 p-4"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-ops-primary"><Icon className="h-5 w-5" /></span><div><p className="text-xs text-slate-500">{label}</p><p className="mt-0.5 text-xl font-bold tabular-nums text-slate-900">{value}</p></div></article>;
}
