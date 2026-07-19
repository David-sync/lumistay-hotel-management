import Link from "next/link";
import { CalendarDays, Check, CheckCircle2, Clock3, CreditCard, Home, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { PrintButton } from "@/components/public/print-button";
import { getPublicBooking } from "@/lib/repository";
import { verifyBookingAccess } from "@/lib/public-booking-access";
import { formatCurrency, formatDate, nightsBetween } from "@/lib/utils";

type Props = { params: Promise<{ maSo: string }>; searchParams: Promise<{ token?: string }> };

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const { maSo } = await params;
  const query = await searchParams;
  const hasAccess = process.env.USE_REAL_DB !== "true" || await verifyBookingAccess(query.token, maSo);
  const booking = hasAccess ? await getPublicBooking(maSo) : null;

  if (!booking) {
    return <div className="mx-auto max-w-lg bg-[#f4f0e8] px-5 py-20 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#d5cec2] bg-[#e9e2d6]"><CalendarDays className="h-7 w-7 text-[#6c685f]" aria-hidden="true" /></div><h1 className="mt-5 font-display text-3xl font-bold text-[#183b35]">Không tìm thấy xác nhận đặt phòng</h1><p className="mt-3 text-sm leading-6 text-[#6c685f]">Mã đặt phòng không tồn tại hoặc chưa sẵn sàng. Vui lòng kiểm tra lại mã của bạn.</p><Link href="/search" className="mt-7 inline-flex border border-[#183b35] bg-[#183b35] px-5 py-3 text-sm font-bold text-[#f4f0e8] transition hover:bg-[#25534a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]">Tìm phòng mới</Link></div>;
  }

  const nights = nightsBetween(booking.ngayDen, booking.ngayDi);
  const remaining = Math.max(0, booking.tongDuKien - booking.tienCoc);

  return (
    <div className="bg-[#f4f0e8] py-10 print:bg-white print:py-0 md:py-14">
      <main className="mx-auto max-w-3xl px-5 print:max-w-none print:px-0 lg:px-8">
        <header className="text-center print:text-left"><div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#9a6a2f] bg-[#e9e2d6] print:mx-0"><CheckCircle2 className="h-9 w-9 text-[#285b4d]" aria-hidden="true" /></div><p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9a6a2f]">Đã xác nhận</p><h1 className="mt-2 font-display text-3xl font-bold text-[#183b35] sm:text-4xl">Kỳ lưu trú của bạn đã sẵn sàng</h1><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6c685f] print:mx-0">Cảm ơn bạn đã chọn LumiStay. Hãy lưu mã đặt phòng bên dưới để sử dụng khi liên hệ hoặc làm thủ tục nhận phòng.</p></header>

        <article className="mt-8 overflow-hidden border border-[#d5cec2] bg-[#fbf9f5] print:mt-6 print:rounded-none print:shadow-none">
          <div className="flex flex-col gap-3 bg-[#183b35] px-5 py-5 text-[#f4f0e8] sm:flex-row sm:items-center sm:justify-between sm:px-7 print:bg-white print:px-0 print:text-[#25241f]"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d7b27a] print:text-[#6c685f]">Mã đặt phòng</p><p className="mt-1 text-2xl font-bold tracking-wide">{booking.maSo}</p></div><span className="flex w-fit items-center gap-2 border border-[#52756b] px-3 py-1.5 text-xs font-bold text-[#d7d9cf] print:border-[#285b4d] print:text-[#285b4d]"><Check className="h-4 w-4" aria-hidden="true" /> Đã xác nhận</span></div>

          <div className="p-5 sm:p-7 print:px-0">
            <section aria-labelledby="stay-details"><div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-[#9a6a2f]" aria-hidden="true" /><h2 id="stay-details" className="font-display text-xl font-bold text-[#183b35]">LumiStay Hotel &amp; Residence</h2></div><p className="mt-1 pl-7 text-xs text-[#6c685f]">Trung tâm thành phố, Việt Nam</p><div className="mt-5 grid grid-cols-2 divide-x divide-[#d5cec2] border border-[#d5cec2] py-4"><div className="px-4"><p className="text-[10px] font-bold uppercase tracking-wide text-[#6c685f]">Nhận phòng</p><p className="mt-1 text-sm font-bold text-[#25241f] sm:text-base">{formatDate(booking.ngayDen)}</p><p className="mt-1 flex items-center gap-1 text-xs text-[#6c685f]"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Từ 14:00</p></div><div className="px-4"><p className="text-[10px] font-bold uppercase tracking-wide text-[#6c685f]">Trả phòng</p><p className="mt-1 text-sm font-bold text-[#25241f] sm:text-base">{formatDate(booking.ngayDi)}</p><p className="mt-1 flex items-center gap-1 text-xs text-[#6c685f]"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Trước 12:00</p></div></div></section>

            <section className="mt-7 border-t border-[#d5cec2] pt-6" aria-labelledby="booking-details"><h2 id="booking-details" className="font-display text-xl font-bold text-[#183b35]">Chi tiết đặt phòng</h2><dl className="mt-4 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2"><div><dt className="flex items-center gap-1.5 text-xs text-[#6c685f]"><UserRound className="h-4 w-4" aria-hidden="true" /> Khách hàng</dt><dd className="mt-1 font-bold text-[#25241f]">{booking.khachHang}</dd></div><div><dt className="text-xs text-[#6c685f]">Loại phòng</dt><dd className="mt-1 font-bold text-[#25241f]">{booking.tenLp}</dd></div><div><dt className="text-xs text-[#6c685f]">Số phòng</dt><dd className="mt-1 font-bold text-[#25241f]">{booking.soPhg}</dd></div><div><dt className="text-xs text-[#6c685f]">Thời gian lưu trú</dt><dd className="mt-1 font-bold text-[#25241f]">{nights} đêm</dd></div></dl></section>

            <section className="mt-7 border-t border-[#d5cec2] pt-6" aria-labelledby="payment-details"><div className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-[#9a6a2f]" aria-hidden="true" /><h2 id="payment-details" className="font-display text-xl font-bold text-[#183b35]">Tóm tắt thanh toán</h2></div><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-[#6c685f]">Tổng giá phòng dự kiến</dt><dd className="font-semibold text-[#25241f]">{formatCurrency(booking.tongDuKien)}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#6c685f]">Khoản đặt cọc</dt><dd className="font-semibold text-[#285b4d]">{formatCurrency(booking.tienCoc)}</dd></div><div className="flex justify-between gap-4 border-t border-[#d5cec2] pt-3"><dt className="font-bold text-[#183b35]">Còn lại khi nhận phòng</dt><dd className="text-lg font-bold text-[#183b35]">{formatCurrency(remaining)}</dd></div></dl></section>
          </div>
        </article>

        <section className="mt-6 border border-[#d7b27a]/60 bg-[#fbf9f5] p-5 print:border-[#d5cec2] print:bg-white" aria-labelledby="next-steps"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#9a6a2f]" aria-hidden="true" /><div><h2 id="next-steps" className="font-display text-xl font-bold text-[#183b35]">Chuẩn bị cho ngày nhận phòng</h2><ul className="mt-3 space-y-2 text-sm leading-6 text-[#4e4b44]"><li className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[#285b4d]" aria-hidden="true" /> Mang theo CCCD hoặc giấy tờ tùy thân của người đặt.</li><li className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[#285b4d]" aria-hidden="true" /> Cung cấp mã <strong>{booking.maSo}</strong> tại quầy lễ tân.</li><li className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[#285b4d]" aria-hidden="true" /> Phần còn lại được thanh toán khi nhận phòng.</li></ul></div></div></section>

        <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row print:hidden"><Link href="/" className="inline-flex items-center justify-center gap-2 border border-[#183b35] px-5 py-3 text-sm font-bold text-[#183b35] transition hover:bg-[#183b35] hover:text-[#f4f0e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f]"><Home className="h-4 w-4" aria-hidden="true" /> Về trang chủ</Link><PrintButton /></div><p className="mt-7 text-center text-xs text-[#6c685f] print:text-left">Cần hỗ trợ? Liên hệ 1900 1234 hoặc hello@lumistay.vn và cung cấp mã đặt phòng của bạn.</p>
      </main>
    </div>
  );
}
