import { CheckCircle2, Database, KeyRound, Server, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  const isRealDb = process.env.USE_REAL_DB === "true";
  const connectionRows = [
    { label: "Nguồn dữ liệu", value: isRealDb ? "Kết nối vận hành" : "Bộ dữ liệu xem trước", status: "Sẵn sàng" },
    { label: "Máy chủ", value: isRealDb ? "Đã cấu hình" : "Không sử dụng", status: isRealDb ? "Đang hoạt động" : "Ngoại tuyến" },
    { label: "Dữ liệu khách sạn", value: "Thông tin phòng và lưu trú", status: "Đang tải" },
    { label: "Phiên đăng nhập", value: "Cookie bảo mật", status: "Đang bật" },
  ];
  return <div>
    <PageHeader title="Cài đặt" description="Trạng thái kết nối, phiên đăng nhập và bảo vệ dữ liệu vận hành." />
    <section className="mb-5 grid gap-2 md:grid-cols-3"><StatusCard icon={Database} label="Nguồn dữ liệu" value={isRealDb ? "Đang kết nối" : "Xem trước"} tone={isRealDb ? "emerald" : "amber"} /><StatusCard icon={ShieldCheck} label="Xác thực" value="Phiên bảo mật" tone="emerald" /><StatusCard icon={Server} label="Ứng dụng" value="Sẵn sàng" tone="emerald" /></section>
    <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]"><div className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]"><div className="border-b border-[#D8D2C7] px-4 py-3.5 sm:px-5"><h2 className="text-[15px] font-bold text-[#183B35]">Trạng thái hiện tại</h2><p className="mt-0.5 text-xs text-[#81796D]">Thông tin an toàn để nhân viên theo dõi</p></div><dl className="divide-y divide-[#E7E1D7]">{connectionRows.map((row) => <div key={row.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[170px_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:px-5"><dt className="text-[11px] font-medium text-[#81796D]">{row.label}</dt><dd className="text-[12px] font-semibold text-[#25322D]">{row.value}</dd><dd className="flex items-center gap-1.5 text-[11px] font-medium text-[#356B4C]"><CheckCircle2 className="h-3.5 w-3.5" />{row.status}</dd></div>)}</dl></div><aside className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]"><div className="border-b border-[#D8D2C7] px-4 py-3.5"><h2 className="text-[15px] font-bold text-[#183B35]">Kiểm soát truy cập</h2><p className="mt-0.5 text-xs text-[#81796D]">Nguyên tắc bảo vệ dữ liệu</p></div><div className="space-y-2.5 p-4"><Control icon={KeyRound} title="Thông tin bí mật" detail="Mật khẩu và khóa phiên không hiển thị trên giao diện." /><Control icon={ShieldCheck} title="Quyền theo vai trò" detail="Nghiệp vụ được giới hạn theo tài khoản nhân viên." /><Control icon={Database} title="Truy cập dữ liệu" detail="Kết nối dữ liệu được quản lý ở phía máy chủ." /></div></aside></section>
  </div>;
}

function StatusCard({ icon: Icon, label, value, tone }: { icon: typeof Database; label: string; value: string; tone: "emerald" | "amber" }) { const toneClass = tone === "emerald" ? "bg-[#EFF6F0] text-[#356B4C]" : "bg-[#FBF4E8] text-[#9A6A2F]"; return <article className="flex items-center gap-3 rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7] p-3"><span className={`flex h-8 w-8 items-center justify-center rounded-[4px] ${toneClass}`}><Icon className="h-4 w-4" /></span><div><p className="text-[11px] text-[#81796D]">{label}</p><p className="mt-0.5 text-[13px] font-bold text-[#183B35]">{value}</p></div></article>; }
function Control({ icon: Icon, title, detail }: { icon: typeof Database; title: string; detail: string }) { return <div className="flex gap-3 rounded-[4px] border border-[#E0DAD0] p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-[#F0EDE7] text-[#5D655F]"><Icon className="h-3.5 w-3.5" /></span><div><p className="text-[12px] font-semibold text-[#25322D]">{title}</p><p className="mt-0.5 text-[11px] leading-4 text-[#81796D]">{detail}</p></div></div>; }
