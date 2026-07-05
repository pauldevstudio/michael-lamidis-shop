export default function AdminLoading() {
  return (
    <div className="flex-1 p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-white/[0.06] rounded-lg" />
        <div className="h-4 w-72 bg-white/[0.04] rounded-lg" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
            <div className="h-7 w-16 bg-white/[0.06] rounded" />
            <div className="h-3 w-24 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>

      {/* Content area skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.06] h-16" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.06] h-14" />
          ))}
        </div>
      </div>
    </div>
  );
}
