import { BookingTable } from "@/components/booking-table";
import { CreateBookingCard } from "@/components/create-booking-card";
import { PageHeader } from "@/components/page-header";
import { getBookings } from "@/lib/repository";

export default async function BookingsPage() {
  const bookings = await getBookings();
  const waiting = bookings.filter((item) => item.trangThai === "Chờ nhận phòng").length;
  const inHouse = bookings.filter((item) => item.trangThai === "Đã nhận phòng").length;

  return (
    <div>
      <PageHeader title="Đặt phòng" description={`${waiting} khách chờ nhận phòng · ${inHouse} khách đang lưu trú`} />
      <section className="grid items-start gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <BookingTable bookings={bookings} />
        <CreateBookingCard />
      </section>
    </div>
  );
}
