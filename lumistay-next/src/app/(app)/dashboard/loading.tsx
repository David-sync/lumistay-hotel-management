export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-24 max-w-2xl rounded-lg bg-slate-200" />
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-28 rounded-xl bg-white ring-1 ring-slate-200" />)}</div>
      <div className="grid gap-5 2xl:grid-cols-[1.2fr_.8fr]"><div className="h-96 rounded-xl bg-white ring-1 ring-slate-200" /><div className="h-96 rounded-xl bg-white ring-1 ring-slate-200" /></div>
    </div>
  );
}
