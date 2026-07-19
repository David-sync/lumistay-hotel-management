import type { ReactNode } from "react";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-public flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1 bg-[#f4f0e8]">{children}</main>
      <PublicFooter />
    </div>
  );
}
