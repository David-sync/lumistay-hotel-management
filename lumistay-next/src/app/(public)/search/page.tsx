import Link from "next/link";
import { AlertCircle, BedDouble, Check, ChevronRight, Clock3, CreditCard, MapPin, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import { HeroSearch } from "@/components/public/hero-search";
import { BookRoomButton } from "@/components/public/book-room-button";
import { getRoomTypes, searchAvailableRooms } from "@/lib/repository";
import { formatCurrency, formatDate, nightsBetween } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ tenLp?: string; ngDen?: string; ngDi?: string; guests?: string }>;
};

function dateInputOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const roomTypes = await getRoomTypes();
  const tenLp = params.tenLp || roomTypes[0]?.tenLp || "Standard Single";
  const ngDen = params.ngDen || dateInputOffset(1);
  const ngDi = params.ngDi || dateInputOffset(2);
  const requestedGuests = Number(params.guests || 2);
  const guests = Number.isFinite(requestedGuests) ? Math.min(6, Math.max(1, requestedGuests)) : 2;
  const nights = nightsBetween(ngDen, ngDi);
  const rooms = nights > 0 ? await searchAvailableRooms(tenLp, ngDen, ngDi) : [];
  const roomType = roomTypes.find((type) => type.tenLp === tenLp);

  return (
    <div className="bg-gray-50 pb-16">
      <section className="border-b border-white/10 bg-[#003580] py-5 md:py-6">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <HeroSearch roomTypes={roomTypes} compact initialValues={{ tenLp, ngDen, ngDi, guests }} />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-7 md:px-6 md:py-10">
        <nav aria-label="Đường dẫn" className="mb-5 flex items-center gap-1 text-xs text-gray-600">
          <Link href="/" className="rounded-sm text-[#006ce4] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006ce4]">Trang chủ</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span aria-current="page">Kết quả tìm kiếm</span>
        </nav>

        <div className="grid gap-7 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-bold text-gray-900">Kỳ lưu trú của bạn</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nhận phòng</dt><dd className="mt-1 font-bold text-gray-900">{formatDate(ngDen)}</dd><dd className="text-xs text-gray-500">Từ 14:00</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Trả phòng</dt><dd className="mt-1 font-bold text-gray-900">{formatDate(ngDi)}</dd><dd className="text-xs text-gray-500">Trước 12:00</dd></div>
              <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-4"><div><dt className="text-xs text-gray-500">Thời gian</dt><dd className="font-bold">{nights} đêm</dd></div><div><dt className="text-xs text-gray-500">Số khách</dt><dd className="font-bold">{guests} khách</dd></div></div>
            </dl>
            <div className="mt-5 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-gray-700"><ShieldCheck className="mb-2 h-5 w-5 text-[#003580]" aria-hidden="true" /><strong className="block text-gray-900">Đặt phòng an tâm</strong>Giá từng lựa chọn và khoản cần đặt cọc được hiển thị trước khi xác nhận.</div>
          </aside>

          <main>
            <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium text-gray-600"><MapPin className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> LumiStay Hotel &amp; Resort</p>
                <h1 className="mt-1 font-display text-3xl font-bold text-gray-900 md:text-4xl">{tenLp}: {rooms.length} lựa chọn còn trống</h1>
                <p className="mt-2 text-sm text-gray-600">{formatDate(ngDen)} – {formatDate(ngDi)} · {nights} đêm · {guests} khách</p>
              </div>
              {roomType ? <div className="flex w-fit items-center gap-2"><div className="text-right"><p className="text-xs font-bold text-gray-900">Tuyệt vời</p><p className="text-[10px] text-gray-500">{roomType.reviewCount} đánh giá</p></div><span className="rounded-lg rounded-bl-none bg-[#003580] px-3 py-2 text-base font-bold text-white">{roomType.rating}</span></div> : null}
            </div>

            {nights < 1 ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm"><AlertCircle className="mx-auto h-10 w-10 text-red-500" aria-hidden="true" /><h2 className="mt-3 font-display text-2xl font-bold text-gray-900">Ngày trả phòng chưa hợp lệ</h2><p className="mx-auto mt-2 max-w-lg text-sm text-gray-600">Ngày trả phòng cần sau ngày nhận phòng ít nhất một đêm. Hãy điều chỉnh ngày trong thanh tìm kiếm phía trên.</p></div>
            ) : rooms.length === 0 ? (
              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12"><AlertCircle className="mx-auto h-11 w-11 text-gray-400" aria-hidden="true" /><h2 className="mt-4 font-display text-2xl font-bold text-gray-900">Chưa có phòng phù hợp trong khoảng ngày này</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">Thử chọn ngày khác hoặc khám phá một loại phòng khác bên dưới. Tình trạng phòng có thể thay đổi theo thời điểm.</p><Link href="/" className="booking-btn-secondary mt-6 inline-flex focus-visible:ring-4 focus-visible:ring-[#006ce4] focus-visible:ring-offset-2">Về trang chủ</Link></div>
            ) : (
              <div className="mt-6 space-y-5">
                {rooms.map((room, index) => {
                  const nightlyPrice = room.gia;
                  const total = nightlyPrice * nights;
                  const deposit = Math.round(total * 0.3);
                  const amenities = roomType?.amenities.slice(0, 4) || ["WiFi miễn phí", "Phòng tắm riêng", "Điều hòa", "Dọn phòng hằng ngày"];
                  return (
                    <article key={room.soPhg} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-blue-300 hover:shadow-booking">
                      <div className="grid md:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
                        <Link href={`/rooms/${room.malp}?ngDen=${ngDen}&ngDi=${ngDi}&guests=${guests}`} className="group relative block min-h-52 overflow-hidden bg-gray-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#006ce4] focus-visible:ring-inset md:min-h-full" aria-label={`Xem chi tiết ${room.tenLp}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={roomType?.image || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"} alt={`Không gian ${room.tenLp}`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                          {index === 0 ? <span className="absolute left-3 top-3 rounded-md bg-[#003580] px-2.5 py-1.5 text-xs font-bold text-white shadow">Được quan tâm</span> : null}
                        </Link>

                        <div className="flex min-w-0 flex-col p-5">
                          <div className="flex flex-col gap-4 xl:flex-row xl:justify-between">
                            <div className="min-w-0">
                              <Link href={`/rooms/${room.malp}?ngDen=${ngDen}&ngDi=${ngDi}&guests=${guests}`} className="rounded-sm font-display text-2xl font-bold text-[#006ce4] hover:text-[#003580] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006ce4]">{room.tenLp}</Link>
                              <p className="mt-1 text-xs font-medium text-gray-500">Phòng {room.soPhg} · Xác nhận theo phòng cụ thể</p>
                              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-gray-700"><span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> {roomType?.beds || 1} giường</span><span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> Tối đa {roomType?.capacity || guests} khách</span></div>
                              <ul className="mt-4 grid gap-2 text-xs text-gray-700 sm:grid-cols-2">{amenities.map((amenity) => <li key={amenity} className="flex items-center gap-1.5"><Check className="h-4 w-4 shrink-0 text-green-700" aria-hidden="true" /> {amenity}</li>)}</ul>
                            </div>

                            <div className="shrink-0 border-t border-gray-200 pt-4 xl:w-56 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0 xl:text-right">
                              <p className="text-xs text-gray-500">{nights} đêm, {guests} khách</p>
                              <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
                              <p className="text-xs text-gray-500">{formatCurrency(nightlyPrice)} mỗi đêm</p>
                              <p className="mt-2 text-xs font-semibold text-gray-700">Đặt cọc {formatCurrency(deposit)}</p>
                              <div className="mt-4"><BookRoomButton room={room} ngDen={ngDen} ngDi={ngDi} guests={guests} label="Đặt phòng" /></div>
                            </div>
                          </div>

                          <div className="mt-5 grid gap-2 border-t border-gray-100 pt-4 text-xs sm:grid-cols-3"><p className="flex items-center gap-1.5 font-bold text-green-700"><Check className="h-4 w-4" aria-hidden="true" /> Hủy miễn phí trước 24 giờ</p><p className="flex items-center gap-1.5 text-gray-700"><CreditCard className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> Cọc 30%, trả phần còn lại khi nhận phòng</p><p className="flex items-center gap-1.5 font-semibold text-orange-700"><Clock3 className="h-4 w-4" aria-hidden="true" /> Chỉ còn {rooms.length - index} lựa chọn</p></div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <section className="mt-10 border-t border-gray-200 pt-8" aria-labelledby="other-room-types">
              <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#f2a900]" aria-hidden="true" /><h2 id="other-room-types" className="font-display text-2xl font-bold text-gray-900">Bạn cũng có thể cân nhắc</h2></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{roomTypes.filter((type) => type.tenLp !== tenLp).map((type) => <Link key={type.malp} href={`/search?tenLp=${encodeURIComponent(type.tenLp)}&ngDen=${ngDen}&ngDi=${ngDi}&guests=${guests}`} className="rounded-lg border border-gray-200 bg-white p-4 transition hover:border-[#006ce4] hover:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#006ce4]/30"><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-[#003580]">{type.tenLp}</p><p className="mt-1 text-xs text-gray-600">Từ {formatCurrency(type.gia)} / đêm</p></div><span className="flex items-center gap-1 rounded bg-[#003580] px-2 py-1 text-xs font-bold text-white">{type.rating}<Star className="h-3 w-3 fill-[#febb02] text-[#febb02]" aria-hidden="true" /></span></div></Link>)}</div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
