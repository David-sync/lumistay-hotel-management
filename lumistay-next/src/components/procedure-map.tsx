import { ArrowRight } from "lucide-react";

const steps = [
  { title: "Hồ sơ khách", table: "KHACHHANG", procedure: "USP_THEM_KHACH_HANG" },
  { title: "Kiểm tra phòng", table: "PHONG · LOAIPHONG", procedure: "USP_TIM_PHONG_TRONG_THEO_LOAI_P" },
  { title: "Đặt phòng", table: "BOOKING · CTBK", procedure: "USP_DAT_PHONG" },
  { title: "Nhận phòng", table: "PHONG.TRANGTHAI", procedure: "USP_NHAN_PHONG" },
  { title: "Ghi nhận dịch vụ", table: "SUDUNG_DV · CTHD_DV", procedure: "USP_THUE_DICH_VU" },
  { title: "Thu tiền & trả phòng", table: "HOADON", procedure: "USP_THANH_TOAN_HD · USP_TRA_PHONG" },
];

export function ProcedureMap() {
  return (
    <section className="ops-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-4 sm:px-5"><div><h2 className="text-base font-bold text-slate-900">Chuỗi nghiệp vụ lưu trú</h2><p className="mt-0.5 text-xs text-slate-500">Thứ tự kiểm soát từ hồ sơ đến trả phòng</p></div><span className="rounded bg-slate-100 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wide text-slate-500">Technical audit</span></div>
      <div className="grid gap-px bg-slate-200 sm:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.procedure} className="bg-white p-4">
            <div className="flex items-center justify-between"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-ops-primary">{index + 1}</span>{index < steps.length - 1 ? <ArrowRight className="h-3.5 w-3.5 text-slate-300" /> : null}</div>
            <h3 className="mt-3 text-sm font-semibold text-slate-800">{step.title}</h3>
            <p className="mt-0.5 text-[10px] text-slate-400">{step.table}</p>
            <p className="mt-2 break-words font-mono text-[9px] font-semibold leading-4 text-blue-700">{step.procedure}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
