export default function SearchLoading() {
  return (
    <div className="animate-pulse bg-gray-50 pb-16">
      <div className="h-28 bg-[#003580]" />
      <div className="mx-auto grid max-w-7xl gap-7 px-4 py-8 lg:grid-cols-[250px_minmax(0,1fr)] md:px-6">
        <div className="h-64 rounded-xl bg-white shadow-sm ring-1 ring-gray-200" />
        <div className="space-y-5">
          <div className="h-24 rounded-xl bg-white ring-1 ring-gray-200" />
          {[1, 2, 3].map((item) => <div key={item} className="h-64 rounded-xl bg-white ring-1 ring-gray-200" />)}
        </div>
      </div>
    </div>
  );
}
