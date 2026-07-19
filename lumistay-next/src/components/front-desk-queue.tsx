import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";
import type { FrontDeskTask } from "@/lib/types";
import { cn } from "@/lib/utils";

const priorityClass = {
  "Cao": "border-rose-200 bg-rose-50 text-rose-700",
  "Vừa": "border-amber-200 bg-amber-50 text-amber-700",
  "Thấp": "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function FrontDeskQueue({ tasks }: { tasks: FrontDeskTask[] }) {
  return (
    <section className="ops-card overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
        <div><h2 className="text-base font-bold text-slate-900">Hàng đợi ưu tiên</h2><p className="mt-0.5 text-xs text-slate-500">Các đầu việc cần bàn giao trong ca</p></div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{tasks.length} việc</span>
      </div>
      <div className="divide-y divide-slate-100">
        {tasks.map((task, index) => (
          <article key={task.id} className="p-4 transition hover:bg-slate-50 sm:px-5">
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 ring-1 ring-slate-200">
                {task.priority === "Cao" ? <AlertTriangle className="h-4 w-4 text-rose-500" /> : index % 2 ? <Clock3 className="h-4 w-4 text-amber-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="font-semibold text-slate-900">{task.title}</h3><span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold", priorityClass[task.priority])}>{task.priority}</span></div>
                <p className="mt-1 text-sm leading-5 text-slate-500">{task.description}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="rounded bg-slate-100 px-2 py-1 font-semibold text-slate-600">{task.time}</span>
                  <span className="rounded bg-slate-100 px-2 py-1 font-semibold text-slate-600">{task.target}</span>
                  <span className="rounded bg-blue-50 px-2 py-1 font-mono font-semibold text-blue-700">{task.procedure}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
        {tasks.length === 0 ? <p className="px-5 py-10 text-center text-sm text-slate-500">Ca trực không có việc tồn đọng.</p> : null}
      </div>
    </section>
  );
}
