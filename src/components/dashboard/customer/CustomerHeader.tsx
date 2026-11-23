
"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; description: string }> = {
  "/dashboard/customer": {
    title: "Overview",
    description: "Keep track of your wedding booking requests.",
  },
  "/dashboard/customer/bookings": {
    title: "My Bookings",
    description: "View and manage all your booking requests.",
  },
};

export function CustomerHeader() {
  const pathname = usePathname();

  const page = pageTitles[pathname] || {
    title: "Booking Details",
    description: "View your booking information.",
  };

  return (
    <header className="flex min-h-[76px] items-center border-b border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#1D1C24] px-5 md:px-8">
      <div>
        <h1 className="text-lg font-bold text-[#49333F] dark:text-gray-100">
          {page.title}
        </h1>
        <p className="mt-1 text-xs text-[#987B88] dark:text-gray-400">
          {page.description}
        </p>
      </div>
    </header>
  );
}
