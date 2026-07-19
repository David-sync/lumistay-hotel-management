"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BedDouble, CalendarDays, Search, Users } from "lucide-react";
import type { RoomType } from "@/lib/types";

type SearchInitialValues = {
  tenLp?: string;
  ngDen?: string;
  ngDi?: string;
  guests?: number;
};

type Props = {
  roomTypes: RoomType[];
  compact?: boolean;
  initialValues?: SearchInitialValues;
};

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultDates() {
  const arrival = new Date();
  arrival.setDate(arrival.getDate() + 1);
  const departure = new Date(arrival);
  departure.setDate(departure.getDate() + 1);
  return { arrival: toDateInput(arrival), departure: toDateInput(departure) };
}

export function HeroSearch({ roomTypes, compact = false, initialValues }: Props) {
  const router = useRouter();
  const defaults = defaultDates();
  const fallbackRoomType = roomTypes[0]?.tenLp || "Standard Single";
  const initialGuests = Math.min(6, Math.max(1, initialValues?.guests || 2));

  const [tenLp, setTenLp] = useState(initialValues?.tenLp || fallbackRoomType);
  const [ngDen, setNgDen] = useState(initialValues?.ngDen || defaults.arrival);
  const [ngDi, setNgDi] = useState(initialValues?.ngDi || defaults.departure);
  const [guests, setGuests] = useState(initialGuests);

  useEffect(() => {
    setTenLp(initialValues?.tenLp || fallbackRoomType);
    setNgDen(initialValues?.ngDen || defaults.arrival);
    setNgDi(initialValues?.ngDi || defaults.departure);
    setGuests(Math.min(6, Math.max(1, initialValues?.guests || 2)));
  }, [initialValues?.tenLp, initialValues?.ngDen, initialValues?.ngDi, initialValues?.guests, fallbackRoomType, defaults.arrival, defaults.departure]);

  function updateArrival(value: string) {
    setNgDen(value);
    if (ngDi <= value) {
      const nextDay = new Date(`${value}T12:00:00`);
      nextDay.setDate(nextDay.getDate() + 1);
      setNgDi(toDateInput(nextDay));
    }
  }

  function search(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams({ tenLp, ngDen, ngDi, guests: String(guests) });
    router.push(`/search?${params.toString()}`);
  }

  const fieldClass = compact
    ? "flex min-w-0 flex-col gap-1 rounded-md px-3 py-2"
    : "flex min-w-0 flex-col gap-1.5 rounded-md px-4 py-3";
  const controlClass = "min-w-0 cursor-pointer rounded-sm bg-transparent py-0.5 text-sm font-semibold text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-[#006ce4] focus-visible:ring-offset-2";

  return (
    <form
      onSubmit={search}
      aria-label="Tìm phòng"
      className={`rounded-xl border-4 border-[#febb02] bg-white shadow-booking-lg ${compact ? "p-1.5" : "p-2"}`}
    >
      <div className="grid gap-1.5 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_.75fr_auto]">
        <label className={`${fieldClass} border border-gray-200 lg:border-0 lg:border-r`}>
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">
            <BedDouble className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> Loại phòng
          </span>
          <select value={tenLp} onChange={(event) => setTenLp(event.target.value)} className={controlClass}>
            {roomTypes.map((type) => (
              <option key={type.malp} value={type.tenLp}>{type.tenLp}</option>
            ))}
          </select>
        </label>

        <label className={`${fieldClass} border border-gray-200 lg:border-0 lg:border-r`}>
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">
            <CalendarDays className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> Nhận phòng
          </span>
          <input type="date" required value={ngDen} onChange={(event) => updateArrival(event.target.value)} className={controlClass} />
        </label>

        <label className={`${fieldClass} border border-gray-200 lg:border-0 lg:border-r`}>
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">
            <CalendarDays className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> Trả phòng
          </span>
          <input type="date" required value={ngDi} onChange={(event) => setNgDi(event.target.value)} min={ngDen} className={controlClass} />
        </label>

        <label className={`${fieldClass} border border-gray-200 lg:border-0 lg:border-r`}>
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500">
            <Users className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> Số khách
          </span>
          <select value={guests} onChange={(event) => setGuests(Number(event.target.value))} className={controlClass}>
            {[1, 2, 3, 4, 5, 6].map((number) => (
              <option key={number} value={number}>{number} khách</option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className={`booking-btn-primary flex min-h-12 items-center justify-center gap-2 whitespace-nowrap focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#003580] ${compact ? "px-6 py-3" : "px-8 py-4"}`}
        >
          <Search className="h-5 w-5" aria-hidden="true" />
          {compact ? "Tìm lại" : "Tìm phòng"}
        </button>
      </div>
    </form>
  );
}
