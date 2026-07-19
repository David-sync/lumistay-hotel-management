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
    { label: "Tổng phòng", value: String(rooms.length), hint: "Quỹ phòng hiện tại", trend: "Tất cả", tone: "neutral" as const },
    { label: "Sẵn sàng bán", value: String(available), hint: "Trống và sạch", trend: "Khả dụng", tone: "good" as const },
    { label: "Đang khai thác", value: String(occupied + reserved), hint: `${occupied} đang ở · ${reserved} đã đặt`, trend: "Lưu trú", tone: "warn" as const },
    { label: "Cần chú ý", value: String(attention), hint: "Vệ sinh hoặc bảo trì", trend: "Theo dõi", tone: "danger" as const },
  ];

  return (
    <div>
      <PageHeader title="Sơ đồ phòng" description="Rack phòng theo tầng, trạng thái lưu trú và tình trạng buồng." action={<Link href="/bookings" className="inline-flex h-9 items-center gap-2 rounded-[4px] bg-[#183B35] px-3.5 text-xs font-bold text-white transition hover:bg-[#102F2A]">Đặt phòng <ArrowRight className="h-3.5 w-3.5" /></Link>} />
      <section className="mb-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}</section>
      <RoomGrid rooms={rooms} />
    </div>
  );
}
