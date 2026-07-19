import Link from "next/link";
import { BedDouble, LockKeyhole } from "lucide-react";

const focusClass = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#febb02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#003580]";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-[#003580] text-white shadow-md print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className={`flex items-center gap-2 rounded-md transition hover:opacity-90 ${focusClass}`} aria-label="LumiStay - Trang chủ">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white shadow-sm">
            <BedDouble className="h-6 w-6 text-[#003580]" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-display text-2xl font-bold leading-none tracking-tight">LumiStay</span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-200">Hotel &amp; Resort</span>
          </span>
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <Link href="/search" className={`rounded px-1 py-2 transition hover:text-[#febb02] ${focusClass}`}>Phòng nghỉ</Link>
          <Link href="/#amenities" className={`rounded px-1 py-2 transition hover:text-[#febb02] ${focusClass}`}>Tiện ích</Link>
          <Link href="/#reviews" className={`rounded px-1 py-2 transition hover:text-[#febb02] ${focusClass}`}>Đánh giá</Link>
        </nav>

        <Link
          href="/login"
          className={`inline-flex items-center gap-1.5 rounded-md border border-white/35 px-3 py-2 text-xs font-semibold text-blue-50 transition hover:border-white hover:bg-white/10 sm:text-sm ${focusClass}`}
        >
          <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Nhân viên</span>
          <span className="sm:hidden">Nội bộ</span>
        </Link>
      </div>
    </header>
  );
}
