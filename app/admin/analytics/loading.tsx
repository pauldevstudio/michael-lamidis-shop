export default function AnalyticsLoading() {
  return (
    <div className="flex-1 p-6 space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-white/[0.06] rounded-lg" />
        <div className="h-4 w-52 bg-white/[0.04] rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06] space-y-3">
            <div className="h-4 w-20 bg-white/[0.06] rounded" />
            <div className="h-8 w-16 bg-white/[0.06] rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6 h-64" />
    </div>
  );
}
