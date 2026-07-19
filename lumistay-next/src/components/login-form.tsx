"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, BedDouble, KeyRound, ShieldCheck } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.ok) {
      setError(data.message || "Đăng nhập thất bại");
      return;
    }

    router.push(params.get("next") || "/dashboard");
    router.refresh();
  }

  return (
    <div className="grid w-full max-w-4xl overflow-hidden rounded-[6px] border border-[#d8d2c7] bg-[#fbfaf7] md:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden bg-[#183b35] p-9 text-[#f8f5ee] md:flex md:flex-col md:justify-between">
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-[5px] border border-[#d7b27a]/60 text-[#d7b27a]"><BedDouble className="h-5 w-5" aria-hidden="true" /></div>
          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d7b27a]">LumiStay Hotel</p>
          <h1 className="mt-3 max-w-xs text-3xl font-bold leading-tight">Bàn lễ tân bắt đầu từ một ca trực rõ ràng.</h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#d7d9cf]">Theo dõi khách đến, tình trạng phòng, hóa đơn và bàn giao trong cùng một hệ thống nội bộ.</p>
        </div>
        <div className="space-y-3 border-t border-[#355b53] pt-5 text-xs text-[#d7d9cf]">
          <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#d7b27a]" /> Phiên đăng nhập được bảo vệ</p>
          <p className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-[#d7b27a]" /> Quyền truy cập theo vai trò nhân viên</p>
        </div>
      </section>

      <section className="p-6 sm:p-9 md:p-10">
        <div className="md:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#183b35] text-white"><BedDouble className="h-5 w-5" /></div>
          <p className="mt-4 text-sm font-bold text-[#183b35]">LumiStay Hotel</p>
        </div>
        <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a6a2f] md:mt-0">Hệ thống nội bộ</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#183b35]">Đăng nhập ca trực</h2>
        <p className="mt-1 text-sm text-[#716b61]">Sử dụng tài khoản nhân viên đã được cấp.</p>

        <form onSubmit={submit} className="mt-7">
          <label className="block text-[13px] font-semibold text-[#25322d]">
            Tên đăng nhập
            <input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} className="ops-input mt-1.5" />
          </label>

          <label className="mt-4 block text-[13px] font-semibold text-[#25322d]">
            Mật khẩu
            <input autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="ops-input mt-1.5" />
          </label>

          {error ? <p className="mt-4 rounded-[4px] border border-[#e3bfb7] bg-[#fbeeeb] p-3 text-sm text-[#a34e3e]">{error}</p> : null}

          <button disabled={loading} className="ops-btn-primary mt-5 w-full py-3">
            {loading ? "Đang xác thực..." : "Vào bàn lễ tân"}
          </button>

          <div className="mt-5 flex flex-col gap-2 border-t border-[#e7e1d7] pt-4 text-xs text-[#81796d] sm:flex-row sm:items-center sm:justify-between">
            <span>Demo: admin / 123456</span>
            <Link href="/" className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[#183b35] hover:text-[#9a6a2f]"><ArrowLeft className="h-3.5 w-3.5" /> Trang khách sạn</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
