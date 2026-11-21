
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CreditCard,
  RefreshCw,
  Search,
  CalendarDays,
  Store,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type Transaction = {
  _id: string;
  vendorId: string;
  plan: string;
  amount: number;
  currency?: string;
  status: string;
  createdAt: string;
  vendor?: {
    name?: string;
    email?: string;
    image?: string;
  };
};

export default function AdminTransactionsPage() {
  const { data: session } = authClient.useSession();
  const adminId = session?.user?.id;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = useCallback(
    async (refresh = false) => {
      if (!adminId) return;

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await fetch(
          `${API_URL}/admin/${adminId}/transactions`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load transactions");
        }

        setTransactions(
          Array.isArray(data) ? data : data.transactions || []
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not load transactions"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [adminId]
  );

  // Initial data fetching
  useEffect(() => {
    if (!adminId) return;

    let cancelled = false;

    const loadTransactions = async () => {
      try {
        const response = await fetch(
          `${API_URL}/admin/${adminId}/transactions`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load transactions");
        }

        if (!cancelled) {
          setTransactions(
            Array.isArray(data) ? data : data.transactions || []
          );
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not load transactions"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTransactions();

    return () => {
      cancelled = true;
    };
  }, [adminId]);

  const filteredTransactions = transactions.filter((transaction) => {
    const text = search.toLowerCase();

    return (
      transaction.vendor?.name?.toLowerCase().includes(text) ||
      transaction.vendor?.email?.toLowerCase().includes(text) ||
      transaction.vendorId?.toLowerCase().includes(text) ||
      transaction.plan?.toLowerCase().includes(text) ||
      transaction.status?.toLowerCase().includes(text)
    );
  });

  const statusStyle = (status: string) => {
    const value = status?.toLowerCase();

    if (
      ["paid", "active", "success", "succeeded", "completed"].includes(value)
    ) {
      return "bg-green-50 text-green-700";
    }

    if (
      ["failed", "cancelled", "canceled", "unpaid"].includes(value)
    ) {
      return "bg-red-50 text-red-600";
    }

    return "bg-amber-50 text-amber-700";
  };

  const totalAmount = transactions.reduce(
    (total, transaction) => total + Number(transaction.amount || 0),
    0
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#49333F]">
            Transactions
          </h2>
          <p className="mt-1 text-xs text-[#987B88]">
            View vendor subscription payments and transaction records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchTransactions(true)}
          disabled={loading || refreshing}
          className="flex items-center gap-2 rounded-lg border border-[#EEDFE5] bg-white px-3 py-2 text-xs font-semibold text-[#765D68] hover:bg-[#FFF5F8] disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[#F0E2E7] bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#987B88]">
              Total Transactions
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FCECF2] text-[#D96F96]">
              <CreditCard size={17} />
            </div>
          </div>

          <h3 className="mt-2 text-2xl font-bold text-[#49333F]">
            {loading ? "—" : transactions.length}
          </h3>

          <p className="mt-1 text-[10px] text-[#B49AA5]">
            All recorded payments
          </p>
        </div>

        <div className="rounded-xl border border-[#F0E2E7] bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#987B88]">
              Recorded Amount
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FCECF2] text-[#D96F96]">
              <Store size={17} />
            </div>
          </div>

          <h3 className="mt-2 text-2xl font-bold text-[#49333F]">
            {loading
              ? "—"
              : totalAmount.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
          </h3>

          <p className="mt-1 text-[10px] text-[#B49AA5]">
            Sum of transaction amounts (recorded currency values)
          </p>
        </div>
      </div>

      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B49AA5]"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search vendor, email, plan or status..."
          className="h-10 w-full rounded-lg border border-[#F0E2E7] bg-white pl-9 pr-3 text-xs text-[#49333F] outline-none focus:border-[#E477A0]"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#F0E2E7] bg-white">
        <div className="flex items-center justify-between border-b border-[#F0E2E7] px-4 py-3">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-[#D96F96]" />
            <h3 className="text-sm font-bold text-[#49333F]">
              Payment History
            </h3>
          </div>

          <span className="text-[11px] text-[#987B88]">
            {filteredTransactions.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-[#FFF9F6] text-[10px] uppercase tracking-wide text-[#987B88]">
              <tr>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Subscription Plan</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3">Transaction Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F5EAF0]">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-xs text-[#987B88]"
                  >
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-xs text-[#987B88]"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="text-xs hover:bg-[#FFFCFD]"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#49333F]">
                        {transaction.vendor?.name || "Vendor"}
                      </p>

                      <p className="mt-1 text-[10px] text-[#987B88]">
                        {transaction.vendor?.email || transaction.vendorId}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#FCECF2] px-2.5 py-1 text-[10px] font-semibold text-[#D96F96]">
                        {transaction.plan || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-bold text-[#49333F]">
                      {transaction.currency || "USD"}{" "}
                      {Number(transaction.amount || 0).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${statusStyle(
                          transaction.status
                        )}`}
                      >
                        {transaction.status || "Unknown"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-[#987B88]">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        {transaction.createdAt
                          ? new Date(
                              transaction.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
