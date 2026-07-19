import { BookingTable } from "@/components/booking-table";
import { CreateBookingCard } from "@/components/create-booking-card";
import { PageHeader } from "@/components/page-header";
import { ProcedureMap } from "@/components/procedure-map";
import { getBookings } from "@/lib/repository";

export default async function BookingsPage() {
  const bookings = await getBookings();
  const waiting = bookings.filter((item) => item.trangThai === "Chờ nhận phòng").length;
  const inHouse = bookings.filter((item) => item.trangThai === "Đã nhận phòng").length;

  return (
    <div>
      <PageHeader
        eyebrow="Quản lý lưu trú"
        title="Đặt và nhận phòng"
        description={`${waiting} booking chờ nhận phòng · ${inHouse} booking đã nhận phòng`}
      />
      <section className="grid items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <BookingTable bookings={bookings} />
        <CreateBookingCard />
      </section>
      <section className="mt-5"><ProcedureMap /></section>
    </div>
  );
}
