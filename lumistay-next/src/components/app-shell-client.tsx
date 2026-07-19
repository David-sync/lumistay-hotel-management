"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  CalendarCheck,
  ConciergeBell,
  ExternalLink,
  FileBarChart,
  Menu,
  ReceiptText,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "./logout-button";

type NavItem = {
  href: string;
  label: string;
  icon: typeof BedDouble;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navigation: NavGroup[] = [
  {
    label: "Lễ tân",
    items: [
      { href: "/dashboard", label: "Hôm nay", icon: FileBarChart },
      { href: "/rooms", label: "Sơ đồ phòng", icon: BedDouble },
      { href: "/bookings", label: "Đặt phòng", icon: CalendarCheck },
      { href: "/invoices", label: "Thu ngân", icon: ReceiptText },
    ],
  },
  {
    label: "Khách lưu trú",
    items: [
      { href: "/customers", label: "Khách hàng", icon: Users },
      { href: "/services", label: "Dịch vụ", icon: ConciergeBell },
    ],
  },
  {
    label: "Quản trị",
    items: [
      { href: "/reports", label: "Báo cáo", icon: FileBarChart },
      { href: "/staff", label: "Nhân viên", icon: ShieldCheck },
      { href: "/settings", label: "Cài đặt", icon: Settings },
    ],
  },
];

const allNavigation = navigation.flatMap((group) => group.items);

type ShellUser = {
  name: string;
  username: string;
  role: string;
};

export function AppShellClient({ children, user }: { children: ReactNode; user: ShellUser }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = allNavigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const initial = user.name.trim().charAt(0).toUpperCase() || "L";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#F4F1EB] text-[#17211E] font-sans">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r border-[#D8D2C7] bg-[#FBFAF7] md:flex xl:w-60">
        <Link href="/dashboard" className="flex h-16 items-center justify-center border-b border-[#D8D2C7] px-3 xl:justify-start xl:px-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] bg-[#183B35] text-[#F8F5EE]">
            <BedDouble className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="ml-3 hidden min-w-0 xl:block">
            <span className="block text-[15px] font-bold tracking-tight text-[#183B35]">LumiStay</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-[#81796D]">Lễ tân khách sạn</span>
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-2 py-3 xl:px-3" aria-label="Điều hướng vận hành">
          {navigation.map((group) => (
            <div key={group.label} className="mb-4 last:mb-0">
              <p className="mb-1 hidden px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9A6A2F] xl:block">{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    title={item.label}
                    className={cn(
                      "group mb-0.5 flex min-h-10 items-center justify-center rounded-[5px] px-2 py-2 text-[13px] font-semibold transition xl:justify-start xl:px-3",
                      active ? "bg-[#E7EEEA] text-[#183B35]" : "text-[#5D655F] hover:bg-[#F0EDE7] hover:text-[#183B35]",
                    )}
                  >
                    <Icon className={cn("h-[17px] w-[17px] shrink-0", active ? "text-[#183B35]" : "text-[#81796D] group-hover:text-[#183B35]")} aria-hidden="true" />
                    <span className="ml-3 hidden xl:block">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-[#D8D2C7] p-3">
          <Link href="/" title="Trang đặt phòng" className="flex items-center justify-center rounded-[5px] border border-[#D8D2C7] px-2 py-2 text-[#5D655F] transition hover:border-[#9A6A2F] hover:bg-[#F7F1E7] hover:text-[#183B35] xl:justify-start xl:px-3">
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="ml-2 hidden text-xs font-semibold xl:inline">Trang đặt phòng</span>
          </Link>
          <div className="mt-3 hidden items-center gap-2.5 rounded-[5px] bg-[#F0EDE7] p-2.5 xl:flex">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DCE6E1] text-xs font-bold text-[#183B35]">{initial}</span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[#25322D]">{user.name}</span>
              <span className="block truncate text-[10px] text-[#81796D]">{user.role} · @{user.username}</span>
            </span>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-[#17211E]/45" aria-label="Đóng menu" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-[min(88vw,320px)] flex-col border-r border-[#D8D2C7] bg-[#FBFAF7] shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-[#D8D2C7] px-4">
              <Link href="/dashboard" className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#183B35] text-[#F8F5EE]"><BedDouble className="h-[18px] w-[18px]" /></span>
                <span><span className="block text-[15px] font-bold text-[#183B35]">LumiStay</span><span className="block text-[10px] uppercase tracking-[0.12em] text-[#81796D]">Lễ tân khách sạn</span></span>
              </Link>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-[5px] p-2 text-[#5D655F] hover:bg-[#F0EDE7]" aria-label="Đóng menu"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Điều hướng di động">
              {navigation.map((group) => (
                <div key={group.label} className="mb-4">
                  <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9A6A2F]">{group.label}</p>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("mb-0.5 flex items-center gap-3 rounded-[5px] px-3 py-2.5 text-[13px] font-semibold", active ? "bg-[#E7EEEA] text-[#183B35]" : "text-[#5D655F] hover:bg-[#F0EDE7]")}><Icon className="h-[18px] w-[18px]" /><span>{item.label}</span></Link>;
                  })}
                </div>
              ))}
            </nav>
            <div className="border-t border-[#D8D2C7] p-4">
              <div className="mb-3 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DCE6E1] text-xs font-bold text-[#183B35]">{initial}</span><span><span className="block text-sm font-semibold text-[#25322D]">{user.name}</span><span className="block text-xs text-[#81796D]">{user.role} · @{user.username}</span></span></div>
              <LogoutButton className="w-full justify-center" />
            </div>
          </aside>
        </div>
      ) : null}

      <main className="md:pl-20 xl:pl-60">
        <header className="sticky top-0 z-20 flex min-h-16 items-center border-b border-[#D8D2C7] bg-[#FBFAF7]/95 px-4 backdrop-blur md:px-6 xl:px-8">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setMobileOpen(true)} className="rounded-[5px] border border-[#D8D2C7] p-2 text-[#5D655F] hover:bg-[#F0EDE7] md:hidden" aria-label="Mở menu"><Menu className="h-5 w-5" /></button>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#183B35]">{current?.label || "Hôm nay"}</p>
                <p className="hidden truncate text-[11px] text-[#81796D] sm:block">LumiStay Hotel · Ca trực lễ tân</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/bookings" className="inline-flex h-9 items-center gap-1.5 rounded-[5px] bg-[#183B35] px-3 text-xs font-bold text-[#F8F5EE] transition hover:bg-[#102F2A] sm:px-3.5 sm:text-[13px]">Đặt phòng mới <span aria-hidden="true">+</span></Link>
              <div className="hidden items-center gap-2 border-l border-[#D8D2C7] pl-3 lg:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7EEEA] text-xs font-bold text-[#183B35]">{initial}</span>
                <span className="min-w-0"><span className="block max-w-36 truncate text-xs font-semibold text-[#25322D]">{user.name}</span><span className="block text-[10px] text-[#81796D]">{user.role}</span></span>
              </div>
              <div className="hidden sm:block"><LogoutButton compact /></div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:py-6 xl:px-8">{children}</div>
      </main>
    </div>
  );
}
