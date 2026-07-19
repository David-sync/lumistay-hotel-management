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
    return <div className="mx-auto max-w-lg px-4 py-20 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100"><CalendarDays className="h-7 w-7 text-gray-500" aria-hidden="true" /></div><h1 className="mt-5 font-display text-3xl font-bold text-gray-900">Không tìm thấy xác nhận đặt phòng</h1><p className="mt-2 text-sm leading-6 text-gray-600">Mã đặt phòng không tồn tại hoặc chưa sẵn sàng. Vui lòng kiểm tra lại mã của bạn.</p><Link href="/search" className="booking-btn-primary mt-6 inline-flex focus-visible:ring-4 focus-visible:ring-[#006ce4] focus-visible:ring-offset-2">Tìm phòng mới</Link></div>;
  }

  const nights = nightsBetween(booking.ngayDen, booking.ngayDi);
  const remaining = Math.max(0, booking.tongDuKien - booking.tienCoc);

  return (
    <div className="bg-gray-50 py-10 print:bg-white print:py-0 md:py-14">
      <main className="mx-auto max-w-3xl px-4 md:px-6 print:max-w-none print:px-0">
        <header className="text-center print:text-left">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 print:mx-0"><CheckCircle2 className="h-10 w-10 text-green-700" aria-hidden="true" /></div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-green-700">Đã xác nhận</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-gray-900 sm:text-4xl">Đặt phòng của bạn đã hoàn tất</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 print:mx-0">Cảm ơn bạn đã chọn LumiStay. Hãy lưu mã đặt phòng bên dưới để sử dụng khi liên hệ hoặc làm thủ tục nhận phòng.</p>
        </header>

        <article className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm print:mt-6 print:rounded-none print:shadow-none">
          <div className="flex flex-col gap-3 bg-[#003580] px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7 print:bg-white print:px-0 print:text-gray-900"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-200 print:text-gray-500">Mã đặt phòng</p><p className="mt-1 text-2xl font-bold tracking-wide">{booking.maSo}</p></div><span className="flex w-fit items-center gap-2 rounded-full bg-green-500/20 px-3 py-1.5 text-xs font-bold text-green-50 print:border print:border-green-700 print:text-green-800"><Check className="h-4 w-4" aria-hidden="true" /> Đã xác nhận</span></div>

          <div className="p-5 sm:p-7 print:px-0">
            <section aria-labelledby="stay-details"><div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-[#006ce4]" aria-hidden="true" /><h2 id="stay-details" className="font-display text-xl font-bold text-gray-900">LumiStay Hotel &amp; Resort</h2></div><p className="mt-1 pl-7 text-xs text-gray-500">Trung tâm thành phố, Việt Nam</p>
              <div className="mt-5 grid grid-cols-2 divide-x divide-gray-200 rounded-lg border border-gray-200 py-4"><div className="px-4"><p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Nhận phòng</p><p className="mt-1 text-sm font-bold text-gray-900 sm:text-base">{formatDate(booking.ngayDen)}</p><p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Từ 14:00</p></div><div className="px-4"><p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Trả phòng</p><p className="mt-1 text-sm font-bold text-gray-900 sm:text-base">{formatDate(booking.ngayDi)}</p><p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Trước 12:00</p></div></div>
            </section>

            <section className="mt-7 border-t border-gray-200 pt-6" aria-labelledby="booking-details"><h2 id="booking-details" className="font-display text-xl font-bold text-gray-900">Chi tiết đặt phòng</h2><dl className="mt-4 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2"><div><dt className="flex items-center gap-1.5 text-xs text-gray-500"><UserRound className="h-4 w-4" aria-hidden="true" /> Khách hàng</dt><dd className="mt-1 font-bold text-gray-900">{booking.khachHang}</dd></div><div><dt className="text-xs text-gray-500">Loại phòng</dt><dd className="mt-1 font-bold text-gray-900">{booking.tenLp}</dd></div><div><dt className="text-xs text-gray-500">Số phòng</dt><dd className="mt-1 font-bold text-gray-900">{booking.soPhg}</dd></div><div><dt className="text-xs text-gray-500">Thời gian lưu trú</dt><dd className="mt-1 font-bold text-gray-900">{nights} đêm</dd></div></dl></section>

            <section className="mt-7 border-t border-gray-200 pt-6" aria-labelledby="payment-details"><div className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-[#006ce4]" aria-hidden="true" /><h2 id="payment-details" className="font-display text-xl font-bold text-gray-900">Tóm tắt thanh toán</h2></div><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-gray-600">Tổng giá phòng dự kiến</dt><dd className="font-semibold text-gray-900">{formatCurrency(booking.tongDuKien)}</dd></div><div className="flex justify-between gap-4"><dt className="text-gray-600">Khoản đặt cọc</dt><dd className="font-semibold text-green-700">{formatCurrency(booking.tienCoc)}</dd></div><div className="flex justify-between gap-4 border-t border-gray-200 pt-3"><dt className="font-bold text-gray-900">Còn lại khi nhận phòng</dt><dd className="text-lg font-bold text-[#003580]">{formatCurrency(remaining)}</dd></div></dl></section>
          </div>
        </article>

        <section className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5 print:border-gray-300 print:bg-white" aria-labelledby="next-steps"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#003580]" aria-hidden="true" /><div><h2 id="next-steps" className="font-display text-xl font-bold text-gray-900">Chuẩn bị cho ngày nhận phòng</h2><ul className="mt-3 space-y-2 text-sm leading-6 text-gray-700"><li className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" /> Mang theo CCCD hoặc giấy tờ tùy thân của người đặt.</li><li className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" /> Cung cấp mã <strong>{booking.maSo}</strong> tại quầy lễ tân.</li><li className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" /> Phần còn lại được thanh toán khi nhận phòng.</li></ul></div></div></section>

        <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row print:hidden"><Link href="/" className="booking-btn-secondary inline-flex items-center justify-center gap-2 focus-visible:ring-4 focus-visible:ring-[#006ce4] focus-visible:ring-offset-2"><Home className="h-4 w-4" aria-hidden="true" /> Về trang chủ</Link><PrintButton /></div>
        <p className="mt-7 text-center text-xs text-gray-500 print:text-left">Cần hỗ trợ? Liên hệ 1900 1234 hoặc hello@lumistay.vn và cung cấp mã đặt phòng của bạn.</p>
      </main>
    </div>
  );
}
