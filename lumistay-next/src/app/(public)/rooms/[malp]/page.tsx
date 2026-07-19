import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Check, ChevronRight, Clock3, Coffee, CreditCard, Expand, MapPin, ShieldCheck, Star, Users, Wifi } from "lucide-react";
import { HeroSearch } from "@/components/public/hero-search";
import { BookRoomButton } from "@/components/public/book-room-button";
import { getRoomTypeByMalp, getRoomTypes, searchAvailableRooms } from "@/lib/repository";
import { formatCurrency, formatDate, nightsBetween } from "@/lib/utils";

type Props = {
  params: Promise<{ malp: string }>;
  searchParams: Promise<{ ngDen?: string; ngDi?: string; guests?: string }>;
};

function dateInputOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  const guests = Number.isFinite(requestedGuests) ? Math.min(roomType.capacity, Math.max(1, requestedGuests)) : 2;
  const nights = nightsBetween(ngDen, ngDi);
  const available = nights > 0 ? await searchAvailableRooms(roomType.tenLp, ngDen, ngDi) : [];

  return (
    <div className="bg-gray-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
        <nav aria-label="Đường dẫn" className="flex flex-wrap items-center gap-1 text-xs text-gray-600">
          <Link href="/" className="rounded-sm text-[#006ce4] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006ce4]">Trang chủ</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><Link href="/search" className="rounded-sm text-[#006ce4] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006ce4]">Phòng nghỉ</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><span aria-current="page">{roomType.tenLp}</span>
        </nav>

        <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><div className="flex flex-wrap items-center gap-2">{roomType.badge ? <span className="rounded bg-[#febb02] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#003580]">{roomType.badge}</span> : null}<span className="flex gap-0.5" aria-label="Khách sạn 4 sao">{[1,2,3,4].map((star) => <Star key={star} className="h-3.5 w-3.5 fill-[#febb02] text-[#febb02]" aria-hidden="true" />)}</span></div><h1 className="mt-2 font-display text-4xl font-bold leading-tight text-gray-900 md:text-5xl">{roomType.tenLp}</h1><p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600"><MapPin className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> LumiStay Hotel &amp; Resort · Trung tâm thành phố</p></div>
          <div className="flex items-center gap-3"><div className="text-right"><p className="text-sm font-bold text-gray-900">Tuyệt vời</p><p className="text-xs text-gray-500">{roomType.reviewCount} đánh giá</p></div><span className="rounded-lg rounded-bl-none bg-[#003580] px-3 py-2 text-lg font-bold text-white">{roomType.rating}</span></div>
        </header>

        <section className="mt-6 grid h-[310px] gap-2 overflow-hidden rounded-xl sm:grid-cols-[2fr_1fr] md:h-[430px]" aria-label="Hình ảnh phòng">
          <div className="relative overflow-hidden bg-gray-200 sm:row-span-2">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={roomType.image} alt={`Phòng ngủ ${roomType.tenLp}`} className="h-full w-full object-cover" /></div>
          <div className="relative hidden overflow-hidden bg-gray-200 sm:block">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={roomType.image} alt={`Không gian nghỉ ngơi của ${roomType.tenLp}`} className="h-full w-full scale-125 object-cover object-left" /></div>
          <div className="relative hidden overflow-hidden bg-gray-200 sm:block">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={roomType.image} alt={`Tiện nghi trong ${roomType.tenLp}`} className="h-full w-full scale-110 object-cover object-right" /><span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-white/95 px-3 py-2 text-xs font-bold text-gray-900 shadow"><Expand className="h-4 w-4" aria-hidden="true" /> Không gian phòng</span></div>
        </section>

        <div className="relative z-10 -mt-3 px-2 sm:px-4"><HeroSearch roomTypes={roomTypes} compact initialValues={{ tenLp: roomType.tenLp, ngDen, ngDi, guests }} /></div>

        <div className="mt-9 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0">
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="font-display text-2xl font-bold text-gray-900">Trải nghiệm trong phòng</h2>
              <p className="mt-3 text-sm leading-7 text-gray-700 sm:text-base">{roomType.description}</p>
              <div className="mt-6 grid gap-4 border-y border-gray-200 py-5 sm:grid-cols-3"><div className="flex items-center gap-3"><BedDouble className="h-5 w-5 text-[#006ce4]" aria-hidden="true" /><div><p className="text-xs text-gray-500">Giường</p><p className="text-sm font-bold">{roomType.beds} giường</p></div></div><div className="flex items-center gap-3"><Users className="h-5 w-5 text-[#006ce4]" aria-hidden="true" /><div><p className="text-xs text-gray-500">Sức chứa</p><p className="text-sm font-bold">Tối đa {roomType.capacity} khách</p></div></div><div className="flex items-center gap-3"><Wifi className="h-5 w-5 text-[#006ce4]" aria-hidden="true" /><div><p className="text-xs text-gray-500">Kết nối</p><p className="text-sm font-bold">WiFi miễn phí</p></div></div></div>

              <h3 className="mt-6 font-display text-xl font-bold text-gray-900">Tiện nghi nổi bật</h3>
              <ul className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">{roomType.amenities.map((amenity) => <li key={amenity} className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0 text-green-700" aria-hidden="true" /> {amenity}</li>)}<li className="flex items-center gap-2"><Coffee className="h-4 w-4 shrink-0 text-[#006ce4]" aria-hidden="true" /> Trà và cà phê trong phòng</li><li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-[#006ce4]" aria-hidden="true" /> Hỗ trợ khách lưu trú 24/7</li></ul>
            </section>

            <section className="mt-7" aria-labelledby="available-title">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="available-title" className="font-display text-2xl font-bold text-gray-900">Chọn phòng còn trống</h2><p className="mt-1 text-sm text-gray-600">{formatDate(ngDen)} – {formatDate(ngDi)} · {nights} đêm · {guests} khách</p></div><p className="text-sm font-bold text-[#003580]">{available.length} phòng phù hợp</p></div>

              {nights < 1 || available.length === 0 ? <div className="mt-4 rounded-xl border border-gray-200 bg-white p-7 text-center"><p className="font-bold text-gray-900">Chưa có phòng cho lựa chọn hiện tại</p><p className="mt-1 text-sm text-gray-600">Hãy thay đổi ngày lưu trú trong thanh tìm kiếm phía trên.</p></div> : <div className="mt-4 space-y-4">{available.map((room) => { const total = room.gia * nights; return <article key={room.soPhg} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-xl font-bold text-gray-900">{room.tenLp} · Phòng {room.soPhg}</h3><span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase text-green-800">Còn trống</span></div><div className="mt-3 grid gap-2 text-xs sm:grid-cols-2"><p className="flex items-center gap-1.5 font-semibold text-green-700"><Check className="h-4 w-4" aria-hidden="true" /> Hủy miễn phí trước 24 giờ</p><p className="flex items-center gap-1.5 text-gray-700"><CreditCard className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> Đặt cọc 30%</p></div></div><div className="border-t border-gray-200 pt-4 sm:min-w-48 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 sm:text-right"><p className="text-xs text-gray-500">Tổng cho {nights} đêm</p><p className="text-xl font-bold text-gray-900">{formatCurrency(total)}</p><p className="text-xs text-gray-500">{formatCurrency(room.gia)} / đêm</p><div className="mt-3"><BookRoomButton room={room} ngDen={ngDen} ngDi={ngDi} guests={guests} /></div></div></div></article>; })}</div>}
            </section>
          </main>

          <aside className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-24">
            <div className="p-6"><p className="text-sm text-gray-500">Giá từ mỗi đêm</p><p className="mt-1 text-3xl font-bold text-[#003580]">{formatCurrency(roomType.gia)}</p><p className="mt-1 text-xs text-gray-500">Cho tối đa {roomType.capacity} khách</p><div className="mt-5 rounded-lg border border-gray-200 p-4"><div className="grid grid-cols-2 divide-x divide-gray-200"><div className="pr-3"><p className="text-[10px] font-bold uppercase text-gray-500">Nhận phòng</p><p className="mt-1 text-sm font-bold">{formatDate(ngDen)}</p></div><div className="pl-3"><p className="text-[10px] font-bold uppercase text-gray-500">Trả phòng</p><p className="mt-1 text-sm font-bold">{formatDate(ngDi)}</p></div></div><p className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-600"><Clock3 className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> {nights} đêm · {guests} khách</p></div><dl className="mt-5 space-y-3 border-t border-gray-200 pt-5 text-sm"><div className="flex justify-between gap-3"><dt className="text-gray-600">{nights} đêm</dt><dd className="font-semibold">{formatCurrency(roomType.gia * nights)}</dd></div><div className="flex justify-between gap-3"><dt className="font-bold">Tổng tham khảo</dt><dd className="text-lg font-bold text-[#003580]">{formatCurrency(roomType.gia * nights)}</dd></div></dl><Link href={`/search?tenLp=${encodeURIComponent(roomType.tenLp)}&ngDen=${ngDen}&ngDi=${ngDi}&guests=${guests}`} className="booking-btn-primary mt-5 block w-full py-3.5 text-center focus-visible:ring-4 focus-visible:ring-[#006ce4] focus-visible:ring-offset-2">Xem tất cả phòng trống</Link></div><div className="border-t border-green-100 bg-green-50 p-4 text-xs leading-5 text-green-800"><p className="flex items-center gap-2 font-bold"><Check className="h-4 w-4" aria-hidden="true" /> Lựa chọn linh hoạt</p><p className="mt-1">Hủy miễn phí trước 24 giờ. Phần còn lại thanh toán khi nhận phòng.</p></div>
          </aside>
        </div>
      </div>
    </div>
  );
}
