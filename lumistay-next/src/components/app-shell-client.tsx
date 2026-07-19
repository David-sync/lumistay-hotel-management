"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  CalendarCheck,
  ConciergeBell,
  Database,
  ExternalLink,
  Gauge,
  Menu,
  ReceiptText,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "./logout-button";

const navigation = [
  { href: "/dashboard", label: "Điều phối", caption: "Tổng quan ca trực", icon: Gauge },
  { href: "/rooms", label: "Sơ đồ phòng", caption: "Tình trạng buồng", icon: BedDouble },
  { href: "/bookings", label: "Đặt & nhận phòng", caption: "Khách đến và lưu trú", icon: CalendarCheck },
  { href: "/invoices", label: "Hóa đơn", caption: "Thanh toán và trả phòng", icon: ReceiptText },
  { href: "/services", label: "Dịch vụ", caption: "Chi phí phát sinh", icon: ConciergeBell },
  { href: "/customers", label: "Khách hàng", caption: "Hồ sơ lưu trú", icon: Users },
  { href: "/staff", label: "Nhân viên", caption: "Ca làm và phân quyền", icon: ShieldCheck },
  { href: "/reports", label: "Báo cáo", caption: "Hiệu suất vận hành", icon: WalletCards },
  { href: "/settings", label: "Cài đặt", caption: "Trạng thái hệ thống", icon: Settings },
];

type ShellUser = {
  name: string;
  username: string;
  role: string;
};

export function AppShellClient({ children, user, isRealDb }: { children: ReactNode; user: ShellUser; isRealDb: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = navigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const initial = user.name.trim().charAt(0).toUpperCase() || "L";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-ops-bg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r border-slate-200 bg-white md:flex xl:w-64">
        <Link href="/dashboard" className="flex h-[72px] items-center justify-center border-b border-slate-200 px-3 xl:justify-start xl:px-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ops-primary text-white shadow-sm">
            <BedDouble className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="ml-3 hidden min-w-0 xl:block">
            <span className="block text-base font-bold text-slate-900">LumiStay Ops</span>
            <span className="block text-xs text-slate-500">Front Desk Console</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2 xl:p-3" aria-label="Điều hướng vận hành">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={item.label}
                className={cn(
                  "group flex min-h-12 items-center justify-center rounded-lg px-2 py-2 text-sm transition xl:justify-start xl:px-3",
                  active ? "bg-blue-50 text-ops-primary" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", active ? "bg-white text-ops-primary shadow-sm ring-1 ring-blue-100" : "text-slate-500 group-hover:text-slate-700")}>
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="ml-3 hidden min-w-0 xl:block">
                  <span className="block font-semibold">{item.label}</span>
                  <span className={cn("block truncate text-[11px]", active ? "text-blue-700/70" : "text-slate-400")}>{item.caption}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <Link href="/" title="Trang đặt phòng" className="flex items-center justify-center rounded-lg border border-slate-200 px-2 py-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-ops-primary xl:justify-start xl:px-3">
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="ml-2 hidden text-xs font-semibold xl:inline">Trang đặt phòng</span>
          </Link>
          <div className="mt-3 hidden items-center gap-3 rounded-lg bg-slate-50 p-3 xl:flex">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">{initial}</span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-slate-800">{user.name}</span>
              <span className="block truncate text-[11px] text-slate-500">{user.role} · @{user.username}</span>
            </span>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/40" aria-label="Đóng menu" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-[min(88vw,320px)] flex-col bg-white shadow-2xl">
            <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-4">
              <Link href="/dashboard" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ops-primary text-white"><BedDouble className="h-5 w-5" /></span>
                <span><span className="block font-bold text-slate-900">LumiStay Ops</span><span className="block text-xs text-slate-500">Front Desk Console</span></span>
              </Link>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Đóng menu"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Điều hướng di động">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5", active ? "bg-blue-50 text-ops-primary" : "text-slate-600 hover:bg-slate-100")}>
                    <Icon className="h-5 w-5" />
                    <span><span className="block text-sm font-semibold">{item.label}</span><span className="block text-xs text-slate-400">{item.caption}</span></span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">{initial}</span>
                <span><span className="block text-sm font-semibold text-slate-900">{user.name}</span><span className="block text-xs text-slate-500">{user.role} · @{user.username}</span></span>
              </div>
              <LogoutButton className="w-full justify-center" />
            </div>
          </aside>
        </div>
      ) : null}

      <main className="md:pl-20 xl:pl-64">
        <header className="sticky top-0 z-20 flex h-[72px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6 xl:px-8">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setMobileOpen(true)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 md:hidden" aria-label="Mở menu"><Menu className="h-5 w-5" /></button>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{current?.label || "Vận hành lễ tân"}</p>
                <p className="hidden truncate text-xs text-slate-500 sm:block">{current?.caption || "LumiStay"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:text-xs", isRealDb ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700")}>
                <Database className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{isRealDb ? "SQL Server trực tuyến" : "Dữ liệu mô phỏng"}</span>
                <span className="sm:hidden">{isRealDb ? "Live" : "Demo"}</span>
              </span>
              <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 lg:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-ops-primary">{initial}</span>
                <span className="min-w-0"><span className="block max-w-36 truncate text-xs font-semibold text-slate-800">{user.name}</span><span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">{user.role}</span></span>
              </div>
              <div className="hidden sm:block"><LogoutButton compact /></div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:py-7 xl:px-8">{children}</div>
      </main>
    </div>
  );
}
