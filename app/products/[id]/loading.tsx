/**
 * Instant skeleton shown while a product page loads — on-demand renders (a
 * brand-new product not yet pre-rendered) or slow networks. Pre-rendered
 * products are edge-cached and navigate instantly, so this rarely shows; it
 * exists so a click NEVER feels like a dead, blank wait.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Placeholder for the fixed navbar height */}
      <div className="h-[60px] border-b border-navy-100/60" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10">
        {/* Breadcrumb */}
        <div className="h-4 w-44 bg-navy-100/70 rounded mb-8 animate-pulse" />

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl bg-navy-100/60 animate-pulse" />
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-16 w-16 rounded-lg bg-navy-100/50 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Info column */}
          <div className="space-y-4">
            <div className="h-3 w-24 bg-navy-100/70 rounded animate-pulse" />
            <div className="h-9 w-3/4 bg-navy-100/70 rounded animate-pulse" />
            <div className="h-5 w-44 bg-navy-100/60 rounded animate-pulse" />
            <div className="h-10 w-52 bg-navy-100/70 rounded animate-pulse mt-2" />
            <div className="space-y-2 pt-4">
              <div className="h-3 w-full bg-navy-100/50 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-navy-100/50 rounded animate-pulse" />
              <div className="h-3 w-4/6 bg-navy-100/50 rounded animate-pulse" />
            </div>
            <div className="h-12 w-full bg-navy-100/70 rounded-xl animate-pulse mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
