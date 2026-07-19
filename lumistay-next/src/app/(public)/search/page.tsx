import Link from "next/link";
import { AlertCircle, ArrowRight, BedDouble, Check, ChevronRight, Clock3, CreditCard, MapPin, ShieldCheck, Users } from "lucide-react";
import { HeroSearch } from "@/components/public/hero-search";
import { BookRoomButton } from "@/components/public/book-room-button";
import { getRoomTypes, searchAvailableRooms } from "@/lib/repository";
import type { AvailableRoom, RoomType } from "@/lib/types";
import { formatCurrency, formatDate, nightsBetween } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ tenLp?: string; ngDen?: string; ngDi?: string; guests?: string }>;
};

type RoomTypeResult = {
  type: RoomType;
  room: AvailableRoom;
};

function dateInputOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const roomTypes = await getRoomTypes();
  const ngDen = params.ngDen || dateInputOffset(1);
  const ngDi = params.ngDi || dateInputOffset(2);
  const requestedGuests = Number(params.guests || 2);
  const guests = Number.isFinite(requestedGuests) ? Math.min(6, Math.max(1, requestedGuests)) : 2;
  const nights = nightsBetween(ngDen, ngDi);

  const availability = nights > 0
    ? await Promise.all(roomTypes.map(async (type) => ({ type, rooms: await searchAvailableRooms(type.tenLp, ngDen, ngDi) })))
    : [];
  const results: RoomTypeResult[] = availability
    .filter(({ type, rooms }) => type.capacity >= guests && rooms.length > 0)
    .map(({ type, rooms }) => ({ type, room: rooms[0] }));

  return (
    <div className="bg-[#f4f0e8] pb-16">
      <section className="border-b border-[#355b53] bg-[#183b35] py-6">
        <div className="mx-auto max-w-7xl px-5 lg:px-8"><HeroSearch roomTypes={roomTypes} compact initialValues={{ tenLp: params.tenLp, ngDen, ngDi, guests }} /></div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <nav aria-label="Đường dẫn" className="mb-7 flex items-center gap-1 text-xs text-[#6c685f]"><Link href="/" className="rounded-sm text-[#183b35] hover:text-[#9a6a2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]">Trang chủ</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><span aria-current="page">Phòng nghỉ</span></nav>

        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="h-fit border border-[#d5cec2] bg-[#fbf9f5] p-5 lg:sticky lg:top-24">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a6a2f]">Kỳ lưu trú của bạn</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#183b35]">LumiStay</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-[#6c685f]">Nhận phòng</dt><dd className="mt-1 font-bold text-[#25241f]">{formatDate(ngDen)}</dd><dd className="text-xs text-[#6c685f]">Từ 14:00</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-[#6c685f]">Trả phòng</dt><dd className="mt-1 font-bold text-[#25241f]">{formatDate(ngDi)}</dd><dd className="text-xs text-[#6c685f]">Trước 12:00</dd></div>
              <div className="grid grid-cols-2 gap-3 border-t border-[#d5cec2] pt-4"><div><dt className="text-xs text-[#6c685f]">Thời gian</dt><dd className="font-bold text-[#25241f]">{nights} đêm</dd></div><div><dt className="text-xs text-[#6c685f]">Số khách</dt><dd className="font-bold text-[#25241f]">{guests} khách</dd></div></div>
            </dl>
            <div className="mt-6 border-l-2 border-[#9a6a2f] bg-[#f4f0e8] p-3 text-xs leading-5 text-[#4e4b44]"><ShieldCheck className="mb-2 h-5 w-5 text-[#9a6a2f]" aria-hidden="true" /><strong className="block text-[#183b35]">Đặt trực tiếp cùng khách sạn</strong>Giá, điều kiện và khoản đặt cọc được hiển thị trước khi bạn xác nhận.</div>
          </aside>

          <main>
            <div className="border-b border-[#d5cec2] pb-6">
              <p className="flex items-center gap-1.5 text-sm font-medium text-[#6c685f]"><MapPin className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> LumiStay Hotel &amp; Residence · Trung tâm thành phố</p>
              <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-[#183b35] sm:text-4xl">Phòng nghỉ cho những ngày bạn đã chọn.</h1>
              <p className="mt-3 text-sm text-[#6c685f]">{formatDate(ngDen)} – {formatDate(ngDi)} · {nights} đêm · {guests} khách · Hiển thị theo hạng phòng</p>
            </div>

            {nights < 1 ? (
              <div className="mt-7 border border-[#c98d7e] bg-[#fbf0ed] p-8 text-center"><AlertCircle className="mx-auto h-9 w-9 text-[#a34832]" aria-hidden="true" /><h2 className="mt-4 font-display text-2xl font-bold text-[#183b35]">Ngày trả phòng cần sau ngày nhận phòng</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#6c685f]">Hãy điều chỉnh ngày trong thanh tìm kiếm phía trên để xem những phòng còn trống.</p></div>
            ) : results.length === 0 ? (
              <div className="mt-7 border border-[#d5cec2] bg-[#fbf9f5] p-8 text-center sm:p-12"><AlertCircle className="mx-auto h-10 w-10 text-[#9a6a2f]" aria-hidden="true" /><h2 className="mt-4 font-display text-2xl font-bold text-[#183b35]">Chưa có hạng phòng phù hợp</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#6c685f]">Bạn có thể thử một khoảng ngày khác hoặc giảm số khách. Chúng tôi luôn hiển thị toàn bộ hạng phòng phù hợp với kỳ lưu trú.</p><Link href="/" className="mt-6 inline-flex items-center gap-2 border border-[#183b35] px-5 py-3 text-sm font-bold text-[#183b35] transition hover:bg-[#183b35] hover:text-[#f4f0e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]">Về trang chủ <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
            ) : (
              <div className="mt-7 space-y-5">
                <p className="text-sm text-[#6c685f]"><span className="font-bold text-[#183b35]">{results.length} hạng phòng</span> đang có lựa chọn cho kỳ lưu trú này.</p>
                {results.map(({ type, room }, index) => {
                  const total = room.gia * nights;
                  const deposit = Math.round(total * 0.3);
                  return (
                    <article key={type.malp} className="overflow-hidden border border-[#d5cec2] bg-[#fbf9f5] transition hover:border-[#9a6a2f]">
                      <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
                        <Link href={`/rooms/${type.malp}?ngDen=${ngDen}&ngDi=${ngDi}&guests=${guests}`} className="group relative block min-h-52 overflow-hidden bg-[#e9e2d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f] focus-visible:ring-inset" aria-label={`Xem chi tiết ${type.tenLp}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={type.image} alt={`Không gian ${type.tenLp}`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                          {index === 0 ? <span className="absolute left-3 top-3 border border-[#d7b27a] bg-[#f4f0e8]/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#183b35]">Đề xuất</span> : null}
                        </Link>

                        <div className="flex min-w-0 flex-col p-5 sm:p-6">
                          <div className="flex flex-col gap-5 xl:flex-row xl:justify-between">
                            <div className="min-w-0">
                              <Link href={`/rooms/${type.malp}?ngDen=${ngDen}&ngDi=${ngDi}&guests=${guests}`} className="font-display text-2xl font-bold text-[#183b35] hover:text-[#9a6a2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]">{type.tenLp}</Link>
                              <p className="mt-2 max-w-xl text-sm leading-6 text-[#6c685f]">{type.description}</p>
                              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#4e4b44]"><span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> {type.beds} giường</span><span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> Tối đa {type.capacity} khách</span></div>
                              <ul className="mt-4 grid gap-2 text-xs text-[#4e4b44] sm:grid-cols-2">{type.amenities.slice(0, 4).map((amenity) => <li key={amenity} className="flex items-center gap-1.5"><Check className="h-4 w-4 shrink-0 text-[#285b4d]" aria-hidden="true" /> {amenity}</li>)}</ul>
                            </div>

                            <div className="shrink-0 border-t border-[#d5cec2] pt-4 xl:w-52 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0 xl:text-right">
                              <p className="text-xs text-[#6c685f]">Tổng cho {nights} đêm</p><p className="mt-1 text-2xl font-bold text-[#183b35]">{formatCurrency(total)}</p><p className="text-xs text-[#6c685f]">{formatCurrency(room.gia)} mỗi đêm</p><p className="mt-2 text-xs font-semibold text-[#4e4b44]">Đặt cọc {formatCurrency(deposit)}</p><div className="mt-4"><BookRoomButton room={room} ngDen={ngDen} ngDi={ngDi} guests={guests} /></div>
                            </div>
                          </div>
                          <div className="mt-5 grid gap-2 border-t border-[#e1dbd1] pt-4 text-xs sm:grid-cols-3"><p className="flex items-center gap-1.5 font-semibold text-[#285b4d]"><Check className="h-4 w-4" aria-hidden="true" /> Hủy miễn phí trước 24 giờ</p><p className="flex items-center gap-1.5 text-[#4e4b44]"><CreditCard className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> Cọc 30%, trả phần còn lại khi nhận phòng</p><p className="flex items-center gap-1.5 text-[#4e4b44]"><Clock3 className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> Đội ngũ LumiStay hỗ trợ trực tiếp</p></div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
