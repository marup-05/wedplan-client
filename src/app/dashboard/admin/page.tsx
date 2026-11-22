
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  UserRound,
  Store,
  BriefcaseBusiness,
  Clock,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { API_URL, getAuthHeaders } from "@/lib/api";

type DashboardStats = {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalServices: number;
  pendingServices: number;
  totalTransactions: number;
};

const initialStats: DashboardStats = {
  totalUsers: 0,
  totalVendors: 0,
  totalCustomers: 0,
  totalServices: 0,
  pendingServices: 0,
  totalTransactions: 0,
};

const statCards = [
  {
    title: "Total Registered Users",
    key: "totalUsers",
    icon: Users,
    description: "All registered accounts",
  },
  {
    title: "Total Vendors",
    key: "totalVendors",
    icon: Store,
    description: "Registered service providers",
  },
  {
    title: "Total Customers",
    key: "totalCustomers",
    icon: UserRound,
    description: "Registered customers",
  },
  {
    title: "Total Services",
    key: "totalServices",
    icon: BriefcaseBusiness,
    description: "All submitted services",
  },
  {
    title: "Pending Services",
    key: "pendingServices",
    icon: Clock,
    description: "Waiting for admin review",
  },
  {
    title: "Total Transactions",
    key: "totalTransactions",
    icon: CreditCard,
    description: "Recorded transactions",
  },
] as const;

export default function AdminDashboardPage() {
  const { data: session } = authClient.useSession();
  const adminId = session?.user?.id;

  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // API request function: এখানে কোনো React state update নেই
  const loadDashboardData = useCallback(async () => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/admin/dashboard`, {
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load dashboard");
    }

    return data as DashboardStats;
  }, []);

  // Initial dashboard data
  useEffect(() => {
    if (!adminId) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await loadDashboardData();

        if (isMounted) {
          setStats(data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not load dashboard"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [adminId, loadDashboardData]);

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const data = await loadDashboardData();
      setStats(data);
      toast.success("Dashboard refreshed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not refresh dashboard"
      );
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#49333F]">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-xs text-[#987B88]">
            Monitor and manage your WedPlan platform.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing || loading || !adminId}
          className="flex items-center gap-2 rounded-lg border border-[#EEDFE5] bg-white px-3 py-2 text-xs font-semibold text-[#765D68] transition hover:bg-[#FFF5F8] disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className="rounded-xl border border-[#F0E2E7] bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[#987B88]">
                    {card.title}
                  </p>

                  <h3 className="mt-3 text-2xl font-bold text-[#49333F]">
                    {loading ? (
                      <span className="inline-block h-7 w-12 animate-pulse rounded bg-[#FCECF2]" />
                    ) : (
                      stats[card.key].toLocaleString()
                    )}
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCECF2] text-[#D96F96]">
                  <Icon size={19} />
                </div>
              </div>

              <p className="mt-3 text-[11px] text-[#B49AA5]">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
