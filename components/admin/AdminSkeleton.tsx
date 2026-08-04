/**
 * Placeholder blocks shown while admin data is in flight.
 *
 * Two jumps used to happen on every navigation: an empty page while the route
 * resolved, then an empty table while the client fetched from Supabase. These
 * fill both gaps so the layout stays put and only the content fades in.
 */

export function SkeletonBar({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-warm-neutral/70 ${className}`} />
  );
}

/** Heading + subtitle placeholder, matching the manager page headers. */
export function SkeletonHeader() {
  return (
    <div>
      <SkeletonBar className="h-8 w-52" />
      <SkeletonBar className="mt-3 h-4 w-72 max-w-full" />
    </div>
  );
}

/** Row of stat cards, used by the dashboard and the finance summary. */
export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-warm-neutral bg-white/70 p-4 sm:p-6"
        >
          <SkeletonBar className="h-3 w-20" />
          <SkeletonBar className="mt-3 h-6 w-28" />
        </div>
      ))}
    </div>
  );
}

/** Table placeholder that keeps the same height as a populated table. */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-warm-neutral bg-white shadow-sm sm:mt-6">
      <div className="border-b border-warm-neutral/60 bg-warm-neutral/40 px-5 py-3">
        <SkeletonBar className="h-3 w-32" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-t border-warm-neutral/60 px-5 py-4"
        >
          <SkeletonBar className="h-3 flex-1" />
          <SkeletonBar className="hidden h-3 w-24 sm:block" />
          <SkeletonBar className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * Placeholder `<tr>` rows, so a manager's table keeps its header and height
 * while the first Supabase read is in flight instead of flashing empty.
 */
export function SkeletonRows({ cols, rows = 4 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-t border-warm-neutral/60">
          <td colSpan={cols} className="px-5 py-4">
            <SkeletonBar className="h-3 w-full" />
          </td>
        </tr>
      ))}
    </>
  );
}

/** Whole-page fallback used by the admin route's loading.tsx. */
export default function AdminSkeleton() {
  return (
    <div>
      <SkeletonHeader />
      <SkeletonCards />
      <SkeletonTable />
    </div>
  );
}
