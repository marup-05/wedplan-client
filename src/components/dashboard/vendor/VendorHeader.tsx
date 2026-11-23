
"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; description: string }> = {
  "/dashboard/vendor": {
    title: "Overview",
    description: "Manage your wedding business from one place.",
  },
  "/dashboard/vendor/services/new": {
    title: "Add New Service",
    description: "Showcase your wedding services to customers.",
  },
  "/dashboard/vendor/services": {
    title: "My Services",
    description: "View and manage all your submitted services.",
  },
  "/dashboard/vendor/bookings": {
    title: "Booking Requests",
    description: "Manage booking requests from your customers.",
  },
  "/dashboard/vendor/subscription": {
    title: "Subscription",
    description: "Manage your WedPlan subscription.",
  },
};

export function VendorHeader() {
  const pathname = usePathname();
  const page = pageTitles[pathname] || pageTitles["/dashboard/vendor"];

  return (
    <header className="flex min-h-[76px] items-center border-b border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#15141B] px-5 md:px-8">
      <div>
        <h1 className="text-lg font-bold text-[#49333F] dark:text-gray-100">{page.title}</h1>
        <p className="mt-1 text-xs text-[#987B88] dark:text-gray-400">{page.description}</p>
      </div>
    </header>
  );
}
