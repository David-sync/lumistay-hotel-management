import type { ReportRow } from "@/lib/types";

export function MiniBarChart({ data, title = "Doanh thu theo tháng" }: { data: ReportRow[]; title?: string }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <section className="ops-card overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
        <div><h2 className="text-base font-bold text-slate-900">{title}</h2><p className="mt-0.5 font-mono text-[10px] text-slate-400">v_DoanhThuThang</p></div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500">triệu VND</span>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex h-60 items-end gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-3 pb-3 pt-5 sm:gap-3 sm:px-4">
          {data.map((item) => (
            <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2 text-center">
              <span className="text-[10px] font-semibold tabular-nums text-slate-500 sm:text-xs">{item.value}</span>
              <div className="mx-auto w-full max-w-12 rounded-t bg-blue-600 transition hover:bg-blue-700" style={{ height: `${Math.max(10, (item.value / max) * 170)}px` }} title={`${item.label}: ${item.value} triệu VND`} />
              <span className="truncate text-[10px] text-slate-500 sm:text-xs">{item.label}</span>
            </div>
          ))}
        </div>
        {data.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">Chưa có dữ liệu doanh thu.</p> : null}
      </div>
    </section>
  );
}
