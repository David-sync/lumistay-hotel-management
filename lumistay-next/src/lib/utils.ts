import { clsx, type ClassValue } from "clsx";
import type { BookingStatus, RoomStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatShortMoney(value: number) {
  if (value >= 1_000_000) return `${Number((value / 1_000_000).toFixed(1))}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 0);
}

export function statusTone(status: RoomStatus | BookingStatus | string) {
  switch (status) {
    case "Trống":
    case "Đã thanh toán":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Đang thuê":
    case "Đã nhận phòng":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "Đã đặt":
    case "Chờ nhận phòng":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Chờ trả phòng":
    case "Chưa thanh toán":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "Đang sửa chữa":
    case "Đã hủy":
      return "border-slate-200 bg-slate-100 text-slate-600";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export function statusDot(status: string) {
  switch (status) {
    case "Trống":
      return "bg-emerald-500";
    case "Đang thuê":
      return "bg-sky-500";
    case "Đã đặt":
      return "bg-amber-500";
    case "Đang sửa chữa":
      return "bg-slate-400";
    default:
      return "bg-slate-400";
  }
}
