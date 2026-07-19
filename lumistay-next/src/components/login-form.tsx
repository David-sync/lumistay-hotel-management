"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BedDouble } from "lucide-react";

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
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-ops-primary text-white">
          <BedDouble className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">LumiStay Ops</h1>
        <p className="mt-1 text-sm text-slate-500">Đăng nhập hệ thống lễ tân</p>
      </div>

      <form onSubmit={submit} className="ops-card p-6">
        <label className="block text-sm font-medium text-slate-700">
          Tên đăng nhập
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="ops-input mt-1.5" />
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Mật khẩu
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="ops-input mt-1.5" />
        </label>

        {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

        <button disabled={loading} className="ops-btn-primary mt-5 w-full py-3">
          {loading ? "Đang đăng nhập..." : "Vào dashboard"}
        </button>

        <p className="mt-4 text-center text-xs text-slate-400">
          Demo: admin / 123456 · <Link href="/" className="cursor-pointer font-semibold text-ops-primary hover:underline">Về trang đặt phòng</Link>
        </p>
      </form>
    </div>
  );
}
