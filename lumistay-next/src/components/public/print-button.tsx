"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="booking-btn-primary inline-flex items-center justify-center gap-2 focus-visible:ring-4 focus-visible:ring-[#006ce4] focus-visible:ring-offset-2">
      <Printer className="h-4 w-4" aria-hidden="true" /> In xác nhận
    </button>
  );
}
