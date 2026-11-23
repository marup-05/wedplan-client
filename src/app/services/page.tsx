
import { Suspense } from "react";
import { ServicesView } from "@/components/services/ServicesView";

export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesLoading />}>
      <ServicesView />
    </Suspense>
  );
}

function ServicesLoading() {
  return (
    <main className="min-h-screen bg-[#FFF9F6] dark:bg-[#15141B] px-5 py-16">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mx-auto mb-12 h-10 max-w-md rounded-lg bg-[#EADDE1] dark:bg-white/10" />
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-12 rounded-xl bg-[#EADDE1] dark:bg-white/10" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="overflow-hidden rounded-2xl bg-white dark:bg-[#1D1C24]">
              <div className="h-60 bg-[#EADDE1] dark:bg-white/10" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-1/2 rounded bg-[#EADDE1] dark:bg-white/10" />
                <div className="h-5 w-3/4 rounded bg-[#EADDE1] dark:bg-white/10" />
                <div className="h-10 rounded-lg bg-[#EADDE1] dark:bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
