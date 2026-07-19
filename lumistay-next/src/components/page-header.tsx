import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:mb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ops-accent">{eyebrow}</p> : null}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-[28px]">{title}</h1>
        {description ? <p className="mt-1.5 text-sm leading-5 text-slate-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
