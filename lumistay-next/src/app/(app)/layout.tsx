import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-ops min-h-screen">
      <AppShell>{children}</AppShell>
    </div>
  );
}
