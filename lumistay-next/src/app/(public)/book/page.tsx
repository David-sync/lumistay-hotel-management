import Link from "next/link";
import { AlertCircle, Check, ChevronRight, LockKeyhole } from "lucide-react";
import { BookingCheckoutForm } from "@/components/public/booking-checkout-form";
import { getRooms } from "@/lib/repository";
import { nightsBetween } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ soPhg?: string; tenLp?: string; ngDen?: string; ngDi?: string; guests?: string; gia?: string }>;
};

function InvalidBookingSelection() {
  return <div className="mx-auto max-w-xl bg-[#f4f0e8] px-5 py-20 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#d7b27a] bg-[#e9e2d6]"><AlertCircle className="h-7 w-7 text-[#9a6a2f]" aria-hidden="true" /></div><h1 className="mt-5 font-display text-3xl font-bold text-[#183b35]">Chưa thể tiếp tục đặt phòng</h1><p className="mt-3 text-sm leading-6 text-[#6c685f]">Thông tin phòng hoặc ngày lưu trú chưa hợp lệ. Vui lòng quay lại kết quả tìm kiếm và chọn một hạng phòng còn trống.</p><Link href="/search" className="mt-7 inline-flex items-center justify-center border border-[#183b35] bg-[#183b35] px-5 py-3 text-sm font-bold text-[#f4f0e8] transition hover:bg-[#25534a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]">Tìm phòng phù hợp</Link></div>;
}

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams;
  const soPhg = Number(params.soPhg);

  if (!params.soPhg || !params.ngDen || !params.ngDi || !Number.isInteger(soPhg) || nightsBetween(params.ngDen, params.ngDi) < 1) return <InvalidBookingSelection />;

  const rooms = await getRooms();
  const selectedRoom = rooms.find((room) => room.soPhong === soPhg);
  if (!selectedRoom) return <InvalidBookingSelection />;

  return (
    <div className="bg-[#f4f0e8] pb-16">
      <div className="border-b border-[#355b53] bg-[#183b35] py-5 text-[#f4f0e8]">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-5 text-xs font-semibold sm:text-sm lg:px-8"><span className="flex h-7 w-7 items-center justify-center bg-[#d7b27a] text-[#183b35]"><Check className="h-4 w-4" aria-hidden="true" /></span><span className="hidden sm:inline">Chọn hạng phòng</span><span className="h-px w-8 bg-[#52756b] sm:w-16" /><span className="flex h-7 w-7 items-center justify-center bg-[#f4f0e8] font-bold text-[#183b35]">2</span><span>Thông tin khách</span><span className="h-px w-8 bg-[#52756b] sm:w-16" /><span className="flex h-7 w-7 items-center justify-center border border-[#52756b] text-[#b9c9c1]">3</span><span className="hidden text-[#b9c9c1] sm:inline">Xác nhận</span></div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8 lg:py-10">
        <nav aria-label="Đường dẫn" className="flex items-center gap-1 text-xs text-[#6c685f]"><Link href="/" className="rounded-sm text-[#183b35] hover:text-[#9a6a2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]">Trang chủ</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><Link href="/search" className="rounded-sm text-[#183b35] hover:text-[#9a6a2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]">Phòng nghỉ</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><span aria-current="page">Thông tin đặt phòng</span></nav>
        <div className="mt-7 flex flex-col gap-4 border-b border-[#d5cec2] pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a6a2f]">Bước cuối cùng</p><h1 className="mt-2 font-display text-3xl font-bold text-[#183b35] sm:text-4xl">Hoàn tất kỳ lưu trú</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#6c685f]">Kiểm tra ngày, nhập thông tin người đặt và xác nhận khi mọi chi tiết đã chính xác.</p></div><p className="flex shrink-0 items-center gap-2 text-xs font-semibold text-[#285b4d]"><LockKeyhole className="h-4 w-4" aria-hidden="true" /> Kết nối an toàn</p></div>
        <div className="mt-8"><BookingCheckoutForm soPhg={selectedRoom.soPhong} tenLp={selectedRoom.loaiPhong} ngDen={params.ngDen} ngDi={params.ngDi} gia={selectedRoom.gia} /></div>
      </div>
    </div>
  );
}
