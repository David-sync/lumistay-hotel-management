import { NextRequest, NextResponse } from "next/server";
import { searchAvailableRooms } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const tenLp = searchParams.get("tenLp");
  const ngDen = searchParams.get("ngDen");
  const ngDi = searchParams.get("ngDi");

  if (!tenLp || !ngDen || !ngDi) {
    return NextResponse.json({ ok: false, message: "Thiếu tham số tìm kiếm" }, { status: 400 });
  }

  const checkIn = new Date(ngDen);
  const checkOut = new Date(ngDi);
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkIn >= checkOut) {
    return NextResponse.json({ ok: false, message: "Ngày đi phải sau ngày đến" }, { status: 400 });
  }

  try {
    const rooms = await searchAvailableRooms(tenLp, ngDen, ngDi);
    return NextResponse.json({ ok: true, rooms, count: rooms.length });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message || "Tìm kiếm thất bại" }, { status: 500 });
  }
}
