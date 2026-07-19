import Link from "next/link";
import { ArrowUpRight, BedDouble, LockKeyhole } from "lucide-react";

const focusClass = "rounded-sm outline-none transition focus-visible:ring-2 focus-visible:ring-[#9A6A2F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F0E8]";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d5cec2] bg-[#f4f0e8]/95 text-[#25241f] backdrop-blur-sm print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
        <Link href="/" className={`group flex items-center gap-3 ${focusClass}`} aria-label="LumiStay — Trang chủ">
          <span className="flex h-10 w-10 items-center justify-center border border-[#183b35] bg-[#183b35] text-[#f4f0e8]">
            <BedDouble className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-display text-xl font-bold leading-none tracking-[0.08em] text-[#183b35]">LUMISTAY</span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.22em] text-[#6c685f]">Hotel &amp; Residence</span>
          </span>
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-8 text-sm font-medium lg:flex">
          <Link href="/search" className={`${focusClass} hover:text-[#183b35]`}>Phòng nghỉ</Link>
          <Link href="/#story" className={`${focusClass} hover:text-[#183b35]`}>Về LumiStay</Link>
          <Link href="/#amenities" className={`${focusClass} hover:text-[#183b35]`}>Tiện nghi</Link>
          <Link href="/#location" className={`${focusClass} hover:text-[#183b35]`}>Vị trí</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className={`hidden items-center gap-1.5 text-xs font-semibold text-[#6c685f] hover:text-[#183b35] sm:inline-flex ${focusClass}`}>
            <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" /> Nhân viên
          </Link>
          <Link href="/search" className={`inline-flex items-center gap-2 border border-[#183b35] bg-[#183b35] px-4 py-2.5 text-xs font-bold text-[#f4f0e8] hover:bg-[#25534a] ${focusClass}`}>
            <span className="hidden sm:inline">Đặt phòng trực tiếp</span>
            <span className="sm:hidden">Đặt phòng</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
