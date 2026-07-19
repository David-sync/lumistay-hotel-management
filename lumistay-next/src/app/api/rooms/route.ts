import { NextResponse } from "next/server";
import { getRooms } from "@/lib/repository";
import { getApiSession } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getApiSession())) return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
  const data = await getRooms();
  return NextResponse.json(data);
}
