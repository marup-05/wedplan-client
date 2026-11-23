
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  BriefcaseBusiness,
  CalendarCheck,
  Crown,
  House,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/api";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard/vendor",
    icon: LayoutDashboard,
  },
  {
    title: "Add Service",
    href: "/dashboard/vendor/services/new",
    icon: PlusCircle,
  },
  {
    title: "My Services",
    href: "/dashboard/vendor/services",
    icon: BriefcaseBusiness,
  },
  {
    title: "Booking Requests",
    href: "/dashboard/vendor/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Subscription",
    href: "/dashboard/vendor/subscription",
    icon: Crown,
  },
];

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
        plan === "Premium"
          ? "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300"
          : "bg-[#FCECF2] dark:bg-white/10 text-[#D96F96]"
      }`}
    >
      {plan === "Premium" && <Crown size={11} />}
      {plan}
    </span>
  );
}

export function VendorSidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const [plan, setPlan] = useState("Free");

  useEffect(() => {
    if (!session?.user?.id) return;

    let cancelled = false;

    const fetchSubscription = async () => {
      try {
        const headers = await getAuthHeaders();

        const response = await fetch(
          `${API_URL}/vendor/subscription`,
          { headers }
        );

        if (!response.ok) {
          throw new Error("Failed to load subscription");
        }

        const data = await response.json();

        if (!cancelled) {
          setPlan(data.plan || "Free");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Subscription error:", error);
        }
      }
    };

    void fetchSubscription();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  return (
    <>
      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#1D1C24] lg:flex">
        <div className="px-6 py-7">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-2xl font-bold text-[#E477A0]"
            >
              WedPlan
            </Link>

            <PlanBadge plan={plan} />
          </div>

          <p className="mt-1 text-xs text-[#987B88] dark:text-gray-400">
            Vendor Dashboard
          </p>
        </div>

        <div className="px-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#B49AA5] dark:text-gray-500">
            Workspace
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active =
                item.href === "/dashboard/vendor"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#FCECF2] dark:bg-white/10 text-[#D96F96]"
                      : "text-[#765D68] dark:text-gray-300 hover:bg-[#FFF5F8] dark:hover:bg-white/10 hover:text-[#D96F96]"
                  }`}
                >
                  <Icon size={19} />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#765D68] dark:text-gray-300 hover:bg-[#FFF5F8] dark:hover:bg-white/10"
          >
            <House size={19} />
            Back to Website
          </Link>
        </div>
      </aside>

      <div className="border-b border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#1D1C24] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xl font-bold text-[#E477A0]"
          >
            WedPlan
          </Link>

          <PlanBadge plan={plan} />
        </div>

        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard/vendor"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                  active
                    ? "bg-[#FCECF2] dark:bg-white/10 text-[#D96F96]"
                    : "bg-[#FFF9F6] dark:bg-white/5 text-[#765D68] dark:text-gray-300"
                }`}
              >
                <Icon size={16} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
