import type { ReactNode } from "react";

export function PageHeader({ title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="mb-5 flex flex-col gap-3 border-b border-[#D8D2C7] pb-4 sm:mb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-[25px] font-bold tracking-[-0.02em] text-[#183B35] md:text-[28px]">{title}</h1>
        {description ? <p className="mt-1 text-[13px] leading-5 text-[#716B61]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
