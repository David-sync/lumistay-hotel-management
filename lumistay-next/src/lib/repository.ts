import bcrypt from "bcryptjs";
import { bookings, dashboard, demoUser, frontDeskTasks, invoices, recentActivity, roomTypes, rooms, services } from "./mock-data";
import type { AvailableRoom, Booking, DashboardData, FloorSummary, Invoice, PublicBookingResult, Room, RoomType, ServiceUsage, UserSession } from "./types";
import { getDb, sql } from "./db";
import { nightsBetween } from "./utils";

const mockPublicBookings = new Map<string, PublicBookingResult>();

function useRealDb() {
  return process.env.USE_REAL_DB === "true";
}

export async function login(username: string, password: string): Promise<UserSession | null> {
  if (!useRealDb()) {
    const ok = username === (process.env.DEMO_USERNAME || "admin") && password === (process.env.DEMO_PASSWORD || "123456");
    return ok ? demoUser : null;
  }

  const db = await getDb();
  const result = await db.request()
    .input("username", sql.VarChar(50), username)
    .query(`
      SELECT TOP 1
        TK.MATK, TK.TENDANGNHAP, TK.MATKHAU_HASH, TK.VAITRO, TK.TRANGTHAI,
        NV.MANV, NV.TENNV
      FROM dbo.TAIKHOAN TK
      LEFT JOIN dbo.NHANVIEN NV ON TK.MANV = NV.MANV
      WHERE TK.TENDANGNHAP = @username
    `);

  const user = result.recordset[0];
  if (!user || !user.TRANGTHAI) return null;

  const valid = await bcrypt.compare(password, user.MATKHAU_HASH);
  if (!valid) return null;

  await db.request()
    .input("matk", sql.Int, user.MATK)
    .query("UPDATE dbo.TAIKHOAN SET LAN_DANG_NHAP_CUOI = GETDATE() WHERE MATK = @matk");

  return {
    id: user.MATK,
    username: user.TENDANGNHAP,
    role: user.VAITRO,
    manv: user.MANV,
    name: user.TENNV || user.TENDANGNHAP,
  };
}

export async function getDashboard(): Promise<DashboardData> {
  if (!useRealDb()) return dashboard;

  const db = await getDb();
  const [roomsResult, bookingResult, invoiceResult, monthResult, roomTypeResult, serviceResult, checkinResult] = await Promise.all([
    db.request().query("SELECT COUNT(*) AS total FROM dbo.PHONG WHERE TRANGTHAI = N'Trống'"),
    db.request().query("SELECT COUNT(*) AS total FROM dbo.v_BookingChuaThanhToan"),
    db.request().query("SELECT COUNT(*) AS total FROM dbo.HOADON WHERE TRANGTHAI = N'Chưa thanh toán'"),
    db.request().query("SELECT * FROM dbo.v_DoanhThuThang"),
    db.request().query("SELECT * FROM dbo.v_DoanhThuTheoLoaiPhong"),
    db.request().query("SELECT * FROM dbo.v_DichVuBanChay"),
    db.request().query("SELECT * FROM dbo.v_KhachCheckInHomNay"),
  ]);

  const revenueRows = monthResult.recordset;
  const latestRevenue = revenueRows.reduce((sum: number, row: any) => sum + Number(row.TongDoanhThu || row.TONGDOANHTHU || row.DOANHTHU || row.TONG || 0), 0);

  return {
    stats: [
      { label: "Việc cần xử lý", value: String((bookingResult.recordset[0]?.total ?? 0) + (invoiceResult.recordset[0]?.total ?? 0)), hint: "Booking + hóa đơn chờ", trend: "SQL", tone: "warn" },
      { label: "Phòng sẵn sàng bán", value: String(roomsResult.recordset[0]?.total ?? 0), hint: "PHONG.TRANGTHAI = Trống", trend: "Live", tone: "good" },
      { label: "Doanh thu view", value: `${Math.round(latestRevenue / 1000000)}M`, hint: "v_DoanhThuThang", trend: "SQL", tone: "neutral" },
      { label: "HĐ chưa thu", value: String(invoiceResult.recordset[0]?.total ?? 0), hint: "HOADON chưa thanh toán", trend: "Kế toán", tone: "danger" },
    ],
    revenueByMonth: revenueRows.slice(-6).map((row: any, index: number) => ({
      label: row.Thang || row.THANG ? `T${row.Thang || row.THANG}/${row.Nam || row.NAM || ""}` : String(row.Month || row.NGAY || `T${index + 1}`),
      value: Math.round(Number(row.TongDoanhThu || row.TONGDOANHTHU || row.DOANHTHU || row.TONG || 0) / 1000000),
    })),
    revenueByRoomType: roomTypeResult.recordset.map((row: any) => ({
      label: String(row.TENLP || row.MALP || row.LOAI_PHONG || "Loại phòng"),
      value: Math.round(Number(row.TongDoanhThuPhong || row.TONGDOANHTHUPHONG || row.DOANHTHU || row.TONG || 0) / 1000000),
    })),
    topServices: serviceResult.recordset.map((row: any) => ({
      label: String(row.TENDV || row.MADV || "Dịch vụ"),
      value: Number(row.TongSoLuongBan || row.TONGSOLUONGBAN || row.SOLUONG || row.SO_LUOT || row.TONG_SOLUONG || 0),
      note: "lượt",
    })),
    todayCheckins: checkinResult.recordset.map(mapBookingLike),
    frontDeskTasks,
    floorSummary: buildFloorSummary(await getRooms()),
    recentActivity,
  };
}

export async function getRooms(): Promise<Room[]> {
  if (!useRealDb()) return rooms;

  const db = await getDb();
  const result = await db.request().query(`
    SELECT P.SOPHG, P.TRANGTHAI, LP.TENLP, LP.GIA
    FROM dbo.PHONG P
    LEFT JOIN dbo.LOAIPHONG LP ON P.MALP = LP.MALP
    ORDER BY P.SOPHG
  `);

  return result.recordset.map((row: any) => {
    const soPhong = Number(row.SOPHG);
    return {
      soPhong,
      tang: Math.floor(soPhong / 100),
      loaiPhong: row.TENLP || "Chưa rõ",
      gia: Number(row.GIA || 0),
      trangThai: row.TRANGTHAI,
      donDep: "Sạch",
    } as Room;
  });
}

export async function getBookings(): Promise<Booking[]> {
  if (!useRealDb()) return bookings;

  const db = await getDb();
  const result = await db.request().query(`
    SELECT B.MASO, KH.TENKH, KH.SODT, C.SOPHG, LP.TENLP, C.NGDEN, C.NGDI, C.GIADAT, B.TIENCOC, B.TRANGTHAI
    FROM dbo.BOOKING B
    JOIN dbo.KHACHHANG KH ON B.MAKH = KH.MAKH
    JOIN dbo.CTBK C ON B.MASO = C.MASO
    LEFT JOIN dbo.PHONG P ON C.SOPHG = P.SOPHG
    LEFT JOIN dbo.LOAIPHONG LP ON P.MALP = LP.MALP
    ORDER BY B.NGDAT DESC
  `);

  return result.recordset.map(mapBookingLike);
}

export async function getInvoices(): Promise<Invoice[]> {
  if (!useRealDb()) return invoices;

  const db = await getDb();
  const result = await db.request().query(`
    SELECT HD.MAHD, KH.TENKH, NV.TENNV, HD.MASO, HD.NGAY, HD.TONG, HD.TRANGTHAI,
      C.SOPHG,
      ISNULL(PH.TIENPHONG, 0) AS TIENPHONG,
      ISNULL(DV.TIENDICHVU, 0) AS TIENDICHVU
    FROM dbo.HOADON HD
    JOIN dbo.KHACHHANG KH ON HD.MAKH = KH.MAKH
    JOIN dbo.NHANVIEN NV ON HD.MANV = NV.MANV
    OUTER APPLY (SELECT TOP 1 SOPHG FROM dbo.CTBK WHERE MASO = HD.MASO ORDER BY SOPHG) C
    OUTER APPLY (SELECT SUM(GIA) AS TIENPHONG FROM dbo.CTHD_PHG WHERE MAHD = HD.MAHD) PH
    OUTER APPLY (SELECT SUM(GIA * SOLG) AS TIENDICHVU FROM dbo.CTHD_DV WHERE MAHD = HD.MAHD) DV
    ORDER BY HD.NGAY DESC
  `);

  return result.recordset.map((row: any) => ({
    maHd: row.MAHD,
    khachHang: row.TENKH,
    nhanVien: row.TENNV,
    maBooking: row.MASO,
    soPhong: Number(row.SOPHG || 0),
    ngay: new Date(row.NGAY).toISOString(),
    tienPhong: Number(row.TIENPHONG || 0),
    tienDichVu: Number(row.TIENDICHVU || 0),
    tong: Number(row.TONG || 0),
    trangThai: row.TRANGTHAI,
  }));
}

export async function getCustomers(): Promise<Array<{ id: string; name: string; phone: string; cccd: string; note: string }>> {
  if (!useRealDb()) {
    return [
      { id: "KH001", name: "Nguyễn Minh", phone: "0901122334", cccd: "079••••••111", note: "Có booking trong hôm nay" },
      { id: "KH002", name: "Trần An", phone: "0912233445", cccd: "079••••••222", note: "Đang lưu trú" },
      { id: "KH003", name: "Lê Phương", phone: "0923344556", cccd: "079••••••333", note: "Khách quay lại" },
    ];
  }

  const db = await getDb();
  const result = await db.request().query(`
    SELECT KH.MAKH, KH.TENKH, KH.SODT, KH.CCCD,
      COUNT(B.MASO) AS SOBOOKING,
      MAX(B.NGDAT) AS LANDATGAN_NHAT
    FROM dbo.KHACHHANG KH
    LEFT JOIN dbo.BOOKING B ON B.MAKH = KH.MAKH
    GROUP BY KH.MAKH, KH.TENKH, KH.SODT, KH.CCCD
    ORDER BY MAX(B.NGDAT) DESC, KH.TENKH
  `);

  return result.recordset.map((row: any) => ({
    id: row.MAKH,
    name: row.TENKH,
    phone: row.SODT || "",
    cccd: row.CCCD ? `${String(row.CCCD).slice(0, 3)}••••••${String(row.CCCD).slice(-3)}` : "",
    note: `${Number(row.SOBOOKING || 0)} lượt đặt${row.LANDATGAN_NHAT ? ` · gần nhất ${new Date(row.LANDATGAN_NHAT).toLocaleDateString("vi-VN")}` : ""}`,
  }));
}

export async function getServiceUsages(): Promise<ServiceUsage[]> {
  if (!useRealDb()) return services;

  const db = await getDb();
  const result = await db.request().query(`
    SELECT SD.MASD, SD.SOPHG, SD.NGAYSD, SD.SOLG, SD.DONGIA_APDUNG,
      D.TENDV, KH.TENKH
    FROM dbo.SUDUNG_DV SD
    JOIN dbo.DICHVU D ON D.MADV = SD.MADV
    JOIN dbo.HOADON HD ON HD.MAHD = SD.MAHD
    JOIN dbo.KHACHHANG KH ON KH.MAKH = HD.MAKH
    ORDER BY SD.NGAYSD DESC
  `);

  return result.recordset.map((row: any) => ({
    id: `SD${String(row.MASD).padStart(3, "0")}`,
    serviceName: row.TENDV,
    room: Number(row.SOPHG),
    guest: row.TENKH,
    quantity: Number(row.SOLG),
    amount: Number(row.SOLG) * Number(row.DONGIA_APDUNG),
    time: new Date(row.NGAYSD).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
  }));
}

export async function getStaff(): Promise<Array<{ manv: string; name: string; role: string; account: string; permission: string }>> {
  if (!useRealDb()) {
    return [
      { manv: "NV01", name: "Lễ tân Demo", role: "LE_TAN", account: "admin", permission: "Booking, nhận phòng, dịch vụ" },
      { manv: "NV02", name: "Quản lý ca", role: "QUAN_LY", account: "manager", permission: "Phòng, báo cáo, điều phối" },
      { manv: "NV03", name: "Kế toán", role: "KE_TOAN", account: "ketoan", permission: "Hóa đơn, thanh toán" },
    ];
  }

  const db = await getDb();
  const result = await db.request().query(`
    SELECT NV.MANV, NV.TENNV, NV.CHUCVU,
      TK.TENDANGNHAP, TK.VAITRO, TK.TRANGTHAI
    FROM dbo.NHANVIEN NV
    LEFT JOIN dbo.TAIKHOAN TK ON TK.MANV = NV.MANV
    ORDER BY NV.MANV
  `);

  const permissions: Record<string, string> = {
    ADMIN: "Toàn quyền hệ thống",
    QUAN_LY: "Phòng, báo cáo, điều phối",
    LE_TAN: "Booking, nhận phòng, dịch vụ",
    KE_TOAN: "Hóa đơn, thanh toán",
  };

  return result.recordset.map((row: any) => {
    const role = row.VAITRO || row.CHUCVU || "Chưa phân quyền";
    return {
      manv: row.MANV,
      name: row.TENNV,
      role,
      account: row.TRANGTHAI === false ? `${row.TENDANGNHAP} (khóa)` : row.TENDANGNHAP || "",
      permission: permissions[role] || row.CHUCVU || "Chưa cấu hình",
    };
  });
}

export async function createBookingDemo(payload: any) {
  if (!useRealDb()) {
    return { ok: true, maSo: `BK${Math.floor(Math.random() * 900 + 100)}`, demo: true, payload };
  }

  const db = await getDb();
  const result = await db.request()
    .input("MAKH", sql.VarChar(10), payload.maKh)
    .input("SOPHG", sql.Int, Number(payload.soPhong))
    .input("NGDEN", sql.DateTime, new Date(payload.ngayDen))
    .input("NGDI", sql.DateTime, new Date(payload.ngayDi))
    .input("TIENCOC", sql.Decimal(18, 2), Number(payload.tienCoc || 0))
    .output("MASO", sql.VarChar(10))
    .execute("dbo.USP_DAT_PHONG");

  return { ok: true, maSo: result.output.MASO };
}

export async function getRoomTypes(): Promise<RoomType[]> {
  if (!useRealDb()) return roomTypes;

  const db = await getDb();
  const result = await db.request().query(`
    SELECT LP.MALP, LP.TENLP, LP.GIA,
      COUNT(P.SOPHG) AS SO_PHONG
    FROM dbo.LOAIPHONG LP
    LEFT JOIN dbo.PHONG P ON LP.MALP = P.MALP
    GROUP BY LP.MALP, LP.TENLP, LP.GIA
    ORDER BY LP.GIA
  `);

  return result.recordset.map((row: any, index: number) => {
    const mock = roomTypes.find((item) => item.malp === row.MALP) || roomTypes[index % roomTypes.length];
    return {
      ...mock,
      malp: row.MALP,
      tenLp: row.TENLP,
      gia: Number(row.GIA),
    };
  });
}

export async function getRoomTypeByMalp(malp: string): Promise<RoomType | null> {
  const types = await getRoomTypes();
  return types.find((item) => item.malp === malp) ?? null;
}

export async function searchAvailableRooms(tenLp: string, ngDen: string, ngDi: string): Promise<AvailableRoom[]> {
  if (!useRealDb()) {
    const nights = nightsBetween(ngDen, ngDi);
    if (nights < 1) return [];
    return rooms
      .filter((room) => room.loaiPhong.includes(tenLp.split(" ")[0]) || room.loaiPhong === tenLp || matchMockRoomType(room.loaiPhong, tenLp))
      .filter((room) => room.trangThai === "Trống")
      .map((room) => ({
        soPhg: room.soPhong,
        malp: roomTypes.find((t) => t.tenLp === tenLp)?.malp || "LP01",
        tenLp,
        gia: room.gia,
        trangThai: room.trangThai,
      }));
  }

  const db = await getDb();
  try {
    const result = await db.request()
      .input("TENLP", sql.NVarChar(30), tenLp)
      .input("NGDEN", sql.DateTime, new Date(ngDen))
      .input("NGDI", sql.DateTime, new Date(ngDi))
      .execute("dbo.USP_TIM_PHONG_TRONG_THEO_LOAI_P");

    return result.recordset.map((row: any) => ({
      soPhg: Number(row.SOPHG),
      malp: row.MALP,
      tenLp: row.TENLP,
      gia: Number(row.GIA),
      trangThai: row.TRANGTHAI,
    }));
  } catch {
    return [];
  }
}

export async function resolveCustomerId(tenKh: string, soDt: string, cccd: string): Promise<string> {
  if (!useRealDb()) {
    return `KH${String(Math.floor(Math.random() * 900 + 100))}`;
  }

  const db = await getDb();
  const existing = await db.request()
    .input("CCCD", sql.VarChar(12), cccd)
    .query("SELECT TOP 1 MAKH FROM dbo.KHACHHANG WHERE CCCD = @CCCD");

  if (existing.recordset[0]?.MAKH) {
    return existing.recordset[0].MAKH;
  }

  try {
    const result = await db.request()
      .input("TENKH", sql.NVarChar(30), tenKh)
      .input("SODT", sql.VarChar(10), soDt)
      .input("CCCD", sql.VarChar(12), cccd)
      .output("MAKH_MOI", sql.VarChar(10))
      .execute("dbo.USP_THEM_KHACH_HANG");

    return result.output.MAKH_MOI;
  } catch (error: any) {
    const retry = await db.request()
      .input("CCCD", sql.VarChar(12), cccd)
      .query("SELECT TOP 1 MAKH FROM dbo.KHACHHANG WHERE CCCD = @CCCD");
    if (retry.recordset[0]?.MAKH) return retry.recordset[0].MAKH;
    throw error;
  }
}

export async function createPublicBooking(payload: {
  tenKh: string;
  soDt: string;
  cccd: string;
  soPhg: number;
  ngayDen: string;
  ngayDi: string;
}): Promise<PublicBookingResult> {
  const nights = nightsBetween(payload.ngayDen, payload.ngayDi);
  const roomList = await getRooms();
  const room = roomList.find((item) => item.soPhong === payload.soPhg);
  const gia = room?.gia || 500000;
  if (!room || room.trangThai !== "Trống" || nights < 1) throw new Error("Phòng hoặc thời gian lưu trú không hợp lệ");
  const tongDuKien = gia * nights;
  const tienCoc = Math.round(tongDuKien * 0.3);

  if (!useRealDb()) {
    const maSo = `BK${Date.now().toString().slice(-8)}`;
    const result = {
      maSo,
      maKh: `KH${Math.floor(Math.random() * 90 + 10)}`,
      soPhg: payload.soPhg,
      tenLp: room.loaiPhong,
      ngayDen: payload.ngayDen,
      ngayDi: payload.ngayDi,
      tienCoc,
      tongDuKien,
      khachHang: payload.tenKh,
    };
    mockPublicBookings.set(maSo, result);
    return result;
  }

  const maKh = await resolveCustomerId(payload.tenKh, payload.soDt, payload.cccd);
  const db = await getDb();
  const result = await db.request()
    .input("MAKH", sql.VarChar(10), maKh)
    .input("SOPHG", sql.Int, payload.soPhg)
    .input("NGDEN", sql.DateTime, new Date(payload.ngayDen))
    .input("NGDI", sql.DateTime, new Date(payload.ngayDi))
    .input("TIENCOC", sql.Decimal(18, 2), tienCoc)
    .output("MASO", sql.VarChar(10))
    .execute("dbo.USP_DAT_PHONG");

  return {
    maSo: result.output.MASO,
    maKh,
    soPhg: payload.soPhg,
    tenLp: room?.loaiPhong || "",
    ngayDen: payload.ngayDen,
    ngayDi: payload.ngayDi,
    tienCoc,
    tongDuKien,
    khachHang: payload.tenKh,
  };
}

export async function getPublicBooking(maSo: string): Promise<PublicBookingResult | null> {
  if (!useRealDb()) {
    const created = mockPublicBookings.get(maSo);
    if (created) return created;
    const booking = bookings.find((item) => item.maSo === maSo);
    if (!booking) return null;
    return {
      maSo: booking.maSo,
      maKh: "KH01",
      soPhg: booking.soPhong,
      tenLp: booking.loaiPhong,
      ngayDen: booking.ngayDen,
      ngayDi: booking.ngayDi,
      tienCoc: booking.tienCoc,
      tongDuKien: booking.tongDuKien,
      khachHang: booking.khachHang,
    };
  }

  const db = await getDb();
  const result = await db.request()
    .input("MASO", sql.VarChar(10), maSo)
    .query(`
      SELECT B.MASO, B.MAKH, B.TIENCOC, KH.TENKH, C.SOPHG, LP.TENLP, C.NGDEN, C.NGDI, C.GIADAT
      FROM dbo.BOOKING B
      JOIN dbo.KHACHHANG KH ON B.MAKH = KH.MAKH
      JOIN dbo.CTBK C ON B.MASO = C.MASO
      LEFT JOIN dbo.PHONG P ON C.SOPHG = P.SOPHG
      LEFT JOIN dbo.LOAIPHONG LP ON P.MALP = LP.MALP
      WHERE B.MASO = @MASO
    `);

  const row = result.recordset[0];
  if (!row) return null;

  return {
    maSo: row.MASO,
    maKh: row.MAKH,
    soPhg: Number(row.SOPHG),
    tenLp: row.TENLP,
    ngayDen: new Date(row.NGDEN).toISOString(),
    ngayDi: new Date(row.NGDI).toISOString(),
    tienCoc: Number(row.TIENCOC),
    tongDuKien: Number(row.GIADAT) * nightsBetween(new Date(row.NGDEN).toISOString(), new Date(row.NGDI).toISOString()),
    khachHang: row.TENKH,
  };
}

function matchMockRoomType(loaiPhong: string, tenLp: string) {
  const map: Record<string, string[]> = {
    "Standard Single": ["Standard"],
    "Standard Double": ["Deluxe"],
    "VIP Luxury": ["Suite", "VIP"],
    "Penthouse": ["VIP"],
    "Family Suite": ["Suite"],
  };
  return map[tenLp]?.some((key) => loaiPhong.includes(key)) ?? false;
}

function mapBookingLike(row: any): Booking {
  return {
    maSo: row.MASO || row.MaBooking || row.MABOOKING || "BK?",
    khachHang: row.TENKH || row.KHACHHANG || "Khách hàng",
    soDienThoai: row.SODT || "",
    soPhong: Number(row.SOPHG || row.SOPHONG || 0),
    loaiPhong: row.TENLP || row.LOAI_PHONG || "Chưa rõ",
    ngayDen: new Date(row.NGDEN || row.NGAYDEN || Date.now()).toISOString(),
    ngayDi: new Date(row.NGDI || row.NGAYDI || Date.now()).toISOString(),
    tienCoc: Number(row.TIENCOC || 0),
    tongDuKien: Number(row.GIADAT || row.TONGDUKIEN || 0),
    trangThai: row.TRANGTHAI || "Chờ nhận phòng",
    nextAction: row.TRANGTHAI === "Đã nhận phòng" ? "Lập hóa đơn" : "Nhận phòng",
    procedure: row.TRANGTHAI === "Đã nhận phòng" ? "USP_LAP_HOA_DON" : "USP_NHAN_PHONG",
  };
}

function buildFloorSummary(sourceRooms: Room[]): FloorSummary[] {
  const floors = Array.from(new Set(sourceRooms.map((room) => room.tang))).sort((a, b) => a - b);
  return floors.map((floor) => {
    const floorRooms = sourceRooms.filter((room) => room.tang === floor);
    return {
      floor,
      total: floorRooms.length,
      free: floorRooms.filter((room) => room.trangThai === "Trống").length,
      occupied: floorRooms.filter((room) => room.trangThai === "Đang thuê").length,
      reserved: floorRooms.filter((room) => room.trangThai === "Đã đặt").length,
      maintenance: floorRooms.filter((room) => room.trangThai === "Đang sửa chữa").length,
    };
  });
}
