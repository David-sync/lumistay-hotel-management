import Link from "next/link";
import { AlertCircle, Check, ChevronRight, LockKeyhole } from "lucide-react";
import { BookingCheckoutForm } from "@/components/public/booking-checkout-form";
import { getRooms } from "@/lib/repository";
import { nightsBetween } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ soPhg?: string; tenLp?: string; ngDen?: string; ngDi?: string; guests?: string; gia?: string }>;
};

function InvalidBookingSelection() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center md:px-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100"><AlertCircle className="h-7 w-7 text-orange-700" aria-hidden="true" /></div>
      <h1 className="mt-5 font-display text-3xl font-bold text-gray-900">Chưa thể tiếp tục đặt phòng</h1>
      <p className="mt-2 text-sm leading-6 text-gray-600">Thông tin phòng hoặc ngày lưu trú chưa hợp lệ. Vui lòng quay lại kết quả tìm kiếm và chọn phòng còn trống.</p>
      <Link href="/search" className="booking-btn-primary mt-6 inline-flex focus-visible:ring-4 focus-visible:ring-[#006ce4] focus-visible:ring-offset-2">Tìm phòng phù hợp</Link>
    </div>
  );
}

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams;
  const soPhg = Number(params.soPhg);

  if (!params.soPhg || !params.ngDen || !params.ngDi || !Number.isInteger(soPhg) || nightsBetween(params.ngDen, params.ngDi) < 1) {
    return <InvalidBookingSelection />;
  }

  const rooms = await getRooms();
  const selectedRoom = rooms.find((room) => room.soPhong === soPhg);
  if (!selectedRoom) return <InvalidBookingSelection />;

  const tenLp = selectedRoom.loaiPhong;

  return (
    <div className="bg-gray-50 pb-16">
      <div className="border-b border-blue-900/10 bg-[#003580] py-5 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 text-xs font-semibold sm:text-sm md:px-6"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#003580]"><Check className="h-4 w-4" aria-hidden="true" /></span><span>Chọn phòng</span><span className="h-px w-8 bg-blue-200 sm:w-16" /><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#febb02] font-bold text-[#003580]">2</span><span>Thông tin khách</span><span className="h-px w-8 bg-blue-200 sm:w-16" /><span className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-200 text-blue-100">3</span><span className="text-blue-100">Xác nhận</span></div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-7 md:px-6 md:py-10">
        <nav aria-label="Đường dẫn" className="flex items-center gap-1 text-xs text-gray-600"><Link href="/" className="rounded-sm text-[#006ce4] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006ce4]">Trang chủ</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><Link href="/search" className="rounded-sm text-[#006ce4] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006ce4]">Tìm phòng</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><span aria-current="page">Hoàn tất đặt phòng</span></nav>

        <div className="mt-6 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#006ce4]">Bước cuối cùng</p><h1 className="mt-2 font-display text-3xl font-bold text-gray-900 md:text-4xl">Hoàn tất thông tin đặt phòng</h1><p className="mt-2 text-sm leading-6 text-gray-600">Kiểm tra kỳ lưu trú, nhập thông tin người đặt và xác nhận khi mọi chi tiết đã chính xác.</p></div><p className="flex shrink-0 items-center gap-2 text-xs font-semibold text-green-800"><LockKeyhole className="h-4 w-4" aria-hidden="true" /> Kết nối an toàn</p></div>

        <div className="mt-7"><BookingCheckoutForm soPhg={selectedRoom.soPhong} tenLp={tenLp} ngDen={params.ngDen} ngDi={params.ngDi} gia={selectedRoom.gia} /></div>
      </div>
    </div>
  );
}
