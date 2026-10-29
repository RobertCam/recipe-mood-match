export default function LoadingSpinner() {
  return (
    <div
      className="rounded-[28px] border border-stone-200/80 bg-white px-6 py-8 shadow-[0_24px_70px_-48px_rgba(68,32,8,0.7)] sm:px-10 sm:py-10"
      role="status"
      aria-live="polite"
    >
      <div className="h-6 w-28 animate-pulse rounded-full bg-orange-100" />
      <div className="mt-4 h-12 w-2/3 max-w-xl animate-pulse rounded-xl bg-stone-200" />
      <div className="mt-4 h-20 max-w-2xl animate-pulse rounded-xl bg-stone-100" />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-stone-100" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-28 animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-stone-100" />
        </div>
      </div>
      <p className="mt-8 text-sm text-stone-500">Finding something that fits this mood...</p>
    </div>
  );
}
