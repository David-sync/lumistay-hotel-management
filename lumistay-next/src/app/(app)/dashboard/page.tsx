import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BedDouble, CalendarDays, CircleAlert, LogIn, LogOut, ReceiptText, UserRound } from "lucide-react";
import { OperationButton } from "@/components/operation-button";
import { PageHeader } from "@/components/page-header";
import { RoomGrid } from "@/components/room-grid";
import { getBookings, getDashboard, getInvoices, getRooms } from "@/lib/repository";
import type { Booking, Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [data, rooms, bookings, invoices] = await Promise.all([getDashboard(), getRooms(), getBookings(), getInvoices()]);
  const readyRooms = rooms.filter((room) => room.trangThai === "Trống" && room.donDep === "Sạch").length;
  const arrivals = bookings.filter((booking) => booking.trangThai === "Chờ nhận phòng");
  const inHouse = bookings.filter((booking) => booking.trangThai === "Đã nhận phòng");
  const departures = bookings.filter((booking) => booking.trangThai === "Chờ trả phòng");
  const unpaid = invoices.filter((invoice) => invoice.trangThai === "Chưa thanh toán");
  const roomExceptions = rooms.filter((room) => room.trangThai === "Đang sửa chữa" || room.donDep !== "Sạch");
  const today = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  const checkinsFromDashboard = data.todayCheckins.length;

  return (
    <div>
      <PageHeader title="Hôm nay tại khách sạn" description={`${today.charAt(0).toUpperCase()}${today.slice(1)} · Màn hình bàn giao và xử lý ca trực.`} action={<Link href="/bookings" className="inline-flex h-9 items-center gap-2 rounded-[4px] bg-[#183B35] px-3.5 text-xs font-bold text-white transition hover:bg-[#102F2A]">Tạo đặt phòng <ArrowRight className="h-3.5 w-3.5" /></Link>} />

      <section className="mb-5 grid grid-cols-2 overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7] sm:grid-cols-4" aria-label="Tổng quan hôm nay">
        <TodaySignal icon={CalendarDays} label="Khách đến" value={String(arrivals.length)} detail={checkinsFromDashboard ? `${checkinsFromDashboard} lịch đến trong ngày` : "cần nhận phòng"} />
        <TodaySignal icon={UserRound} label="Đang ở" value={String(inHouse.length)} detail="hồ sơ đang lưu trú" />
        <TodaySignal icon={LogOut} label="Dự kiến trả" value={String(departures.length)} detail="cần đối soát" />
        <TodaySignal icon={BedDouble} label="Phòng sẵn sàng" value={String(readyRooms)} detail={`${roomExceptions.length} phòng cần kiểm tra`} tone={roomExceptions.length ? "text-[#9A6A2F]" : "text-[#356B4C]"} />
      </section>

      <section className="mb-5 grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
        <section className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]">
          <div className="flex items-center justify-between border-b border-[#D8D2C7] px-4 py-3"><div><h2 className="text-[15px] font-bold text-[#183B35]">Việc cần làm trong ca</h2><p className="mt-0.5 text-xs text-[#81796D]">Ưu tiên theo bàn giao lễ tân</p></div><span className="rounded-[4px] bg-[#F7F1E7] px-2 py-1 text-[10px] font-bold text-[#9A6A2F]">{data.frontDeskTasks.length} việc</span></div>
          <div className="divide-y divide-[#E7E1D7]">
            {data.frontDeskTasks.map((task) => <div key={task.id} className="flex items-center gap-3 px-4 py-3"><span className={task.priority === "Cao" ? "text-[#A34E3E]" : task.priority === "Vừa" ? "text-[#9A6A2F]" : "text-[#6A786F]"}><CircleAlert className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold text-[#25322D]">{task.title}</p><p className="mt-0.5 truncate text-[11px] text-[#81796D]">{task.target} · {task.time} · {task.description}</p></div><span className="shrink-0 text-[10px] font-bold text-[#81796D]">{task.priority}</span></div>)}
            {data.frontDeskTasks.length === 0 ? <p className="px-4 py-8 text-center text-sm text-[#81796D]">Không có việc tồn.</p> : null}
          </div>
        </section>
        <section className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]">
          <div className="flex items-center justify-between border-b border-[#D8D2C7] px-4 py-3"><div><h2 className="text-[15px] font-bold text-[#183B35]">Ngoại lệ phòng</h2><p className="mt-0.5 text-xs text-[#81796D]">Cần phối hợp với buồng phòng</p></div><Link href="/rooms" className="text-[11px] font-bold text-[#183B35] hover:text-[#9A6A2F]">Mở sơ đồ</Link></div>
          <div className="divide-y divide-[#E7E1D7]">
            {roomExceptions.slice(0, 5).map((room) => <div key={room.soPhong} className="flex items-center gap-3 px-4 py-3"><span className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#F7F1E7] text-[11px] font-bold text-[#9A6A2F]">{room.soPhong}</span><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-[#25322D]">{room.trangThai === "Đang sửa chữa" ? "Đang bảo trì" : "Chờ dọn phòng"}</p><p className="text-[11px] text-[#81796D]">{room.khachHang || room.loaiPhong} · Buồng {room.donDep.toLowerCase()}</p></div></div>)}
            {roomExceptions.length === 0 ? <p className="px-4 py-8 text-center text-sm text-[#81796D]">Không có ngoại lệ.</p> : null}
          </div>
        </section>
      </section>

      <section className="grid gap-3 xl:grid-cols-2">
        <DeskList icon={LogIn} title="Khách đến / nhận phòng" count={arrivals.length} empty="Không có khách chờ nhận phòng.">
          {arrivals.slice(0, 5).map((booking) => <BookingRow key={booking.maSo} booking={booking} action={<OperationButton action="check-in" identifier={booking.maSo} label="Nhận phòng" />} />)}
        </DeskList>
        <DeskList icon={UserRound} title="Khách đang ở" count={inHouse.length} empty="Chưa có hồ sơ đang lưu trú.">
          {inHouse.slice(0, 5).map((booking) => <BookingRow key={booking.maSo} booking={booking} action={<OperationButton action="create-invoice" identifier={booking.maSo} label="Lập hóa đơn" />} />)}
        </DeskList>
        <DeskList icon={LogOut} title="Dự kiến trả phòng" count={departures.length} empty="Không có khách dự kiến trả phòng.">
          {departures.slice(0, 5).map((booking) => <BookingRow key={booking.maSo} booking={booking} action={<Link href="/invoices" className="inline-flex h-8 items-center rounded-[4px] border border-[#B9B2A6] px-2.5 text-[11px] font-bold text-[#183B35] hover:border-[#183B35]">Mở thu ngân</Link>} />)}
        </DeskList>
        <DeskList icon={ReceiptText} title="Hóa đơn chưa thu" count={unpaid.length} empty="Không có hóa đơn chờ thu.">
          {unpaid.slice(0, 5).map((invoice) => <InvoiceRow key={invoice.maHd} invoice={invoice} />)}
        </DeskList>
      </section>

      <section className="mt-5">
        <div className="mb-2.5 flex items-end justify-between gap-3"><div><h2 className="text-[15px] font-bold text-[#183B35]">Sơ đồ phòng</h2><p className="mt-0.5 text-xs text-[#81796D]">Rack phòng compact theo tầng</p></div><Link href="/rooms" className="inline-flex items-center gap-1 text-xs font-bold text-[#183B35] hover:text-[#9A6A2F]">Xem toàn bộ <ArrowRight className="h-3.5 w-3.5" /></Link></div>
        <RoomGrid rooms={rooms} compact />
      </section>
    </div>
  );
}

function TodaySignal({ icon: Icon, label, value, detail, tone = "text-[#183B35]" }: { icon: typeof CalendarDays; label: string; value: string; detail: string; tone?: string }) {
  return <div className="flex min-w-0 items-center gap-2.5 border-b border-[#E7E1D7] px-3 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><Icon className="h-4 w-4 shrink-0 text-[#9A6A2F]" /><span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-wide text-[#81796D]">{label}</span><span className={`block text-lg font-bold tabular-nums ${tone}`}>{value}<span className="ml-1 text-[11px] font-medium text-[#81796D]">{detail}</span></span></span></div>;
}

function DeskList({ icon: Icon, title, count, empty, children }: { icon: typeof LogIn; title: string; count: number; empty: string; children: ReactNode }) {
  return <section className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]"><div className="flex items-center justify-between border-b border-[#D8D2C7] px-4 py-3"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#9A6A2F]" /><h2 className="text-[14px] font-bold text-[#183B35]">{title}</h2></div><span className="text-[11px] font-bold text-[#81796D]">{count}</span></div><div className="divide-y divide-[#E7E1D7]">{count > 0 ? children : <p className="px-4 py-8 text-center text-sm text-[#81796D]">{empty}</p>}</div></section>;
}

function BookingRow({ booking, action }: { booking: Booking; action: ReactNode }) {
  return <div className="flex items-center gap-3 px-4 py-3"><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-[#25322D]">{booking.khachHang}</p><p className="mt-0.5 text-[11px] text-[#81796D]">Phòng {booking.soPhong} · {booking.maSo} · {formatDate(booking.ngayDen)} – {formatDate(booking.ngayDi)}</p></div>{action}</div>;
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  return <div className="flex items-center gap-3 px-4 py-3"><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-[#25322D]">{invoice.khachHang}</p><p className="mt-0.5 text-[11px] text-[#81796D]">{invoice.maHd} · Phòng {invoice.soPhong}</p></div><span className="mr-1 text-[12px] font-bold tabular-nums text-[#183B35]">{formatCurrency(invoice.tong)}</span><OperationButton action="pay" identifier={invoice.maHd} bookingId={invoice.maBooking} label="Thu tiền" /></div>;
}
