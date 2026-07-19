import type { Activity } from "@/lib/types";

export function ActivityFeed({ items }: { items: Activity[] }) {
  return (
    <section className="ops-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5"><div><h2 className="text-base font-bold text-slate-900">Nhật ký ca trực</h2><p className="mt-0.5 text-xs text-slate-500">Các thay đổi gần đây</p></div><span className="rounded bg-slate-100 px-2 py-1 font-mono text-[10px] text-slate-500">AUDIT_LOG</span></div>
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 px-4 py-3.5 sm:px-5">
            <time className="w-10 shrink-0 pt-0.5 text-xs font-semibold tabular-nums text-slate-400">{item.time}</time>
            <div className="relative min-w-0 flex-1 border-l border-slate-200 pl-4"><span className="absolute -left-1 top-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" /><p className="text-sm font-semibold text-slate-800">{item.title}</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{item.description}</p><span className="mt-1.5 inline-flex rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-500">{item.tableName}</span></div>
          </div>
        ))}
        {items.length === 0 ? <p className="px-5 py-10 text-center text-sm text-slate-500">Chưa có hoạt động trong ca.</p> : null}
      </div>
    </section>
  );
}
