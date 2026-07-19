import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { RoomGrid } from "@/components/room-grid";
import { StatCard } from "@/components/stat-card";
import { getRooms } from "@/lib/repository";

export default async function RoomsPage() {
  const rooms = await getRooms();
  const available = rooms.filter((room) => room.trangThai === "Trống" && room.donDep === "Sạch").length;
  const occupied = rooms.filter((room) => room.trangThai === "Đang thuê").length;
  const reserved = rooms.filter((room) => room.trangThai === "Đã đặt").length;
  const attention = rooms.filter((room) => room.trangThai === "Đang sửa chữa" || room.donDep !== "Sạch").length;
  const stats = [
    { label: "Tổng phòng", value: String(rooms.length), hint: "Toàn bộ quỹ phòng", trend: "Hiện có", tone: "neutral" as const },
    { label: "Sẵn sàng bán", value: String(available), hint: "Trống và sạch", trend: "Khả dụng", tone: "good" as const },
    { label: "Đang khai thác", value: String(occupied + reserved), hint: `${occupied} đang ở · ${reserved} đã đặt`, trend: "Công suất", tone: "warn" as const },
    { label: "Cần chú ý", value: String(attention), hint: "Vệ sinh hoặc bảo trì", trend: "Buồng phòng", tone: "danger" as const },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Room rack"
        title="Sơ đồ tầng và phòng"
        description="Tình trạng bán, vệ sinh và lưu trú được gom theo từng tầng."
        action={<Link href="/bookings" className="inline-flex items-center gap-2 rounded-lg bg-ops-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900">Đi đến booking <ArrowRight className="h-4 w-4" /></Link>}
      />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}</section>
      <RoomGrid rooms={rooms} />
    </div>
  );
}
