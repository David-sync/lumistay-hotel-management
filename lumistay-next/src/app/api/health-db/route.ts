import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getApiSession } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getApiSession())) return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
  if (process.env.USE_REAL_DB !== "true") {
    return NextResponse.json({ ok: true, mode: "mock", message: "USE_REAL_DB=false nên chưa cần SQL Server" });
  }

  try {
    const db = await getDb();
    const result = await db.request().query("SELECT DB_NAME() AS databaseName, GETDATE() AS serverTime");
    return NextResponse.json({ ok: true, mode: "sql-server", data: result.recordset[0] });
  } catch (error) {
    console.error("Database health check failed", error);
    return NextResponse.json({ ok: false, message: "Không thể kết nối SQL Server" }, { status: 500 });
  }
}
