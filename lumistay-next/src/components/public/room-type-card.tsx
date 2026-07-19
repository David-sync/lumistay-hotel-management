import Link from "next/link";
import { BedDouble, Check, Star, Users, Wifi } from "lucide-react";
import type { RoomType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function RoomTypeCard({ roomType, checkIn, checkOut }: { roomType: RoomType; checkIn?: string; checkOut?: string }) {
  const query = checkIn && checkOut ? `?ngDen=${checkIn}&ngDi=${checkOut}` : "";
  const href = `/rooms/${roomType.malp}${query}`;

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-booking-lg">
      <Link href={href} className="block rounded-t-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#006ce4] focus-visible:ring-inset" aria-label={`Xem ${roomType.tenLp}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={roomType.image} alt={`Không gian ${roomType.tenLp}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          {roomType.badge ? (
            <span className="absolute left-3 top-3 rounded-md bg-[#003580] px-2.5 py-1 text-xs font-bold text-white shadow-sm">{roomType.badge}</span>
          ) : null}
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={href} className="rounded-sm font-display text-xl font-bold text-[#003580] hover:text-[#006ce4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006ce4]">
              {roomType.tenLp}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-600">{roomType.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="inline-flex items-center gap-1 rounded-md bg-[#003580] px-2 py-1 text-sm font-bold text-white">
              {roomType.rating}<Star className="h-3.5 w-3.5 fill-[#febb02] text-[#febb02]" aria-hidden="true" />
            </div>
            <p className="mt-1 text-[10px] text-gray-500">{roomType.reviewCount} đánh giá</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-gray-600">
          <span className="flex items-center gap-1"><BedDouble className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> {roomType.beds} giường</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> Tối đa {roomType.capacity} khách</span>
          <span className="flex items-center gap-1"><Wifi className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> WiFi miễn phí</span>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-green-700"><Check className="h-4 w-4" aria-hidden="true" /> Có lựa chọn hủy miễn phí</p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-500">Giá mỗi đêm từ</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(roomType.gia)}</p>
          </div>
          <Link href={href} className="booking-btn-primary shrink-0 px-4 py-2.5 text-xs focus-visible:ring-4 focus-visible:ring-[#006ce4] focus-visible:ring-offset-2">
            Xem phòng
          </Link>
        </div>
      </div>
    </article>
  );
}
