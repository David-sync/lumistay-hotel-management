export default function RoomsLoading() {
  return <div className="animate-pulse space-y-4"><div className="h-20 max-w-2xl rounded-[6px] bg-[#E7E1D7]" />{[1, 2, 3].map((floor) => <section key={floor} className="overflow-hidden rounded-[6px] border border-[#D8D2C7] bg-[#FBFAF7]"><div className="h-10 border-b border-[#D8D2C7] bg-[#F0EDE7]" /><div className="grid grid-cols-2 gap-px bg-[#D8D2C7] sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">{[1, 2, 3, 4, 5].map((room) => <div key={room} className="h-20 bg-[#FBFAF7]" />)}</div></section>)}</div>;
}
