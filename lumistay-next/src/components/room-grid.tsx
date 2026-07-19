import type { ElementType } from "react";
import { BedDouble, Brush, CalendarClock, DoorOpen, Wrench } from "lucide-react";
import type { Room, RoomStatus } from "@/lib/types";
import { cn, formatCurrency, formatDate, statusDot, statusTone } from "@/lib/utils";

const statusIcons: Record<RoomStatus, ElementType> = {
  "Trống": DoorOpen,
  "Đang thuê": BedDouble,
  "Đã đặt": CalendarClock,
  "Đang sửa chữa": Wrench,
};

export function RoomGrid({ rooms, compact = false }: { rooms: Room[]; compact?: boolean }) {
  const floors = Array.from(new Set(rooms.map((room) => room.tang))).sort((a, b) => a - b);

  return (
    <div className="space-y-4">
      <RoomLegend />
      {floors.map((floor) => {
        const floorRooms = rooms.filter((room) => room.tang === floor);
        const ready = floorRooms.filter((room) => room.trangThai === "Trống" && room.donDep === "Sạch").length;
        const occupied = floorRooms.filter((room) => room.trangThai === "Đang thuê").length;
        return (
          <section key={floor} className="ops-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 px-4 py-3.5 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-ops-primary shadow-sm ring-1 ring-slate-200">{floor}</span>
                <div><h2 className="text-sm font-bold text-slate-900">Tầng {floor}</h2><p className="text-xs text-slate-500">{floorRooms.length} phòng</p></div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500"><span><b className="text-emerald-700">{ready}</b> sẵn sàng</span><span className="h-3 w-px bg-slate-300" /><span><b className="text-sky-700">{occupied}</b> đang ở</span></div>
            </div>
            <div className={cn("grid gap-px bg-slate-200", compact ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4")}>
              {floorRooms.map((room) => <RoomCard key={room.soPhong} room={room} />)}
            </div>
          </section>
        );
      })}
      {rooms.length === 0 ? <div className="ops-card px-5 py-12 text-center text-sm text-slate-500">Chưa có dữ liệu phòng.</div> : null}
    </div>
  );
}

function RoomCard({ room }: { room: Room }) {
  const Icon = statusIcons[room.trangThai];
  const guidance = getRoomGuidance(room);

  return (
    <article className="relative bg-white p-4 transition hover:z-10 hover:bg-slate-50">
      <span className={cn("absolute inset-y-0 left-0 w-1", statusDot(room.trangThai))} />
      <div className="flex items-start justify-between gap-3 pl-1">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Phòng</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-950">{room.soPhong}</p>
        </div>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", statusTone(room.trangThai))}><Icon className="h-4 w-4" aria-hidden="true" /></span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 pl-1">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold", statusTone(room.trangThai))}><span className={cn("h-1.5 w-1.5 rounded-full", statusDot(room.trangThai))} />{room.trangThai}</span>
        <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", room.donDep === "Sạch" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700")}><Brush className="h-3 w-3" />{room.donDep}</span>
      </div>
      <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
        <div className="flex justify-between gap-3"><dt className="text-slate-500">Hạng phòng</dt><dd className="font-semibold text-slate-700">{room.loaiPhong}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-slate-500">Giá niêm yết</dt><dd className="font-semibold tabular-nums text-slate-700">{formatCurrency(room.gia)}</dd></div>
        {room.khachHang ? <div className="flex justify-between gap-3"><dt className="text-slate-500">Khách</dt><dd className="max-w-[60%] truncate font-semibold text-slate-700">{room.khachHang}</dd></div> : null}
        {room.ngayDi ? <div className="flex justify-between gap-3"><dt className="text-slate-500">Ngày đi</dt><dd className="font-semibold text-slate-700">{formatDate(room.ngayDi)}</dd></div> : null}
      </dl>
      <p className="mt-3 rounded-md bg-slate-50 px-2.5 py-2 text-[11px] font-medium leading-4 text-slate-600">{guidance}</p>
    </article>
  );
}

export function RoomLegend() {
  const items: RoomStatus[] = ["Trống", "Đã đặt", "Đang thuê", "Đang sửa chữa"];
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Chú thích trạng thái phòng">
      {items.map((item) => <span key={item} className={cn("inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-[11px] font-semibold", statusTone(item))}><span className={cn("h-1.5 w-1.5 rounded-full", statusDot(item))} />{item}</span>)}
      <span className="ml-auto hidden text-[11px] text-slate-400 lg:inline">Trạng thái cập nhật từ sơ đồ buồng</span>
    </div>
  );
}

function getRoomGuidance(room: Room) {
  if (room.trangThai === "Trống" && room.donDep === "Sạch") return "Sẵn sàng phân bổ cho booking mới";
  if (room.trangThai === "Trống") return "Chờ hoàn tất vệ sinh trước khi bán";
  if (room.trangThai === "Đã đặt") return "Kiểm tra hồ sơ trước khi nhận phòng";
  if (room.trangThai === "Đang thuê") return "Theo dõi dịch vụ và thời điểm trả phòng";
  return "Tạm khóa bán cho đến khi bảo trì hoàn tất";
}
