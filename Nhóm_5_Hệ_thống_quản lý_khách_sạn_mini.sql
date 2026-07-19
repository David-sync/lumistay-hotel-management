IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'QLKS')
BEGIN
    CREATE DATABASE QLKS;
END
GO

USE QLKS;
GO

DROP TABLE IF EXISTS SUDUNG_DV;
DROP TABLE IF EXISTS CTHD_DV;
DROP TABLE IF EXISTS CTHD_PHG;
DROP TABLE IF EXISTS HOADON;
DROP TABLE IF EXISTS CTBK;
DROP TABLE IF EXISTS BOOKING;

DROP TABLE IF EXISTS PHG_TAISAN;
DROP TABLE IF EXISTS TAISAN;

DROP TABLE IF EXISTS LOG_GIA_DV;
DROP TABLE IF EXISTS DICHVU;

DROP TABLE IF EXISTS LOG_GIA_PHG;
DROP TABLE IF EXISTS NHANVIEN;
DROP TABLE IF EXISTS KHACHHANG;
DROP TABLE IF EXISTS PHONG;
DROP TABLE IF EXISTS LOAIPHONG;
GO

-- 1.TẠO BẢNG LOẠI PHÒNG
CREATE TABLE LOAIPHONG(
	MALP VARCHAR(10) PRIMARY KEY,
	TENLP NVARCHAR(30),
	GIA DECIMAL(18, 2) NOT NULL
);
-- 2.TẠO BẢNG PHÒNG
CREATE TABLE PHONG(
	SOPHG INT PRIMARY KEY,
	TRANGTHAI NVARCHAR(30) NOT NULL CHECK (TRANGTHAI IN (N'Trống', N'Đang thuê', N'Đang sửa chữa')),
	MALP VARCHAR(10) FOREIGN KEY REFERENCES LOAIPHONG(MALP)
);
-- 3.TẠO BẢNG KHÁCH HÀNG
CREATE TABLE KHACHHANG(
	MAKH VARCHAR(10) PRIMARY KEY,
	TENKH NVARCHAR(30) NOT NULL,
	SODT VARCHAR(10), 
	CCCD VARCHAR(12) NOT NULL UNIQUE
);
-- 4.TẠO BẢNG NHÂN VIÊN
CREATE TABLE NHANVIEN(
	MANV VARCHAR(10) PRIMARY KEY,
	TENNV NVARCHAR(30) NOT NULL,
	SDT VARCHAR(10) NOT NULL,
	LUONG DECIMAL(18, 2) NOT NULL CHECK(LUONG > 0),
	CHUCVU NVARCHAR(30)
);
-- 5.TẠO BẢNG DỊCH VỤ
CREATE TABLE DICHVU(
	MADV VARCHAR(10) PRIMARY KEY,
	TENDV NVARCHAR(30) NOT NULL,
	DONGIA DECIMAL(18, 2) NOT NULL CHECK(DONGIA > 0)
);
-- 6.TẠO BẢNG BOOKING
CREATE TABLE BOOKING(
	MASO VARCHAR(10) PRIMARY KEY,
	NGDAT DATETIME NOT NULL,
	TIENCOC DECIMAL(18, 2) DEFAULT 0 CHECK(TIENCOC >= 0),
	TRANGTHAI NVARCHAR(30) NOT NULL CHECK (TRANGTHAI IN (N'Chờ nhận phòng', N'Đã nhận phòng', N'Đã hủy')), 
	MAKH VARCHAR(10) NOT NULL FOREIGN KEY REFERENCES KHACHHANG(MAKH)
);
-- 7.TẠO BẢNG CTBK
CREATE TABLE CTBK(
	MASO VARCHAR(10),
	SOPHG INT,
	NGDEN DATETIME NOT NULL,
	NGDI DATETIME NOT NULL,
	GIADAT DECIMAL(18, 2) NOT NULL CHECK(GIADAT > 0),
	PRIMARY KEY (MASO, SOPHG),
	FOREIGN KEY (MASO) REFERENCES BOOKING(MASO),
	FOREIGN KEY (SOPHG) REFERENCES PHONG(SOPHG),
	CONSTRAINT CK_CTBK_NGAY CHECK (NGDI > NGDEN)
);
-- 8,TẠO BẢNG HÓA ĐƠN
CREATE TABLE HOADON(
	MAHD VARCHAR(10) PRIMARY KEY,
	MAKH VARCHAR(10) NOT NULL FOREIGN KEY REFERENCES KHACHHANG(MAKH),
	MANV VARCHAR(10) NOT NULL FOREIGN KEY REFERENCES NHANVIEN(MANV),
	MASO VARCHAR(10) NOT NULL UNIQUE FOREIGN KEY REFERENCES BOOKING(MASO),
	TONG DECIMAL(18, 2) NOT NULL DEFAULT 0 CHECK(TONG >= 0),
	TRANGTHAI NVARCHAR(30) NOT NULL CHECK (TRANGTHAI IN (N'Đã thanh toán', N'Chưa thanh toán', N'Đã hủy')),
	NGAY DATETIME NOT NULL
);
-- 9.TẠO BẢNG CTHD_PHG
CREATE TABLE CTHD_PHG(
	MAHD VARCHAR(10),
	SOPHG INT,
	NGDEN DATETIME NOT NULL,
	NGDI DATETIME NOT NULL,
	GIA DECIMAL(18, 2) NOT NULL CHECK(GIA >0),
	PRIMARY KEY (MAHD, SOPHG),
	FOREIGN KEY (MAHD) REFERENCES HOADON(MAHD),
	FOREIGN KEY (SOPHG) REFERENCES PHONG(SOPHG),
	CONSTRAINT CK_CTHD_PHG_NGAY CHECK (NGDI > NGDEN)
);
-- 10.TẠO BẢNG CTHD_DV
CREATE TABLE CTHD_DV(
	MAHD VARCHAR(10),
	MADV VARCHAR(10),
	SOLG INT NOT NULL CHECK(SOLG >0),
	GIA DECIMAL(18, 2) NOT NULL CHECK(GIA >0),
	PRIMARY KEY (MAHD, MADV),
	FOREIGN KEY (MAHD) REFERENCES HOADON(MAHD),
	FOREIGN KEY (MADV) REFERENCES DICHVU(MADV)
);
-- 11. BẢNG LOG GIÁ PHÒNG (Để truy vết lịch sử giá)
CREATE TABLE LOG_GIA_PHG (
    ID_LOG_PHONG INT IDENTITY(1,1) PRIMARY KEY,
    MALP VARCHAR(10) REFERENCES LOAIPHONG(MALP),
    GIA_CU DECIMAL(18, 2),
    GIA_MOI DECIMAL(18, 2),
    NGAY_THAY_DOI DATETIME DEFAULT GETDATE(),
    LYDO NVARCHAR(100)
);

-- 12. BẢNG LOG GIÁ DỊCH VỤ
CREATE TABLE LOG_GIA_DV (
    ID_LOG_DV INT IDENTITY(1,1) PRIMARY KEY,
    MADV VARCHAR(10) REFERENCES DICHVU(MADV),
    GIA_CU DECIMAL(18, 2),
    GIA_MOI DECIMAL(18, 2),
    NGAY_THAY_DOI DATETIME DEFAULT GETDATE(),
    LYDO NVARCHAR(100)
);

-- 13. BẢNG DANH MỤC TÀI SẢN (Dùng chung cho toàn khách sạn)
CREATE TABLE TAISAN (
    MATS VARCHAR(10) PRIMARY KEY,
    TENTS NVARCHAR(100),
    DONGIA_NHAP DECIMAL(18, 2) CHECK (DONGIA_NHAP >= 0)
);

-- 14. BẢNG PHONG_TAISAN (Quản lý tài sản trong phòng)
CREATE TABLE PHG_TAISAN (
    SOPHG INT REFERENCES PHONG(SOPHG),
    MATS VARCHAR(10) REFERENCES TAISAN(MATS),
    SOLUONG INT CHECK (SOLUONG > 0) ,
    TINHTRANG NVARCHAR(30) CHECK (TINHTRANG IN (N'Tốt', N'Cần bảo trì', N'Hỏng', N'Đang sửa chữa')), 
    PRIMARY KEY (SOPHG, MATS)
);

--15. BẢNG SUDUNG_DV
CREATE TABLE SUDUNG_DV (
    MASD INT IDENTITY(1,1) PRIMARY KEY,
    SOPHG INT NOT NULL, 
    MAHD VARCHAR(10) NOT NULL,
    MADV VARCHAR(10) NOT NULL,
    NGAYSD DATETIME NOT NULL DEFAULT GETDATE(),
    SOLG INT NOT NULL CHECK (SOLG > 0),
    DONGIA_APDUNG DECIMAL(18,2) NOT NULL CHECK (DONGIA_APDUNG > 0),

    FOREIGN KEY (MAHD) REFERENCES HOADON(MAHD),
    FOREIGN KEY (MADV) REFERENCES DICHVU(MADV),
    FOREIGN KEY (SOPHG) REFERENCES PHONG(SOPHG)
);
GO

-- Nhập dữ liệu [Mốc thời gian nhập: 10-5-2026]
-- 1. LOẠI PHÒNG
INSERT INTO LOAIPHONG (MALP, TENLP, GIA) VALUES
('LP01', N'Standard Single', 500000),
('LP02', N'Standard Double', 800000),
('LP03', N'VIP Luxury', 1500000),
('LP04', N'Penthouse', 4500000),
('LP05', N'Family Suite', 2000000);

-- 2. PHÒNG
INSERT INTO PHONG (SOPHG, TRANGTHAI, MALP) VALUES
(101, N'Trống', 'LP01'),
(102, N'Đang sửa chữa', 'LP01'),
(103, N'Đang thuê', 'LP01'), 
(104, N'Trống', 'LP01'),
(201, N'Trống', 'LP02'),
(202, N'Đang sửa chữa', 'LP02'),
(203, N'Trống', 'LP02'),
(204, N'Đang sửa chữa', 'LP02'),
(301, N'Trống', 'LP03'),
(302, N'Đang thuê', 'LP03'),
(303, N'Trống', 'LP03'),
(401, N'Trống', 'LP04'),
(501, N'Đang thuê', 'LP05'),
(502, N'Đang sửa chữa', 'LP05');

-- 3. KHÁCH HÀNG
INSERT INTO KHACHHANG (MAKH, TENKH, SODT, CCCD) VALUES
('KH01', N'Nguyễn Văn Thành', '0903123456', '079123456001'),
('KH02', N'Lê Thị Mai', '0912456789', '079123456002'),
('KH03', N'Trần Minh Hoàng', '0988654321', '079123456003'),
('KH04', N'Phạm Thu Thảo', '0933777888', '079123456004'),
('KH05', N'Đỗ Gia Bảo', '0944111222', '079123456005'),
('KH06', N'Bùi Bích Phương', '0977222333', '079123456006'),
('KH07', N'Võ Hoàng Yến', '0909000111', '079123456007'),
('KH08', N'Lý Hải Nam', '0911555444', '079123456008'),
('KH09', N'Nguyễn Bích Diệp', '0905123456', '079000111222'),
('KH10', N'Trịnh Công Sơn', '0909998887', '079000555444');

-- 4. NHÂN VIÊN
INSERT INTO NHANVIEN (MANV, TENNV, SDT, LUONG, CHUCVU) VALUES
('NV01', N'Nguyễn Quản Lý', '0901000111', 20000000, N'Quản lý'),
('NV02', N'Trần Lễ Tân', '0902000222', 9000000, N'Lễ tân'),
('NV03', N'Lê Tiếp Tân', '0903000333', 8500000, N'Lễ tân'),
('NV04', N'Phạm Kế Toán', '0904000444', 12000000, N'Kế toán'),
('NV05', N'Hoàng Phục Vụ', '0905000555', 7000000, N'Phục vụ');

-- 5. DỊCH VỤ
INSERT INTO DICHVU (MADV, TENDV, DONGIA) VALUES
('DV01', N'Giặt ủi', 50000),
('DV02', N'Nước suối', 20000),
('DV03', N'Buffet Sáng', 150000),
('DV04', N'Massage/Spa', 600000),
('DV05', N'Thuê xe máy', 150000),
('DV06', N'Mì ly', 25000),
('DV07', N'Bia/Nước ngọt', 35000),
('DV08', N'Đưa đón sân bay', 300000);

-- 6. BOOKING
INSERT INTO BOOKING (MASO, NGDAT, TIENCOC, TRANGTHAI, MAKH) VALUES
('BK01', '2025-01-09', 1000000, N'Đã nhận phòng', 'KH01'),  
('BK02', '2025-05-11', 320000, N'Đã nhận phòng', 'KH02'),   
('BK03', '2025-09-17', 1500000, N'Đã nhận phòng', 'KH03'),  
('BK04', '2025-11-06', 500000, N'Đã nhận phòng', 'KH04'),   
('BK05', '2026-01-12', 6500000, N'Đã nhận phòng', 'KH05'),  
('BK06', '2026-03-02', 320000, N'Đã nhận phòng', 'KH06'),   
('BK07', '2026-04-29', 1500000, N'Đã nhận phòng', 'KH07'),  
('BK08', '2026-05-05', 1200000, N'Đã nhận phòng', 'KH08'),  
('BK09', '2026-05-05', 300000, N'Đã nhận phòng', 'KH01'),   
('BK10', '2026-05-08', 6500000, N'Chờ nhận phòng', 'KH09'),  
('BK11', '2026-05-09', 200000, N'Chờ nhận phòng', 'KH10'),   
('BK12', '2026-05-10', 480000, N'Chờ nhận phòng', 'KH04');  

-- 7. CTBK
INSERT INTO CTBK (MASO, SOPHG, NGDEN, NGDI, GIADAT) VALUES
('BK01', 101, '2025-01-15', '2025-01-20', 2500000),
('BK01', 102, '2025-01-15', '2025-01-20', 2500000),
('BK02', 201, '2025-05-16', '2025-05-18', 1600000),
('BK03', 301, '2025-09-20', '2025-09-25', 7500000),
('BK04', 102, '2025-11-17', '2025-11-22', 2500000),
('BK05', 401, '2026-01-20', '2026-01-25', 22500000),
('BK05', 502, '2026-01-20', '2026-01-25', 10000000),
('BK06', 202, '2026-03-15', '2026-03-17', 1600000),
('BK07', 302, '2026-05-06', '2026-05-11', 7500000),
('BK08', 501, '2026-05-10', '2026-05-13', 6000000),
('BK09', 103, '2026-05-09', '2026-05-12', 1500000),
('BK10', 401, '2026-05-14', '2026-05-19', 22500000),
('BK10', 501, '2026-05-14', '2026-05-19', 10000000),
('BK11', 104, '2026-05-24', '2026-05-26', 1000000),
('BK12', 203, '2026-05-25', '2026-05-28', 2400000);

-- 8. HÓA ĐƠN
INSERT INTO HOADON (MAHD, MAKH, MANV, MASO, TONG, NGAY, TRANGTHAI) VALUES
('HD01', 'KH01', 'NV02', 'BK01', 5250000, '2025-01-20', N'Đã thanh toán'),  
('HD02', 'KH02', 'NV02', 'BK02', 1410000, '2025-05-18', N'Đã thanh toán'),  
('HD03', 'KH03', 'NV03', 'BK03', 8300000, '2025-09-25', N'Đã thanh toán'),  
('HD04', 'KH04', 'NV02', 'BK04', 2250000, '2025-11-22', N'Đã thanh toán'),  
('HD05', 'KH05', 'NV02', 'BK05', 30500000, '2026-01-25', N'Đã thanh toán'), 
('HD06', 'KH06', 'NV03', 'BK06', 1490000, '2026-03-17', N'Đã thanh toán'),  
('HD07', 'KH07', 'NV05', 'BK07', 6900000, '2026-05-11', N'Chưa thanh toán'),  
('HD08', 'KH08', 'NV02', 'BK08', 4860000, '2026-05-13', N'Chưa thanh toán'),  
('HD09', 'KH01', 'NV03', 'BK09', 1250000, '2026-05-12', N'Chưa thanh toán'),  
('HD10', 'KH09', 'NV02', 'BK10', 26000000, '2026-05-19', N'Chưa thanh toán'),
('HD11', 'KH10', 'NV03', 'BK11', 800000, '2026-05-26', N'Chưa thanh toán'),  
('HD12', 'KH04', 'NV02', 'BK12', 1920000, '2026-05-28', N'Chưa thanh toán'); 

-- 9. CTHD_PHG
INSERT INTO CTHD_PHG (MAHD, SOPHG, NGDEN, NGDI, GIA) VALUES
('HD01', 101, '2025-01-15', '2025-01-20', 2500000),
('HD01', 102, '2025-01-15', '2025-01-20', 2500000),
('HD02', 201, '2025-05-16', '2025-05-18', 1600000),
('HD03', 301, '2025-09-20', '2025-09-25', 7500000),
('HD04', 102, '2025-11-17', '2025-11-22', 2500000),
('HD05', 401, '2026-01-20', '2026-01-25', 22500000),
('HD05', 502, '2026-01-20', '2026-01-25', 10000000),
('HD06', 202, '2026-03-15', '2026-03-17', 1600000),
('HD07', 302, '2026-05-06', '2026-05-11', 7500000),
('HD08', 501, '2026-05-10', '2026-05-13', 6000000),
('HD09', 103, '2026-05-09', '2026-05-12', 1500000),
('HD10', 401, '2026-05-14', '2026-05-19', 22500000),
('HD10', 501, '2026-05-14', '2026-05-19', 10000000),
('HD11', 104, '2026-05-24', '2026-05-26', 1000000),
('HD12', 203, '2026-05-25', '2026-05-28', 2400000);

-- 10. CTHD_DV
INSERT INTO CTHD_DV (MAHD, MADV, SOLG, GIA) VALUES
('HD01', 'DV02', 10, 200000),
('HD01', 'DV03', 5, 750000),
('HD01', 'DV08', 1, 300000),
('HD02', 'DV02', 4, 80000),
('HD02', 'DV06', 2, 50000),
('HD03', 'DV04', 2, 1200000),
('HD03', 'DV05', 5, 750000),
('HD03', 'DV07', 10, 350000),
('HD04', 'DV01', 3, 150000),
('HD04', 'DV02', 5, 100000),
('HD05', 'DV04', 4, 2400000),
('HD05', 'DV08', 1, 600000),
('HD05', 'DV03', 4, 1500000),
('HD06', 'DV07', 6, 210000),
('HD07', 'DV05', 2, 300000),
('HD07', 'DV04', 1, 600000),
('HD08', 'DV02', 3, 60000),
('HD09', 'DV01', 1, 50000);
GO

-- 11. LOG_GIA_PHONG 
INSERT INTO LOG_GIA_PHG (MALP, GIA_CU, GIA_MOI, NGAY_THAY_DOI, LYDO) VALUES
('LP01', 450000, 500000, '2026-01-01', N'Điều chỉnh giá đầu năm'),
('LP02', 750000, 800000, '2026-01-05', N'Nâng cấp thiết bị'),
('LP03', 1200000, 1500000, '2026-01-10', N'Nâng cấp phòng VIP'),
('LP04', 4000000, 4500000, '2026-02-01', N'Tăng giá mùa lễ hội'),
('LP05', 1800000, 2000000, '2026-02-15', N'Tăng giá dịch vụ gia đình'),
('LP01', 500000, 550000, '2026-03-01', N'Điều chỉnh theo thị trường'),
('LP02', 800000, 850000, '2026-03-10', N'Phụ phí vệ sinh'),
('LP03', 1500000, 1600000, '2026-04-01', N'Tăng giá mùa du lịch'),
('LP04', 4500000, 4800000, '2026-04-15', N'Nâng cấp nội thất cao cấp'),
('LP05', 2000000, 2200000, '2026-05-01', N'Phụ phí dịp lễ lớn');

-- 12. LOG_GIA_DV
INSERT INTO LOG_GIA_DV (MADV, GIA_CU, GIA_MOI, NGAY_THAY_DOI, LYDO) VALUES
('DV01', 40000, 45000, '2026-01-01', N'Tăng giá nguyên liệu giặt'),
('DV02', 15000, 20000, '2026-01-05', N'Tăng giá nhập nước'),
('DV03', 120000, 140000, '2026-01-10', N'Cải thiện thực đơn buffet'),
('DV04', 500000, 600000, '2026-02-01', N'Nâng cấp dịch vụ Spa'),
('DV05', 120000, 150000, '2026-02-15', N'Bảo trì xe máy'),
('DV06', 20000, 25000, '2026-03-01', N'Tăng giá mì gói nhập'),
('DV07', 30000, 35000, '2026-03-15', N'Tăng giá bia/nước ngọt'),
('DV08', 250000, 300000, '2026-04-01', N'Phụ phí xăng dầu'),
('DV01', 45000, 50000, '2026-04-15', N'Điều chỉnh giá giặt ủi'),
('DV03', 140000, 150000, '2026-05-01', N'Buffet đặc biệt dịp lễ');

--13. DANHMUCTAISAN
INSERT INTO TAISAN (MATS, TENTS, DONGIA_NHAP) VALUES
('TS01', N'Tivi Samsung 43 inch', 8000000),
('TS02', N'Giường đơn tiêu chuẩn', 3000000),
('TS03', N'Giường đôi tiêu chuẩn', 5000000),
('TS04', N'Giường King size', 5000000),
('TS05', N'Điều hòa Daikin', 12000000),
('TS06', N'Tủ lạnh mini', 3000000),
('TS07', N'Ghế sofa', 2000000),
('TS08', N'Bàn làm việc', 1500000),
('TS09', N'Đèn ngủ thông minh', 500000),
('TS010', N'Máy sấy tóc', 300000),
('TS011', N'Ấm đun siêu tốc', 200000);

--14. PHONG_TAISAN
INSERT INTO PHG_TAISAN (SOPHG, MATS, SOLUONG, TINHTRANG) VALUES
-- Hạng Standard Single (Phòng 101 -> 104): Giường đơn (TS02), không Sofa (TS07), không giường King (TS04)
(101, 'TS01', 1, N'Tốt'), (101, 'TS02', 1, N'Tốt'), (101, 'TS05', 1, N'Tốt'), (101, 'TS06', 1, N'Tốt'), (101, 'TS08', 1, N'Tốt'), (101, 'TS09', 1, N'Tốt'), (101, 'TS010', 1, N'Tốt'), (101, 'TS011', 1, N'Tốt'),
(102, 'TS01', 1, N'Tốt'), (102, 'TS02', 1, N'Cần bảo trì'), (102, 'TS05', 1, N'Tốt'), (102, 'TS06', 1, N'Tốt'), (102, 'TS08', 1, N'Tốt'), (102, 'TS09', 1, N'Tốt'), (102, 'TS010', 1, N'Tốt'), (102, 'TS011', 1, N'Tốt'),
(103, 'TS01', 1, N'Tốt'), (103, 'TS02', 1, N'Tốt'), (103, 'TS05', 1, N'Tốt'), (103, 'TS06', 1, N'Tốt'), (103, 'TS08', 1, N'Tốt'), (103, 'TS09', 1, N'Tốt'), (103, 'TS010', 1, N'Tốt'), (103, 'TS011', 1, N'Tốt'),
(104, 'TS01', 1, N'Tốt'), (104, 'TS02', 1, N'Tốt'), (104, 'TS05', 1, N'Tốt'), (104, 'TS06', 1, N'Tốt'), (104, 'TS08', 1, N'Tốt'), (104, 'TS09', 1, N'Tốt'), (104, 'TS010', 1, N'Tốt'), (104, 'TS011', 1, N'Tốt'),

-- Hạng Standard Double (Phòng 201 -> 204): Đổi sang Giường đôi (TS03), tăng Đèn ngủ (TS09) lên số lượng 2
(201, 'TS01', 1, N'Tốt'), (201, 'TS03', 1, N'Tốt'), (201, 'TS05', 1, N'Tốt'), (201, 'TS06', 1, N'Tốt'), (201, 'TS08', 1, N'Tốt'), (201, 'TS09', 2, N'Tốt'), (201, 'TS010', 1, N'Tốt'), (201, 'TS011', 1, N'Tốt'),
(202, 'TS01', 1, N'Tốt'), (202, 'TS03', 1, N'Tốt'), (202, 'TS05', 1, N'Tốt'), (202, 'TS06', 1, N'Đang sửa chữa'), (202, 'TS08', 1, N'Tốt'), (202, 'TS09', 2, N'Tốt'), (202, 'TS010', 1, N'Tốt'), (202, 'TS011', 1, N'Tốt'),
(203, 'TS01', 1, N'Tốt'), (203, 'TS03', 1, N'Tốt'), (203, 'TS05', 1, N'Tốt'), (203, 'TS06', 1, N'Tốt'), (203, 'TS08', 1, N'Tốt'), (203, 'TS09', 2, N'Tốt'), (203, 'TS010', 1, N'Tốt'), (203, 'TS011', 1, N'Tốt'),
(204, 'TS01', 1, N'Tốt'), (204, 'TS03', 1, N'Tốt'), (204, 'TS05', 1, N'Tốt'), (204, 'TS06', 1, N'Tốt'), (204, 'TS08', 1, N'Tốt'), (204, 'TS09', 2, N'Tốt'), (204, 'TS010', 1, N'Tốt'), (204, 'TS011', 1, N'Tốt'),

-- Hạng VIP Luxury (Phòng 301 -> 303): Giường King size (TS04), bổ sung thêm Ghế sofa (TS07), tăng Máy sấy (TS010) và Ấm đun (TS011) lên số lượng 2
(301, 'TS03', 1, N'Tốt'), (301, 'TS04', 1, N'Tốt'), (301, 'TS05', 1, N'Tốt'), (301, 'TS07', 1, N'Tốt'), (301, 'TS08', 1, N'Tốt'), (301, 'TS09', 1, N'Tốt'), (301, 'TS010', 2, N'Tốt'), (301, 'TS011', 2, N'Tốt'),
(302, 'TS03', 1, N'Tốt'), (302, 'TS04', 1, N'Tốt'), (302, 'TS05', 1, N'Tốt'), (302, 'TS07', 1, N'Tốt'), (302, 'TS08', 1, N'Tốt'), (302, 'TS09', 1, N'Tốt'), (302, 'TS010', 2, N'Tốt'), (302, 'TS011', 2, N'Tốt'),
(303, 'TS03', 1, N'Tốt'), (303, 'TS04', 1, N'Tốt'), (303, 'TS05', 1, N'Tốt'), (303, 'TS07', 1, N'Tốt'), (303, 'TS08', 1, N'Tốt'), (303, 'TS09', 1, N'Tốt'), (303, 'TS010', 2, N'Tốt'), (303, 'TS011', 2, N'Tốt'),

-- Hạng Penthouse (Phòng 401): Giường King size (TS04), tăng số lượng Tivi (TS01 x2), Ghế sofa (TS07 x2), Điều hòa (TS05 x3)
(401, 'TS01', 2, N'Tốt'), (401, 'TS04', 1, N'Tốt'), (401, 'TS05', 3, N'Tốt'), (401, 'TS06', 1, N'Tốt'), (401, 'TS07', 2, N'Tốt'), (401, 'TS08', 1, N'Tốt'), (401, 'TS09', 4, N'Tốt'), (401, 'TS010', 2, N'Tốt'), (401, 'TS011', 1, N'Tốt'),
-- Hạng Family Suite (Phòng 501 -> 502): Trang bị kết hợp cả 1 Giường đơn (TS02) và 1 Giường đôi (TS03), có thêm Ghế sofa (TS07)
(501, 'TS01', 2, N'Tốt'), (501, 'TS02', 1, N'Tốt'), (501, 'TS03', 1, N'Tốt'), (501, 'TS05', 2, N'Tốt'), (501, 'TS06', 1, N'Tốt'), (501, 'TS07', 1, N'Tốt'), (501, 'TS08', 1, N'Tốt'), (501, 'TS09', 3, N'Tốt'), (501, 'TS010', 1, N'Tốt'), (501, 'TS011', 1, N'Tốt'),
(502, 'TS01', 2, N'Tốt'), (502, 'TS02', 1, N'Tốt'), (502, 'TS03', 1, N'Cần bảo trì'), (502, 'TS05', 2, N'Tốt'), (502, 'TS06', 1, N'Tốt'), (502, 'TS07', 1, N'Tốt'), (502, 'TS08', 1, N'Tốt'), (502, 'TS09', 3, N'Tốt'), (502, 'TS010', 1, N'Tốt'), (502, 'TS011', 1, N'Tốt');


--15. SUDUNG_DV
INSERT INTO SUDUNG_DV (SOPHG, MAHD, MADV, NGAYSD, SOLG, DONGIA_APDUNG) VALUES
(101, 'HD01', 'DV08', '2025-01-15 15:10:00', 1, 300000),
(101, 'HD01', 'DV02', '2025-01-16 08:30:00', 10, 20000),
(101, 'HD01', 'DV03', '2025-01-17 07:00:00', 5, 150000),
(201, 'HD02', 'DV02', '2025-05-16 09:15:00', 4, 20000),
(201, 'HD02', 'DV06', '2025-05-16 21:00:00', 2, 25000),
(301, 'HD03', 'DV04', '2025-09-21 14:00:00', 2, 600000),
(301, 'HD03', 'DV05', '2025-09-22 09:00:00', 5, 150000),
(301, 'HD03', 'DV07', '2025-09-23 20:30:00', 10, 35000),
(102, 'HD04', 'DV01', '2025-11-18 10:00:00', 3, 50000),
(102, 'HD04', 'DV02', '2025-11-19 09:00:00', 5, 20000),
(401, 'HD05', 'DV08', '2026-01-20 16:00:00', 1, 600000),
(401, 'HD05', 'DV04', '2026-01-21 15:00:00', 4, 600000),
(502, 'HD05', 'DV03', '2026-01-22 07:00:00', 4, 375000),
(202, 'HD06', 'DV07', '2026-03-16 20:00:00', 6, 35000),
(302, 'HD07', 'DV05', '2026-05-08 09:30:00', 2, 150000),
(302, 'HD07', 'DV04', '2026-05-09 15:00:00', 1, 600000),
(103, 'HD09', 'DV01', '2026-05-10 08:00:00', 1, 50000),
(501, 'HD08', 'DV02', '2026-05-12 11:00:00', 3, 20000);
GO

-- INDEX

CREATE NONCLUSTERED INDEX idx_KhachHang_TraCuu
ON KHACHHANG(SODT, CCCD)
GO
CREATE NONCLUSTERED INDEX idx_Phong_TrangThai_Loai
ON PHONG(TRANGTHAI, MALP)
GO
CREATE NONCLUSTERED INDEX idx_CTBK_NgayThang
ON CTBK(SOPHG, NGDEN, NGDI)
GO

-- kiểm thử index
-- Case 1: Tìm kiếm thông tin khách hàng dựa trên Số điện thoại và CCCD
PRINT N'CASE 1: TÌM KIẾM THÔNG TIN KHÁCH HÀNG DỰA TRÊN SỐ ĐIỆN THOẠI VÀ CCCD';
SELECT MAKH, TENKH, SODT, CCCD
FROM KHACHHANG WITH (INDEX(idx_KhachHang_TraCuu))
WHERE SODT = '0903123456' AND CCCD = '079123456001';
GO
-- Case 2: Tìm kiếm các phòng trống thuộc một loại phòng cụ thể
PRINT N'CASE 2: TÌM KIẾM CÁC PHÒNG TRỐNG THUỘC MỘT LOẠI PHÒNG CỤ THỂ';
SELECT SOPHG, TRANGTHAI, MALP
FROM PHONG WITH (INDEX(idx_Phong_TrangThai_Loai))
WHERE TRANGTHAI = N'Trống' AND MALP = 'LP01';
GO
-- Case 3: Tra cứu lịch đặt phòng theo số phòng và khoảng thời gian đến đi
PRINT N'CASE 3: TRA CỨU LỊCH ĐẶT PHÒNG THEO SỐ PHÒNG VÀ KHOẢNG THỜI GIAN ĐẾN ĐI';
SELECT MASO, SOPHG, NGDEN, NGDI
FROM CTBK WITH (INDEX(idx_CTBK_NgayThang))
WHERE SOPHG = 101 AND NGDEN >= '2025-01-01' AND NGDI <= '2025-01-30';
GO


-- FUNCTION
DROP FUNCTION IF EXISTS UFC_TINH_SO_DEM;
DROP FUNCTION IF EXISTS UFC_TINH_TONG_SO_DEM_PHONG_THEO_HD;
DROP FUNCTION IF EXISTS UFC_KIEM_TRA_PHONG_TRONG;
DROP FUNCTION IF EXISTS UFC_TONG_TIEN_PHONG;
DROP FUNCTION IF EXISTS UFC_TONG_TIEN_DV;
DROP FUNCTION IF EXISTS UFC_TONG_HD;
DROP FUNCTION IF EXISTS UFC_SO_TIEN_CON_LAI;
DROP FUNCTION IF EXISTS UFC_DOANH_THU_THANG;
GO

-- 1. Tính số đêm ở
CREATE FUNCTION UFC_TINH_SO_DEM(@NGDEN DATETIME, @NGDI DATETIME)
RETURNS INT 
AS
BEGIN
	DECLARE @TEMP INT;
	SELECT @TEMP = DATEDIFF(DAY, @NGDEN, @NGDI);

	RETURN @TEMP;
END
GO

SELECT dbo.UFC_TINH_SO_DEM('2026-05-10', '2026-05-15') AS SoDem;
GO

-- 2. Tính tổng số đêm của hóa đơn
CREATE FUNCTION UFC_TINH_TONG_SO_DEM_PHONG_THEO_HD(@MAHD VARCHAR(10))
RETURNS INT 
AS 
BEGIN
	DECLARE @TONG INT;
	SELECT @TONG = SUM(DATEDIFF(DAY, NGDEN, NGDI))
	FROM CTHD_PHG
	WHERE MAHD = @MAHD;

	RETURN @TONG;
END
GO

SELECT dbo.UFC_TINH_TONG_SO_DEM_PHONG_THEO_HD('HD08') AS TONG_SO_DEM_PHONG_THEO_HD;
GO

-- 3. Kiểm tra phòng trống
CREATE FUNCTION UFC_KIEM_TRA_PHONG_TRONG(@SOPHG INT, @NGDEN DATETIME, @NGDI DATETIME)
RETURNS BIT
AS 
BEGIN
	DECLARE @KQ BIT;
	IF EXISTS (SELECT 1 
				FROM CTBK CT
				WHERE SOPHG = @SOPHG AND @NGDEN < CT.NGDI AND @NGDI > CT.NGDEN)
		SET @KQ = 0;
	ELSE
		SET @KQ = 1;

	RETURN @KQ;
END
GO

SELECT dbo.UFC_KIEM_TRA_PHONG_TRONG(101, '2026-04-07', '2026-04-15') AS PHONG_TRONG;
GO

-- 4. Tính tổng tiền phòng của hóa đơn
CREATE FUNCTION UFC_TONG_TIEN_PHONG(@MAHD VARCHAR(10))
RETURNS DECIMAL(18,2)
AS
BEGIN
	DECLARE @TONG DECIMAL(18,2);
	SELECT @TONG = SUM(CTP.GIA)
	FROM CTHD_PHG CTP
	WHERE MAHD = @MAHD;
	
	RETURN @TONG;
END
GO

SELECT dbo.UFC_TONG_TIEN_PHONG('HD08') AS TONG_TIEN_PHONG;
GO

-- 5. Tính tổng tiền dịch vụ theo mahd
CREATE FUNCTION UFC_TONG_TIEN_DV(@MAHD VARCHAR(10))
RETURNS DECIMAL(18,2)
AS 
BEGIN
	DECLARE @TONG_DV DECIMAL(18,2);
	SELECT @TONG_DV = SUM(CTDV.GIA)
	FROM CTHD_DV CTDV
	WHERE CTDV.MAHD = @MAHD;

	RETURN ISNULL(@TONG_DV, 0);
END
GO

SELECT dbo.UFC_TONG_TIEN_DV('HD08') AS TONG_TIEN_DV;
GO


-- 6. Tính tổng hóa đơn (TONG_TIEN_PHONG + TONG_TIEN_DV)
CREATE FUNCTION UFC_TONG_HD(@MAHD VARCHAR(10))
RETURNS DECIMAL(18,2)
AS
BEGIN 
	DECLARE @TONG_HD DECIMAL(18,2);
	SELECT @TONG_HD = ISNULL(dbo.UFC_TONG_TIEN_PHONG(@MAHD), 0) + ISNULL(dbo.UFC_TONG_TIEN_DV(@MAHD), 0);

	RETURN @TONG_HD;
END
GO

SELECT dbo.UFC_TONG_HD('HD08');
GO


-- 7. Số tiền khách phải trả (TONG_TIEN_PHONG + TONG_DV - TIENCOC)
CREATE FUNCTION UFC_SO_TIEN_CON_LAI(@MAHD VARCHAR(10))
RETURNS DECIMAL(18,2)
AS 
BEGIN
    DECLARE @CON_LAI DECIMAL;
    DECLARE @TIEN_COC DECIMAL;

    SELECT @TIEN_COC = BK.TIENCOC
    FROM HOADON HD
    LEFT JOIN BOOKING BK ON HD.MASO = BK.MASO
    WHERE HD.MAHD = @MAHD;

	IF @TIEN_COC IS NULL
		SET @TIEN_COC = 0;

    SET @CON_LAI = dbo.UFC_TONG_HD(@MAHD) - @TIEN_COC;

	RETURN @CON_LAI;
END
GO

SELECT dbo.UFC_SO_TIEN_CON_LAI('HD08');
GO

-- 8. Doanh thu trên tháng
CREATE FUNCTION UFC_DOANH_THU_THANG(@THANG INT, @NAM INT)
RETURNS DECIMAL(18,2)
AS 
BEGIN
	DECLARE @DOANH_THU DECIMAL;
    SELECT @DOANH_THU = SUM(dbo.UFC_TONG_HD(MAHD))
    FROM HOADON
    WHERE TRANGTHAI = N'Đã thanh toán' AND MONTH(NGAY) = @THANG AND YEAR(NGAY) = @NAM;

    RETURN @DOANH_THU;
END
GO 

SELECT dbo.UFC_DOANH_THU_THANG(9, 2025);
GO


-- VIEW
DROP VIEW IF EXISTS v_PhongTrong;
DROP VIEW IF EXISTS v_BookingChuaThanhToan;
DROP VIEW IF EXISTS v_KhachCheckInHomNay;
DROP VIEW IF EXISTS v_HieuSuatNhanVien;
DROP VIEW IF EXISTS v_ThongKeLuongNhanVien;
DROP VIEW IF EXISTS v_DichVuBanChay;
DROP VIEW IF EXISTS v_ChiTietHoaDonTongHop;
DROP VIEW IF EXISTS v_DoanhThuThang;
DROP VIEW IF EXISTS v_DoanhThuTheoLoaiPhong;
DROP VIEW IF EXISTS v_LichSuThue_KhachHang;
DROP VIEW IF EXISTS v_LichSuThuePhong;
DROP VIEW IF EXISTS v_LichSuDieuChinhGia;
DROP VIEW IF EXISTS v_TaiSanTheoPhong;
GO

-- 1. Danh sách phòng trống 
CREATE VIEW v_PhongTrong
AS
SELECT SOPHG, TENLP, GIA
FROM PHONG P, LOAIPHONG L 
WHERE P.MALP = L.MALP
AND TRANGTHAI = N'Trống'
GO

-- 2. Booking chờ xử lý
CREATE VIEW v_BookingChuaThanhToan 
AS
SELECT B.MASO, TENKH, SODT, TIENCOC
FROM BOOKING B
JOIN KHACHHANG K ON B.MAKH = K.MAKH
LEFT JOIN HOADON H ON B.MASO = H.MASO
WHERE H.MAHD IS NULL OR H.TRANGTHAI = N'Chưa thanh toán'
GO

-- 3. Danh sách khách hàng Check-in trong ngày hôm nay
CREATE  VIEW v_KhachCheckInHomNay 
AS
SELECT B.MASO, TENKH, SODT, SOPHG, NGDEN
FROM BOOKING B, KHACHHANG K, CTBK C
WHERE B.MAKH = K.MAKH
AND B.MASO = C.MASO
AND CAST(C.NGDEN AS DATE) = CAST(GETDATE() AS DATE) 
AND B.TRANGTHAI = N'Chờ nhận phòng'
GO

-- 4. Hiệu suất lập hóa đơn của nhân viên
CREATE VIEW v_HieuSuatNhanVien 
AS
SELECT N.MANV, TENNV, COUNT(MAHD) AS SoHoaDonDaLap, SUM(TONG) AS DoanhThuMangLai
FROM NHANVIEN N
LEFT JOIN HOADON H ON N.MANV = H.MANV
GROUP BY N.MANV, TENNV
GO

-- 5. Thống kê lương nhân viên 
CREATE VIEW v_ThongKeLuongNhanVien 
AS
SELECT CHUCVU, COUNT(MANV) AS SoLuongNV, SUM(LUONG) AS TongLuong
FROM NHANVIEN
GROUP BY CHUCVU
GO

-- 6. Dịch vụ bán chạy nhất
CREATE VIEW v_DichVuBanChay 
AS
SELECT D.MADV, TENDV, SUM(SOLG) AS TongSoLuongBan
FROM DICHVU D, CTHD_DV C 
WHERE D.MADV = C.MADV
GROUP BY D.MADV, TENDV
GO

-- 7. Tổng hợp Hóa Đơn (Chi tiết người mua, người bán)
CREATE VIEW v_ChiTietHoaDonTongHop 
AS
SELECT H.MAHD, TENKH, TENNV, NGAY, SUM(TONG+TIENCOC) AS THANHTIEN, TONG, H.TRANGTHAI
FROM HOADON H, KHACHHANG K, NHANVIEN N, BOOKING B
WHERE H.MAKH = K.MAKH
AND H.MANV = N.MANV
AND B.MASO = H .MASO
GROUP BY H.MAHD, TENKH, TENNV, NGAY, TONG, H.TRANGTHAI
GO

-- 8. Doanh thu theo tháng
CREATE VIEW v_DoanhThuThang
AS
SELECT MONTH(NGAY) AS Thang, YEAR(NGAY) AS Nam, SUM(TONG+TIENCOC) AS TongDoanhThu
FROM BOOKING B, HOADON H
WHERE B.MASO = H .MASO
AND H.TRANGTHAI = N'Đã thanh toán'
GROUP BY MONTH(NGAY), YEAR(NGAY)
GO

-- 9. Doanh thu theo loại phòng
-- Nếu một hóa đơn chỉ có 1 phòng thì toàn bộ tiền cọc tính cho loại phòng đó. 
-- Nếu một hóa đơn có nhiều phòng, cọc được chia theo tỷ lệ CTHD_PHG.GIA
CREATE VIEW v_DoanhThuTheoLoaiPhong 
AS
WITH TongPhongTheoHD AS (
    SELECT 
        MAHD,
        SUM(GIA) AS TongTienPhongTheoHD
    FROM CTHD_PHG
    GROUP BY MAHD
)
SELECT 
    L.TENLP,
    SUM(C.GIA) AS TongTienPhong,
    SUM(
        CASE 
            WHEN T.TongTienPhongTheoHD > 0 
            THEN B.TIENCOC * C.GIA / T.TongTienPhongTheoHD
            ELSE 0
        END
    ) AS TienCocPhanBo,
    SUM(C.GIA) 
    + SUM(
        CASE 
            WHEN T.TongTienPhongTheoHD > 0 
            THEN B.TIENCOC * C.GIA / T.TongTienPhongTheoHD
            ELSE 0
        END
    ) AS TongDoanhThuPhong
FROM LOAIPHONG L
JOIN PHONG P ON L.MALP = P.MALP
JOIN CTHD_PHG C ON P.SOPHG = C.SOPHG
JOIN HOADON H ON C.MAHD = H.MAHD
JOIN BOOKING B ON H.MASO = B.MASO
JOIN TongPhongTheoHD T ON C.MAHD = T.MAHD
GROUP BY L.TENLP
GO

-- 10. Lịch sử thuê phòng của từng khách hàng
CREATE OR ALTER VIEW v_LichSuThue_KhachHang 
AS
SELECT K.MAKH, TENKH, COUNT(B.MASO) AS SoLanDatPhong, SUM(TONG+TIENCOC) AS TongTienDaChi
FROM KHACHHANG K
LEFT JOIN BOOKING B ON K.MAKH = B.MAKH
LEFT JOIN HOADON H ON B.MASO = H.MASO AND H.TRANGTHAI = N'Đã thanh toán'
GROUP BY K.MAKH, TENKH
GO

-- 11. Lịch sử thuê phòng
CREATE VIEW v_LichSuThuePhong 
AS
SELECT P.SOPHG, H.MAKH, NGDEN, NGDI, GIA
FROM CTHD_PHG C, PHONG P, HOADON H
WHERE C.SOPHG = P.SOPHG
AND C.MAHD = H.MAHD
GO

-- 12. Lịch sử điều chỉnh giá phòng và dịch vụ
CREATE VIEW v_LichSuDieuChinhGia
AS
SELECT 
    N'PHÒNG' AS LOAI_GIA,
    L.MALP AS MA_DOI_TUONG,
    L.TENLP AS TEN_DOI_TUONG,
    G.GIA_CU,
    G.GIA_MOI,
    G.NGAY_THAY_DOI,
    G.LYDO
FROM LOG_GIA_PHG G
JOIN LOAIPHONG L ON G.MALP = L.MALP

UNION ALL

SELECT 
    N'DỊCH VỤ' AS LOAI_GIA,
    D.MADV AS MA_DOI_TUONG,
    D.TENDV AS TEN_DOI_TUONG,
    G.GIA_CU,
    G.GIA_MOI,
    G.NGAY_THAY_DOI,
    G.LYDO
FROM LOG_GIA_DV G
JOIN DICHVU D ON G.MADV = D.MADV;
GO

-- 13. Danh sách tài sản theo phòng
CREATE VIEW v_TaiSanTheoPhong
AS
SELECT
    P.SOPHG,
    LP.TENLP,
    TS.MATS,
    TS.TENTS,
    PT.SOLUONG,
    PT.TINHTRANG,
    TS.DONGIA_NHAP,
    PT.SOLUONG * TS.DONGIA_NHAP AS TONG_GIA_TRI_TAI_SAN
FROM PHG_TAISAN PT
JOIN PHONG P ON PT.SOPHG = P.SOPHG
JOIN LOAIPHONG LP ON P.MALP = LP.MALP
JOIN TAISAN TS ON PT.MATS = TS.MATS;
GO

-- 1. Danh sách phòng trống 
SELECT * FROM v_PhongTrong
GO

-- 2. Booking chờ xử lý
SELECT * FROM v_BookingChuaThanhToan
GO

-- 3. Danh sách khách hàng Check-in trong ngày hôm nay
-- đưa 1 booking về ngày hiện tại
UPDATE CTBK
SET NGDEN = GETDATE(),
    NGDI = DATEADD(DAY, 2, GETDATE())
WHERE MASO = 'BK11';
GO

SELECT * FROM v_KhachCheckInHomNay 
GO

-- 4. Hiệu suất lập hóa đơn của nhân viên
SELECT * FROM v_HieuSuatNhanVien
GO

-- 5. Thống kê lương nhân viên 
SELECT * FROM v_ThongKeLuongNhanVien
GO

-- 6. Dịch vụ bán chạy nhất
SELECT * FROM v_DichVuBanChay
ORDER BY TongSoLuongBan DESC
GO

-- 7. Tổng hợp Hóa Đơn (Chi tiết người mua, người bán)
SELECT * FROM v_ChiTietHoaDonTongHop
GO

-- 8. Doanh thu theo tháng
SELECT * FROM v_DoanhThuThang
GO

-- 9. Doanh thu theo loại phòng
SELECT * FROM v_DoanhThuTheoLoaiPhong
GO

-- 10. Lịch sử thuê phòng của từng khách hàng
SELECT * FROM v_LichSuThue_KhachHang
GO

-- 11. Lịch sử thuê phòng
SELECT * FROM v_LichSuThuePhong
GO

-- 12. Lịch sử điều chỉnh giá phòng và dịch vụ
SELECT * FROM v_LichSuDieuChinhGia
ORDER BY NGAY_THAY_DOI DESC;
GO

-- 13. Danh sách tài sản theo phòng
SELECT *
FROM v_TaiSanTheoPhong
GO

-- PROCEDURE

IF OBJECT_ID('USP_THEM_KHACH_HANG', 'P') IS NOT NULL
    DROP PROCEDURE USP_THEM_KHACH_HANG;
GO

IF OBJECT_ID('USP_CAP_NHAT_TRANG_THAI_PHONG', 'P') IS NOT NULL
    DROP PROCEDURE USP_CAP_NHAT_TRANG_THAI_PHONG;
GO

IF OBJECT_ID('USP_CAP_NHAT_LOAI_PHONG', 'P') IS NOT NULL
    DROP PROCEDURE USP_CAP_NHAT_LOAI_PHONG;
GO

IF OBJECT_ID('USP_TIM_PHONG_TRONG_THEO_LOAI_P', 'P') IS NOT NULL
    DROP PROCEDURE USP_TIM_PHONG_TRONG_THEO_LOAI_P;
GO

IF OBJECT_ID('USP_DAT_PHONG', 'P') IS NOT NULL
    DROP PROCEDURE USP_DAT_PHONG;
GO

IF OBJECT_ID('USP_NHAN_PHONG', 'P') IS NOT NULL
    DROP PROCEDURE USP_NHAN_PHONG;
GO

IF OBJECT_ID('USP_LAP_HOA_DON', 'P') IS NOT NULL
    DROP PROCEDURE USP_LAP_HOA_DON;
GO

IF OBJECT_ID('USP_TRA_PHONG', 'P') IS NOT NULL
    DROP PROCEDURE USP_TRA_PHONG;
GO

IF OBJECT_ID('USP_THUE_DICH_VU', 'P') IS NOT NULL
    DROP PROCEDURE USP_THUE_DICH_VU;
GO

-- thêm 
IF OBJECT_ID('USP_TONG_HOP_CTHD_DV', 'P') IS NOT NULL
    DROP PROCEDURE USP_TONG_HOP_CTHD_DV;
GO

IF OBJECT_ID('USP_CAP_NHAT_DICH_VU', 'P') IS NOT NULL
    DROP PROCEDURE USP_CAP_NHAT_DICH_VU;
GO

IF OBJECT_ID('USP_CAP_NHAT_TONG_HD', 'P') IS NOT NULL
    DROP PROCEDURE USP_CAP_NHAT_TONG_HD;
GO

IF OBJECT_ID('USP_THANH_TOAN_HD', 'P') IS NOT NULL
    DROP PROCEDURE USP_THANH_TOAN_HD;
GO

IF OBJECT_ID('USP_THEM_NHAN_VIEN', 'P') IS NOT NULL
    DROP PROCEDURE USP_THEM_NHAN_VIEN;
GO



-- USP_THEM_KHACH_HANG -------------------------------------
CREATE OR ALTER PROCEDURE USP_THEM_KHACH_HANG
    @TENKH NVARCHAR(30),
    @SODT VARCHAR(10),
    @CCCD VARCHAR(12),
    @MAKH_MOI VARCHAR(10) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF @TENKH IS NULL OR LTRIM(RTRIM(@TENKH)) = ''
    BEGIN
        RAISERROR(N'Lỗi: Tên khách hàng không được để trống.', 16, 1);
        RETURN;
    END

    IF @SODT IS NULL OR LEN(@SODT) <> 10 OR @SODT LIKE '%[^0-9]%'
    BEGIN
        RAISERROR(N'Lỗi: Số điện thoại không hợp lệ.', 16, 1);
        RETURN;
    END

    IF @CCCD IS NULL 
        OR LEN(@CCCD) <> 12 
        OR @CCCD LIKE '%[^0-9]%'
    BEGIN
        RAISERROR(N'Lỗi: CCCD không hợp lệ.', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM KHACHHANG WHERE CCCD = @CCCD)
    BEGIN
        SELECT @MAKH_MOI = MAKH FROM KHACHHANG WHERE CCCD = @CCCD;
        RAISERROR(N'Khách hàng đã tồn tại.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        DECLARE @SO_MOI INT;
        SELECT @SO_MOI = ISNULL(MAX(CAST(SUBSTRING(MAKH, 3, LEN(MAKH) - 2) AS INT)), 0) + 1
        FROM KHACHHANG WITH (UPDLOCK, HOLDLOCK);

        SET @MAKH_MOI = 'KH' + RIGHT('0000' + CAST(@SO_MOI AS VARCHAR(8)), 4);

        INSERT INTO KHACHHANG(MAKH, TENKH, SODT, CCCD)
        VALUES(@MAKH_MOI, @TENKH, @SODT, @CCCD);

        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;
        THROW;
    END CATCH
END;
GO

-- Trường hợp 1: Thêm khách hàng thành công
DECLARE @MAKH VARCHAR(10);

EXEC USP_THEM_KHACH_HANG
    @TENKH = N'Phạm Văn E',
    @SODT = '0933333333',
    @CCCD = '123456789097',
    @MAKH_MOI = @MAKH OUTPUT;

SELECT @MAKH AS MAKH_MOI;
GO

-- Trường hợp 2: Tên khách hàng để trống
DECLARE @MAKH2 VARCHAR(10);

EXEC USP_THEM_KHACH_HANG
    @TENKH = N'',
    @SODT = '0912345678',
    @CCCD = '123456789013',
    @MAKH_MOI = @MAKH2 OUTPUT;
GO

-- Trường hợp 3: Số điện thoại không hợp lệ
DECLARE @MAKH3 VARCHAR(10);

EXEC USP_THEM_KHACH_HANG
    @TENKH = N'Trần Thị B',
    @SODT = '09123ABC',
    @CCCD = '123456789014',
    @MAKH_MOI = @MAKH3 OUTPUT;
GO

-- Trường hợp 4: CCCD không hợp lệ
DECLARE @MAKH4 VARCHAR(10);

EXEC USP_THEM_KHACH_HANG
    @TENKH = N'Lê Văn C',
    @SODT = '0987654321',
    @CCCD = '12345',
    @MAKH_MOI = @MAKH4 OUTPUT;
GO

-- Trường hợp 5: CCCD đã tồn tại
DECLARE @MAKH5 VARCHAR(10);

EXEC USP_THEM_KHACH_HANG
    @TENKH = N'Nguyễn Văn Thành',
    @SODT = '0903123456',
    @CCCD = '079123456001',
    @MAKH_MOI = @MAKH5 OUTPUT;
GO




-- USP_CAP_NHAT_TRANG_THAI_PHONG -------------------------------------
CREATE OR ALTER PROCEDURE USP_CAP_NHAT_TRANG_THAI_PHONG
    @SOPHG INT,
    @TRANGTHAI_MOI NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra phòng tồn tại

    IF NOT EXISTS (
        SELECT 1
        FROM PHONG
        WHERE SOPHG = @SOPHG
    )
    BEGIN
        RAISERROR(N'Lỗi: Số phòng không tồn tại.', 16, 1);
        RETURN;
    END

    -- Kiểm tra trạng thái hợp lệ
    IF @TRANGTHAI_MOI NOT IN (N'Trống', N'Đang sửa chữa')
    BEGIN
        RAISERROR(N'Lỗi: Trạng thái phòng không hợp lệ.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        DECLARE @TRANGTHAI_HIEN_TAI NVARCHAR(30);

        -- Khóa dòng phòng cần cập nhật
        SELECT @TRANGTHAI_HIEN_TAI = TRANGTHAI
        FROM PHONG WITH (UPDLOCK, HOLDLOCK)
        WHERE SOPHG = @SOPHG;

        -- Kiểm tra cập nhật trùng trạng thái
        IF @TRANGTHAI_HIEN_TAI = @TRANGTHAI_MOI
        BEGIN
            RAISERROR(N'Lỗi: Phòng đã ở trạng thái này.', 16, 1);
        END

        -- Không cho cập nhật nếu phòng đang thuê
        IF @TRANGTHAI_HIEN_TAI = N'Đang thuê'
        BEGIN
            RAISERROR(N'Lỗi: Phòng đang có khách thuê.', 16, 1);
        END

        -- Cập nhật trạng thái phòng
        UPDATE PHONG
        SET TRANGTHAI = @TRANGTHAI_MOI
        WHERE SOPHG = @SOPHG;

        COMMIT TRAN;

        SELECT 
            @SOPHG AS SOPHG,
            @TRANGTHAI_MOI AS TRANGTHAI_MOI,
            N'Cập nhật trạng thái phòng thành công.' AS THONGBAO;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ERROR_MESSAGE NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ERROR_STATE INT = ERROR_STATE();

        RAISERROR(@ERROR_MESSAGE, 16, @ERROR_STATE);
    END CATCH
END;
GO

-- Trường hợp 1: Số phòng không tồn tại
EXEC USP_CAP_NHAT_TRANG_THAI_PHONG
    @SOPHG = 999,
    @TRANGTHAI_MOI = N'Đang sửa chữa';
GO

-- Trường hợp 2: Trạng thái không hợp lệ
EXEC USP_CAP_NHAT_TRANG_THAI_PHONG
    @SOPHG = 101,
    @TRANGTHAI_MOI = N'Đã đặt trước';
GO

-- Trường hợp 3: Trạng thái bị trùng
EXEC USP_CAP_NHAT_TRANG_THAI_PHONG
    @SOPHG = 101,
    @TRANGTHAI_MOI = N'Trống';
GO

-- Trường hợp 4: Phòng đang có khách thuê
EXEC USP_CAP_NHAT_TRANG_THAI_PHONG
    @SOPHG = 103,
    @TRANGTHAI_MOI = N'Đang sửa chữa';
GO

-- Trường hợp 5: Cập nhật thành công
EXEC USP_CAP_NHAT_TRANG_THAI_PHONG
    @SOPHG = 102,
    @TRANGTHAI_MOI = N'Trống';
GO

SELECT SOPHG, TRANGTHAI
FROM PHONG
WHERE SOPHG = 102;
GO





-- USP_CAP_NHAT_LOAI_PHONG -------------------------------------
CREATE OR ALTER PROCEDURE USP_CAP_NHAT_LOAI_PHONG
    @MALP VARCHAR(10),
    @TENLP_MOI NVARCHAR(30),
    @GIA_MOI DECIMAL(18, 2)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra loại phòng tồn tại
    IF NOT EXISTS (
        SELECT 1
        FROM LOAIPHONG
        WHERE MALP = @MALP
    )
    BEGIN
        RAISERROR(N'Lỗi: Mã loại phòng không tồn tại.', 16, 1);
        RETURN;
    END

    -- Kiểm tra tên loại phòng
    IF @TENLP_MOI IS NULL 
       OR LTRIM(RTRIM(@TENLP_MOI)) = N''
    BEGIN
        RAISERROR(N'Lỗi: Tên loại phòng không được để trống.', 16, 1);
        RETURN;
    END

    -- Kiểm tra giá phòng
    IF @GIA_MOI IS NULL 
       OR @GIA_MOI <= 0
    BEGIN
        RAISERROR(N'Lỗi: Giá loại phòng phải lớn hơn 0.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        -- Kiểm tra trùng tên loại phòng
        IF EXISTS (
            SELECT 1
            FROM LOAIPHONG WITH (UPDLOCK, HOLDLOCK)
            WHERE TENLP = LTRIM(RTRIM(@TENLP_MOI))
              AND MALP <> @MALP
        )
        BEGIN
            RAISERROR(N'Lỗi: Tên loại phòng đã tồn tại.', 16, 1);
        END

        DECLARE @TENLP_CU NVARCHAR(30);
        DECLARE @GIA_CU DECIMAL(18,2);

        -- Khóa dòng dữ liệu cần cập nhật
        SELECT 
            @TENLP_CU = TENLP,
            @GIA_CU = GIA
        FROM LOAIPHONG WITH (UPDLOCK, HOLDLOCK)
        WHERE MALP = @MALP;

        -- Kiểm tra dữ liệu trùng hoàn toàn
        IF @TENLP_CU = LTRIM(RTRIM(@TENLP_MOI))
           AND @GIA_CU = @GIA_MOI
        BEGIN
            RAISERROR(N'Lỗi: Dữ liệu cập nhật trùng với dữ liệu hiện tại.', 16, 1);
        END

        -- Không cho đổi tên nếu đã phát sinh lưu trú
        IF @TENLP_CU <> LTRIM(RTRIM(@TENLP_MOI))
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM CTHD_PHG CTP WITH (UPDLOCK, HOLDLOCK)
                INNER JOIN PHONG P 
                    ON CTP.SOPHG = P.SOPHG
                WHERE P.MALP = @MALP
            )
            BEGIN
                RAISERROR(
                    N'Lỗi: Loại phòng đã phát sinh giao dịch, không được đổi tên.',
                    16,
                    1
                );
            END
        END

		-- Ghi log nếu có thay đổi giá phòng
		IF @GIA_CU <> @GIA_MOI
		BEGIN
			INSERT INTO LOG_GIA_PHG(MALP, GIA_CU, GIA_MOI, NGAY_THAY_DOI, LYDO)
			VALUES(@MALP, @GIA_CU, @GIA_MOI, GETDATE(), N'Cập nhật giá loại phòng');
		END

        -- Cập nhật dữ liệu
        UPDATE LOAIPHONG
        SET TENLP = LTRIM(RTRIM(@TENLP_MOI)),
            GIA = @GIA_MOI
        WHERE MALP = @MALP;

        COMMIT TRAN;

        SELECT
            @MALP AS MALP,
            LTRIM(RTRIM(@TENLP_MOI)) AS TENLP_MOI,
            @GIA_MOI AS GIA_MOI,
            N'Cập nhật loại phòng thành công.' AS THONGBAO;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ERROR_MESSAGE NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ERROR_STATE INT = ERROR_STATE();

        RAISERROR(@ERROR_MESSAGE, 16, @ERROR_STATE);
    END CATCH
END;
GO

-- Trường hợp 1: Mã loại phòng không tồn tại
EXEC USP_CAP_NHAT_LOAI_PHONG
    @MALP = 'LP99',
    @TENLP_MOI = N'Phòng VIP',
    @GIA_MOI = 5000000;
GO

-- Trường hợp 2: Tên loại phòng để trống
EXEC USP_CAP_NHAT_LOAI_PHONG
    @MALP = 'LP01',
    @TENLP_MOI = N'',
    @GIA_MOI = 500000;
GO

-- Trường hợp 3: Giá phòng không hợp lệ
EXEC USP_CAP_NHAT_LOAI_PHONG
    @MALP = 'LP01',
    @TENLP_MOI = N'Standard Single',
    @GIA_MOI = -150000;
GO

-- Trường hợp 4: Tên loại phòng bị trùng
EXEC USP_CAP_NHAT_LOAI_PHONG
    @MALP = 'LP01',
    @TENLP_MOI = N'Standard Double',
    @GIA_MOI = 600000;
GO

-- Trường hợp 5: Dữ liệu bị trùng hoàn toàn
EXEC USP_CAP_NHAT_LOAI_PHONG
    @MALP = 'LP01',
    @TENLP_MOI = N'Standard Single',
    @GIA_MOI = 500000;
GO

-- Trường hợp 6: Cập nhật thành công
EXEC USP_CAP_NHAT_LOAI_PHONG
    @MALP = 'LP01',
    @TENLP_MOI = N'Standard Single',
    @GIA_MOI = 650000;
GO

SELECT *
FROM LOAIPHONG
WHERE MALP = 'LP01';
GO







-- USP_TIM_PHONG_TRONG_THEO_LOAI_P -----------------------------------------
CREATE OR ALTER PROCEDURE USP_TIM_PHONG_TRONG_THEO_LOAI_P
    @TENLP NVARCHAR(30),
    @NGDEN DATETIME,
    @NGDI DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra tên loại phòng
    IF @TENLP IS NULL 
       OR LTRIM(RTRIM(@TENLP)) = ''
    BEGIN
        RAISERROR(N'Lỗi: Tên loại phòng không được để trống.',16,1);
        RETURN;
    END

    -- Kiểm tra loại phòng tồn tại
    IF NOT EXISTS (
        SELECT 1
        FROM LOAIPHONG
        WHERE TENLP = @TENLP
    )
    BEGIN
        RAISERROR(N'Lỗi: Loại phòng không tồn tại.',16,1);
        RETURN;
    END

    -- Kiểm tra ngày
    IF @NGDEN >= @NGDI
    BEGIN
        RAISERROR(N'Lỗi: Ngày đến phải nhỏ hơn ngày đi.',16,1);
        RETURN;
    END

    -- Tìm phòng trống
    SELECT 
        P.SOPHG,
        LP.MALP,
        LP.TENLP,
        LP.GIA,
        P.TRANGTHAI
    FROM PHONG P
    INNER JOIN LOAIPHONG LP
        ON P.MALP = LP.MALP
    WHERE LP.TENLP = @TENLP
        AND P.TRANGTHAI = N'Trống'

        AND NOT EXISTS (
            SELECT 1
            FROM CTBK C
            INNER JOIN BOOKING B
                ON C.MASO = B.MASO
            WHERE C.SOPHG = P.SOPHG
                AND B.TRANGTHAI <> N'Đã hủy'
                AND @NGDI > C.NGDEN
                AND @NGDEN < C.NGDI
        )

        AND NOT EXISTS (
            SELECT 1
            FROM CTHD_PHG CP
            INNER JOIN HOADON H
                ON CP.MAHD = H.MAHD
            WHERE CP.SOPHG = P.SOPHG
                AND H.TRANGTHAI <> N'Đã hủy'
                AND @NGDI > CP.NGDEN
                AND @NGDEN < CP.NGDI
        );

    -- Không tìm thấy phòng phù hợp
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR(N'Lỗi: Không tìm thấy phòng trống phù hợp.',16,1);
        RETURN;
    END
END;
GO

-- Trường hợp 1: Tìm phòng hợp lệ
EXEC USP_TIM_PHONG_TRONG_THEO_LOAI_P
    @TENLP = N'Standard Single',
    @NGDEN = '2026-06-01',
    @NGDI = '2026-06-03';
GO

-- Trường hợp 2: Ngày đến lớn hơn ngày đi
EXEC USP_TIM_PHONG_TRONG_THEO_LOAI_P
    @TENLP = N'Standard Single',
    @NGDEN = '2026-06-05',
    @NGDI = '2026-06-03';
GO

-- Trường hợp 3: Loại phòng không tồn tại
EXEC USP_TIM_PHONG_TRONG_THEO_LOAI_P
    @TENLP = N'VIP PRESIDENT',
    @NGDEN = '2026-06-01',
    @NGDI = '2026-06-03';
GO







-- USP_DAT_PHONG -----------------------------------------
CREATE OR ALTER PROCEDURE USP_DAT_PHONG
    @MASO VARCHAR(10) OUTPUT,
    @MAKH VARCHAR(10),
    @SOPHG INT,
    @NGDEN DATETIME,
    @NGDI DATETIME,
    @TIENCOC DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;

    SET @NGDEN = CAST(CAST(@NGDEN AS DATE) AS DATETIME) + '14:00:00';
    SET @NGDI   = CAST(CAST(@NGDI AS DATE) AS DATETIME) + '12:00:00';

    IF @MASO IS NOT NULL 
       AND LTRIM(RTRIM(@MASO)) <> ''
       AND (@MASO NOT LIKE 'BK%' 
            OR TRY_CAST(SUBSTRING(@MASO, 3, LEN(@MASO) - 2) AS INT) IS NULL)
    BEGIN
        RAISERROR(N'Lỗi: Mã đặt phòng không hợp lệ.', 16, 1);
        RETURN;
    END

    IF CAST(@NGDEN AS DATE) < CAST(GETDATE() AS DATE)
    BEGIN
        RAISERROR(N'Lỗi: Không thể đặt phòng trong quá khứ.', 16, 1);
        RETURN;
    END

    IF @NGDEN >= @NGDI
    BEGIN
        RAISERROR(N'Lỗi: Ngày đến phải nhỏ hơn ngày đi.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM KHACHHANG WHERE MAKH = @MAKH)
    BEGIN
        RAISERROR(N'Lỗi: Mã khách hàng không tồn tại.', 16, 1);
        RETURN;
    END

    IF @MASO IS NOT NULL
    BEGIN
    IF EXISTS (SELECT 1 FROM BOOKING WHERE MASO = @MASO AND MAKH <> @MAKH)
        BEGIN
            RAISERROR(N'Lỗi: Booking thuộc khách hàng khác.', 16, 1);
            RETURN;
        END
        

        IF EXISTS (SELECT 1 FROM BOOKING WHERE MASO = @MASO AND TRANGTHAI = N'Đã hủy')
        BEGIN
            RAISERROR(N'Lỗi: Booking đã bị hủy.', 16, 1);
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM BOOKING WHERE MASO = @MASO AND TRANGTHAI = N'Đã nhận phòng')
        BEGIN
            RAISERROR(N'Lỗi: Booking đã check-in.', 16, 1);
            RETURN;
        END
    END

    IF @TIENCOC < 0
    BEGIN
        RAISERROR(N'Lỗi: Tiền cọc không hợp lệ.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        -- Tự động sinh mã booking nếu để trống
        IF @MASO IS NULL OR LTRIM(RTRIM(@MASO)) = ''
        BEGIN
            DECLARE @SO_MOI INT;
            SELECT @SO_MOI = ISNULL(MAX(TRY_CAST(SUBSTRING(MASO, 3, LEN(MASO) - 2) AS INT)), 0) + 1
            FROM BOOKING 
            WHERE MASO LIKE 'BK%';

            SET @MASO = 'BK' + CASE 
                                    WHEN @SO_MOI < 100 THEN RIGHT('0' + CAST(@SO_MOI AS VARCHAR(10)), 2)
                                    ELSE CAST(@SO_MOI AS VARCHAR(10))
                                END;
        END

        -- Chèn hoặc cập nhật bảng BOOKING
        IF NOT EXISTS (SELECT 1 FROM BOOKING WHERE MASO = @MASO)
        BEGIN
            INSERT INTO BOOKING(MASO, NGDAT, TIENCOC, TRANGTHAI, MAKH)
            VALUES (@MASO, GETDATE(), @TIENCOC, N'Chờ nhận phòng', @MAKH);
        END
        ELSE
        BEGIN
            UPDATE BOOKING SET TIENCOC = TIENCOC + @TIENCOC WHERE MASO = @MASO;
        END

        -- Lấy giá phòng để điền vào chi tiết đặt phòng
        DECLARE @GIADAT DECIMAL(18,2);
        SELECT @GIADAT = LP.GIA
        FROM PHONG P
        INNER JOIN LOAIPHONG LP ON P.MALP = LP.MALP
        WHERE P.SOPHG = @SOPHG;

        -- Chèn vào bảng chi tiết đặt phòng CTBK
        INSERT INTO CTBK(MASO, SOPHG, NGDEN, NGDI, GIADAT)
        VALUES (@MASO, @SOPHG, @NGDEN, @NGDI, ISNULL(@GIADAT, 0));

        COMMIT TRAN;

        SELECT @MASO AS MASO, N'Đặt phòng thành công.' AS THONGBAO;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        THROW; 
    END CATCH
END;
GO

WHILE @@TRANCOUNT > 0 ROLLBACK TRAN;
GO

-- Kiểm thử đặt phòng thành công với phòng 102 (Bỏ qua lỗi sửa chữa)
DECLARE @MASO_OUT8 VARCHAR(10) = NULL;
EXEC USP_DAT_PHONG @MASO = @MASO_OUT8 OUTPUT, @MAKH = 'KH01', @SOPHG = 102, @NGDEN = '2026-06-01', @NGDI = '2026-06-03', @TIENCOC = 500000;
GO

-- Kiểm thử đặt phòng thành công với phòng 203 (Bỏ qua lỗi trùng lịch)
DECLARE @MASO_OUT9 VARCHAR(10) = NULL;
EXEC USP_DAT_PHONG @MASO = @MASO_OUT9 OUTPUT, @MAKH = 'KH04', @SOPHG = 203, @NGDEN = '2026-06-01', @NGDI = '2026-06-03', @TIENCOC = 500000;
GO

-- Xem kết quả ghi nhận thực tế trong Database
SELECT MASO, NGDAT, TIENCOC, TRANGTHAI FROM BOOKING WHERE NGDAT >= CAST(GETDATE() AS DATE);
SELECT * FROM CTBK WHERE SOPHG IN (102, 203);
GO






--- USP_NHAN_PHONG --------------------------------------
CREATE OR ALTER PROCEDURE USP_NHAN_PHONG
    @MASO VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra booking tồn tại
    IF NOT EXISTS (
        SELECT 1
        FROM BOOKING
        WHERE MASO = @MASO
    )
    BEGIN
        RAISERROR(N'Lỗi: Mã đặt phòng không tồn tại.',16,1);
        RETURN;
    END

    -- Chưa tới ngày nhận phòng
    IF EXISTS (
        SELECT 1
        FROM CTBK
        WHERE MASO = @MASO
          AND CAST(GETDATE() AS DATE) < CAST(NGDEN AS DATE)
    )
    BEGIN
        RAISERROR(N'Lỗi: Chưa tới ngày nhận phòng.',16,1);
        RETURN;
    END

    -- Booking quá hạn
    IF EXISTS (
        SELECT 1
        FROM CTBK
        WHERE MASO = @MASO
          AND GETDATE() > DATEADD(DAY,1,NGDEN)
    )
    BEGIN
        RAISERROR(N'Lỗi: Booking đã quá hạn nhận phòng.',16,1);
        RETURN;
    END

    -- Booking không hợp lệ
    IF EXISTS (
        SELECT 1
        FROM BOOKING
        WHERE MASO = @MASO
          AND TRANGTHAI IN (N'Đã nhận phòng',N'Đã hủy')
    )
    BEGIN
        RAISERROR(N'Lỗi: Booking không hợp lệ.',16,1);
        RETURN;
    END

    -- Booking chưa có phòng
    IF NOT EXISTS (
        SELECT 1
        FROM CTBK
        WHERE MASO = @MASO
    )
    BEGIN
        RAISERROR(N'Lỗi: Booking chưa có phòng.',16,1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        -- Kiểm tra trạng thái phòng
        IF EXISTS (
            SELECT 1
            FROM CTBK CT
            JOIN PHONG P WITH (XLOCK,HOLDLOCK)
                ON CT.SOPHG = P.SOPHG
            WHERE CT.MASO = @MASO
              AND P.TRANGTHAI IN (N'Đang sửa chữa',N'Đang thuê')
        )
        BEGIN
            RAISERROR(N'Lỗi: Có phòng không khả dụng.',16,1);
        END

        -- Cập nhật trạng thái phòng
        UPDATE PHONG
        SET TRANGTHAI = N'Đang thuê'
        WHERE SOPHG IN (
            SELECT SOPHG
            FROM CTBK
            WHERE MASO = @MASO
        );

        -- Cập nhật booking
        UPDATE BOOKING
        SET TRANGTHAI = N'Đã nhận phòng'
        WHERE MASO = @MASO;

        COMMIT TRAN;

        SELECT
            @MASO AS MASO,
            N'Nhận phòng thành công.' AS THONGBAO;

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ERROR_MESSAGE NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ERROR_STATE INT = ERROR_STATE();

        RAISERROR(@ERROR_MESSAGE,16,@ERROR_STATE);

    END CATCH
END;
GO

-- Trường hợp 1: Nhận phòng thành công
EXEC USP_NHAN_PHONG
    @MASO = 'BK01';
GO

-- Trường hợp 2: Booking không tồn tại
EXEC USP_NHAN_PHONG
    @MASO = 'BK9999';
GO

-- Trường hợp 3: Booking đã hủy
EXEC USP_NHAN_PHONG
    @MASO = 'BK05';
GO



--- USP_LAP_HOA_DON --------------------------------------
CREATE OR ALTER PROCEDURE USP_LAP_HOA_DON
    @MAHD VARCHAR(10),
    @MASO VARCHAR(10),
    @MANV VARCHAR(10)
AS
BEGIN 
    SET NOCOUNT ON;

	IF @MAHD IS NULL
	OR LTRIM(RTRIM(@MAHD)) = ''
	OR @MAHD NOT LIKE 'HD%'
	OR TRY_CAST(SUBSTRING(@MAHD,3,LEN(@MAHD)-2) AS INT) IS NULL
	BEGIN
		RAISERROR(N'Lỗi: Mã hóa đơn không đúng định dạng.',16,1);
		RETURN;
	END

    IF NOT EXISTS (SELECT 1 FROM BOOKING WHERE MASO = @MASO)
    BEGIN
        RAISERROR(N'Lỗi: Mã đặt phòng (Booking) không tồn tại trên hệ thống.', 16, 1);
        RETURN;
    END
    
    IF NOT EXISTS (SELECT 1 FROM NHANVIEN WHERE MANV = @MANV)
    BEGIN
        RAISERROR(N'Lỗi: Mã nhân viên không tồn tại trên hệ thống.', 16, 1);
        RETURN;
    END

-- check xem booking này đã đc checkin ch -> đc thì ms tạo hoá đơn
	IF EXISTS (SELECT 1 FROM BOOKING WHERE MASO = @MASO AND TRANGTHAI <> N'Đã nhận phòng')
	BEGIN
		RAISERROR(N'Lỗi: Chỉ được lập hóa đơn sau khi khách đã nhận phòng.', 16,1);
		RETURN;
	END

-- check xem ctbk có tồn tại k (tại booking có -> tạo hoá đơn đc, nhg ctbk thì cho phép xoá tay, nên cái booking đó có thể vô nghĩa)
	IF NOT EXISTS (SELECT 1 FROM CTBK WHERE MASO = @MASO)
	BEGIN
		RAISERROR(
			N'Lỗi: Phiếu đặt phòng chưa có thông tin chi tiết phòng (Dữ liệu không hợp lệ).', 16, 1);
		RETURN;
	END


-- 4 cái "note .." bên dưới t gthich chung 1 lần luôn nh
-- note 1
	IF EXISTS (
		SELECT 1 
		FROM HOADON
		WHERE MAHD = @MAHD
	)
	BEGIN
		RAISERROR(N'Lỗi: Mã hóa đơn này đã tồn tại trong hệ thống.',16,1);
		RETURN;
	END

-- note 2
    IF EXISTS (SELECT 1
	FROM HOADON --
	WHERE MASO = @MASO AND TRANGTHAI <> N'Đã hủy')
    BEGIN
        RAISERROR(N'Lỗi: Mã đặt phòng này đã được lập hóa đơn trước đó.', 16, 1);
		RETURN;
    END

BEGIN TRY
	BEGIN TRAN;
-- note 3
	IF EXISTS (SELECT 1 FROM HOADON WITH (UPDLOCK, HOLDLOCK) WHERE MAHD = @MAHD)
        BEGIN
            RAISERROR(N'Lỗi hệ thống: Mã hóa đơn bị trùng lặp tại thời điểm ghi.', 16, 1);
        END
-- note 4
	IF EXISTS (SELECT 1 FROM HOADON WITH (UPDLOCK, HOLDLOCK) WHERE MASO = @MASO AND TRANGTHAI <> N'Đã hủy')
        BEGIN
            RAISERROR(N'Lỗi hệ thống: Booking đã bị chiếm dụng hóa đơn bởi tiến trình khác.', 16, 1);
        END

/* chỗ này về cơ bản là 2 lệnh đều ktra giống hệt nhau, khác ở chỗ có khoá hệ thống lại hay k th 'WITH (UPDLOCK, HOLDLOCK)'
- cái ở bên ngoài try (note 1, 2) dùng để lọc thẳng khi gặp lỗi đó đơn thuần th (báo lỗi thẳng nên tốc độ nhanh)
- cái bên trg try (note 3, 4) dùng cho th trace condition, lỡ mà 2 lễ tân tạo hoá đơn đồng thời thì hệ thống ms xử lý -> lúc này thực tế là 
máy A vào đc thì khoá hệ thống, nên máy B bị đơ (đợi máy A tạo hoá đơn xong) -> máy B sẽ ktra cái if trg try đó -> nhảy xuống catch -> rollback (chứ k phải nó chạy lại từ đk if ở ngoài try (note 1/2) để báo lỗi lại đâu nh)
-> cái này hiếm khi xảy ra nên ms đặt trg try, nếu mà bay tưởng 2 cái giống nhau mà gộp lại là hệ thống gần như luôn nghẽn cổ chai luôn á */

    DECLARE @MAKH VARCHAR(10);

    SELECT @MAKH = MAKH 
	FROM BOOKING WITH (UPDLOCK, HOLDLOCK)
	WHERE MASO = @MASO;

    -- Khởi tạo hóa đơn gốc với tổng tiền bằng 0
    INSERT INTO HOADON(MAHD, MAKH, MANV, MASO, TONG, TRANGTHAI, NGAY)
    VALUES(@MAHD, @MAKH, @MANV, @MASO, 0, N'Chưa thanh toán', GETDATE());

	COMMIT TRAN;

    -- Trả kết quả về cho giao diện 
    SELECT @MAHD AS MAHD, 
		N'Hóa đơn lưu trú đã được tạo thành công! Trạng thái: Chưa thanh toán, Số tiền hiện tại: 0đ.' 
		AS THONGBAO;

END TRY
    BEGIN CATCH
		IF @@TRANCOUNT > 0
				ROLLBACK TRAN;

			DECLARE @ERROR_MESSAGE NVARCHAR(4000) = ERROR_MESSAGE();
			DECLARE @ERROR_STATE INT = ERROR_STATE();
			RAISERROR(@ERROR_MESSAGE, 16, @ERROR_STATE);
    END CATCH
END;
GO

-- Trường hợp 1: Lập hóa đơn thành công sau khi nhận phòng
DECLARE @MASO_LHD VARCHAR(10) = 'BK14';

EXEC USP_DAT_PHONG
    @MASO = @MASO_LHD OUTPUT,
    @MAKH = 'KH10',
    @SOPHG = 303,
    @NGDEN = '2026-05-31',
    @NGDI = '2026-06-01',
    @TIENCOC = 300000;
GO

EXEC USP_NHAN_PHONG
    @MASO = 'BK14';
GO

EXEC USP_LAP_HOA_DON
    @MAHD = 'HD14',
    @MASO = 'BK14',
    @MANV = 'NV01';
GO

SELECT MAHD, MAKH, MANV, MASO, TONG, TRANGTHAI, NGAY
FROM HOADON
WHERE MAHD = 'HD14';
GO

-- Trường hợp 2: Mã hóa đơn sai định dạng
EXEC USP_LAP_HOA_DON
    @MAHD = 'ABC14',
    @MASO = 'BK14',
    @MANV = 'NV01';
GO

-- Trường hợp 3: Mã hóa đơn đã tồn tại
EXEC USP_LAP_HOA_DON
    @MAHD = 'HD14',
    @MASO = 'BK14',
    @MANV = 'NV01';
GO

-- Trường hợp 4: Booking chưa nhận phòng
EXEC USP_LAP_HOA_DON
    @MAHD = 'HD15',
    @MASO = 'BK11',
    @MANV = 'NV01';
GO



--- USP_TRA_PHONG --------------------------------------
CREATE OR ALTER PROCEDURE USP_TRA_PHONG
    @MAHD VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @MASO VARCHAR(10);

    -- Kiểm tra hóa đơn
    IF NOT EXISTS (
        SELECT 1
        FROM HOADON
        WHERE MAHD = @MAHD
          AND TRANGTHAI = N'Đã thanh toán'
    )
    BEGIN
        RAISERROR(N'Lỗi: Hóa đơn không hợp lệ.',16,1);
        RETURN;
    END

    -- Hóa đơn chưa có phòng
    IF NOT EXISTS (
        SELECT 1
        FROM CTHD_PHG
        WHERE MAHD = @MAHD
    )
    BEGIN
        RAISERROR(N'Lỗi: Hóa đơn chưa có thông tin phòng.',16,1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        -- Lấy mã booking
        SELECT @MASO = MASO
        FROM HOADON
        WHERE MAHD = @MAHD;

        -- Kiểm tra booking
        IF EXISTS (
            SELECT 1
            FROM BOOKING
            WHERE MASO = @MASO
              AND TRANGTHAI <> N'Đã nhận phòng'
        )
        BEGIN
            RAISERROR(N'Lỗi: Booking không hợp lệ.',16,1);
        END

        -- Cập nhật trạng thái phòng
        UPDATE PHONG
        SET TRANGTHAI = N'Trống'
        WHERE SOPHG IN (
            SELECT SOPHG
            FROM CTHD_PHG
            WHERE MAHD = @MAHD
        );

        COMMIT TRAN;

        SELECT
            @MAHD AS MAHD,
            N'Trả phòng thành công.' AS THONGBAO;

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ERROR_MESSAGE NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ERROR_STATE INT = ERROR_STATE();

        RAISERROR(@ERROR_MESSAGE,16,@ERROR_STATE);

    END CATCH
END;
GO

-- Trường hợp 1: Trả phòng thành công
EXEC USP_TRA_PHONG
    @MAHD = 'HD01';
GO

-- Kiểm tra lại trạng thái phòng
SELECT SOPHG, TRANGTHAI
FROM PHONG
WHERE SOPHG = 101;
GO

-- Trường hợp 2: Hóa đơn không hợp lệ
EXEC USP_TRA_PHONG
    @MAHD = 'HD9999';
GO





-----USP_THUE_DICH_VU--------------------------------------
CREATE OR ALTER PROCEDURE USP_THUE_DICH_VU
    @MAHD VARCHAR(10),
    @SOPHG INT,
    @MADV VARCHAR(10),
    @SOLG INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @DONGIA DECIMAL(18,2);

    -- Kiểm tra số lượng
    IF @SOLG <= 0
    BEGIN
        RAISERROR(N'Lỗi: Số lượng không hợp lệ.',16,1);
        RETURN;
    END

    -- Kiểm tra hóa đơn
    IF NOT EXISTS (
        SELECT 1
        FROM HOADON
        WHERE MAHD = @MAHD
          AND TRANGTHAI = N'Chưa thanh toán'
    )
    BEGIN
        RAISERROR(N'Lỗi: Hóa đơn không hợp lệ hoặc đã thanh toán/hủy.',16,1);
        RETURN;
    END

    -- Kiểm tra phòng có thuộc hóa đơn này không
    IF NOT EXISTS (
        SELECT 1
        FROM HOADON H
        INNER JOIN CTBK C ON H.MASO = C.MASO
        WHERE H.MAHD = @MAHD
          AND C.SOPHG = @SOPHG
    )
    BEGIN
        RAISERROR(N'Lỗi: Phòng không thuộc hóa đơn này.',16,1);
        RETURN;
    END

    -- Kiểm tra dịch vụ
    IF NOT EXISTS (
        SELECT 1
        FROM DICHVU
        WHERE MADV = @MADV
    )
    BEGIN
        RAISERROR(N'Lỗi: Dịch vụ không tồn tại.',16,1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        -- Lấy đơn giá hiện tại tại thời điểm khách sử dụng dịch vụ
        SELECT @DONGIA = DONGIA
        FROM DICHVU
        WHERE MADV = @MADV;

        -- Ghi nhận từng lần sử dụng dịch vụ vào bảng phát sinh
        INSERT INTO SUDUNG_DV(SOPHG, MAHD, MADV, NGAYSD, SOLG, DONGIA_APDUNG)
        VALUES(@SOPHG, @MAHD, @MADV, GETDATE(), @SOLG, @DONGIA);

        COMMIT TRAN;

        SELECT
            @MAHD AS MAHD,
            @SOPHG AS SOPHG,
            @MADV AS MADV,
            @SOLG AS SOLG,
            @DONGIA AS DONGIA_APDUNG,
            @SOLG * @DONGIA AS THANH_TIEN_LAN_SU_DUNG,
            N'Ghi nhận sử dụng dịch vụ thành công.' AS THONGBAO;

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ERROR_MESSAGE NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ERROR_STATE INT = ERROR_STATE();

        RAISERROR(@ERROR_MESSAGE,16,@ERROR_STATE);

    END CATCH
END;
GO


-- Trường hợp 1: Ghi nhận sử dụng dịch vụ thành công
PRINT N'CASE 1: GHI NHẬN SỬ DỤNG DỊCH VỤ THÀNH CÔNG';
EXEC USP_THUE_DICH_VU
    @MAHD = 'HD12',
    @SOPHG = 203,
    @MADV = 'DV02',
    @SOLG = 2;
GO

SELECT *
FROM SUDUNG_DV
WHERE MAHD = 'HD12'
ORDER BY NGAYSD DESC;
GO

SELECT *
FROM CTHD_DV
WHERE MAHD = 'HD12';
GO
-- Kỳ vọng: SUDUNG_DV có dòng mới, CTHD_DV chưa có/còn chưa đổi vì chưa tổng hợp.

-- Trường hợp 2: Dịch vụ không tồn tại
PRINT N'CASE 2: DỊCH VỤ KHÔNG TỒN TẠI';
EXEC USP_THUE_DICH_VU
    @MAHD = 'HD12',
    @SOPHG = 203,
    @MADV = 'DV99',
    @SOLG = 1;
GO

-- Trường hợp 3: Số lượng không hợp lệ
PRINT N'CASE 3: SỐ LƯỢNG KHÔNG HỢP LỆ';
EXEC USP_THUE_DICH_VU
    @MAHD = 'HD12',
    @SOPHG = 203,
    @MADV = 'DV02',
    @SOLG = -1;
GO

-- Trường hợp 4: Phòng không thuộc hóa đơn
PRINT N'CASE 4: PHÒNG KHÔNG THUỘC HÓA ĐƠN';
EXEC USP_THUE_DICH_VU
    @MAHD = 'HD12',
    @SOPHG = 101,
    @MADV = 'DV02',
    @SOLG = 1;
GO

-- Trường hợp 5: Hóa đơn đã thanh toán, không được thêm dịch vụ
PRINT N'CASE 5: HÓA ĐƠN ĐÃ THANH TOÁN, KHÔNG ĐƯỢC THÊM DỊCH VỤ';
EXEC USP_THUE_DICH_VU
    @MAHD = 'HD01',
    @SOPHG = 101,
    @MADV = 'DV02',
    @SOLG = 1;
GO





-----USP_TONG_HOP_CTHD_DV--------------------------------------
CREATE OR ALTER PROCEDURE USP_TONG_HOP_CTHD_DV
    @MAHD VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra hóa đơn tồn tại
    IF NOT EXISTS (
        SELECT 1
        FROM HOADON
        WHERE MAHD = @MAHD
    )
    BEGIN
        RAISERROR(N'Lỗi: Mã hóa đơn không tồn tại.',16,1);
        RETURN;
    END

    -- Chỉ tổng hợp lại dịch vụ cho hóa đơn chưa thanh toán
    IF EXISTS (
        SELECT 1
        FROM HOADON
        WHERE MAHD = @MAHD
          AND TRANGTHAI <> N'Chưa thanh toán'
    )
    BEGIN
        RAISERROR(N'Lỗi: Hóa đơn đã thanh toán hoặc đã hủy, không thể tổng hợp lại dịch vụ.',16,1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        -- Xóa dữ liệu tổng hợp cũ để tránh cộng trùng
        DELETE FROM CTHD_DV
        WHERE MAHD = @MAHD;

        -- Tổng hợp lại từ bảng phát sinh SUDUNG_DV
        INSERT INTO CTHD_DV(MAHD, MADV, SOLG, GIA)
        SELECT 
            MAHD,
            MADV,
            SUM(SOLG) AS SOLG,
            SUM(SOLG * DONGIA_APDUNG) AS GIA
        FROM SUDUNG_DV
        WHERE MAHD = @MAHD
        GROUP BY MAHD, MADV;

        COMMIT TRAN;

        SELECT 
            @MAHD AS MAHD,
            N'Đã tổng hợp dịch vụ từ SUDUNG_DV sang CTHD_DV.' AS THONGBAO;

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ERROR_MESSAGE NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ERROR_STATE INT = ERROR_STATE();

        RAISERROR(@ERROR_MESSAGE,16,@ERROR_STATE);

    END CATCH
END;
GO



-- Trường hợp 1: Tổng hợp dịch vụ thành công
PRINT N'CASE 1: TỔNG HỢP DỊCH VỤ TỪ SUDUNG_DV SANG CTHD_DV THÀNH CÔNG';
EXEC USP_TONG_HOP_CTHD_DV
    @MAHD = 'HD12';
GO

SELECT *
FROM CTHD_DV
WHERE MAHD = 'HD12';
GO

-- Trường hợp 2: Hóa đơn không tồn tại
PRINT N'CASE 2: HÓA ĐƠN KHÔNG TỒN TẠI';
EXEC USP_TONG_HOP_CTHD_DV
    @MAHD = 'HD9999';
GO

-- Trường hợp 3: Hóa đơn đã thanh toán, không được tổng hợp lại
PRINT N'CASE 3: HÓA ĐƠN ĐÃ THANH TOÁN, KHÔNG ĐƯỢC TỔNG HỢP LẠI';
EXEC USP_TONG_HOP_CTHD_DV
    @MAHD = 'HD01';
GO




------- USP_CAP_NHAT_DICH_VU --------------------------------------
CREATE OR ALTER PROCEDURE USP_CAP_NHAT_DICH_VU
    @MADV VARCHAR(10),
    @TENDV_MOI NVARCHAR(30),
    @DONGIA_MOI DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra dịch vụ
    IF NOT EXISTS (
        SELECT 1
        FROM DICHVU
        WHERE MADV = @MADV
    )
    BEGIN
        RAISERROR(N'Lỗi: Dịch vụ không tồn tại.',16,1);
        RETURN;
    END

    -- Kiểm tra tên
    IF LTRIM(RTRIM(@TENDV_MOI)) = N''
    BEGIN
        RAISERROR(N'Lỗi: Tên dịch vụ không hợp lệ.',16,1);
        RETURN;
    END

    -- Kiểm tra đơn giá
    IF @DONGIA_MOI <= 0
    BEGIN
        RAISERROR(N'Lỗi: Đơn giá không hợp lệ.',16,1);
        RETURN;
    END

    -- Kiểm tra trùng tên
    IF EXISTS (
        SELECT 1
        FROM DICHVU
        WHERE TENDV = LTRIM(RTRIM(@TENDV_MOI))
          AND MADV <> @MADV
    )
    BEGIN
        RAISERROR(N'Lỗi: Tên dịch vụ đã tồn tại.',16,1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

		DECLARE @GIA_CU DECIMAL(18,2);

        -- Lấy giá cũ trước khi cập nhật
        SELECT @GIA_CU = DONGIA
        FROM DICHVU WITH (UPDLOCK, HOLDLOCK)
        WHERE MADV = @MADV;

		-- Ghi log nếu có thay đổi giá dịch vụ
		IF @GIA_CU <> @DONGIA_MOI
		BEGIN
			INSERT INTO LOG_GIA_DV(MADV, GIA_CU, GIA_MOI, NGAY_THAY_DOI, LYDO)
			VALUES(@MADV, @GIA_CU, @DONGIA_MOI, GETDATE(), N'Cập nhật giá dịch vụ');
		END

        -- Cập nhật dịch vụ
        UPDATE DICHVU
        SET TENDV = LTRIM(RTRIM(@TENDV_MOI)),
            DONGIA = @DONGIA_MOI
        WHERE MADV = @MADV;

        COMMIT TRAN;

        SELECT
            @MADV AS MADV,
            N'Cập nhật dịch vụ thành công.' AS THONGBAO;

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ERROR_MESSAGE NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ERROR_STATE INT = ERROR_STATE();

        RAISERROR(@ERROR_MESSAGE,16,@ERROR_STATE);

    END CATCH
END;
GO

-- Trường hợp 1: Dịch vụ không tồn tại
PRINT N'CASE 1: DỊCH VỤ KHÔNG TỒN TẠI';
EXEC USP_CAP_NHAT_DICH_VU @MADV = 'DV99', @TENDV_MOI = N'Nước ép cam', @DONGIA_MOI = 40000;
GO
-- Trường hợp 2: Tên dịch vụ không hợp lệ
PRINT N'CASE 2: TÊN DỊCH VỤ KHÔNG HỢP LỆ';
EXEC USP_CAP_NHAT_DICH_VU @MADV = 'DV01', @TENDV_MOI = N'   ', @DONGIA_MOI = 50000;
GO
-- Trường hợp 3: Đơn giá không hợp lệ
PRINT N'CASE 3: ĐƠN GIÁ KHÔNG HỢP LỆ';
EXEC USP_CAP_NHAT_DICH_VU @MADV = 'DV01', @TENDV_MOI = N'Giặt ủi cao cấp', @DONGIA_MOI = -5000;
GO
-- Trường hợp 4: Tên dịch vụ đã tồn tại
PRINT N'CASE 4: TÊN DỊCH VỤ ĐÃ TỒN TẠI';
EXEC USP_CAP_NHAT_DICH_VU @MADV = 'DV01', @TENDV_MOI = N'Nước suối', @DONGIA_MOI = 60000;
GO
-- Trường hợp 5: Cập nhật dịch vụ thành công
PRINT N'CASE 5: CẬP NHẬT DỊCH VỤ THÀNH CÔNG';
BEGIN TRY
DECLARE @ResultTable5 TABLE (MADV VARCHAR(10), THONGBAO NVARCHAR(100));
INSERT INTO @ResultTable5
EXEC USP_CAP_NHAT_DICH_VU @MADV = 'DV01', @TENDV_MOI = N'Giặt ủi siêu tốc', @DONGIA_MOI = 75000;

DECLARE @Msg5 NVARCHAR(100);
SELECT @Msg5 = THONGBAO FROM @ResultTable5;
PRINT N'Kết quả hệ thống: ' + @Msg5;
END TRY
BEGIN CATCH
PRINT N'Lỗi hệ thống: ' + ERROR_MESSAGE();
END CATCH;
GO
-- Kiểm tra dữ liệu sau khi cập nhật thành công
PRINT N'DỮ LIỆU TRONG DICHVU SAU KHI CẬP NHẬT:';
SELECT MADV, TENDV, DONGIA FROM DICHVU WHERE MADV = 'DV01';
GO
-- Khôi phục lại dữ liệu mẫu ban đầu. 
-- LƯU Ý: cái này sẽ không ghi log, vì nó update trực tiếp bảng DICHVU, không đi qua USP_CAP_NHAT_DICH_VU, cái này ổn nếu chỉ là khôi phục dữ liệu để test.
UPDATE DICHVU SET TENDV = N'Giặt ủi', DONGIA = 50000 WHERE MADV = 'DV01';
GO


-- Trường hợp 6: 
PRINT N'KIỂM TRA LOG GIÁ DỊCH VỤ SAU KHI CẬP NHẬT';
SELECT *
FROM LOG_GIA_DV
WHERE MADV = 'DV01'
GO



-- USP_CAP_NHAT_TONG_HD --------------------------------------
CREATE OR ALTER PROCEDURE USP_CAP_NHAT_TONG_HD 
    @MAHD VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM HOADON WHERE MAHD = @MAHD)
    BEGIN
        RAISERROR(N'Lỗi: Mã hóa đơn không tồn tại trên hệ thống.', 16, 1);
        RETURN;
    END

    -- 2. Check trạng thái hóa đơn (Đã chốt thanh toán hoặc đã hủy thì KHÔNG được tính toán lại tiền)
    IF EXISTS (SELECT 1 FROM HOADON WHERE MAHD = @MAHD AND TRANGTHAI <> N'Chưa thanh toán')
    BEGIN
        RAISERROR(N'Lỗi: Hóa đơn này đã hoàn tất hoặc đã hủy, không thể cập nhật lại số tiền.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        -- Khóa chốt giữ dòng hóa đơn cần tính tiền để loại Race Condition
        IF EXISTS (SELECT 1 FROM HOADON WITH (UPDLOCK, HOLDLOCK) WHERE MAHD = @MAHD AND TRANGTHAI <> N'Chưa thanh toán')
        BEGIN
            RAISERROR(N'Lỗi hệ thống: Trạng thái hóa đơn đã bị thay đổi bởi tiến trình khác.', 16, 1);
        END

        -- Tổng hợp dịch vụ phát sinh từ SUDUNG_DV sang CTHD_DV
        EXEC USP_TONG_HOP_CTHD_DV @MAHD;


        -- Đọc dữ liệu qua Function + UPDATE đồng bộ dưới sự bảo vệ của Khóa
        UPDATE HOADON
        SET TONG = ISNULL(dbo.UFC_SO_TIEN_CON_LAI(@MAHD), 0)
        WHERE MAHD = @MAHD;

        COMMIT TRAN;

        SELECT 
            @MAHD AS MAHD,
            TONG AS TONG_TIEN_CUOI_CUNG,
            TRANGTHAI AS TRANGTHAI_HD,
            N'Đã đồng bộ và cập nhật tổng tiền hóa đơn thành công.' AS THONGBAO
        FROM HOADON
        WHERE MAHD = @MAHD;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ERROR_MESSAGE NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ERROR_STATE INT = ERROR_STATE();
        RAISERROR(@ERROR_MESSAGE, 16, @ERROR_STATE);
    END CATCH
END;
GO

-- Kiểm thử
-- Trường hợp 1: Cập nhật tổng hóa đơn thành công
EXEC USP_THUE_DICH_VU
    @MAHD = 'HD12',
    @SOPHG = 203,
    @MADV = 'DV02',
    @SOLG = 2;
GO

EXEC USP_CAP_NHAT_TONG_HD
    @MAHD = 'HD12';
GO

SELECT MAHD, TONG, TRANGTHAI
FROM HOADON
WHERE MAHD = 'HD12';
GO

SELECT *
FROM CTHD_DV
WHERE MAHD = 'HD12';
GO


-- Trường hợp 2: Hóa đơn không tồn tại
EXEC USP_CAP_NHAT_TONG_HD
    @MAHD = 'HD9999';
GO

-- Trường hợp 3: Hóa đơn đã thanh toán
EXEC USP_CAP_NHAT_TONG_HD
    @MAHD = 'HD01';
GO





-----USP_THANH_TOAN_HD --------------------------------------
CREATE OR ALTER PROCEDURE USP_THANH_TOAN_HD
    @MAHD VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra hóa đơn
    IF NOT EXISTS (
        SELECT 1
        FROM HOADON
        WHERE MAHD = @MAHD
          AND TRANGTHAI = N'Chưa thanh toán'
    )
    BEGIN
        RAISERROR(N'Lỗi: Hóa đơn không hợp lệ.',16,1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        -- Cập nhật tổng hóa đơn
        EXEC USP_CAP_NHAT_TONG_HD @MAHD;

        -- Thanh toán hóa đơn
        UPDATE HOADON
        SET TRANGTHAI = N'Đã thanh toán',
            NGAY = GETDATE()
        WHERE MAHD = @MAHD;

        COMMIT TRAN;

        SELECT
            @MAHD AS MAHD,
            N'Thanh toán hóa đơn thành công.' AS THONGBAO;

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ERROR_MESSAGE NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ERROR_STATE INT = ERROR_STATE();

        RAISERROR(@ERROR_MESSAGE,16,@ERROR_STATE);

    END CATCH
END;
GO

-- Trường hợp 1: Thanh toán thành công
EXEC USP_THANH_TOAN_HD
    @MAHD = 'HD12';
GO

-- Kiểm tra trạng thái hóa đơn
SELECT MAHD, TRANGTHAI, NGAY
FROM HOADON
WHERE MAHD = 'HD12';
GO

-- Trường hợp 2: Hóa đơn không hợp lệ
EXEC USP_THANH_TOAN_HD
    @MAHD = 'HD9999';
GO


---- USP_THEM_NHAN_VIEN --------------------------------------
CREATE OR ALTER PROCEDURE USP_THEM_NHAN_VIEN
    @TENNV NVARCHAR(30),
    @SDT VARCHAR(10),
    @LUONG DECIMAL(18,2),
    @CHUCVU NVARCHAR(30),
    @MANV_MOI VARCHAR(10) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra tên
    IF LTRIM(RTRIM(@TENNV)) = N''
    BEGIN
        RAISERROR(N'Lỗi: Tên nhân viên không hợp lệ.',16,1);
        RETURN;
    END

    -- Kiểm tra số điện thoại
    IF LEN(@SDT) <> 10 OR @SDT LIKE '%[^0-9]%'
    BEGIN
        RAISERROR(N'Lỗi: Số điện thoại không hợp lệ.',16,1);
        RETURN;
    END

    -- Kiểm tra lương
    IF @LUONG <= 0
    BEGIN
        RAISERROR(N'Lỗi: Lương không hợp lệ.',16,1);
        RETURN;
    END

    -- Kiểm tra chức vụ
    IF LTRIM(RTRIM(@CHUCVU)) = N''
    BEGIN
        RAISERROR(N'Lỗi: Chức vụ không hợp lệ.',16,1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        -- Kiểm tra trùng số điện thoại
        IF EXISTS (
            SELECT 1
            FROM NHANVIEN
            WHERE SDT = @SDT
        )
        BEGIN
            RAISERROR(N'Lỗi: Số điện thoại đã tồn tại.',16,1);
        END

        DECLARE @SO_MOI INT;

        -- Sinh mã nhân viên
        SELECT @SO_MOI =
            ISNULL(MAX(CAST(SUBSTRING(MANV,3,LEN(MANV)) AS INT)),0) + 1
        FROM NHANVIEN;

        SET @MANV_MOI =
            'NV' + RIGHT('0000' + CAST(@SO_MOI AS VARCHAR),4);

        -- Thêm nhân viên
        INSERT INTO NHANVIEN(MANV,TENNV,SDT,LUONG,CHUCVU)
        VALUES(
            @MANV_MOI,
            LTRIM(RTRIM(@TENNV)),
            @SDT,
            @LUONG,
            LTRIM(RTRIM(@CHUCVU))
        );

        COMMIT TRAN;

        SELECT
            @MANV_MOI AS MANV,
            N'Thêm nhân viên thành công.' AS THONGBAO;

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ERROR_MESSAGE NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ERROR_STATE INT = ERROR_STATE();

        RAISERROR(@ERROR_MESSAGE,16,@ERROR_STATE);

    END CATCH
END;
GO

-- Trường hợp 1: Tên nhân viên không hợp lệ
PRINT N'CASE 1: TÊN NHÂN VIÊN KHÔNG HỢP LỆ';
DECLARE @MANV_OUT1 VARCHAR(10);
EXEC USP_THEM_NHAN_VIEN @TENNV = N'   ', @SDT = '0906000111', @LUONG = 8000000, @CHUCVU = N'Lễ tân', @MANV_MOI = @MANV_OUT1 OUTPUT;
GO
-- Trường hợp 2: Số điện thoại không hợp lệ (Không đủ 10 chữ số hoặc chứa ký tự đặc biệt)
PRINT N'CASE 2: SỐ ĐIỆN THOẠI KHÔNG HỢP LỆ';
DECLARE @MANV_OUT2 VARCHAR(10);
EXEC USP_THEM_NHAN_VIEN @TENNV = N'Nguyễn Văn A', @SDT = '0906ABC123', @LUONG = 8000000, @CHUCVU = N'Lễ tân', @MANV_MOI = @MANV_OUT2 OUTPUT;
GO
-- Trường hợp 3: Lương không hợp lệ
PRINT N'CASE 3: LƯƠNG KHÔNG HỢP LỆ';
DECLARE @MANV_OUT3 VARCHAR(10);
EXEC USP_THEM_NHAN_VIEN @TENNV = N'Nguyễn Văn A', @SDT = '0906000111', @LUONG = -500000, @CHUCVU = N'Lễ tân', @MANV_MOI = @MANV_OUT3 OUTPUT;
GO
-- Trường hợp 4: Chức vụ không hợp lệ
PRINT N'CASE 4: CHỨC VỤ KHÔNG HỢP LỆ';
DECLARE @MANV_OUT4 VARCHAR(10);
EXEC USP_THEM_NHAN_VIEN @TENNV = N'Nguyễn Văn A', @SDT = '0906000111', @LUONG = 8000000, @CHUCVU = N'   ', @MANV_MOI = @MANV_OUT4 OUTPUT;
GO
-- Trường hợp 5: Số điện thoại đã tồn tại
PRINT N'CASE 5: SỐ ĐIỆN THOẠI ĐÃ TỒN TẠI';
DECLARE @MANV_OUT5 VARCHAR(10);
EXEC USP_THEM_NHAN_VIEN @TENNV = N'Nguyễn Văn A', @SDT = '0901000111', @LUONG = 8000000, @CHUCVU = N'Lễ tân', @MANV_MOI = @MANV_OUT5 OUTPUT;
GO
-- Trường hợp 6: Thêm nhân viên thành công
PRINT N'CASE 6: THÊM NHÂN VIÊN THÀNH CÔNG';
BEGIN TRY
DECLARE @MANV_OUT6 VARCHAR(10);
DECLARE @ResultTable6 TABLE (MANV VARCHAR(10), THONGBAO NVARCHAR(100));
INSERT INTO @ResultTable6
EXEC USP_THEM_NHAN_VIEN @TENNV = N'Nguyễn Hoàng Nam', @SDT = '0906123456', @LUONG = 9500000, @CHUCVU = N'Lễ tân', @MANV_MOI = @MANV_OUT6 OUTPUT;

DECLARE @Msg6 NVARCHAR(100);
SELECT @Msg6 = THONGBAO FROM @ResultTable6;
PRINT N'Kết quả hệ thống: ' + @Msg6;
END TRY
BEGIN CATCH
PRINT N'Lỗi hệ thống: ' + ERROR_MESSAGE();
END CATCH;
GO
-- Kiểm tra dữ liệu sau khi thêm thành công
PRINT N'DỮ LIỆU TRONG NHANVIEN SAU KHI THÊM:';
SELECT MANV, TENNV, SDT, LUONG, CHUCVU FROM NHANVIEN WHERE SDT = '0906123456';
GO
-- Dọn dẹp dữ liệu phát sinh sau khi kết thúc quá trình test
DELETE FROM NHANVIEN WHERE SDT = '0906123456';
GO






-- TRIGGER

DROP TRIGGER IF EXISTS tg_Audit_HOADON;
DROP TRIGGER IF EXISTS tg_ThongBaoCapNhatTrangThaiPhong;
DROP TRIGGER IF EXISTS tg_ThongBaoThemBooking;
DROP TRIGGER IF EXISTS tg_ThongBaoHuyBooking;
DROP TRIGGER IF EXISTS tg_HuyBooking_HuyHoaDon;
DROP TRIGGER IF EXISTS tg_ChanSuaCCCD;
DROP TRIGGER IF EXISTS tg_ChanSuaPhong_DaNhan;
DROP TRIGGER IF EXISTS tg_ChanThemDichVu;
DROP TRIGGER IF EXISTS tg_ChanThemSuDungDV;
DROP TRIGGER IF EXISTS tg_ChanXoaHoaDon;
GO

IF OBJECT_ID('AUDIT_LOG', 'U') IS NULL
BEGIN
    CREATE TABLE AUDIT_LOG (
        LOG_ID INT IDENTITY(1,1) PRIMARY KEY,
        USERNAME NVARCHAR(100),
        ACTION NVARCHAR(50),
        TABLE_NAME NVARCHAR(50),
        RECORD_ID NVARCHAR(50),
        LOG_TIME DATETIME DEFAULT GETDATE()
    );
END;
GO

-- thông báo các sửa đổi
CREATE TRIGGER tg_Audit_HOADON
ON HOADON
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- INSERT
    IF EXISTS (SELECT 1 FROM inserted) AND NOT EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO AUDIT_LOG(USERNAME, ACTION, TABLE_NAME, RECORD_ID)
        SELECT SYSTEM_USER, 'INSERT', 'HOADON', MAHD
        FROM inserted;
    END

    -- UPDATE
    IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO AUDIT_LOG(USERNAME, ACTION, TABLE_NAME, RECORD_ID)
        SELECT SYSTEM_USER, 'UPDATE', 'HOADON', MAHD
        FROM inserted;
    END

    -- DELETE
    IF EXISTS (SELECT 1 FROM deleted) AND NOT EXISTS (SELECT 1 FROM inserted)
    BEGIN
        INSERT INTO AUDIT_LOG(USERNAME, ACTION, TABLE_NAME, RECORD_ID)
        SELECT SYSTEM_USER, 'DELETE', 'HOADON', MAHD
        FROM deleted;
    END
END;
GO

UPDATE HOADON
SET TRANGTHAI = N'Đã thanh toán'
WHERE MAHD = 'HD02';
GO

SELECT *
FROM AUDIT_LOG
ORDER BY LOG_TIME DESC;
GO


-- 1. Thông báo khi cập nhật trạng thái phòng
CREATE TRIGGER tg_ThongBaoCapNhatTrangThaiPhong
ON PHONG
AFTER UPDATE
AS
BEGIN
    IF UPDATE(TRANGTHAI)
    BEGIN
        DECLARE @SoPhong INT, @TrangThaiMoi NVARCHAR(30)
        SELECT @SoPhong = SOPHG, @TrangThaiMoi = TRANGTHAI FROM inserted
		PRINT N'Thông báo: Cập nhật trạng thái phòng thành công!'
        PRINT N' - Số phòng: ' + CAST(@SoPhong AS NVARCHAR(10))
        PRINT N' - Trạng thái hiện tại: ' + @TrangThaiMoi
    END
END
GO

UPDATE PHONG SET TRANGTHAI = N'Trống' WHERE SOPHG = 102
GO

-- 2. Thông báo khi thêm mới Đặt phòng
CREATE TRIGGER tg_ThongBaoThemBooking
ON BOOKING
AFTER INSERT
AS
BEGIN
    DECLARE @MaSo VARCHAR(10)
    SELECT @MaSo = MASO FROM inserted
    PRINT N'Thông báo: Đã thêm mới đơn đặt phòng ' + @MaSo
END
GO

INSERT INTO BOOKING (MASO, NGDAT, TIENCOC, TRANGTHAI, MAKH) 
VALUES ('BK999', '2026-05-12', 200000, N'Chờ nhận phòng', 'KH01')
GO

-- 3. Thông báo khi hủy Đặt phòng
CREATE TRIGGER tg_ThongBaoHuyBooking
ON BOOKING
AFTER UPDATE
AS
BEGIN
    IF UPDATE(TRANGTHAI)
    BEGIN
        IF EXISTS (
            SELECT 1 FROM inserted i 
            JOIN deleted d ON i.MASO = d.MASO 
            WHERE i.TRANGTHAI = N'Đã hủy' AND d.TRANGTHAI <> N'Đã hủy'
        )
        BEGIN
            DECLARE @MaSo VARCHAR(10)
            SELECT @MaSo = MASO FROM inserted WHERE TRANGTHAI = N'Đã hủy'
            PRINT N'Thông báo: Đơn đặt phòng ' + @MaSo + N' đã bị HỦY!'
        END
    END
END
GO

UPDATE BOOKING SET TRANGTHAI = N'Đã hủy' WHERE MASO = 'BK13'
SELECT * FROM BOOKING
GO

-- 4. Tự động chuyển trạng thái Hóa đơn khi Booking bị hủy
CREATE TRIGGER tg_HuyBooking_HuyHoaDon
ON BOOKING
AFTER UPDATE
AS
BEGIN
    IF UPDATE(TRANGTHAI)
    BEGIN
        UPDATE HOADON
        SET TRANGTHAI = N'Đã hủy'
        WHERE MASO IN (
            SELECT MASO FROM inserted 
            WHERE TRANGTHAI = N'Đã hủy'
        )
    END
END
GO

SELECT MAHD, TRANGTHAI FROM HOADON 
WHERE MAHD IN (SELECT MAHD FROM BOOKING WHERE MASO = 'BK12')

UPDATE BOOKING SET TRANGTHAI = N'Đã hủy' WHERE MASO = 'BK12'
SELECT MAHD, TRANGTHAI FROM HOADON 
WHERE MAHD IN (SELECT MAHD FROM BOOKING WHERE MASO = 'BK12')
GO

-- 5. Chặn sửa CCCD 
CREATE TRIGGER tg_ChanSuaCCCD
ON KHACHHANG
AFTER UPDATE
AS
BEGIN
    IF UPDATE(CCCD)
    BEGIN
        IF EXISTS (
            SELECT 1 FROM inserted i
            JOIN deleted d ON i.MAKH = d.MAKH
            WHERE i.CCCD <> d.CCCD
        )
        BEGIN
            RAISERROR(N'Lỗi hệ thống: Số CCCD là định danh cố định, không được phép chỉnh sửa!', 16, 1)
            ROLLBACK TRANSACTION
        END
    END
END
GO

UPDATE KHACHHANG SET CCCD = '077900789099' WHERE MAKH = 'KH01'
GO

-- 6. Chặn thay đổi mã phòng khi đã nhận phòng
CREATE TRIGGER tg_ChanSuaPhong_DaNhan
ON CTBK
AFTER UPDATE
AS
BEGIN
    IF UPDATE(SOPHG)
    BEGIN
        IF EXISTS (
            SELECT 1 FROM inserted i
            JOIN BOOKING B ON i.MASO = B.MASO
            WHERE B.TRANGTHAI = N'Đã nhận phòng'
        )
        BEGIN
            RAISERROR(N'Lỗi hệ thống: Khách đã nhận phòng, không thể trực tiếp thay đổi mã phòng trên hệ thống đặt!', 16, 1);
            ROLLBACK TRANSACTION;
        END
    END
END
GO

UPDATE CTBK SET SOPHG = 201 WHERE MASO = 'BK08'
GO

-- 7. Chặn thêm dịch vụ vào hóa đơn đã thanh toán hoặc đã hủy
CREATE TRIGGER tg_ChanThemDichVu
ON CTHD_DV
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1 FROM inserted i, HOADON H 
        WHERE i.MAHD = H.MAHD
        AND H.TRANGTHAI IN (N'Đã thanh toán', N'Đã hủy')
    )
    BEGIN
        RAISERROR(N'Lỗi hệ thống: Hóa đơn này đã kết toán hoặc đã hủy, không thể thêm/sửa dịch vụ!', 16, 1)
        ROLLBACK TRANSACTION
    END
END
GO

INSERT INTO CTHD_DV (MAHD, MADV, SOLG, GIA) VALUES ('HD01', 'DV01', 2, 100000)
GO


-- 7b. Chặn thêm/sửa lần sử dụng dịch vụ vào hóa đơn đã thanh toán hoặc đã hủy
CREATE TRIGGER tg_ChanThemSuDungDV
ON SUDUNG_DV
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN HOADON H ON i.MAHD = H.MAHD
        WHERE H.TRANGTHAI IN (N'Đã thanh toán', N'Đã hủy')
    )
    BEGIN
        RAISERROR(N'Lỗi hệ thống: Hóa đơn này đã kết toán hoặc đã hủy, không thể thêm/sửa dịch vụ phát sinh!', 16, 1);
        ROLLBACK TRANSACTION;
    END
END
GO

-- Test trigger tg_ChanThemSuDungDV Không cho thêm dịch vụ vào hóa đơn đã thanh toán
INSERT INTO SUDUNG_DV(SOPHG, MAHD, MADV, NGAYSD, SOLG, DONGIA_APDUNG)
VALUES(101, 'HD01', 'DV02', GETDATE(), 1, 20000);
GO

-- 8. Chặn xóa Hóa đơn
CREATE TRIGGER tg_ChanXoaHoaDon
ON HOADON
INSTEAD OF DELETE
AS
BEGIN
    RAISERROR(N'Lỗi hệ thống: Không cho phép xóa hóa đơn!', 16, 1)
    ROLLBACK TRANSACTION
END
GO

DELETE FROM HOADON WHERE MAHD = 'HD01'
GO

----------------------------------
USE master;
GO

CREATE LOGIN [NV01_Login] WITH PASSWORD = 'Trinhtranphuongtuan.666';
CREATE LOGIN [NV02_Login] WITH PASSWORD = 'Miule@1234';
CREATE LOGIN [NV03_Login] WITH PASSWORD = 'Chidan@1234';
CREATE LOGIN [NV04_Login] WITH PASSWORD = 'Binhgold@1234';
CREATE LOGIN [NV05_Login] WITH PASSWORD = 'CocongmaisaccongaynenksminiVN.999';
GO

USE QLKS;
GO
CREATE USER [NV01_User] FOR LOGIN [NV01_Login];
CREATE USER [NV02_User] FOR LOGIN [NV02_Login];
CREATE USER [NV03_User] FOR LOGIN [NV03_Login];
CREATE USER [NV04_User] FOR LOGIN [NV04_Login];
CREATE USER [NV05_User] FOR LOGIN [NV05_Login];
GO


ALTER LOGIN NV02_Login DISABLE;
GO
ALTER LOGIN NV02_Login ENABLE;
GO

USE QLKS;
GO

ALTER ROLE Role_NghiepVu DROP MEMBER NV02_User;
GO

ALTER LOGIN NV02_Login
WITH PASSWORD = 'Ieatkids@63636';



-- Recovery Model ----------------------------------
USE msdb;
GO

ALTER DATABASE [QLKS] 
SET RECOVERY FULL;
GO


-- Full Backup Job ----------------------------------
EXEC dbo.sp_add_job 
    @job_name = N'QLKS_SaoLuu_Full_HangTuan', 
    @enabled = 1,
    @description = N'Sao lưu toàn bộ cơ sở dữ liệu QLKS định kỳ hàng tuần';
GO

EXEC sp_add_jobstep 
    @job_name = N'QLKS_SaoLuu_Full_HangTuan', 
    @step_name = N'Thuc_Thi_Backup_Full', 
    @subsystem = N'TSQL', 
	@command = N' 
        DECLARE @fileName VARCHAR(256);
        SET @fileName = ''/var/opt/mssql/data/QLKS_Full_'' + CONVERT(VARCHAR(8), GETDATE(), 112) + ''.bak'';
        BACKUP DATABASE [QLKS] TO DISK = @fileName WITH COMPRESSION, INIT;', 
	@database_name = N'master'; 
GO

EXEC sp_add_jobschedule 
    @job_name = N'QLKS_SaoLuu_Full_HangTuan', 
    @name = N'Lich_ChuNhat_1GioSang', 
    @freq_type = 8,                     -- chu kì chạy 1 tuần, 8 là con số đại diện cho tần suất mỗi tuần
	@freq_interval = 1,                 -- 1 = Sunday, 2 = Monday, 4 = Tuesday, 8 = Wednesday ... 64 = Saturday
	@freq_recurrence_factor = 1,        -- đây là tần số lặp lại mỗi chu kỳ, 1 nghĩa là 1 tuần 1 lần, 2 nghĩa là 2 tuần 1 lần
	@active_start_time = 020000;        -- 02:00:00 giờ sáng bắt đầu chạy
GO

EXEC sp_add_jobserver @job_name = N'QLKS_SaoLuu_Full_HangTuan', @server_name = N'(LOCAL)';
GO




-- Differential Backup Job ----------------------------------
EXEC dbo.sp_add_job 
    @job_name = N'QLKS_SaoLuu_Diff_HangNgay', 
    @enabled = 1,
    @description = N'Sao lưu các dữ liệu thay đổi so với bản Full gần nhất';
GO

EXEC sp_add_jobstep 
    @job_name = N'QLKS_SaoLuu_Diff_HangNgay', 
    @step_name = N'Thuc_Thi_Backup_Diff', 
    @subsystem = N'TSQL', 
    @command = N'
        DECLARE @fileName VARCHAR(256);
        SET @fileName = ''/var/opt/mssql/data/QLKS_Diff_'' + CONVERT(VARCHAR(8), GETDATE(), 112) + ''.bak'';
        BACKUP DATABASE [QLKS] TO DISK = @fileName WITH DIFFERENTIAL, COMPRESSION, INIT;', 
	@database_name = N'master';
GO

EXEC sp_add_jobschedule 
    @job_name = N'QLKS_SaoLuu_Diff_HangNgay', 
    @name = N'Lich_Thu2_Den_Thu7_1GioSang', 
    @freq_type = 8,                 -- hàng tuần
	@freq_interval = 126,           -- tổng của thứ 2 đến thứ 7 (không sinh ra vào chủ nhật). 2 + 4 + 8 + 16 + 32 + 64 = 126 
	@freq_recurrence_factor = 1, 
	@active_start_time = 020000; 
GO

EXEC sp_add_jobserver @job_name = N'QLKS_SaoLuu_Diff_HangNgay', @server_name = N'(LOCAL)';
GO




-- Log Backup Job ----------------------------------
EXEC dbo.sp_add_job 
    @job_name = N'QLKS_SaoLuu_Log_HangGio', 
    @enabled = 1,
    @description = N'Sao lưu nhật ký giao dịch hàng giờ để phòng chống mất dữ liệu';
GO

EXEC sp_add_jobstep 
    @job_name = N'QLKS_SaoLuu_Log_HangGio', 
    @step_name = N'Thuc_Thi_Backup_Log', 
    @subsystem = N'TSQL', 
    @command = N'
        DECLARE @fileName VARCHAR(256);
        SET @fileName = ''/var/opt/mssql/data/QLKS_Log_'' + CONVERT(VARCHAR(8), GETDATE(), 112) + ''_'' + REPLACE(CONVERT(VARCHAR(5), GETDATE(), 108), '':'', '''') + ''.trn'';
        BACKUP LOG [QLKS] TO DISK = @fileName WITH COMPRESSION;', 
	@database_name = N'master';
GO

EXEC sp_add_jobschedule 
    @job_name = N'QLKS_SaoLuu_Log_HangGio', 
    @name = N'Lich_Lap_Lai_HangGio', 
    @freq_type = 4,                 -- 4 là hàng ngày
	@freq_interval = 1,             -- 1 là ngày nào cũng chạy, 2 là 2 ngày chạy 1 lần
	@freq_subday_type = 8,          -- 8 là mỗi giờ, 4 là mỗi phút, 2 là mỗi giây
	@freq_subday_interval = 1,      -- lặp lại mỗi 1 giờ
	@active_start_time = 030000;    -- bắt đầu từ 3 giờ sáng, sau diff
GO

EXEC sp_add_jobserver @job_name = N'QLKS_SaoLuu_Log_HangGio', @server_name = N'(LOCAL)';
GO




-- Cleanup Backup Job ----------------------------------
EXEC dbo.sp_add_job 
    @job_name = N'QLKS_DonDep_Backup_Cu', 
    @enabled = 1,
    @description = N'Tự động quét và xóa bỏ các file backup cũ quá 7 ngày để giải phóng bộ nhớ';
GO

EXEC sp_add_jobstep 
    @job_name = N'QLKS_DonDep_Backup_Cu', 
    @step_name = N'Thuc_Thi_Xoa_File_Quá_Hạn', 
    @subsystem = N'TSQL',
    @command = N'
        DECLARE @DeleteDate DATETIME;
        SET @DeleteDate = DATEADD(day, -7, GETDATE());
        
        -- Xóa các file .bak (Full và Diff) cũ hơn 7 ngày
        EXEC master.dbo.xp_delete_file 0, N''/var/opt/mssql/data/'', N''bak'', @DeleteDate;
        
        -- Xóa các file .trn (Log) cũ hơn 7 ngày
        EXEC master.dbo.xp_delete_file 0, N''/var/opt/mssql/data/'', N''trn'', @DeleteDate;', 
	@database_name = N'master';
GO


EXEC sp_add_jobschedule 
    @job_name = N'QLKS_DonDep_Backup_Cu', 
    @name = N'Lich_DonDep_ChuNhat_3GioSang', 
    @freq_type = 8,
	@freq_interval = 1, 
	@freq_recurrence_factor = 1, 
	@active_start_time = 030000;
GO

EXEC sp_add_jobserver @job_name = N'QLKS_DonDep_Backup_Cu', @server_name = N'(LOCAL)';
GO




-- Manual Backup Test (kiểm thử nhanh) ----------------------------------

-- Full Backup Job
DECLARE @fileName VARCHAR(256);
SET @fileName = '/var/opt/mssql/data/QLKS_Full_' 
+ CONVERT(VARCHAR(8), GETDATE(), 112) + '.bak';

BACKUP DATABASE [QLKS] 
TO DISK = @fileName 
WITH COMPRESSION, INIT;
GO

-- Differential Backup Job
DECLARE @fileName VARCHAR(256);
SET @fileName = '/var/opt/mssql/data/QLKS_Diff_' 
+ CONVERT(VARCHAR(8), GETDATE(), 112) + '.bak';

BACKUP DATABASE [QLKS] 
TO DISK = @fileName 
WITH DIFFERENTIAL, COMPRESSION, INIT;
GO

-- Log Backup Job 
DECLARE @fileName VARCHAR(256);
SET @fileName = '/var/opt/mssql/data/QLKS_Log_' 
+ CONVERT(VARCHAR(8), GETDATE(), 112) + '_' 
+ REPLACE(CONVERT(VARCHAR(5), GETDATE(), 108), ':', '') 
+ '.trn';

BACKUP LOG [QLKS] 
TO DISK = @fileName 
WITH COMPRESSION;


USE master;
GO

-- Khôi phục Full Backup gần nhất
RESTORE DATABASE [QLKS]
FROM DISK = '/var/opt/mssql/data/QLKS_Full_20260517.bak'
WITH NORECOVERY, REPLACE;
GO


-- Khôi phục Differential Backup
RESTORE DATABASE [QLKS]
FROM DISK = '/var/opt/mssql/data/QLKS_Diff_20260521.bak'
WITH NORECOVERY;
GO


-- Khôi phục chuỗi Transaction Log Backup
RESTORE LOG [QLKS]
FROM DISK = '/var/opt/mssql/data/QLKS_Log_20260521_0300.trn'
WITH NORECOVERY;

RESTORE LOG [QLKS]
FROM DISK = '/var/opt/mssql/data/QLKS_Log_20260521_0400.trn'
WITH NORECOVERY;

RESTORE LOG [QLKS]
FROM DISK = '/var/opt/mssql/data/QLKS_Log_20260521_0500.trn'
WITH NORECOVERY;

RESTORE LOG [QLKS]
FROM DISK = '/var/opt/mssql/data/QLKS_Log_20260521_1500.trn'
WITH NORECOVERY;
GO


-- Hoàn tất phục hồi và mở lại hệ thống
RESTORE DATABASE [QLKS]
WITH RECOVERY;
GO



