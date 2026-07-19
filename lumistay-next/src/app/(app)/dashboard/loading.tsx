export default function DashboardLoading() {
  return <div className="animate-pulse space-y-4"><div className="h-20 max-w-2xl rounded-[6px] bg-[#E7E1D7]" /><div className="grid grid-cols-2 overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7] sm:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-20 border-r border-[#E7E1D7] last:border-r-0" />)}</div><div className="grid gap-3 lg:grid-cols-2"><div className="h-72 rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]" /><div className="h-72 rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]" /></div></div>;
}
