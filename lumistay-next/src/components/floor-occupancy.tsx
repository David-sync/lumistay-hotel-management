import type { FloorSummary } from "@/lib/types";

export function FloorOccupancy({ floors }: { floors: FloorSummary[] }) {
  return (
    <section className="ops-card overflow-hidden">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-5"><h2 className="text-base font-bold text-slate-900">Công suất theo tầng</h2><p className="mt-0.5 text-xs text-slate-500">Phân bổ trạng thái phòng hiện tại</p></div>
      <div className="space-y-4 p-4 sm:p-5">
        {floors.map((floor) => {
          const total = Math.max(floor.total, 1);
          const occupiedRate = Math.round(((floor.occupied + floor.reserved) / total) * 100);
          return (
            <div key={floor.floor}>
              <div className="mb-2 flex items-end justify-between gap-3"><div><span className="text-sm font-semibold text-slate-800">Tầng {floor.floor}</span><span className="ml-2 text-xs text-slate-400">{floor.total} phòng</span></div><span className="text-xs font-semibold text-slate-600">{occupiedRate}% khai thác</span></div>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100" aria-label={`Tầng ${floor.floor}: ${floor.free} phòng trống, ${floor.occupied} đang thuê, ${floor.reserved} đã đặt, ${floor.maintenance} bảo trì`}>
                <div className="bg-emerald-500" style={{ width: `${(floor.free / total) * 100}%` }} />
                <div className="bg-sky-500" style={{ width: `${(floor.occupied / total) * 100}%` }} />
                <div className="bg-amber-400" style={{ width: `${(floor.reserved / total) * 100}%` }} />
                <div className="bg-slate-400" style={{ width: `${(floor.maintenance / total) * 100}%` }} />
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2 text-center text-[10px] text-slate-500"><span><b className="block text-xs text-emerald-700">{floor.free}</b>Trống</span><span><b className="block text-xs text-sky-700">{floor.occupied}</b>Đang ở</span><span><b className="block text-xs text-amber-700">{floor.reserved}</b>Đã đặt</span><span><b className="block text-xs text-slate-600">{floor.maintenance}</b>Bảo trì</span></div>
            </div>
          );
        })}
        {floors.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">Chưa có dữ liệu công suất.</p> : null}
      </div>
    </section>
  );
}
