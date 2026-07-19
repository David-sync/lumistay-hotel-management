import { NextRequest, NextResponse } from "next/server";
import { getPublicBooking } from "@/lib/repository";
import { verifyBookingAccess } from "@/lib/public-booking-access";

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ maSo: string }> }) {
  const { maSo } = await params;
  const token = req.nextUrl.searchParams.get("token") || undefined;

  try {
    const hasAccess = process.env.USE_REAL_DB !== "true" || await verifyBookingAccess(token, maSo);
    const booking = hasAccess ? await getPublicBooking(maSo) : null;
    if (!booking) {
      return NextResponse.json({ ok: false, message: "Không tìm thấy booking" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, booking });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message || "Lỗi tải booking" }, { status: 500 });
  }
}
