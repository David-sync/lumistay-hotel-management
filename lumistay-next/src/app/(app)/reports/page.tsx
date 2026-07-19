import { BarChart3, BedDouble, ConciergeBell, TrendingUp } from "lucide-react";
import { MiniBarChart } from "@/components/mini-bar-chart";
import { PageHeader } from "@/components/page-header";
import { SideRankCard } from "@/components/side-rank-card";
import { getDashboard } from "@/lib/repository";

const operationalViews = ["Hiệu suất nhân viên", "Thống kê lương", "Chi tiết hóa đơn", "Lịch sử thuê phòng", "Điều chỉnh giá", "Tài sản theo phòng"];

export default async function ReportsPage() {
  const data = await getDashboard();
  const revenueTotal = data.revenueByMonth.reduce((sum, item) => sum + item.value, 0);
  const bestMonth = data.revenueByMonth.reduce((best, item) => item.value > best.value ? item : best, data.revenueByMonth[0] || { label: "—", value: 0 });
  const bestRoom = data.revenueByRoomType.reduce((best, item) => item.value > best.value ? item : best, data.revenueByRoomType[0] || { label: "—", value: 0 });
  const bestService = data.topServices.reduce((best, item) => item.value > best.value ? item : best, data.topServices[0] || { label: "—", value: 0 });
  return <div>
    <PageHeader title="Báo cáo" description="Tổng hợp doanh thu, hạng phòng và dịch vụ để theo dõi hoạt động khách sạn." />
    <section className="mb-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={TrendingUp} label="Doanh thu 6 kỳ" value={`${revenueTotal} triệu`} /><Metric icon={BarChart3} label="Kỳ cao nhất" value={`${bestMonth.label} · ${bestMonth.value} triệu`} /><Metric icon={BedDouble} label="Hạng phòng dẫn đầu" value={bestRoom.label} /><Metric icon={ConciergeBell} label="Dịch vụ nổi bật" value={bestService.label} /></section>
    <section className="grid gap-4 xl:grid-cols-2"><MiniBarChart data={data.revenueByMonth} /><SideRankCard title="Doanh thu theo loại phòng" subtitle="Tổng hợp theo kỳ" rows={data.revenueByRoomType} /><SideRankCard title="Dịch vụ bán chạy" subtitle="Số lượt sử dụng" rows={data.topServices} /><section className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]"><div className="border-b border-[#D8D2C7] px-4 py-3.5"><h2 className="text-[15px] font-bold text-[#183B35]">Báo cáo quản trị</h2><p className="mt-0.5 text-xs text-[#81796D]">Các nhóm số liệu có thể đối soát</p></div><div className="grid gap-px bg-[#D8D2C7] sm:grid-cols-2">{operationalViews.map((view) => <article key={view} className="bg-[#FBFAF7] p-3.5 text-[12px] font-semibold text-[#25322D]">{view}</article>)}</div></section></section>
  </div>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof TrendingUp; label: string; value: string }) { return <article className="flex min-w-0 items-center gap-3 rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7] p-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#E7EEEA] text-[#183B35]"><Icon className="h-4 w-4" /></span><div className="min-w-0"><p className="text-[11px] text-[#81796D]">{label}</p><p className="mt-0.5 truncate text-[13px] font-bold text-[#183B35]">{value}</p></div></article>; }
