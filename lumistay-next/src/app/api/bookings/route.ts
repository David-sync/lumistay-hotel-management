import { NextResponse } from "next/server";
import { createBookingDemo, getBookings } from "@/lib/repository";
import { getApiSession } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getApiSession())) return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
  const data = await getBookings();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  if (!(await getApiSession())) return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
  try {
    const payload = await req.json();
    const data = await createBookingDemo(payload);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message || "Không tạo được booking" }, { status: 500 });
  }
}
