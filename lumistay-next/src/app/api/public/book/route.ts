import { NextRequest, NextResponse } from "next/server";
import { createPublicBooking } from "@/lib/repository";
import { signBookingAccess } from "@/lib/public-booking-access";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenKh, soDt, cccd, soPhg, ngayDen, ngayDi } = body;

    if (!tenKh || !soDt || !cccd || !soPhg || !ngayDen || !ngayDi) {
      return NextResponse.json({ ok: false, message: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
    }

    if (!/^\d{10}$/.test(soDt)) {
      return NextResponse.json({ ok: false, message: "Số điện thoại phải có 10 chữ số" }, { status: 400 });
    }

    if (!/^\d{12}$/.test(cccd)) {
      return NextResponse.json({ ok: false, message: "CCCD phải có 12 chữ số" }, { status: 400 });
    }

    if (typeof tenKh !== "string" || tenKh.trim().length < 2 || tenKh.trim().length > 30) {
      return NextResponse.json({ ok: false, message: "Họ tên phải từ 2 đến 30 ký tự" }, { status: 400 });
    }

    const roomNumber = Number(soPhg);
    const checkIn = new Date(ngayDen);
    const checkOut = new Date(ngayDi);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!Number.isInteger(roomNumber) || Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkIn < today || checkOut <= checkIn) {
      return NextResponse.json({ ok: false, message: "Phòng hoặc thời gian lưu trú không hợp lệ" }, { status: 400 });
    }

    const booking = await createPublicBooking({ tenKh: tenKh.trim(), soDt, cccd, soPhg: roomNumber, ngayDen, ngayDi });
    const accessToken = await signBookingAccess(booking.maSo);
    const response = NextResponse.json({ ok: true, booking, accessToken });
    response.cookies.set("booking_access", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 2,
    });
    return response;
  } catch (error: any) {
    console.error("Public booking failed", error);
    return NextResponse.json({ ok: false, message: "Không thể hoàn tất đặt phòng. Phòng có thể vừa được người khác chọn." }, { status: 500 });
  }
}
