import Link from "next/link";
import { Award, BadgeCheck, Coffee, Dumbbell, MapPin, ShieldCheck, Sparkles, Waves, Wifi } from "lucide-react";
import { HeroSearch } from "@/components/public/hero-search";
import { RoomTypeCard } from "@/components/public/room-type-card";
import { getRoomTypes } from "@/lib/repository";

const amenities = [
  { icon: Wifi, title: "WiFi tốc độ cao", description: "Kết nối miễn phí trong toàn bộ khuôn viên" },
  { icon: Coffee, title: "Bữa sáng mỗi ngày", description: "Thực đơn đa dạng phục vụ từ 06:00 đến 10:00" },
  { icon: Waves, title: "Hồ bơi vô cực", description: "Không gian thư giãn với tầm nhìn thành phố" },
  { icon: Dumbbell, title: "Phòng gym 24/7", description: "Thiết bị hiện đại cho lịch tập linh hoạt" },
  { icon: Sparkles, title: "Spa & wellness", description: "Liệu trình thư giãn cho kỳ nghỉ trọn vẹn" },
  { icon: ShieldCheck, title: "Hỗ trợ 24/7", description: "Đội ngũ luôn sẵn sàng trong suốt kỳ lưu trú" },
];

const reviews = [
  { name: "Minh Anh", origin: "TP. Hồ Chí Minh", rating: 9.2, text: "Phòng sạch sẽ, yên tĩnh và đúng như hình. Nhân viên hỗ trợ nhận phòng rất nhanh và chuyên nghiệp.", date: "Tháng 6, 2026" },
  { name: "Hoàng Long", origin: "Đà Nẵng", rating: 8.8, text: "Vị trí thuận tiện, giường thoải mái và thông tin giá rõ ràng. Tôi sẽ quay lại trong chuyến công tác tới.", date: "Tháng 5, 2026" },
  { name: "Thu Hà", origin: "Hà Nội", rating: 9.0, text: "Family Suite rộng rãi, phù hợp với gia đình. Các tiện ích và giờ nhận phòng đều được hướng dẫn rõ ràng.", date: "Tháng 4, 2026" },
];

export default async function HomePage() {
  const roomTypes = await getRoomTypes();
  const reviewCount = roomTypes.reduce((sum, room) => sum + room.reviewCount, 0);

  return (
    <>
      <section className="relative overflow-visible bg-[#003580] pb-16 pt-10 md:pb-24 md:pt-16">
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85" alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00275f] via-[#003580]/90 to-[#003580]/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-3xl text-white">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#febb02] sm:text-sm">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Kỳ nghỉ của bạn, theo cách trọn vẹn nhất
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
              Tìm nơi lưu trú lý tưởng cho hành trình của bạn
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-blue-50 md:text-lg">
              Phòng nghỉ tiện nghi, mức giá rõ ràng và xác nhận nhanh chóng tại LumiStay Hotel &amp; Resort.
            </p>
          </div>

          <div className="relative mt-8 md:mt-10">
            <HeroSearch roomTypes={roomTypes} />
          </div>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-blue-50 sm:text-sm">
            <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#febb02]" aria-hidden="true" /> Giá hiển thị rõ ràng</span>
            <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#febb02]" aria-hidden="true" /> Lựa chọn hủy linh hoạt</span>
            <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#febb02]" aria-hidden="true" /> Hỗ trợ trong suốt kỳ nghỉ</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20" aria-labelledby="featured-rooms">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#006ce4]">Được khách hàng yêu thích</p>
            <h2 id="featured-rooms" className="mt-2 font-display text-3xl font-bold text-gray-900 md:text-4xl">Phòng nghỉ nổi bật</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">Từ chuyến công tác ngắn ngày đến kỳ nghỉ gia đình, luôn có lựa chọn phù hợp cho bạn.</p>
          </div>
          <Link href="/search" className="booking-btn-secondary inline-flex w-fit items-center justify-center focus-visible:ring-4 focus-visible:ring-[#006ce4] focus-visible:ring-offset-2">Xem tất cả phòng</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roomTypes.slice(0, 3).map((roomType) => <RoomTypeCard key={roomType.malp} roomType={roomType} />)}
        </div>
      </section>

      <section id="amenities" className="scroll-mt-24 border-y border-gray-200 bg-white py-14 md:py-20" aria-labelledby="amenities-title">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#006ce4]">Tiện nghi chu đáo</p>
            <h2 id="amenities-title" className="mt-2 font-display text-3xl font-bold text-gray-900 md:text-4xl">Mọi điều bạn cần cho một kỳ nghỉ thoải mái</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/40 sm:p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#003580] text-white"><Icon className="h-5 w-5" aria-hidden="true" /></div>
                  <h3 className="mt-4 text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="reviews" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20" aria-labelledby="reviews-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#006ce4]"><Award className="h-5 w-5 text-[#febb02]" aria-hidden="true" /> Trải nghiệm thực tế</p>
            <h2 id="reviews-title" className="mt-2 font-display text-3xl font-bold text-gray-900 md:text-4xl">Khách lưu trú nói gì?</h2>
          </div>
          <p className="text-sm text-gray-600"><span className="font-bold text-gray-900">8.9/10</span> · {reviewCount} đánh giá</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <blockquote key={review.name} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div><p className="font-bold text-gray-900">{review.name}</p><p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500"><MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {review.origin}</p></div>
                <span className="rounded-md bg-[#003580] px-2.5 py-1.5 text-sm font-bold text-white">{review.rating}</span>
              </div>
              <p className="mt-5 text-sm leading-6 text-gray-700">“{review.text}”</p>
              <footer className="mt-4 text-xs text-gray-500">Đã lưu trú · {review.date}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-[#003580] py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 text-white md:flex-row md:items-center md:px-6">
          <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#febb02]">Sẵn sàng lên đường?</p><h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Kỳ nghỉ tiếp theo chỉ cách vài bước.</h2><p className="mt-2 text-sm text-blue-100 md:text-base">Chọn ngày lưu trú để xem phòng còn trống và tổng giá ngay hôm nay.</p></div>
          <Link href="/search" className="booking-btn-primary inline-flex shrink-0 px-8 py-4 text-base focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#003580]">Tìm phòng ngay</Link>
        </div>
      </section>
    </>
  );
}
