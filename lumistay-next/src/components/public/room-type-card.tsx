import Link from "next/link";
import { BedDouble, Check, MoveUpRight, Users, Wifi } from "lucide-react";
import type { RoomType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function RoomTypeCard({ roomType, checkIn, checkOut }: { roomType: RoomType; checkIn?: string; checkOut?: string }) {
  const query = checkIn && checkOut ? `?ngDen=${checkIn}&ngDi=${checkOut}` : "";
  const href = `/rooms/${roomType.malp}${query}`;

  return (
    <article className="group overflow-hidden border border-[#d5cec2] bg-[#fbf9f5] transition hover:border-[#9a6a2f] hover:shadow-[0_12px_30px_rgba(24,59,53,0.10)]">
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f] focus-visible:ring-inset" aria-label={`Xem chi tiết ${roomType.tenLp}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#e9e2d6]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={roomType.image} alt={`Không gian ${roomType.tenLp}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          {roomType.badge ? <span className="absolute left-4 top-4 border border-[#d7b27a] bg-[#f4f0e8]/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#183b35]">{roomType.badge}</span> : null}
        </div>
      </Link>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={href} className="font-display text-xl font-bold text-[#183b35] hover:text-[#9a6a2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]">
              {roomType.tenLp}
            </Link>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6c685f]">{roomType.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold text-[#183b35]">{roomType.rating}</p>
            <p className="mt-0.5 text-[10px] text-[#6c685f]">{roomType.reviewCount} nhận xét</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#e1dbd1] pt-4 text-xs font-medium text-[#4e4b44]">
          <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> {roomType.beds} giường</span>
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> {roomType.capacity} khách</span>
          <span className="flex items-center gap-1.5"><Wifi className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> WiFi</span>
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#285b4d]"><Check className="h-4 w-4" aria-hidden="true" /> Hủy miễn phí trước 24 giờ</p>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#e1dbd1] pt-4">
          <div>
            <p className="text-xs text-[#6c685f]">Từ mỗi đêm</p>
            <p className="mt-1 text-xl font-bold text-[#25241f]">{formatCurrency(roomType.gia)}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#183b35] transition group-hover:text-[#9a6a2f]">Xem phòng <MoveUpRight className="h-4 w-4" aria-hidden="true" /></span>
        </div>
      </div>
    </article>
  );
}
