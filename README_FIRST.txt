LumiStay Ops Redesign
=====================

Bản này sửa lại frontend theo hướng nghiệp vụ khách sạn thật:
- Trung tâm là sơ đồ phòng và hàng đợi lễ tân, không phải dashboard KPI chung chung.
- Mỗi action hiển thị rõ procedure SQL tương ứng.
- Có luồng: thêm khách -> tìm phòng trống -> đặt phòng -> nhận phòng -> dịch vụ -> hóa đơn/thanh toán.

Xem nhanh UI:
1. `standalone-demo/index.html` là bản preview tĩnh cũ.
2. Bản redesign đầy đủ nằm trong Next.js (`lumistay-next`), chạy theo hướng dẫn bên dưới.

Chạy Next.js:
1. cd lumistay-next
2. npm install
3. cp .env.example .env.local
4. npm run dev
5. Mở http://localhost:3000

Login demo:
- admin
- 123456

Muốn nối DB thật:
- Chạy schema/seed gốc, sau đó `lumistay-next/database/01_add_taikhoan.sql`, seed tài khoản và `03_web_hardening.sql` trong SQL Server.
- Tạo user `hotel_web` riêng, không dùng sa.
- Sửa `.env.local`: `USE_REAL_DB=true`, DB_HOST/DB_PORT là TCP endpoint của ngrok (không phải localhost trên Vercel), DB_USER/DB_PASSWORD/DB_NAME và JWT_SECRET.
- Test `/api/health-db` sau khi đăng nhập ops.
- Vercel chỉ deploy Next.js; máy bạn phải bật SQL Server + TCP tunnel trong lúc demo.

Điểm quan trọng:
- Java backend không bắt buộc phải bỏ. Với đồ án này, Next.js server/API route đã đủ làm BFF, còn procedure/view/trigger giữ nguyên ở SQL Server.
- Không thể deploy “SQL script” trực tiếp lên Vercel. Phải có SQL Server đang chạy và một đường TCP an toàn tới nó.
- Xem hướng dẫn chi tiết trong `lumistay-next/README.md`.
