# LumiStay Ops Redesign

Frontend redesign cho đồ án quản lý khách sạn SQL Server.

## Concept

Không làm dashboard chung chung. App được thiết kế theo workflow của lễ tân:

1. Xem việc cần xử lý hôm nay
2. Xem sơ đồ phòng theo tầng
3. Tạo booking từ phòng trống
4. Nhận phòng
5. Thêm dịch vụ
6. Lập hóa đơn / trả phòng / thanh toán
7. Xem báo cáo từ SQL views

## Chạy local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Login demo:

```txt
admin
123456
```

## Nối SQL Server thật

Frontend Next.js không cần chuyển logic procedure lên JavaScript. Kiến trúc của LumiStay là:

```txt
Browser → Next.js server/API routes trên Vercel → SQL Server qua TCP tunnel
                         └─ stored procedures, views, triggers vẫn ở SQL Server
```

Tạo `.env.local` khi chạy local hoặc thêm các biến tương tự trong Vercel Project Settings:

```env
USE_REAL_DB=true
DB_HOST=0.tcp.ngrok.io
DB_PORT=12345
DB_USER=hotel_web
DB_PASSWORD=mật_khẩu_sql_server
DB_NAME=QLKS
DB_ENCRYPT=false
DB_TRUST_CERT=true
DB_POOL_MAX=3
JWT_SECRET=một_chuỗi_dài_ngẫu_nhiên
```

`DB_HOST` và `DB_PORT` phải là endpoint TCP của tunnel, không phải `localhost` khi chạy trên Vercel. Với một người xem, ngrok TCP là đường ngắn nhất: chạy SQL Server trên máy bạn, mở TCP tunnel tới port 1433, rồi dùng host/port ngrok trong Vercel. Cloudflare Tunnel thông thường phù hợp HTTP; muốn dùng SQL Server TCP cần cấu hình Cloudflare Access/Tunnel TCP tương ứng, không dùng URL website thay cho `DB_HOST`.

### Thứ tự cài database

1. Chạy script schema/seed gốc trong SSMS trên database `QLKS`.
2. Chạy `database/01_add_taikhoan.sql`.
3. Chạy `npm run hash-password -- 123456`, thay placeholder trong `database/02_seed_taikhoan_demo.sql`, rồi chạy script đó.
4. Chạy `database/03_web_hardening.sql`. Script này không drop table; nó khóa phòng khi ghi booking và cấp quyền cập nhật thời điểm đăng nhập.
5. Tạo một login SQL Server riêng `hotel_web`, không dùng `sa`. Chỉ mở quyền `SELECT`/`EXECUTE` cần thiết.
6. Các phần backup/restore trong script là nghiệp vụ quản trị database, không chạy trong request web và không cần đưa lên Vercel.
7. Mở app và kiểm tra `/api/health-db` sau khi đăng nhập ops.

### Chạy và deploy

```bash
npm install
cp .env.example .env.local
npm run dev
npm run build
```

Trong Vercel, import repository, chọn Root Directory là `lumistay-next`, giữ Build Command `next build`, sau đó khai báo env vars ở trên. Vercel Function phải chạy Node.js; các route gọi `mssql` đã được đánh dấu `runtime = "nodejs"`.

### Lưu ý an toàn khi tunnel từ máy cá nhân

- Không expose port 1433 trực tiếp ra Internet nếu chưa có firewall/ACL.
- Chỉ chạy tunnel khi bạn đang demo; khi tắt máy hoặc tunnel thì site vẫn render được nhưng phần SQL live sẽ không hoạt động.
- Dùng tài khoản DB riêng, password mạnh, `DB_POOL_MAX=3`; Vercel serverless có thể tạo nhiều instance nên không xem `pool.max` là giới hạn toàn hệ thống.
- Nếu SQL Server của bạn có chứng chỉ hợp lệ, đặt `DB_ENCRYPT=true` và `DB_TRUST_CERT=false`. `DB_TRUST_CERT=true` chỉ phù hợp tunnel/demo với certificate tự ký.
- Không commit `.env.local`, password, JWT secret hoặc endpoint tunnel vào git.

## Các procedure được map trong UI

- `USP_THEM_KHACH_HANG`
- `USP_TIM_PHONG_TRONG_THEO_LOAI_P`
- `USP_DAT_PHONG`
- `USP_NHAN_PHONG`
- `USP_LAP_HOA_DON`
- `USP_THUE_DICH_VU`
- `USP_TRA_PHONG`
- `USP_THANH_TOAN_HD`

Các nút ops đã nối qua `POST /api/operations`: nhận phòng, lập hóa đơn, thanh toán và trả phòng. Khi `USE_REAL_DB=false`, chúng trả feedback demo để bạn trình diễn giao diện; khi bật live, chúng gọi stored procedure thật.
