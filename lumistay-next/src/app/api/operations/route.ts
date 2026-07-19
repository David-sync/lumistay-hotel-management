import { NextRequest, NextResponse } from "next/server";
import { getApiSession } from "@/lib/api-auth";
import { getDb, sql } from "@/lib/db";

export const runtime = "nodejs";

type OperationAction = "check-in" | "create-invoice" | "pay" | "checkout";

const messages: Record<OperationAction, string> = {
  "check-in": "Đã nhận phòng thành công.",
  "create-invoice": "Đã lập hóa đơn cho booking.",
  pay: "Đã thanh toán hóa đơn.",
  checkout: "Đã trả phòng thành công.",
};

const allowedRoles: Record<OperationAction, string[]> = {
  "check-in": ["ADMIN", "QUAN_LY", "LE_TAN"],
  "create-invoice": ["ADMIN", "QUAN_LY", "LE_TAN"],
  pay: ["ADMIN", "QUAN_LY", "KE_TOAN"],
  checkout: ["ADMIN", "QUAN_LY", "LE_TAN"],
};

export async function POST(req: NextRequest) {
  const session = await getApiSession();
  if (!session) return NextResponse.json({ message: "Phiên đăng nhập đã hết hạn" }, { status: 401 });

  try {
    const body = await req.json();
    const action = body.action as OperationAction;
    if (!action || !Object.prototype.hasOwnProperty.call(messages, action)) {
      return NextResponse.json({ message: "Thao tác không hợp lệ" }, { status: 400 });
    }
    if (!allowedRoles[action].includes(session.role)) {
      return NextResponse.json({ message: "Vai trò hiện tại không được phép thực hiện thao tác này" }, { status: 403 });
    }

    const maSo = typeof body.maSo === "string" ? body.maSo.trim() : "";
    const maHd = typeof body.maHd === "string" ? body.maHd.trim() : "";
    if ((action === "check-in" || action === "create-invoice") && !/^BK\d+$/.test(maSo)) {
      return NextResponse.json({ message: "Mã booking không hợp lệ" }, { status: 400 });
    }
    if ((action === "pay" || action === "checkout") && !/^HD\d+$/.test(maHd)) {
      return NextResponse.json({ message: "Mã hóa đơn không hợp lệ" }, { status: 400 });
    }

    if (process.env.USE_REAL_DB !== "true") {
      return NextResponse.json({ ok: true, demo: true, message: `${messages[action]} (chế độ demo)` });
    }

    const db = await getDb();

    if (action === "check-in") {
      await db.request()
        .input("MASO", sql.VarChar(10), maSo)
        .execute("dbo.USP_NHAN_PHONG");
    }

    if (action === "create-invoice") {
      if (!session.manv) return NextResponse.json({ message: "Tài khoản chưa liên kết nhân viên" }, { status: 403 });

      await db.request()
        .input("MASO", sql.VarChar(10), maSo)
        .input("MANV", sql.VarChar(10), session.manv)
        .query(`
          SET XACT_ABORT ON;
          BEGIN TRY
            BEGIN TRAN;

            DECLARE @SO_MOI INT;
            DECLARE @MAHD VARCHAR(10);
            SELECT @SO_MOI = ISNULL(MAX(TRY_CAST(SUBSTRING(MAHD, 3, LEN(MAHD) - 2) AS INT)), 0) + 1
            FROM dbo.HOADON WITH (UPDLOCK, HOLDLOCK)
            WHERE MAHD LIKE 'HD%';

            SET @MAHD = 'HD' + CASE WHEN @SO_MOI < 100 THEN RIGHT('0' + CAST(@SO_MOI AS VARCHAR(10)), 2) ELSE CAST(@SO_MOI AS VARCHAR(10)) END;

            EXEC dbo.USP_LAP_HOA_DON @MAHD = @MAHD, @MASO = @MASO, @MANV = @MANV;

            INSERT INTO dbo.CTHD_PHG(MAHD, SOPHG, NGDEN, NGDI, GIA)
            SELECT @MAHD, C.SOPHG, C.NGDEN, C.NGDI,
              C.GIADAT * DATEDIFF(DAY, CAST(C.NGDEN AS DATE), CAST(C.NGDI AS DATE))
            FROM dbo.CTBK C
            WHERE C.MASO = @MASO
              AND NOT EXISTS (
                SELECT 1 FROM dbo.CTHD_PHG HP
                WHERE HP.MAHD = @MAHD AND HP.SOPHG = C.SOPHG
              );

            EXEC dbo.USP_CAP_NHAT_TONG_HD @MAHD = @MAHD;
            COMMIT TRAN;
          END TRY
          BEGIN CATCH
            IF @@TRANCOUNT > 0 ROLLBACK TRAN;
            THROW;
          END CATCH
        `);
    }

    if (action === "pay") {
      await db.request()
        .input("MAHD", sql.VarChar(10), maHd)
        .execute("dbo.USP_THANH_TOAN_HD");
    }

    if (action === "checkout") {
      await db.request()
        .input("MAHD", sql.VarChar(10), maHd)
        .execute("dbo.USP_TRA_PHONG");
    }

    return NextResponse.json({ ok: true, message: messages[action] });
  } catch (error) {
    console.error("Hotel operation failed", error);
    const message = error instanceof Error ? error.message.replace(/^.*Lỗi:\s*/u, "") : "Không thể hoàn tất thao tác";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
