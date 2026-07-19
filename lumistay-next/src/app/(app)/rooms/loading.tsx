export default function RoomsLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-24 max-w-2xl rounded-lg bg-slate-200" />
      {[1, 2, 3].map((floor) => <section key={floor} className="rounded-xl bg-white p-5 ring-1 ring-slate-200"><div className="h-6 w-40 rounded bg-slate-200" /><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((room) => <div key={room} className="h-36 rounded-lg bg-slate-100" />)}</div></section>)}
    </div>
  );
}
