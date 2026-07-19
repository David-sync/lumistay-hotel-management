import { NextResponse } from "next/server";
import { getInvoices } from "@/lib/repository";
import { getApiSession } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getApiSession())) return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
  const data = await getInvoices();
  return NextResponse.json(data);
}
