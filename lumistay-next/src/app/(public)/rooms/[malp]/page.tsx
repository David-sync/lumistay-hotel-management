import Link from "next/link";
import { BedDouble, Check, ChevronRight, Clock3, Coffee, Expand, MapPin, ShieldCheck, Users, Wifi } from "lucide-react";
import { HeroSearch } from "@/components/public/hero-search";
import { BookRoomButton } from "@/components/public/book-room-button";
import { getRoomTypeByMalp, getRoomTypes, searchAvailableRooms } from "@/lib/repository";
import { formatCurrency, formatDate, nightsBetween } from "@/lib/utils";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ malp: string }>;
  searchParams: Promise<{ ngDen?: string; ngDi?: string; guests?: string }>;
};

function dateInputOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default async function RoomDetailPage({ params, searchParams }: Props) {
  const { malp } = await params;
  const query = await searchParams;
  const roomType = await getRoomTypeByMalp(malp);
  if (!roomType) notFound();

  const roomTypes = await getRoomTypes();
  const ngDen = query.ngDen || dateInputOffset(1);
  const ngDi = query.ngDi || dateInputOffset(2);
  const requestedGuests = Number(query.guests || 2);
  const guests = Number.isFinite(requestedGuests) ? Math.min(roomType.capacity, Math.max(1, requestedGuests)) : Math.min(2, roomType.capacity);
  const nights = nightsBetween(ngDen, ngDi);
  const available = nights > 0 ? await searchAvailableRooms(roomType.tenLp, ngDen, ngDi) : [];
  const selectedRoom = available[0];

  return (
    <div className="bg-[#f4f0e8] pb-16">
      <div className="mx-auto max-w-7xl px-5 pt-7 lg:px-8">
        <nav aria-label="Đường dẫn" className="flex flex-wrap items-center gap-1 text-xs text-[#6c685f]"><Link href="/" className="rounded-sm text-[#183b35] hover:text-[#9a6a2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]">Trang chủ</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><Link href="/search" className="rounded-sm text-[#183b35] hover:text-[#9a6a2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]">Phòng nghỉ</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><span aria-current="page">{roomType.tenLp}</span></nav>

        <header className="mt-6 flex flex-col gap-4 border-b border-[#d5cec2] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a6a2f]">Không gian lưu trú</p><h1 className="mt-2 font-display text-4xl font-bold leading-tight text-[#183b35] sm:text-5xl">{roomType.tenLp}</h1><p className="mt-3 flex items-center gap-1.5 text-sm text-[#6c685f]"><MapPin className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> LumiStay Hotel &amp; Residence · Trung tâm thành phố</p></div>
          <div className="text-left sm:text-right"><p className="text-sm font-bold text-[#183b35]">{roomType.rating} / 10</p><p className="mt-1 text-xs text-[#6c685f]">{roomType.reviewCount} nhận xét của khách</p></div>
        </header>

        <section className="mt-7 grid h-[320px] gap-2 overflow-hidden sm:grid-cols-[2fr_1fr] md:h-[470px]" aria-label={`Hình ảnh ${roomType.tenLp}`}>
          <div className="relative overflow-hidden bg-[#e9e2d6] sm:row-span-2">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={roomType.image} alt={`Phòng ngủ ${roomType.tenLp}`} className="h-full w-full object-cover" /></div>
          <div className="relative hidden overflow-hidden bg-[#e9e2d6] sm:block">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={roomType.image} alt="Chi tiết nội thất trong phòng" className="h-full w-full scale-125 object-cover object-left" /></div>
          <div className="relative hidden overflow-hidden bg-[#e9e2d6] sm:block">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={roomType.image} alt="Không gian thư giãn trong phòng" className="h-full w-full scale-110 object-cover object-right" /><span className="absolute bottom-3 right-3 flex items-center gap-1.5 border border-[#d5cec2] bg-[#f4f0e8]/95 px-3 py-2 text-xs font-bold text-[#183b35]"><Expand className="h-4 w-4" aria-hidden="true" /> Không gian phòng</span></div>
        </section>

        <div className="relative z-10 -mt-3 px-1 sm:px-4"><HeroSearch roomTypes={roomTypes} compact initialValues={{ tenLp: roomType.tenLp, ngDen, ngDi, guests }} /></div>

        <div className="mt-10 grid items-start gap-9 lg:grid-cols-[minmax(0,1fr)_350px]">
          <main className="min-w-0">
            <section className="border border-[#d5cec2] bg-[#fbf9f5] p-5 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a6a2f]">Về căn phòng</p><h2 className="mt-2 font-display text-2xl font-bold text-[#183b35]">Một không gian để thở.</h2><p className="mt-4 text-sm leading-7 text-[#4e4b44] sm:text-base">{roomType.description}</p>
              <div className="mt-7 grid gap-4 border-y border-[#d5cec2] py-5 sm:grid-cols-3"><div className="flex items-center gap-3"><BedDouble className="h-5 w-5 text-[#9a6a2f]" aria-hidden="true" /><div><p className="text-xs text-[#6c685f]">Giường</p><p className="text-sm font-bold text-[#183b35]">{roomType.beds} giường</p></div></div><div className="flex items-center gap-3"><Users className="h-5 w-5 text-[#9a6a2f]" aria-hidden="true" /><div><p className="text-xs text-[#6c685f]">Sức chứa</p><p className="text-sm font-bold text-[#183b35]">Tối đa {roomType.capacity} khách</p></div></div><div className="flex items-center gap-3"><Wifi className="h-5 w-5 text-[#9a6a2f]" aria-hidden="true" /><div><p className="text-xs text-[#6c685f]">Kết nối</p><p className="text-sm font-bold text-[#183b35]">WiFi miễn phí</p></div></div></div>
              <h3 className="mt-7 font-display text-xl font-bold text-[#183b35]">Tiện nghi trong phòng</h3><ul className="mt-4 grid gap-3 text-sm text-[#4e4b44] sm:grid-cols-2">{roomType.amenities.map((amenity) => <li key={amenity} className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0 text-[#285b4d]" aria-hidden="true" /> {amenity}</li>)}<li className="flex items-center gap-2"><Coffee className="h-4 w-4 shrink-0 text-[#9a6a2f]" aria-hidden="true" /> Trà và cà phê trong phòng</li><li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-[#9a6a2f]" aria-hidden="true" /> Hỗ trợ khách lưu trú 24/7</li></ul>
            </section>

            <section className="mt-9 border-t border-[#d5cec2] pt-8" aria-labelledby="available-title">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a6a2f]">Ngày bạn chọn</p><h2 id="available-title" className="mt-2 font-display text-2xl font-bold text-[#183b35]">Đặt hạng phòng này</h2><p className="mt-1 text-sm text-[#6c685f]">{formatDate(ngDen)} – {formatDate(ngDi)} · {nights} đêm · {guests} khách</p></div><p className="text-sm font-bold text-[#285b4d]">{selectedRoom ? "Sẵn sàng để đặt" : "Cần chọn ngày khác"}</p></div>
              {selectedRoom ? <div className="mt-5 border border-[#d5cec2] bg-[#fbf9f5] p-5 sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="flex items-center gap-2 text-sm font-bold text-[#285b4d]"><Check className="h-4 w-4" aria-hidden="true" /> Có lựa chọn phù hợp</p><p className="mt-2 text-sm leading-6 text-[#6c685f]">LumiStay sẽ sắp xếp căn phòng phù hợp trong hạng phòng này cho kỳ lưu trú của bạn.</p></div><div className="border-t border-[#d5cec2] pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right"><p className="text-xs text-[#6c685f]">Tổng cho {nights} đêm</p><p className="mt-1 text-xl font-bold text-[#183b35]">{formatCurrency(selectedRoom.gia * nights)}</p><div className="mt-3"><BookRoomButton room={selectedRoom} ngDen={ngDen} ngDi={ngDi} guests={guests} /></div></div></div></div> : <div className="mt-5 border border-[#d5cec2] bg-[#fbf9f5] p-7 text-center"><p className="font-bold text-[#183b35]">Chưa có lựa chọn cho ngày hiện tại.</p><p className="mt-1 text-sm text-[#6c685f]">Hãy đổi ngày trong thanh tìm kiếm phía trên để xem thời gian khác.</p></div>}
            </section>
          </main>

          <aside className="border border-[#d5cec2] bg-[#fbf9f5] lg:sticky lg:top-24">
            <div className="border-b border-[#355b53] bg-[#183b35] p-6 text-[#f4f0e8]"><p className="text-xs text-[#d7d9cf]">Giá từ mỗi đêm</p><p className="mt-1 text-3xl font-bold">{formatCurrency(roomType.gia)}</p><p className="mt-1 text-xs text-[#d7d9cf]">Cho tối đa {roomType.capacity} khách</p></div>
            <div className="p-6"><div className="grid grid-cols-2 divide-x divide-[#d5cec2] border border-[#d5cec2] py-3"><div className="px-3"><p className="text-[10px] font-bold uppercase text-[#6c685f]">Nhận phòng</p><p className="mt-1 text-sm font-bold text-[#25241f]">{formatDate(ngDen)}</p></div><div className="px-3"><p className="text-[10px] font-bold uppercase text-[#6c685f]">Trả phòng</p><p className="mt-1 text-sm font-bold text-[#25241f]">{formatDate(ngDi)}</p></div></div><p className="mt-4 flex items-center gap-2 text-xs text-[#6c685f]"><Clock3 className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> {nights} đêm · Nhận phòng từ 14:00</p><dl className="mt-5 space-y-3 border-t border-[#d5cec2] pt-5 text-sm"><div className="flex justify-between gap-3"><dt className="text-[#6c685f]">{nights} đêm</dt><dd className="font-semibold text-[#25241f]">{formatCurrency(roomType.gia * nights)}</dd></div><div className="flex justify-between gap-3"><dt className="font-bold text-[#183b35]">Tổng tham khảo</dt><dd className="text-lg font-bold text-[#183b35]">{formatCurrency(roomType.gia * nights)}</dd></div></dl><Link href={`/search?ngDen=${ngDen}&ngDi=${ngDi}&guests=${guests}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-[#183b35] px-5 py-3.5 text-center text-sm font-bold text-[#183b35] transition hover:bg-[#183b35] hover:text-[#f4f0e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]">Xem tất cả hạng phòng <ArrowRightIcon /></Link></div><div className="border-t border-[#d7b27a]/60 bg-[#f4f0e8] p-4 text-xs leading-5 text-[#4e4b44]"><p className="flex items-center gap-2 font-bold text-[#183b35]"><Check className="h-4 w-4 text-[#285b4d]" aria-hidden="true" /> Chính sách dễ hiểu</p><p className="mt-1">Hủy miễn phí trước 24 giờ. Phần còn lại thanh toán khi nhận phòng.</p></div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon() { return <span aria-hidden="true">→</span>; }
