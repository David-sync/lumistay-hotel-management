import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function GET() {
  const token = (await cookies()).get("hotel_session")?.value;
  const user = await verifySession(token);
  return NextResponse.json({ ok: Boolean(user), user });
}
