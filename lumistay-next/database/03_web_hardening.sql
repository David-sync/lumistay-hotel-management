USE QLKS;
GO

/*
  LumiStay web hardening migration.
  Run this AFTER the main schema/procedure script and 01_add_taikhoan.sql.
  It is intentionally non-destructive: no tables are dropped and no seed data is changed.
*/

IF OBJECT_ID('dbo.TAIKHOAN', 'U') IS NOT NULL
BEGIN
  GRANT UPDATE ON dbo.TAIKHOAN (LAN_DANG_NHAP_CUOI) TO hotel_web;
END
GO

/*
  The original USP_DAT_PHONG searches availability first but does not re-check it
  while writing. This version keeps the original contract and locks the selected
  room before inserting CTBK, preventing double booking and maintenance bookings.
*/
CREATE OR ALTER PROCEDURE dbo.USP_DAT_PHONG
    @MASO VARCHAR(10) OUTPUT,
    @MAKH VARCHAR(10),
    @SOPHG INT,
    @NGDEN DATETIME,
    @NGDI DATETIME,
    @TIENCOC DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    SET @NGDEN = CAST(CAST(@NGDEN AS DATE) AS DATETIME) + '14:00:00';
    SET @NGDI = CAST(CAST(@NGDI AS DATE) AS DATETIME) + '12:00:00';

    IF @NGDEN < CAST(GETDATE() AS DATE) OR @NGDEN >= @NGDI
    BEGIN
      THROW 51001, N'Ngày lưu trú không hợp lệ.', 1;
    END
    IF @TIENCOC < 0
    BEGIN
      THROW 51002, N'Tiền cọc không hợp lệ.', 1;
    END
    IF NOT EXISTS (SELECT 1 FROM dbo.KHACHHANG WHERE MAKH = @MAKH)
    BEGIN
      THROW 51003, N'Khách hàng không tồn tại.', 1;
    END

    BEGIN TRY
      BEGIN TRAN;

      DECLARE @RoomStatus NVARCHAR(30);
      DECLARE @RoomTypePrice DECIMAL(18,2);
      SELECT @RoomStatus = P.TRANGTHAI, @RoomTypePrice = LP.GIA
      FROM dbo.PHONG P WITH (UPDLOCK, HOLDLOCK)
      JOIN dbo.LOAIPHONG LP ON LP.MALP = P.MALP
      WHERE P.SOPHG = @SOPHG;

      IF @RoomStatus IS NULL
      BEGIN
        THROW 51004, N'Phòng không tồn tại.', 1;
      END
      IF @RoomStatus <> N'Trống'
      BEGIN
        THROW 51005, N'Phòng hiện không sẵn sàng để đặt.', 1;
      END
      IF EXISTS (
        SELECT 1
        FROM dbo.CTBK C
        JOIN dbo.BOOKING B ON B.MASO = C.MASO
        WHERE C.SOPHG = @SOPHG
          AND B.TRANGTHAI <> N'Đã hủy'
          AND @NGDI > C.NGDEN
          AND @NGDEN < C.NGDI
      )
      BEGIN
        THROW 51006, N'Phòng vừa được đặt cho khoảng ngày bị trùng.', 1;
      END
      IF EXISTS (
        SELECT 1
        FROM dbo.CTHD_PHG C
        JOIN dbo.HOADON H ON H.MAHD = C.MAHD
        WHERE C.SOPHG = @SOPHG
          AND H.TRANGTHAI <> N'Đã hủy'
          AND @NGDI > C.NGDEN
          AND @NGDEN < C.NGDI
      )
      BEGIN
        THROW 51007, N'Phòng đã có lưu trú trùng ngày.', 1;
      END

      IF @MASO IS NULL OR LTRIM(RTRIM(@MASO)) = ''
      BEGIN
        DECLARE @NextBooking INT;
        SELECT @NextBooking = ISNULL(MAX(TRY_CAST(SUBSTRING(MASO, 3, LEN(MASO) - 2) AS INT)), 0) + 1
        FROM dbo.BOOKING WITH (UPDLOCK, HOLDLOCK)
        WHERE MASO LIKE 'BK%';
        SET @MASO = 'BK' + CASE WHEN @NextBooking < 100 THEN RIGHT('0' + CAST(@NextBooking AS VARCHAR(10)), 2) ELSE CAST(@NextBooking AS VARCHAR(10)) END;
      END

      IF EXISTS (SELECT 1 FROM dbo.BOOKING WHERE MASO = @MASO)
      BEGIN
        THROW 51008, N'Mã booking đã tồn tại.', 1;
      END

      INSERT INTO dbo.BOOKING (MASO, NGDAT, TIENCOC, TRANGTHAI, MAKH)
      VALUES (@MASO, GETDATE(), @TIENCOC, N'Chờ nhận phòng', @MAKH);

      INSERT INTO dbo.CTBK (MASO, SOPHG, NGDEN, NGDI, GIADAT)
      VALUES (@MASO, @SOPHG, @NGDEN, @NGDI, @RoomTypePrice);

      COMMIT TRAN;
      SELECT @MASO AS MASO, N'Đặt phòng thành công.' AS THONGBAO;
    END TRY
    BEGIN CATCH
      IF @@TRANCOUNT > 0 ROLLBACK TRAN;
      THROW;
    END CATCH
END;
GO

/* The web operation API adds CTHD_PHG after USP_LAP_HOA_DON so room charges
   are available to USP_CAP_NHAT_TONG_HD and USP_TRA_PHONG. */
PRINT N'LumiStay web hardening đã sẵn sàng.';
GO
