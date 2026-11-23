
"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  CalendarCheck,
  Crown,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { API_URL, getAuthHeaders } from "@/lib/api";

type DashboardData = {
  totalServices: number;
  activeServices: number;
  pendingRequests: number;
  acceptedBookings: number;
  subscriptionPlan: string;
};

const initialDashboardData: DashboardData = {
  totalServices: 0,
  activeServices: 0,
  pendingRequests: 0,
  acceptedBookings: 0,
  subscriptionPlan: "Free",
};

export default function VendorDashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  const [data, setData] = useState<DashboardData>(
    initialDashboardData,
  );

  const [fetching, setFetching] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const userId = session?.user?.id;

  useEffect(() => {
    if (isPending || !userId) return;

    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setFetching(true);

        const headers = await getAuthHeaders();

        const response = await fetch(`${API_URL}/vendor/dashboard`, {
          headers,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Dashboard load failed");
        }

        if (isMounted) {
          setData({
            totalServices: result.totalServices ?? 0,
            activeServices: result.activeServices ?? 0,
            pendingRequests: result.pendingRequests ?? 0,
            acceptedBookings: result.acceptedBookings ?? 0,
            subscriptionPlan: result.subscriptionPlan ?? "Free",
          });
        }
      } catch (error) {
        if (isMounted) {
          console.error("Dashboard error:", error);
        }
      } finally {
        if (isMounted) {
          setFetching(false);
          setFetchCompleted(true);
        }
      }
    };

    void fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [userId, isPending]);

  const loading =
    isPending || (!!userId && (!fetchCompleted || fetching));

  const stats = [
    {
      title: "Total Services",
      value: data.totalServices,
      description: "All submitted services",
      icon: BriefcaseBusiness,
    },
    {
      title: "Active Services",
      value: data.activeServices,
      description: "Approved and active services",
      icon: CheckCircle2,
    },
    {
      title: "Pending Requests",
      value: data.pendingRequests,
      description: "Waiting for your response",
      icon: Clock,
    },
    {
      title: "Accepted Bookings",
      value: data.acceptedBookings,
      description: "Successfully accepted",
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-[#D96F96]">
          Vendor Dashboard
        </p>

        <h2 className="mt-1.5 text-xl font-bold text-[#49333F] dark:text-gray-100 md:text-2xl">
          Welcome to your workspace!
        </h2>

        <p className="mt-1.5 text-xs text-[#987B88] dark:text-gray-400">
          Manage your wedding services and booking requests from here.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#1D1C24] p-3.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-[#FCECF2] dark:bg-white/10 p-2 text-[#D96F96]">
                  <Icon size={17} />
                </div>

                <ArrowUpRight
                  size={15}
                  className="text-[#C5AAB5] dark:text-gray-500"
                />
              </div>

              <h3 className="mt-3 text-xs font-medium text-[#987B88] dark:text-gray-400">
                {stat.title}
              </h3>

              <p className="mt-1 text-2xl font-bold text-[#49333F] dark:text-gray-100">
                {loading ? "—" : stat.value}
              </p>

              <p className="mt-1.5 text-[11px] text-[#B49AA5] dark:text-gray-500">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#1D1C24] p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#FCECF2] dark:bg-white/10 p-2.5 text-[#D96F96]">
            <Crown size={19} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#49333F] dark:text-gray-100">
              Your Current Plan
            </h3>

            <p className="text-xs text-[#987B88] dark:text-gray-400">
              {loading
                ? "Loading..."
                : `${data.subscriptionPlan} Plan`}
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs text-[#765D68] dark:text-gray-300">
          {data.subscriptionPlan === "Premium"
            ? "You have unlimited active services with your Premium Plan."
            : "You can publish up to 3 active services with your Free Plan."}
        </p>

        <Link
          href="/dashboard/vendor/subscription"
          className="mt-4 inline-flex rounded-lg bg-[#FCECF2] dark:bg-white/10 px-3.5 py-2 text-xs font-semibold text-[#D96F96] hover:bg-[#F8DFE9] dark:hover:bg-white/15"
        >
          Manage Subscription
        </Link>
      </div>
    </div>
  );
}
