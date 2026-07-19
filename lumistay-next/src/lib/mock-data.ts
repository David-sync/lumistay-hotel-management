import type { Activity, Booking, DashboardData, FrontDeskTask, Invoice, Room, RoomType, ServiceUsage, UserSession } from "./types";

export const demoUser: UserSession = {
  id: "demo",
  username: "admin",
  role: "ADMIN",
  name: "Lễ tân Demo",
  manv: "NV01",
};

export const rooms: Room[] = [
  { soPhong: 101, tang: 1, loaiPhong: "Standard", gia: 450000, trangThai: "Trống", donDep: "Sạch" },
  { soPhong: 102, tang: 1, loaiPhong: "Standard", gia: 450000, trangThai: "Đang thuê", donDep: "Cần dọn", khachHang: "Trần An", maBooking: "BK002", ngayDen: "2026-07-17", ngayDi: "2026-07-19" },
  { soPhong: 103, tang: 1, loaiPhong: "Standard", gia: 450000, trangThai: "Đã đặt", donDep: "Sạch", khachHang: "Hoàng Khoa", maBooking: "BK004", ngayDen: "2026-07-22", ngayDi: "2026-07-24" },
  { soPhong: 104, tang: 1, loaiPhong: "Standard", gia: 450000, trangThai: "Trống", donDep: "Đang dọn" },
  { soPhong: 201, tang: 2, loaiPhong: "Deluxe", gia: 750000, trangThai: "Đã đặt", donDep: "Sạch", khachHang: "Nguyễn Minh", maBooking: "BK001", ngayDen: "2026-07-18", ngayDi: "2026-07-20" },
  { soPhong: 202, tang: 2, loaiPhong: "Deluxe", gia: 750000, trangThai: "Trống", donDep: "Sạch" },
  { soPhong: 203, tang: 2, loaiPhong: "Deluxe", gia: 750000, trangThai: "Đang thuê", donDep: "Sạch", khachHang: "Lê Phương", maBooking: "BK003", ngayDen: "2026-07-18", ngayDi: "2026-07-21" },
  { soPhong: 204, tang: 2, loaiPhong: "Deluxe", gia: 750000, trangThai: "Trống", donDep: "Cần dọn" },
  { soPhong: 301, tang: 3, loaiPhong: "Suite", gia: 1200000, trangThai: "Đang sửa chữa", donDep: "Đang dọn" },
  { soPhong: 302, tang: 3, loaiPhong: "Suite", gia: 1200000, trangThai: "Trống", donDep: "Sạch" },
  { soPhong: 303, tang: 3, loaiPhong: "Suite", gia: 1200000, trangThai: "Đang thuê", donDep: "Sạch", khachHang: "Vũ Linh", maBooking: "BK006", ngayDen: "2026-07-17", ngayDi: "2026-07-18" },
  { soPhong: 304, tang: 3, loaiPhong: "Suite", gia: 1200000, trangThai: "Trống", donDep: "Sạch" },
  { soPhong: 401, tang: 4, loaiPhong: "VIP", gia: 2200000, trangThai: "Đang thuê", donDep: "Sạch", khachHang: "Mai Chi", maBooking: "BK005", ngayDen: "2026-07-16", ngayDi: "2026-07-18" },
  { soPhong: 402, tang: 4, loaiPhong: "VIP", gia: 2200000, trangThai: "Trống", donDep: "Sạch" },
  { soPhong: 403, tang: 4, loaiPhong: "VIP", gia: 2200000, trangThai: "Trống", donDep: "Sạch" },
  { soPhong: 404, tang: 4, loaiPhong: "VIP", gia: 2200000, trangThai: "Đã đặt", donDep: "Sạch", khachHang: "Đặng Nam", maBooking: "BK007", ngayDen: "2026-07-19", ngayDi: "2026-07-20" },
];

export const bookings: Booking[] = [
  { maSo: "BK001", khachHang: "Nguyễn Minh", soDienThoai: "0901122334", soPhong: 201, loaiPhong: "Deluxe", ngayDen: "2026-07-18", ngayDi: "2026-07-20", tienCoc: 500000, tongDuKien: 1500000, trangThai: "Chờ nhận phòng", nextAction: "Nhận phòng", procedure: "USP_NHAN_PHONG" },
  { maSo: "BK002", khachHang: "Trần An", soDienThoai: "0912233445", soPhong: 102, loaiPhong: "Standard", ngayDen: "2026-07-17", ngayDi: "2026-07-19", tienCoc: 300000, tongDuKien: 900000, trangThai: "Đã nhận phòng", nextAction: "Lập hóa đơn", procedure: "USP_LAP_HOA_DON" },
  { maSo: "BK003", khachHang: "Lê Phương", soDienThoai: "0923344556", soPhong: 203, loaiPhong: "Deluxe", ngayDen: "2026-07-18", ngayDi: "2026-07-21", tienCoc: 700000, tongDuKien: 2250000, trangThai: "Đã nhận phòng", nextAction: "Thêm dịch vụ", procedure: "USP_THUE_DICH_VU" },
  { maSo: "BK004", khachHang: "Hoàng Khoa", soDienThoai: "0934455667", soPhong: 103, loaiPhong: "Standard", ngayDen: "2026-07-22", ngayDi: "2026-07-24", tienCoc: 400000, tongDuKien: 900000, trangThai: "Chờ nhận phòng", nextAction: "Đợi ngày đến", procedure: "USP_NHAN_PHONG" },
  { maSo: "BK005", khachHang: "Mai Chi", soDienThoai: "0945566778", soPhong: 401, loaiPhong: "VIP", ngayDen: "2026-07-16", ngayDi: "2026-07-18", tienCoc: 1000000, tongDuKien: 4400000, trangThai: "Chờ trả phòng", nextAction: "Trả phòng", procedure: "USP_TRA_PHONG" },
  { maSo: "BK006", khachHang: "Vũ Linh", soDienThoai: "0956677889", soPhong: 303, loaiPhong: "Suite", ngayDen: "2026-07-17", ngayDi: "2026-07-18", tienCoc: 600000, tongDuKien: 1200000, trangThai: "Chờ trả phòng", nextAction: "Lập hóa đơn", procedure: "USP_LAP_HOA_DON" },
];

export const invoices: Invoice[] = [
  { maHd: "HD001", khachHang: "Trần An", nhanVien: "NV01 - Lễ tân", maBooking: "BK002", soPhong: 102, ngay: "2026-07-17", tienPhong: 900000, tienDichVu: 850000, tong: 1750000, trangThai: "Chưa thanh toán" },
  { maHd: "HD002", khachHang: "Lê Phương", nhanVien: "NV02 - Lễ tân", maBooking: "BK003", soPhong: 203, ngay: "2026-07-18", tienPhong: 2250000, tienDichVu: 300000, tong: 2550000, trangThai: "Chưa thanh toán" },
  { maHd: "HD003", khachHang: "Mai Chi", nhanVien: "NV03 - Kế toán", maBooking: "BK005", soPhong: 401, ngay: "2026-07-18", tienPhong: 4400000, tienDichVu: 800000, tong: 5200000, trangThai: "Đã thanh toán" },
  { maHd: "HD004", khachHang: "Vũ Linh", nhanVien: "NV01 - Lễ tân", maBooking: "BK006", soPhong: 303, ngay: "2026-07-18", tienPhong: 1200000, tienDichVu: 0, tong: 1200000, trangThai: "Chưa thanh toán" },
];

export const services: ServiceUsage[] = [
  { id: "SD001", serviceName: "Ăn sáng", room: 203, guest: "Lê Phương", quantity: 2, amount: 180000, time: "08:10" },
  { id: "SD002", serviceName: "Giặt ủi", room: 102, guest: "Trần An", quantity: 3, amount: 240000, time: "10:25" },
  { id: "SD003", serviceName: "Spa", room: 401, guest: "Mai Chi", quantity: 1, amount: 520000, time: "15:30" },
];

export const frontDeskTasks: FrontDeskTask[] = [
  { id: "T1", title: "Nhận phòng cho BK001", description: "Nguyễn Minh đến hôm nay, phòng 201 đã sạch.", priority: "Cao", time: "14:00", target: "Phòng 201", procedure: "USP_NHAN_PHONG" },
  { id: "T2", title: "Trả phòng VIP 401", description: "Mai Chi hết hạn lưu trú hôm nay, cần tổng hợp dịch vụ.", priority: "Cao", time: "12:00", target: "HD003", procedure: "USP_TRA_PHONG" },
  { id: "T3", title: "Thu hóa đơn HD001", description: "Trần An có hóa đơn chưa thanh toán.", priority: "Vừa", time: "Trước 18:00", target: "HD001", procedure: "USP_THANH_TOAN_HD" },
  { id: "T4", title: "Dọn phòng 104", description: "Phòng trống nhưng chưa đạt trạng thái sạch.", priority: "Thấp", time: "Trong ngày", target: "Phòng 104", procedure: "USP_CAP_NHAT_TRANG_THAI_PHONG" },
];

export const recentActivity: Activity[] = [
  { id: "A1", time: "10:25", title: "Thêm dịch vụ giặt ủi", description: "Phòng 102 dùng 3 lượt giặt ủi", tableName: "SUDUNG_DV" },
  { id: "A2", time: "09:40", title: "Cập nhật trạng thái phòng", description: "Phòng 104 chuyển sang Đang dọn", tableName: "PHONG" },
  { id: "A3", time: "08:10", title: "Thêm dịch vụ ăn sáng", description: "Phòng 203 dùng 2 suất ăn sáng", tableName: "CTHD_DV" },
  { id: "A4", time: "07:55", title: "Tạo booking mới", description: "BK007 đặt phòng VIP 404", tableName: "BOOKING" },
];

const countBy = (floor: number, status: string) => rooms.filter((room) => room.tang === floor && room.trangThai === status).length;

export const dashboard: DashboardData = {
  stats: [
    { label: "Việc cần xử lý", value: "4", hint: "Check-in, trả phòng, thanh toán", trend: "Hôm nay", tone: "warn" },
    { label: "Phòng sẵn sàng bán", value: String(rooms.filter((room) => room.trangThai === "Trống" && room.donDep === "Sạch").length), hint: "Trống + sạch", trend: "Có thể đặt", tone: "good" },
    { label: "Khách đang ở", value: String(rooms.filter((room) => room.trangThai === "Đang thuê").length), hint: "Cần theo dõi dịch vụ", trend: "In-house", tone: "neutral" },
    { label: "Hóa đơn chờ thu", value: String(invoices.filter((invoice) => invoice.trangThai === "Chưa thanh toán").length), hint: "Ưu tiên trước check-out", trend: "Kế toán", tone: "danger" },
  ],
  revenueByMonth: [
    { label: "T2", value: 42 },
    { label: "T3", value: 58 },
    { label: "T4", value: 76 },
    { label: "T5", value: 63 },
    { label: "T6", value: 91 },
    { label: "T7", value: 128 },
  ],
  revenueByRoomType: [
    { label: "Standard", value: 22, note: "Bán đều" },
    { label: "Deluxe", value: 38, note: "Đặt nhiều" },
    { label: "Suite", value: 26, note: "Tỷ suất tốt" },
    { label: "VIP", value: 42, note: "Doanh thu chính" },
  ],
  topServices: [
    { label: "Giặt ủi", value: 32, note: "lượt" },
    { label: "Ăn sáng", value: 28, note: "lượt" },
    { label: "Spa", value: 14, note: "lượt" },
    { label: "Đưa đón", value: 9, note: "lượt" },
  ],
  todayCheckins: bookings.filter((item) => item.ngayDen === "2026-07-18"),
  frontDeskTasks,
  floorSummary: [1, 2, 3, 4].map((floor) => ({
    floor,
    total: rooms.filter((room) => room.tang === floor).length,
    free: countBy(floor, "Trống"),
    occupied: countBy(floor, "Đang thuê"),
    reserved: countBy(floor, "Đã đặt"),
    maintenance: countBy(floor, "Đang sửa chữa"),
  })),
  recentActivity,
};

export const roomTypes: RoomType[] = [
  {
    malp: "LP01",
    tenLp: "Standard Single",
    gia: 500000,
    description: "Phòng tiêu chuẩn dành cho khách đi công tác hoặc nghỉ ngắn ngày. Không gian gọn gàng, đầy đủ tiện nghi cơ bản.",
    amenities: ["WiFi miễn phí", "Máy lạnh", "TV", "Minibar", "Phòng tắm riêng"],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    rating: 8.4,
    reviewCount: 128,
    beds: 1,
    capacity: 1,
    badge: "Phổ biến",
  },
  {
    malp: "LP02",
    tenLp: "Standard Double",
    gia: 800000,
    description: "Phòng đôi rộng rãi với giường queen size, lý tưởng cho cặp đôi hoặc bạn bè đi du lịch.",
    amenities: ["WiFi miễn phí", "Máy lạnh", "TV 43\"", "Minibar", "Ban công nhỏ"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    rating: 8.7,
    reviewCount: 214,
    beds: 1,
    capacity: 2,
    badge: "Giá tốt",
  },
  {
    malp: "LP03",
    tenLp: "VIP Luxury",
    gia: 1500000,
    description: "Trải nghiệm sang trọng với view thành phố, nội thất cao cấp và dịch vụ butler 24/7.",
    amenities: ["View thành phố", "Jacuzzi", "Minibar cao cấp", "Room service", "Bồn tắm"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    rating: 9.2,
    reviewCount: 89,
    beds: 1,
    capacity: 2,
    badge: "Cao cấp",
  },
  {
    malp: "LP04",
    tenLp: "Penthouse",
    gia: 4500000,
    description: "Penthouse đỉnh cao với sân thượng riêng, phòng khách rộng và trang thiết bị smart home.",
    amenities: ["Sân thượng riêng", "Bếp mini", "Smart home", "Butler", "View panorama"],
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
    rating: 9.6,
    reviewCount: 42,
    beds: 2,
    capacity: 4,
    badge: "Độc quyền",
  },
  {
    malp: "LP05",
    tenLp: "Family Suite",
    gia: 2000000,
    description: "Suite gia đình với phòng ngủ riêng biệt, khu vực sinh hoạt chung rộng rãi cho cả gia đình.",
    amenities: ["2 phòng ngủ", "Bếp nhỏ", "Giường phụ", "Khu chơi trẻ em", "Máy giặt"],
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
    rating: 9.0,
    reviewCount: 76,
    beds: 2,
    capacity: 4,
    badge: "Gia đình",
  },
];
