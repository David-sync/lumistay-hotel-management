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

export function BookRoomButton({ room, ngDen, ngDi, guests, label = "Chọn phòng" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function book() {
    setLoading(true);
    const params = new URLSearchParams({
      soPhg: String(room.soPhg),
      tenLp: room.tenLp,
      ngDen,
      ngDi,
      guests: String(guests),
    });
    router.push(`/book?${params.toString()}`);
  }

  return (
    <button
      type="button"
      onClick={book}
      disabled={loading}
      className="booking-btn-primary inline-flex min-h-11 w-full items-center justify-center gap-2 px-5 py-2.5 text-sm focus-visible:ring-4 focus-visible:ring-[#006ce4] focus-visible:ring-offset-2 sm:w-auto"
    >
      {loading ? "Đang mở..." : label}
      {!loading ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
    </button>
  );
}
