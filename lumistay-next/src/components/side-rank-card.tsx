import type { ReportRow } from "@/lib/types";

export function SideRankCard({ title, subtitle, rows }: { title: string; subtitle: string; rows: ReportRow[] }) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <section className="ops-card overflow-hidden">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-5"><h2 className="text-base font-bold text-slate-900">{title}</h2><p className="mt-0.5 font-mono text-[10px] text-slate-400">{subtitle}</p></div>
      <div className="space-y-4 p-4 sm:p-5">
        {rows.map((row, index) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <div className="flex min-w-0 items-center gap-2"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">{index + 1}</span><span className="truncate font-semibold text-slate-700">{row.label}</span></div>
              <span className="shrink-0 font-bold tabular-nums text-slate-900">{row.value}{row.note ? ` ${row.note}` : ""}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(5, (row.value / max) * 100)}%` }} /></div>
          </div>
        ))}
        {rows.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">Chưa có dữ liệu xếp hạng.</p> : null}
      </div>
    </section>
  );
}
