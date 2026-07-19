import Link from "next/link";
import { BedDouble, Clock3, Mail, MapPin, Phone } from "lucide-react";

const footerLink = "rounded-sm transition hover:text-[#d7b27a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b27a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#183b35]";

export function PublicFooter() {
  return (
    <footer className="border-t border-[#355b53] bg-[#183b35] text-[#f4f0e8] print:hidden">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <BedDouble className="h-6 w-6 text-[#d7b27a]" aria-hidden="true" />
              <span className="font-display text-xl font-bold tracking-[0.08em]">LUMISTAY</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#d7d9cf]">
              Một nơi lưu trú vừa đủ riêng tư để nghỉ ngơi, vừa đủ gần để sống cùng nhịp thành phố.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d7b27a]">Khám phá</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#d7d9cf]">
              <li><Link href="/search" className={footerLink}>Phòng nghỉ</Link></li>
              <li><Link href="/#story" className={footerLink}>Câu chuyện của chúng tôi</Link></li>
              <li><Link href="/#amenities" className={footerLink}>Tiện nghi</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d7b27a]">Lưu trú</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#d7d9cf]">
              <li className="flex items-start gap-2"><Clock3 className="mt-1 h-4 w-4 shrink-0 text-[#d7b27a]" aria-hidden="true" /> Nhận phòng từ 14:00</li>
              <li className="flex items-start gap-2"><Clock3 className="mt-1 h-4 w-4 shrink-0 text-[#d7b27a]" aria-hidden="true" /> Trả phòng trước 12:00</li>
              <li>Đặt trực tiếp, giá và điều kiện luôn rõ ràng.</li>
            </ul>
          </div>

          <div id="contact">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d7b27a]">Liên hệ</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#d7d9cf]">
              <li className="flex items-start gap-2"><MapPin className="mt-1 h-4 w-4 shrink-0 text-[#d7b27a]" aria-hidden="true" /> Trung tâm thành phố, Việt Nam</li>
              <li><a href="tel:19001234" className={`flex items-center gap-2 ${footerLink}`}><Phone className="h-4 w-4" aria-hidden="true" /> 1900 1234</a></li>
              <li><a href="mailto:hello@lumistay.vn" className={`flex items-center gap-2 ${footerLink}`}><Mail className="h-4 w-4" aria-hidden="true" /> hello@lumistay.vn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[#355b53] pt-6 text-xs text-[#b9c9c1] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LumiStay Hotel &amp; Residence. Mọi quyền được bảo lưu.</p>
          <p>Đặt trực tiếp với sự an tâm.</p>
        </div>
      </div>
    </footer>
  );
}
