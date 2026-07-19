export default function SearchLoading() {
  return (
    <div className="animate-pulse bg-[#f4f0e8] pb-16">
      <div className="h-28 border-b border-[#355b53] bg-[#183b35]" />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-8">
        <div className="h-64 border border-[#d5cec2] bg-[#fbf9f5]" />
        <div className="space-y-5"><div className="h-24 border-b border-[#d5cec2] bg-[#f4f0e8]" />{[1, 2, 3].map((item) => <div key={item} className="h-64 border border-[#d5cec2] bg-[#fbf9f5]" />)}</div>
      </div>
    </div>
  );
}
