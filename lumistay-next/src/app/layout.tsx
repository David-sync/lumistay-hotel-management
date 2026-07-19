import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LumiStay — Đặt phòng khách sạn",
  description: "Tìm và đặt phòng trực tuyến tại LumiStay với xác nhận nhanh chóng, rõ ràng và an toàn.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
