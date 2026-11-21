
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  House,
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard/customer",
    icon: LayoutDashboard,
  },
  {
    title: "My Bookings",
    href: "/dashboard/customer/bookings",
    icon: CalendarCheck,
  },
];

export function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-[#F0E2E7] bg-white lg:flex">
        <div className="px-6 py-7">
          <Link href="/" className="text-2xl font-bold text-[#E477A0]">
            WedPlan
          </Link>

          <p className="mt-1 text-xs text-[#987B88]">
            Customer Dashboard
          </p>
        </div>

        <div className="px-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#B49AA5]">
            Workspace
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active =
                item.href === "/dashboard/customer"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#FCECF2] text-[#D96F96]"
                      : "text-[#765D68] hover:bg-[#FFF5F8] hover:text-[#D96F96]"
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
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#765D68] hover:bg-[#FFF5F8]"
          >
            <House size={19} />
            Back to Website
          </Link>
        </div>
      </aside>

      <div className="border-b border-[#F0E2E7] bg-white px-4 py-3 lg:hidden">
        <Link href="/" className="text-xl font-bold text-[#E477A0]">
          WedPlan
        </Link>

        <p className="mt-0.5 text-[11px] text-[#987B88]">
          Customer Dashboard
        </p>

        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard/customer"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                  active
                    ? "bg-[#FCECF2] text-[#D96F96]"
                    : "bg-[#FFF9F6] text-[#765D68]"
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
