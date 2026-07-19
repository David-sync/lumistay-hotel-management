import { NextResponse } from "next/server";
import { getRoomTypes } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    const roomTypes = await getRoomTypes();
    return NextResponse.json({ ok: true, roomTypes });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message || "Không tải được loại phòng" }, { status: 500 });
  }
}
