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

  const inputClass = "booking-input mt-1.5 focus-visible:border-[#006ce4] focus-visible:ring-4 focus-visible:ring-[#006ce4]/25";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <form onSubmit={submit} className="order-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 lg:order-1">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#003580] text-sm font-bold text-white">1</span>
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900">Thông tin người đặt</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Nhập thông tin trùng khớp với giấy tờ tùy thân dùng khi nhận phòng.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-gray-800">Họ và tên <span className="text-red-600">*</span></span>
            <input required autoComplete="name" value={tenKh} onChange={(event) => setTenKh(event.target.value)} className={inputClass} placeholder="Nguyễn Văn An" />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-gray-800">Số điện thoại <span className="text-red-600">*</span></span>
            <input required type="tel" inputMode="numeric" autoComplete="tel" pattern="[0-9]{10}" value={soDt} onChange={(event) => setSoDt(event.target.value.replace(/\D/g, ""))} className={inputClass} placeholder="0901234567" maxLength={10} aria-describedby="phone-hint" />
            <span id="phone-hint" className="mt-1 block text-xs text-gray-500">10 chữ số, dùng để liên hệ về đặt phòng.</span>
          </label>
          <label className="block">
            <span className="text-sm font-bold text-gray-800">CCCD / CMND <span className="text-red-600">*</span></span>
            <input required inputMode="numeric" pattern="[0-9]{12}" value={cccd} onChange={(event) => setCccd(event.target.value.replace(/\D/g, ""))} className={inputClass} placeholder="079123456789" minLength={12} maxLength={12} aria-describedby="identity-hint" />
            <span id="identity-hint" className="mt-1 block text-xs text-gray-500">Nhập đủ 12 chữ số trên căn cước công dân.</span>
          </label>
        </div>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div className="flex gap-3">
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[#003580]" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-gray-900">Thông tin của bạn được bảo vệ</p>
              <p className="mt-1 text-xs leading-5 text-gray-600">Thông tin định danh chỉ được dùng để xác nhận người lưu trú và hỗ trợ thủ tục nhận phòng.</p>
            </div>
          </div>
        </div>

        {error ? (
          <div role="alert" className="mt-5 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" /> {error}
          </div>
        ) : null}

        <button type="submit" disabled={loading} className="booking-btn-primary mt-6 w-full py-4 text-base focus-visible:ring-4 focus-visible:ring-[#006ce4] focus-visible:ring-offset-2">
          {loading ? "Đang xác nhận đặt phòng..." : "Hoàn tất đặt phòng"}
        </button>

        <div className="mt-4 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-green-700" aria-hidden="true" /> Đặt phòng an toàn</span>
          <span className="flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-[#003580]" aria-hidden="true" /> Cọc 30% giá trị</span>
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-700" aria-hidden="true" /> Xác nhận ngay</span>
        </div>
      </form>

      <aside className="order-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:order-2 lg:sticky lg:top-24">
        <div className="bg-[#003580] px-5 py-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Tóm tắt đặt phòng</p>
          <h2 className="mt-1 font-display text-2xl font-bold">{tenLp}</h2>
          <p className="mt-1 text-sm text-blue-100">Phòng {soPhg}</p>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 divide-x divide-gray-200 rounded-lg border border-gray-200 py-3">
            <div className="px-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Nhận phòng</p>
              <p className="mt-1 text-sm font-bold text-gray-900">{formatDate(ngDen)}</p>
              <p className="text-xs text-gray-500">Từ 14:00</p>
            </div>
            <div className="px-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Trả phòng</p>
              <p className="mt-1 text-sm font-bold text-gray-900">{formatDate(ngDi)}</p>
              <p className="text-xs text-gray-500">Trước 12:00</p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-gray-700"><CalendarDays className="h-4 w-4 text-[#006ce4]" aria-hidden="true" /> Tổng thời gian: {nights} đêm</p>

          <div className="mt-5 border-t border-gray-200 pt-5">
            <h3 className="text-sm font-bold text-gray-900">Chi tiết giá</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-gray-600">{formatCurrency(gia)} × {nights} đêm</dt><dd className="font-semibold text-gray-900">{formatCurrency(total)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-gray-600">Cần đặt cọc (30%)</dt><dd className="font-semibold text-gray-900">{formatCurrency(deposit)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-gray-600">Còn lại khi nhận phòng</dt><dd className="font-semibold text-gray-900">{formatCurrency(remaining)}</dd></div>
            </dl>
          </div>

          <div className="mt-5 flex items-end justify-between border-t border-gray-200 pt-5">
            <div><p className="text-sm font-bold text-gray-900">Tổng giá phòng</p><p className="text-xs text-gray-500">Cho {nights} đêm</p></div>
            <p className="text-xl font-bold text-[#003580]">{formatCurrency(total)}</p>
          </div>

          <div className="mt-5 rounded-lg bg-green-50 p-3 text-xs leading-5 text-green-800">
            <p className="font-bold">Điều kiện linh hoạt</p>
            <p>Hủy miễn phí trước 24 giờ so với giờ nhận phòng. Phần còn lại thanh toán khi nhận phòng.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
