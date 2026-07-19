"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="inline-flex cursor-pointer items-center justify-center gap-2 border border-[#183b35] bg-[#183b35] px-5 py-3 text-sm font-bold text-[#f4f0e8] transition hover:bg-[#25534a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f] focus-visible:ring-offset-2">
      <Printer className="h-4 w-4" aria-hidden="true" /> In xác nhận
    </button>
  );
}
