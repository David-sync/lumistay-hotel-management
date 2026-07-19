import { CheckCircle2, Database, KeyRound, Server, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  const isRealDb = process.env.USE_REAL_DB === "true";
  const connectionRows = [
    { label: "Chế độ dữ liệu", value: isRealDb ? "SQL Server trực tuyến" : "Dữ liệu mô phỏng", status: isRealDb ? "Đang kết nối" : "An toàn cho demo" },
    { label: "Máy chủ", value: isRealDb ? (process.env.DB_HOST || "Đã cấu hình") : "Không sử dụng", status: isRealDb ? "Biến môi trường" : "Ngoại tuyến" },
    { label: "Cơ sở dữ liệu", value: isRealDb ? (process.env.DB_NAME || "QLKS") : "Bộ dữ liệu LumiStay", status: "Nguồn vận hành" },
    { label: "Phiên đăng nhập", value: "Cookie bảo mật", status: "Đang bật" },
  ];

  return (
    <div>
      <PageHeader eyebrow="System control" title="Cài đặt vận hành" description="Trạng thái nguồn dữ liệu, phiên đăng nhập và bảo vệ hệ thống." />
      <section className="mb-5 grid gap-3 md:grid-cols-3">
        <StatusCard icon={Database} label="Nguồn dữ liệu" value={isRealDb ? "SQL Server" : "Demo dataset"} tone={isRealDb ? "emerald" : "amber"} />
        <StatusCard icon={ShieldCheck} label="Xác thực" value="Phiên bảo mật" tone="emerald" />
        <StatusCard icon={Server} label="Ứng dụng" value="Sẵn sàng" tone="emerald" />
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="ops-card overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-5"><h2 className="text-base font-bold text-slate-900">Cấu hình hiện tại</h2><p className="mt-0.5 text-xs text-slate-500">Chỉ hiển thị thông tin không nhạy cảm</p></div>
          <dl className="divide-y divide-slate-100">
            {connectionRows.map((row) => <div key={row.label} className="grid gap-1 px-4 py-4 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:px-5"><dt className="text-xs font-medium text-slate-500">{row.label}</dt><dd className="text-sm font-semibold text-slate-800">{row.value}</dd><dd className="flex items-center gap-1.5 text-xs font-medium text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />{row.status}</dd></div>)}
          </dl>
        </div>

        <aside className="ops-card overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-5"><h2 className="text-base font-bold text-slate-900">Kiểm soát truy cập</h2><p className="mt-0.5 text-xs text-slate-500">Nguyên tắc bảo vệ dữ liệu vận hành</p></div>
          <div className="space-y-3 p-4 sm:p-5">
            <Control icon={KeyRound} title="Thông tin bí mật" detail="Mật khẩu và khóa phiên không hiển thị trên giao diện." />
            <Control icon={ShieldCheck} title="Quyền theo vai trò" detail="Nghiệp vụ được giới hạn theo tài khoản nhân viên." />
            <Control icon={Database} title="Truy cập dữ liệu" detail="Kết nối cơ sở dữ liệu được quản lý ở phía máy chủ." />
          </div>
        </aside>
      </section>
    </div>
  );
}

function StatusCard({ icon: Icon, label, value, tone }: { icon: typeof Database; label: string; value: string; tone: "emerald" | "amber" }) {
  const toneClass = tone === "emerald" ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-amber-50 text-amber-700 ring-amber-100";
  return <article className="ops-card flex items-center gap-3 p-4"><span className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${toneClass}`}><Icon className="h-5 w-5" /></span><div><p className="text-xs text-slate-500">{label}</p><p className="mt-0.5 text-base font-bold text-slate-900">{value}</p></div></article>;
}

function Control({ icon: Icon, title, detail }: { icon: typeof Database; title: string; detail: string }) {
  return <div className="flex gap-3 rounded-lg border border-slate-200 p-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><Icon className="h-4 w-4" /></span><div><p className="text-sm font-semibold text-slate-800">{title}</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{detail}</p></div></div>;
}
