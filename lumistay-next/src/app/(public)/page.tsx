import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, Coffee, Dumbbell, MapPin, ShieldCheck, Sparkles, Waves, Wifi } from "lucide-react";
import { HeroSearch } from "@/components/public/hero-search";
import { RoomTypeCard } from "@/components/public/room-type-card";
import { getRoomTypes } from "@/lib/repository";

const amenities = [
  { icon: Wifi, title: "Kết nối liền mạch", description: "WiFi tốc độ cao trong phòng và mọi không gian chung." },
  { icon: Coffee, title: "Bữa sáng thong thả", description: "Thực đơn tươi ngon phục vụ từ 06:00 đến 10:00 mỗi ngày." },
  { icon: Waves, title: "Hồ bơi trên cao", description: "Một khoảng lặng để ngắm thành phố và thả nhịp sống chậm lại." },
  { icon: Dumbbell, title: "Phòng gym 24/7", description: "Không gian tập luyện riêng tư, mở cửa theo lịch của bạn." },
  { icon: Sparkles, title: "Chăm sóc nhẹ nhàng", description: "Đội ngũ lễ tân luôn sẵn sàng để kỳ nghỉ diễn ra tự nhiên." },
  { icon: ShieldCheck, title: "An tâm khi đặt trực tiếp", description: "Giá rõ ràng, điều kiện dễ hiểu và hỗ trợ từ chính khách sạn." },
];

export default async function HomePage() {
  const roomTypes = await getRoomTypes();

  return (
    <>
      <section className="border-b border-[#d5cec2] bg-[#f4f0e8]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-12 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-20 lg:pt-16">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a6a2f]"><BadgeCheck className="h-4 w-4" aria-hidden="true" /> Một khách sạn, một nhịp sống riêng</p>
            <h1 className="mt-5 max-w-xl font-display text-4xl font-bold leading-[1.08] text-[#183b35] sm:text-5xl">Ở lại thành phố, theo cách thật dễ chịu.</h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-[#4e4b44] sm:text-lg">LumiStay là một khách sạn boutique giữa trung tâm — nơi những ngày bận rộn có thể khép lại bằng một căn phòng yên tĩnh, một bữa sáng chậm rãi và sự chăm sóc vừa đủ.</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#4e4b44]">
              <span className="flex items-center gap-2"><CheckMark /> Giá trực tiếp rõ ràng</span>
              <span className="flex items-center gap-2"><CheckMark /> Xác nhận tức thì</span>
              <span className="flex items-center gap-2"><CheckMark /> Đội ngũ tại chỗ</span>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden bg-[#d8d0c3] lg:min-h-[500px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85" alt="Sảnh và khu nghỉ của LumiStay" className="h-full min-h-[360px] w-full object-cover lg:min-h-[500px]" />
            <div className="absolute bottom-5 left-5 max-w-[230px] border border-[#f4f0e8]/60 bg-[#183b35]/95 p-4 text-[#f4f0e8]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d7b27a]">LumiStay, trung tâm thành phố</p>
              <p className="mt-2 text-sm leading-6">Một điểm trở về bình tĩnh giữa những hành trình.</p>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-7 lg:px-8 lg:pb-10"><HeroSearch roomTypes={roomTypes} /></div>
      </section>

      <section id="story" className="scroll-mt-24 mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-24">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a6a2f]">Câu chuyện của chúng tôi</p>
          <h2 className="mt-3 max-w-sm font-display text-3xl font-bold leading-tight text-[#183b35] sm:text-4xl">Một căn cứ đẹp cho những ngày ở xa nhà.</h2>
        </div>
        <div className="grid gap-6 text-sm leading-7 text-[#4e4b44] sm:grid-cols-2 sm:gap-10">
          <p>Chúng tôi tin một khách sạn tốt không cần làm quá nhiều. Một chiếc giường thật thoải mái, ánh sáng ấm, những vật liệu bền đẹp và một người luôn nhớ bạn muốn dùng cà phê lúc mấy giờ.</p>
          <p>Từ LumiStay, bạn có thể đi bộ đến những con phố sôi động của thành phố rồi trở về với một không gian được giữ yên. Đặt trực tiếp với chúng tôi để được nhìn thấy toàn bộ thông tin trước khi quyết định.</p>
        </div>
      </section>

      <section className="border-y border-[#d5cec2] bg-[#e9e2d6]" aria-labelledby="rooms-title">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a6a2f]">Không gian nghỉ ngơi</p><h2 id="rooms-title" className="mt-3 font-display text-3xl font-bold text-[#183b35] sm:text-4xl">Chọn căn phòng hợp với nhịp của bạn.</h2></div>
            <Link href="/search" className="inline-flex w-fit items-center gap-2 border-b border-[#183b35] pb-1 text-sm font-bold text-[#183b35] transition hover:border-[#9a6a2f] hover:text-[#9a6a2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]">Xem ngày lưu trú <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{roomTypes.slice(0, 3).map((roomType) => <RoomTypeCard key={roomType.malp} roomType={roomType} />)}</div>
        </div>
      </section>

      <section id="amenities" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24" aria-labelledby="amenities-title">
        <div className="max-w-xl"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a6a2f]">Những điều nhỏ làm nên kỳ nghỉ</p><h2 id="amenities-title" className="mt-3 font-display text-3xl font-bold text-[#183b35] sm:text-4xl">Đủ đầy, không phô trương.</h2><p className="mt-4 text-sm leading-7 text-[#6c685f]">Mọi tiện nghi được chọn để phục vụ một ngày lưu trú thoải mái hơn, từ lúc bạn bước vào đến khi rời đi.</p></div>
        <div className="mt-10 grid border-l border-t border-[#d5cec2] sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((item) => { const Icon = item.icon; return <article key={item.title} className="border-b border-r border-[#d5cec2] bg-[#fbf9f5] p-6 sm:p-7"><Icon className="h-6 w-6 text-[#9a6a2f]" aria-hidden="true" /><h3 className="mt-5 text-base font-bold text-[#183b35]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#6c685f]">{item.description}</p></article>; })}
        </div>
      </section>

      <section id="location" className="scroll-mt-24 border-t border-[#d5cec2] bg-[#183b35] text-[#f4f0e8]" aria-labelledby="location-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_1fr] lg:px-8 lg:py-20">
          <div><p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d7b27a]"><MapPin className="h-4 w-4" aria-hidden="true" /> Vị trí</p><h2 id="location-title" className="mt-3 font-display text-3xl font-bold sm:text-4xl">Gần nơi bạn cần, đủ xa để nghỉ ngơi.</h2><p className="mt-5 max-w-lg text-sm leading-7 text-[#d7d9cf]">LumiStay nằm tại trung tâm thành phố, thuận tiện cho những cuộc hẹn, những buổi khám phá ẩm thực và một buổi tối trở về thật nhẹ nhàng.</p><div className="mt-7 flex flex-wrap gap-5 text-sm text-[#d7d9cf]"><span>10 phút đến khu phố cổ</span><span>25 phút từ sân bay</span></div></div>
          <div className="border border-[#355b53] p-6 sm:p-8"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d7b27a]">Đặt trực tiếp cùng LumiStay</p><ul className="mt-5 space-y-4 text-sm leading-6 text-[#d7d9cf]"><li className="flex gap-3"><BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#d7b27a]" aria-hidden="true" /> Giá và chính sách hiển thị rõ trước khi bạn xác nhận.</li><li className="flex gap-3"><BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#d7b27a]" aria-hidden="true" /> Đội ngũ khách sạn hỗ trợ trực tiếp, không qua trung gian.</li><li className="flex gap-3"><BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#d7b27a]" aria-hidden="true" /> Xác nhận đặt phòng gửi ngay sau khi hoàn tất.</li></ul><Link href="/search" className="mt-7 inline-flex items-center gap-2 border border-[#d7b27a] px-5 py-3 text-sm font-bold text-[#f4f0e8] transition hover:bg-[#d7b27a] hover:text-[#183b35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b27a]">Xem phòng còn trống <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
        </div>
      </section>
    </>
  );
}

function CheckMark() {
  return <span className="flex h-5 w-5 items-center justify-center border border-[#9a6a2f] text-[#9a6a2f]" aria-hidden="true"><Check className="h-3.5 w-3.5" /></span>;
}
