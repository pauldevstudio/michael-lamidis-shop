export default function ProductsLoading() {
  return (
    <div className="flex-1 p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-36 bg-white/[0.06] rounded-lg" />
          <div className="h-4 w-56 bg-white/[0.04] rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-white/[0.06] rounded-xl" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 flex-1 max-w-sm bg-white/[0.04] rounded-xl" />
        <div className="h-10 w-24 bg-white/[0.04] rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="aspect-square bg-white/[0.04]" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 bg-white/[0.06] rounded" />
              <div className="h-5 w-32 bg-white/[0.06] rounded" />
              <div className="h-6 w-20 bg-white/[0.06] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
