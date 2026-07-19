"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function LogoutButton({ compact = false, className }: { compact?: boolean; className?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={logout} className={cn("inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900", className)} type="button" title="Đăng xuất">
      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
      {compact ? <span className="sr-only">Đăng xuất</span> : <span>Đăng xuất</span>}
    </button>
  );
}
