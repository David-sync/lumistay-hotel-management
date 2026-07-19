import type { Room, RoomStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RoomGrid({ rooms, compact = false }: { rooms: Room[]; compact?: boolean }) {
  const floors = Array.from(new Set(rooms.map((room) => room.tang))).sort((a, b) => a - b);
  return <div className="space-y-3">
    <RoomLegend />
    {floors.map((floor) => {
      const floorRooms = rooms.filter((room) => room.tang === floor);
      const ready = floorRooms.filter((room) => room.trangThai === "Trống" && room.donDep === "Sạch").length;
      const occupied = floorRooms.filter((room) => room.trangThai === "Đang thuê").length;
      return <section key={floor} className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]"><div className="flex items-center justify-between border-b border-[#D8D2C7] bg-[#F0EDE7] px-3 py-2"><div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#183B35] text-[11px] font-bold text-white">{floor}</span><h2 className="text-[13px] font-bold text-[#25322D]">Tầng {floor}</h2><span className="text-[11px] text-[#81796D]">{floorRooms.length} phòng</span></div><div className="flex items-center gap-2.5 text-[11px] text-[#716B61]"><span><b className="text-[#356B4C]">{ready}</b> sẵn sàng</span><span className="h-3 w-px bg-[#C9C2B6]" /><span><b className="text-[#183B35]">{occupied}</b> đang ở</span></div></div><div className={cn("grid gap-px bg-[#D8D2C7]", compact ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5")}>{floorRooms.map((room) => <RoomCell key={room.soPhong} room={room} />)}</div></section>;
    })}
    {rooms.length === 0 ? <div className="rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7] px-5 py-10 text-center text-sm text-[#716B61]">Chưa có dữ liệu phòng.</div> : null}
  </div>;
}

function RoomCell({ room }: { room: Room }) {
  const clean = room.donDep === "Sạch";
  return <article className="min-h-[82px] bg-[#FBFAF7] px-2.5 py-2 transition hover:bg-[#F7F1E7]"><div className="flex items-start justify-between gap-1.5"><div className="flex items-center gap-1.5"><span className={cn("h-2 w-2 rounded-full", roomDot(room.trangThai))} /><span className="text-[16px] font-bold tabular-nums tracking-tight text-[#183B35]">{room.soPhong}</span></div><span className={cn("rounded-[3px] border px-1.5 py-0.5 text-[9px] font-bold", roomTone(room.trangThai))}>{shortStatus(room.trangThai)}</span></div><p className="mt-1 truncate text-[11px] font-medium text-[#4E5852]">{room.khachHang || room.loaiPhong}</p><p className={cn("mt-1 text-[10px] font-semibold", clean ? "text-[#51705D]" : "text-[#9A6A2F]")}>Buồng: {room.donDep.toLowerCase()}</p></article>;
}

function roomTone(status: RoomStatus) {
  if (status === "Trống") return "border-[#BBD2C1] bg-[#EFF6F0] text-[#356B4C]";
  if (status === "Đang thuê") return "border-[#BCD6D1] bg-[#EEF5F3] text-[#28635D]";
  if (status === "Đã đặt") return "border-[#E4CBA4] bg-[#FBF4E8] text-[#9A6A2F]";
  return "border-[#D8D2C7] bg-[#F0EDE7] text-[#716B61]";
}

function roomDot(status: RoomStatus) {
  if (status === "Trống") return "bg-[#4D805C]";
  if (status === "Đang thuê") return "bg-[#2D6964]";
  if (status === "Đã đặt") return "bg-[#B27B32]";
  return "bg-[#8B887F]";
}

function shortStatus(status: RoomStatus) {
  if (status === "Đang thuê") return "Đang ở";
  if (status === "Đang sửa chữa") return "Bảo trì";
  return status;
}

export function RoomLegend() {
  const items: RoomStatus[] = ["Trống", "Đã đặt", "Đang thuê", "Đang sửa chữa"];
  return <div className="flex flex-wrap items-center gap-2" aria-label="Chú thích trạng thái phòng">{items.map((item) => <span key={item} className={cn("inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-1 text-[10px] font-semibold", roomTone(item))}><span className={cn("h-1.5 w-1.5 rounded-full", roomDot(item))} />{shortStatus(item)}</span>)}</div>;
}
