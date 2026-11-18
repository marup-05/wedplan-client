
export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#FFF9F6]">
      {/* Hero Skeleton */}
      <section className="h-[650px] bg-[#EADDE1] md:h-[720px]" />

      {/* Featured Services Skeleton */}
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-md space-y-3 text-center">
            <div className="mx-auto h-3 w-32 rounded bg-[#EADDE1]" />
            <div className="mx-auto h-8 w-72 max-w-full rounded bg-[#EADDE1]" />
            <div className="mx-auto h-3 w-64 max-w-full rounded bg-[#EADDE1]" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-[#F0E3E7] bg-white"
              >
                <div className="h-56 bg-[#EADDE1]" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-28 rounded bg-[#EADDE1]" />
                  <div className="h-5 w-3/4 rounded bg-[#EADDE1]" />
                  <div className="h-4 w-1/2 rounded bg-[#EADDE1]" />
                  <div className="h-10 rounded-full bg-[#F5E8EC]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Sections Skeleton */}
      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="mx-auto h-8 w-64 rounded bg-[#EADDE1]" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-64 rounded-2xl bg-[#EADDE1]"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
