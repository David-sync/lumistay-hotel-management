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
    <button onClick={logout} className={cn("inline-flex items-center gap-2 rounded-[4px] border border-[#D8D2C7] bg-[#FBFAF7] px-3 py-2 text-xs font-semibold text-[#5D655F] transition hover:border-[#9A6A2F] hover:bg-[#F7F1E7] hover:text-[#183B35]", className)} type="button" title="Đăng xuất">
      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
      {compact ? <span className="sr-only">Đăng xuất</span> : <span>Đăng xuất</span>}
    </button>
  );
}
