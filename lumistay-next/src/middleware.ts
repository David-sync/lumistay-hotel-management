import { NextRequest, NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";

const protectedPrefixes = ["/dashboard", "/bookings", "/customers", "/invoices", "/services", "/staff", "/reports", "/settings"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = pathname === "/rooms" || protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("hotel_session")?.value;
  const session = await verifySession(token);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
