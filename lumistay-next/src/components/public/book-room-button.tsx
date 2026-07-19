"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { AvailableRoom } from "@/lib/types";

type Props = {
  room: AvailableRoom;
  ngDen: string;
  ngDi: string;
  guests: number;
  label?: string;
};

export function BookRoomButton({ room, ngDen, ngDi, guests, label = "Đặt hạng phòng này" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function book() {
    setLoading(true);
    const params = new URLSearchParams({
      // The selected physical room is kept in the booking contract, but is not shown to guests before checkout.
      soPhg: String(room.soPhg),
      tenLp: room.tenLp,
      ngDen,
      ngDi,
      guests: String(guests),
    });
    router.push(`/book?${params.toString()}`);
  }

  return (
    <button type="button" onClick={book} disabled={loading} className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 bg-[#183b35] px-5 py-2.5 text-sm font-bold text-[#f4f0e8] transition hover:bg-[#25534a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf9f5] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
      {loading ? "Đang mở..." : label}
      {!loading ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
    </button>
  );
}
