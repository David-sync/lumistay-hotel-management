import { BarChart3, BedDouble, ConciergeBell, TrendingUp } from "lucide-react";
import { MiniBarChart } from "@/components/mini-bar-chart";
import { PageHeader } from "@/components/page-header";
import { SideRankCard } from "@/components/side-rank-card";
import { getDashboard } from "@/lib/repository";

const operationalViews = [
  { name: "Hiệu suất nhân viên", source: "v_HieuSuatNhanVien" },
  { name: "Thống kê lương", source: "v_ThongKeLuongNhanVien" },
  { name: "Chi tiết hóa đơn", source: "v_ChiTietHoaDonTongHop" },
  { name: "Lịch sử thuê phòng", source: "v_LichSuThuePhong" },
  { name: "Điều chỉnh giá", source: "v_LichSuDieuChinhGia" },
  { name: "Tài sản theo phòng", source: "v_TaiSanTheoPhong" },
];

export default async function ReportsPage() {
  const data = await getDashboard();
  const revenueTotal = data.revenueByMonth.reduce((sum, item) => sum + item.value, 0);
  const bestMonth = data.revenueByMonth.reduce((best, item) => item.value > best.value ? item : best, data.revenueByMonth[0] || { label: "—", value: 0 });
  const bestRoom = data.revenueByRoomType.reduce((best, item) => item.value > best.value ? item : best, data.revenueByRoomType[0] || { label: "—", value: 0 });
  const bestService = data.topServices.reduce((best, item) => item.value > best.value ? item : best, data.topServices[0] || { label: "—", value: 0 });

  return (
    <div>
      <PageHeader eyebrow="Performance" title="Báo cáo vận hành" description="Tổng hợp doanh thu, hạng phòng và dịch vụ từ dữ liệu nghiệp vụ." />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={TrendingUp} label="Doanh thu 6 kỳ" value={`${revenueTotal} triệu`} />
        <Metric icon={BarChart3} label="Kỳ cao nhất" value={`${bestMonth.label} · ${bestMonth.value} triệu`} />
        <Metric icon={BedDouble} label="Hạng phòng dẫn đầu" value={bestRoom.label} />
        <Metric icon={ConciergeBell} label="Dịch vụ nổi bật" value={bestService.label} />
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        <MiniBarChart data={data.revenueByMonth} />
        <SideRankCard title="Doanh thu theo loại phòng" subtitle="v_DoanhThuTheoLoaiPhong" rows={data.revenueByRoomType} />
        <SideRankCard title="Dịch vụ bán chạy" subtitle="v_DichVuBanChay" rows={data.topServices} />
        <section className="ops-card overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-5"><h2 className="text-base font-bold text-slate-900">Danh mục báo cáo kiểm soát</h2><p className="mt-0.5 text-xs text-slate-500">Các nguồn dữ liệu phục vụ đối soát</p></div>
          <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
            {operationalViews.map((view) => <article key={view.source} className="bg-white p-4"><p className="text-sm font-semibold text-slate-800">{view.name}</p><p className="mt-1 break-all font-mono text-[10px] text-slate-400">{view.source}</p></article>)}
          </div>
        </section>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof TrendingUp; label: string; value: string }) {
  return <article className="ops-card flex min-w-0 items-center gap-3 p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-ops-primary"><Icon className="h-5 w-5" /></span><div className="min-w-0"><p className="text-xs text-slate-500">{label}</p><p className="mt-0.5 truncate text-base font-bold text-slate-900">{value}</p></div></article>;
}
