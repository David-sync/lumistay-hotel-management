"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, CalendarDays, Check, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { formatCurrency, formatDate, nightsBetween } from "@/lib/utils";

type Props = {
  soPhg: number;
  tenLp: string;
  ngDen: string;
  ngDi: string;
  gia: number;
};

export function BookingCheckoutForm({ soPhg, tenLp, ngDen, ngDi, gia }: Props) {
  const router = useRouter();
  const [tenKh, setTenKh] = useState("");
  const [soDt, setSoDt] = useState("");
  const [cccd, setCccd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nights = nightsBetween(ngDen, ngDi);
  const total = gia * nights;
  const deposit = Math.round(total * 0.3);
  const remaining = total - deposit;
  const inputClass = "mt-1.5 w-full border border-[#cfc8bc] bg-[#fbf9f5] px-4 py-3 text-sm text-[#25241f] outline-none transition placeholder:text-[#9a958b] focus:border-[#9a6a2f] focus:ring-2 focus:ring-[#9a6a2f]/20";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/public/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenKh, soDt, cccd, soPhg, ngayDen: ngDen, ngayDi: ngDi }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.message || "Không thể hoàn tất đặt phòng. Vui lòng kiểm tra thông tin và thử lại.");
        return;
      }

      const token = typeof data.accessToken === "string" ? `?token=${encodeURIComponent(data.accessToken)}` : "";
      router.push(`/confirmation/${data.booking.maSo}${token}`);
    } catch {
      setError("Kết nối bị gián đoạn. Vui lòng thử lại sau ít phút.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form onSubmit={submit} className="order-2 border border-[#d5cec2] bg-[#fbf9f5] p-5 sm:p-8 lg:order-1">
        <div className="flex items-start gap-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#183b35] text-sm font-bold text-[#f4f0e8]">1</span>
          <div>
            <h2 className="font-display text-2xl font-bold text-[#183b35]">Thông tin người đặt</h2>
            <p className="mt-1 text-sm leading-6 text-[#6c685f]">Thông tin này giúp đội ngũ lễ tân chuẩn bị đón tiếp bạn chu đáo.</p>
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-[#25241f]">Họ và tên <span className="text-[#a34832]">*</span></span>
            <input required autoComplete="name" value={tenKh} onChange={(event) => setTenKh(event.target.value)} className={inputClass} placeholder="Nguyễn Văn An" />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-[#25241f]">Số điện thoại <span className="text-[#a34832]">*</span></span>
            <input required type="tel" inputMode="numeric" autoComplete="tel" pattern="[0-9]{10}" value={soDt} onChange={(event) => setSoDt(event.target.value.replace(/\D/g, ""))} className={inputClass} placeholder="0901234567" maxLength={10} aria-describedby="phone-hint" />
            <span id="phone-hint" className="mt-1 block text-xs text-[#6c685f]">10 chữ số, dùng để liên hệ về kỳ lưu trú.</span>
          </label>
          <label className="block">
            <span className="text-sm font-bold text-[#25241f]">CCCD / CMND <span className="text-[#a34832]">*</span></span>
            <input required inputMode="numeric" pattern="[0-9]{12}" value={cccd} onChange={(event) => setCccd(event.target.value.replace(/\D/g, ""))} className={inputClass} placeholder="079123456789" minLength={12} maxLength={12} aria-describedby="identity-hint" />
            <span id="identity-hint" className="mt-1 block text-xs text-[#6c685f]">Dùng để xác nhận người lưu trú khi nhận phòng.</span>
          </label>
        </div>

        <div className="mt-7 border border-[#d7b27a]/60 bg-[#f4f0e8] p-4">
          <div className="flex gap-3">
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[#9a6a2f]" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-[#183b35]">Thông tin của bạn được bảo mật</p>
              <p className="mt-1 text-xs leading-5 text-[#6c685f]">Thông tin định danh chỉ được dùng để xác nhận người lưu trú và hỗ trợ thủ tục nhận phòng.</p>
            </div>
          </div>
        </div>

        {error ? <div role="alert" className="mt-5 flex gap-2 border border-[#c98d7e] bg-[#f9ece8] p-4 text-sm font-medium text-[#8a3424]"><AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" /> {error}</div> : null}

        <button type="submit" disabled={loading} className="mt-6 w-full cursor-pointer bg-[#183b35] px-5 py-4 text-base font-bold text-[#f4f0e8] transition hover:bg-[#25534a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a6a2f] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Đang xác nhận đặt phòng..." : "Xác nhận đặt phòng"}
        </button>

        <div className="mt-5 grid gap-3 border-t border-[#e1dbd1] pt-5 text-xs text-[#6c685f] sm:grid-cols-3">
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#285b4d]" aria-hidden="true" /> Bảo mật thông tin</span>
          <span className="flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> Cọc 30% giá trị</span>
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#285b4d]" aria-hidden="true" /> Xác nhận ngay</span>
        </div>
      </form>

      <aside className="order-1 border border-[#d5cec2] bg-[#fbf9f5] lg:sticky lg:top-24 lg:order-2">
        <div className="border-b border-[#355b53] bg-[#183b35] px-5 py-5 text-[#f4f0e8]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d7b27a]">Tóm tắt kỳ lưu trú</p>
          <h2 className="mt-2 font-display text-2xl font-bold">{tenLp}</h2>
          <p className="mt-1 text-sm text-[#d7d9cf]">LumiStay Hotel &amp; Residence</p>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 divide-x divide-[#d5cec2] border border-[#d5cec2] py-3">
            <div className="px-3"><p className="text-[10px] font-bold uppercase tracking-wide text-[#6c685f]">Nhận phòng</p><p className="mt-1 text-sm font-bold text-[#25241f]">{formatDate(ngDen)}</p><p className="text-xs text-[#6c685f]">Từ 14:00</p></div>
            <div className="px-3"><p className="text-[10px] font-bold uppercase tracking-wide text-[#6c685f]">Trả phòng</p><p className="mt-1 text-sm font-bold text-[#25241f]">{formatDate(ngDi)}</p><p className="text-xs text-[#6c685f]">Trước 12:00</p></div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#4e4b44]"><CalendarDays className="h-4 w-4 text-[#9a6a2f]" aria-hidden="true" /> {nights} đêm · {nights > 0 ? "Kỳ lưu trú đã chọn" : "Kiểm tra lại ngày"}</p>

          <div className="mt-5 border-t border-[#d5cec2] pt-5">
            <h3 className="text-sm font-bold text-[#183b35]">Chi tiết giá</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-[#6c685f]">{formatCurrency(gia)} × {nights} đêm</dt><dd className="font-semibold text-[#25241f]">{formatCurrency(total)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#6c685f]">Đặt cọc (30%)</dt><dd className="font-semibold text-[#25241f]">{formatCurrency(deposit)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#6c685f]">Thanh toán khi nhận phòng</dt><dd className="font-semibold text-[#25241f]">{formatCurrency(remaining)}</dd></div>
            </dl>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#d5cec2] pt-5">
            <div><p className="text-sm font-bold text-[#183b35]">Tổng dự kiến</p><p className="text-xs text-[#6c685f]">Cho {nights} đêm</p></div>
            <p className="text-xl font-bold text-[#183b35]">{formatCurrency(total)}</p>
          </div>

          <div className="mt-5 border-l-2 border-[#9a6a2f] bg-[#f4f0e8] p-3 text-xs leading-5 text-[#4e4b44]">
            <p className="font-bold text-[#183b35]">Điều kiện linh hoạt</p>
            <p>Hủy miễn phí trước 24 giờ so với giờ nhận phòng. Phần còn lại thanh toán khi nhận phòng.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
