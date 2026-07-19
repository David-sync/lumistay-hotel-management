export type Role = "ADMIN" | "QUAN_LY" | "LE_TAN" | "KE_TOAN";

export type UserSession = {
  id: number | string;
  username: string;
  role: Role;
  name?: string;
  manv?: string;
};

export type Stat = {
  label: string;
  value: string;
  hint: string;
  trend?: string;
  tone?: "good" | "warn" | "danger" | "neutral";
};

export type RoomStatus = "Trống" | "Đang thuê" | "Đã đặt" | "Đang sửa chữa";

export type Room = {
  soPhong: number;
  tang: number;
  loaiPhong: string;
  gia: number;
  trangThai: RoomStatus;
  donDep: "Sạch" | "Cần dọn" | "Đang dọn";
  khachHang?: string;
  maBooking?: string;
  ngayDen?: string;
  ngayDi?: string;
};

export type BookingStatus = "Chờ nhận phòng" | "Đã nhận phòng" | "Chờ trả phòng" | "Đã hủy";

export type Booking = {
  maSo: string;
  khachHang: string;
  soDienThoai: string;
  soPhong: number;
  loaiPhong: string;
  ngayDen: string;
  ngayDi: string;
  tienCoc: number;
  tongDuKien: number;
  trangThai: BookingStatus;
  nextAction: string;
  procedure: "USP_DAT_PHONG" | "USP_NHAN_PHONG" | "USP_LAP_HOA_DON" | "USP_TRA_PHONG" | "USP_THANH_TOAN_HD" | "USP_THUE_DICH_VU";
};

export type Invoice = {
  maHd: string;
  khachHang: string;
  nhanVien: string;
  maBooking: string;
  soPhong: number;
  ngay: string;
  tienPhong: number;
  tienDichVu: number;
  tong: number;
  trangThai: "Đã thanh toán" | "Chưa thanh toán" | "Đã hủy";
};

export type ReportRow = {
  label: string;
  value: number;
  note?: string;
};

export type FrontDeskTask = {
  id: string;
  title: string;
  description: string;
  priority: "Cao" | "Vừa" | "Thấp";
  time: string;
  target: string;
  procedure: string;
};

export type FloorSummary = {
  floor: number;
  total: number;
  free: number;
  occupied: number;
  reserved: number;
  maintenance: number;
};

export type ServiceUsage = {
  id: string;
  serviceName: string;
  room: number;
  guest: string;
  quantity: number;
  amount: number;
  time: string;
};

export type Activity = {
  id: string;
  time: string;
  title: string;
  description: string;
  tableName: string;
};

export type DashboardData = {
  stats: Stat[];
  revenueByMonth: ReportRow[];
  revenueByRoomType: ReportRow[];
  topServices: ReportRow[];
  todayCheckins: Booking[];
  frontDeskTasks: FrontDeskTask[];
  floorSummary: FloorSummary[];
  recentActivity: Activity[];
};

export type RoomType = {
  malp: string;
  tenLp: string;
  gia: number;
  description: string;
  amenities: string[];
  image: string;
  rating: number;
  reviewCount: number;
  beds: number;
  capacity: number;
  badge?: string;
};

export type AvailableRoom = {
  soPhg: number;
  malp: string;
  tenLp: string;
  gia: number;
  trangThai: string;
};

export type PublicBookingResult = {
  maSo: string;
  maKh: string;
  soPhg: number;
  tenLp: string;
  ngayDen: string;
  ngayDi: string;
  tienCoc: number;
  tongDuKien: number;
  khachHang: string;
};
