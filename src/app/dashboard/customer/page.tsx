
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  CalendarCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type DashboardData = {
  totalBookings: number;
  pendingBookings: number;
  acceptedBookings: number;
  rejectedBookings: number;
};

export default function CustomerDashboardPage() {
  const { data: session } = authClient.useSession();

  const [data, setData] = useState<DashboardData>({
    totalBookings: 0,
    pendingBookings: 0,
    acceptedBookings: 0,
    rejectedBookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const customerId = session?.user?.id;

    if (!customerId) return;

    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/customer/${customerId}/dashboard`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Dashboard load failed");
        }

        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const stats = [
    {
      title: "Total Booking Requests",
      value: data.totalBookings,
      description: "All your booking requests",
      icon: CalendarDays,
    },
    {
      title: "Pending Bookings",
      value: data.pendingBookings,
      description: "Waiting for vendor response",
      icon: Clock,
    },
    {
      title: "Accepted Bookings",
      value: data.acceptedBookings,
      description: "Successfully accepted",
      icon: CheckCircle2,
    },
    {
      title: "Rejected Bookings",
      value: data.rejectedBookings,
      description: "Requests not accepted",
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-[#D96F96]">
          Customer Dashboard
        </p>

        <h2 className="mt-1.5 text-xl font-bold text-[#49333F] md:text-2xl">
          Welcome to your workspace!
        </h2>

        <p className="mt-1.5 text-xs text-[#987B88]">
          Track your wedding bookings and manage your requests from here.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-[#F0E2E7] bg-white p-3.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-[#FCECF2] p-2 text-[#D96F96]">
                  <Icon size={17} />
                </div>

                <ArrowUpRight size={15} className="text-[#C5AAB5]" />
              </div>

              <h3 className="mt-3 text-xs font-medium text-[#987B88]">
                {stat.title}
              </h3>

              <p className="mt-1 text-2xl font-bold text-[#49333F]">
                {loading ? "—" : stat.value}
              </p>

              <p className="mt-1.5 text-[11px] text-[#B49AA5]">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-[#F0E2E7] bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#FCECF2] p-2.5 text-[#D96F96]">
              <CalendarCheck size={20} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#49333F]">
                My Bookings
              </h3>

              <p className="mt-1 text-xs text-[#987B88]">
                View your booking requests and their current status.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FCECF2] px-4 py-2.5 text-xs font-semibold text-[#D96F96] transition hover:bg-[#F8DFE9]"
          >
            View My Bookings
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
