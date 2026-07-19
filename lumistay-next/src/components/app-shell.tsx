import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { AppShellClient } from "./app-shell-client";

export async function AppShell({ children }: { children: ReactNode }) {
  const token = (await cookies()).get("hotel_session")?.value;
  const user = await verifySession(token);
  if (!user) redirect("/login");

  return (
    <AppShellClient
      user={{
        name: user.name || user.username,
        username: user.username,
        role: user.role,
      }}
    >
      {children}
    </AppShellClient>
  );
}
