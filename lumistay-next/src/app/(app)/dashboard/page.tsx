import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardCheck, Hotel, UserRoundCheck } from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import { FloorOccupancy } from "@/components/floor-occupancy";
import { FrontDeskQueue } from "@/components/front-desk-queue";
import { PageHeader } from "@/components/page-header";
import { ProcedureMap } from "@/components/procedure-map";
import { RoomGrid } from "@/components/room-grid";
import { StatCard } from "@/components/stat-card";
import { getDashboard, getRooms } from "@/lib/repository";

export default async function DashboardPage() {
  const [data, rooms] = await Promise.all([getDashboard(), getRooms()]);
  const readyRooms = rooms.filter((room) => room.trangThai === "Trống" && room.donDep === "Sạch").length;
  const highPriority = data.frontDeskTasks.filter((task) => task.priority === "Cao").length;
  const shiftDate = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());

  return (
    <div>
      <PageHeader
        eyebrow="Trung tâm điều phối"
        title="Ca trực hôm nay"
        description="Theo dõi tình trạng phòng, khách đến và công việc ưu tiên trong một màn hình."
        action={<Link href="/bookings" className="inline-flex items-center gap-2 rounded-lg bg-ops-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900">Mở sổ booking <ArrowRight className="h-4 w-4" /></Link>}
      />

      <section className="mb-4 grid gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Thông tin bàn giao ca">
        <ShiftSignal icon={CalendarDays} label="Ngày vận hành" value={shiftDate} />
        <ShiftSignal icon={UserRoundCheck} label="Khách đến hôm nay" value={`${data.todayCheckins.length} booking`} />
        <ShiftSignal icon={Hotel} label="Phòng sẵn sàng" value={`${readyRooms} phòng`} />
        <ShiftSignal icon={ClipboardCheck} label="Ưu tiên cao" value={`${highPriority} đầu việc`} tone={highPriority > 0 ? "text-rose-700" : "text-emerald-700"} />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <FrontDeskQueue tasks={data.frontDeskTasks} />
        <FloorOccupancy floors={data.floorSummary} />
      </section>

      <section className="mt-5 grid items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="text-lg font-bold text-slate-900">Sơ đồ phòng nhanh</h2><p className="text-sm text-slate-500">Tình trạng bán và lưu trú theo từng tầng</p></div>
            <Link href="/rooms" className="inline-flex items-center gap-1 text-sm font-semibold text-ops-primary hover:text-blue-900">Xem toàn bộ <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <RoomGrid rooms={rooms} compact />
        </div>
        <ActivityFeed items={data.recentActivity} />
      </section>

      <section className="mt-5"><ProcedureMap /></section>
    </div>
  );
}

function ShiftSignal({ icon: Icon, label, value, tone = "text-slate-800" }: { icon: typeof CalendarDays; label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-white/80 px-3 py-2 ring-1 ring-blue-100">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-ops-primary"><Icon className="h-4 w-4" /></span>
      <span className="min-w-0"><span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</span><span className={`block truncate text-xs font-bold ${tone}`}>{value}</span></span>
    </div>
  );
}
