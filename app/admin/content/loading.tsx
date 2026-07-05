export default function ContentLoading() {
  return (
    <div className="flex-1 p-6 space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-40 bg-white/[0.06] rounded-lg" />
        <div className="h-4 w-64 bg-white/[0.04] rounded-lg" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-white/[0.04] rounded-lg" />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-white/[0.06] rounded" />
            <div className="h-10 bg-white/[0.03] rounded-xl border border-white/[0.06]" />
          </div>
        ))}
      </div>
    </div>
  );
}
