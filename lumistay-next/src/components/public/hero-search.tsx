"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import type { RoomType } from "@/lib/types";

type SearchInitialValues = {
  // Kept for compatibility with existing links; the public search always considers every room type.
  tenLp?: string;
  ngDen?: string;
  ngDi?: string;
  guests?: number;
};

type Props = {
  roomTypes?: RoomType[];
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

export function HeroSearch({ compact = false, initialValues }: Props) {
  const router = useRouter();
  const defaults = defaultDates();
  const [ngDen, setNgDen] = useState(initialValues?.ngDen || defaults.arrival);
  const [ngDi, setNgDi] = useState(initialValues?.ngDi || defaults.departure);
  const [guests, setGuests] = useState(Math.min(6, Math.max(1, initialValues?.guests || 2)));

  useEffect(() => {
    setNgDen(initialValues?.ngDen || defaults.arrival);
    setNgDi(initialValues?.ngDi || defaults.departure);
    setGuests(Math.min(6, Math.max(1, initialValues?.guests || 2)));
    // The route is the source of truth when the search bar is reused on another public page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.ngDen, initialValues?.ngDi, initialValues?.guests]);

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
    router.push(`/search?${new URLSearchParams({ ngDen, ngDi, guests: String(guests) }).toString()}`);
  }

  const fieldClass = compact
    ? "flex min-w-0 flex-col gap-1 border border-[#d5cec2] px-3 py-2.5"
    : "flex min-w-0 flex-col gap-1 border border-[#d5cec2] bg-[#fbf9f5] px-4 py-3";
  const controlClass = "min-w-0 cursor-pointer bg-transparent py-0.5 text-sm font-semibold text-[#25241f] outline-none focus-visible:ring-2 focus-visible:ring-[#9A6A2F]";

  return (
    <form onSubmit={search} aria-label="Tìm phòng tại LumiStay" className={`border border-[#9a6a2f] bg-[#f4f0e8] p-2 ${compact ? "shadow-[0_8px_24px_rgba(24,59,53,0.08)]" : "shadow-[0_14px_34px_rgba(24,59,53,0.16)]"}`}>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-[1fr_1fr_.75fr_auto]">
        <label className={fieldClass}>
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c685f]">
            <CalendarDays className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> Nhận phòng
          </span>
          <input type="date" required value={ngDen} onChange={(event) => updateArrival(event.target.value)} className={controlClass} />
        </label>

        <label className={fieldClass}>
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c685f]">
            <CalendarDays className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> Trả phòng
          </span>
          <input type="date" required value={ngDi} onChange={(event) => setNgDi(event.target.value)} min={ngDen} className={controlClass} />
        </label>

        <label className={fieldClass}>
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c685f]">
            <Users className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> Khách
          </span>
          <select value={guests} onChange={(event) => setGuests(Number(event.target.value))} className={controlClass}>
            {[1, 2, 3, 4, 5, 6].map((number) => <option key={number} value={number}>{number} khách</option>)}
          </select>
        </label>

        <button type="submit" className={`inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 bg-[#183b35] px-6 py-3 text-sm font-bold text-[#f4f0e8] transition hover:bg-[#25534a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f0e8] ${compact ? "lg:px-5" : "lg:px-8"}`}>
          {compact ? "Cập nhật" : "Xem phòng"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
