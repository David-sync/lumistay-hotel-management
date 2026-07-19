import Link from "next/link";
import { BedDouble, Clock3, Mail, MapPin, Phone } from "lucide-react";

const footerLink = "rounded-sm transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#febb02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#003580]";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#003580] text-white print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2">
              <BedDouble className="h-7 w-7 text-[#febb02]" aria-hidden="true" />
              <span className="font-display text-2xl font-bold">LumiStay</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">
              Không gian nghỉ dưỡng tiện nghi giữa trung tâm thành phố, với quy trình đặt phòng nhanh chóng và xác nhận rõ ràng.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#febb02]">Khám phá</h2>
            <ul className="mt-4 space-y-3 text-sm text-blue-100">
              <li><Link href="/search" className={footerLink}>Tìm phòng</Link></li>
              <li><Link href="/#amenities" className={footerLink}>Tiện ích khách sạn</Link></li>
              <li><Link href="/#reviews" className={footerLink}>Đánh giá của khách</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#febb02]">Lưu trú</h2>
            <ul className="mt-4 space-y-3 text-sm text-blue-100">
              <li className="flex items-start gap-2"><Clock3 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Nhận phòng từ 14:00</li>
              <li className="flex items-start gap-2"><Clock3 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Trả phòng trước 12:00</li>
              <li>Vui lòng mang giấy tờ tùy thân khi nhận phòng.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#febb02]">Liên hệ</h2>
            <ul className="mt-4 space-y-3 text-sm text-blue-100">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Trung tâm thành phố, Việt Nam</li>
              <li><a href="tel:19001234" className={`flex items-center gap-2 ${footerLink}`}><Phone className="h-4 w-4" aria-hidden="true" /> 1900 1234</a></li>
              <li><a href="mailto:hello@lumistay.vn" className={`flex items-center gap-2 ${footerLink}`}><Mail className="h-4 w-4" aria-hidden="true" /> hello@lumistay.vn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-blue-200 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LumiStay Hotel &amp; Resort. Mọi quyền được bảo lưu.</p>
          <p>Đặt phòng an tâm · Xác nhận nhanh chóng</p>
        </div>
      </div>
    </footer>
  );
}
