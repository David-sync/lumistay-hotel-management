import { NextResponse } from "next/server";
import { login } from "@/lib/repository";
import { signSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const user = await login(username, password);

    if (!user) {
      return NextResponse.json({ ok: false, message: "Sai tài khoản hoặc mật khẩu" }, { status: 401 });
    }

    const token = await signSession(user);
    const res = NextResponse.json({ ok: true, user });
    res.cookies.set("hotel_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message || "Lỗi đăng nhập" }, { status: 500 });
  }
}
