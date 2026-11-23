
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Eye,
  X,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { API_URL, getAuthHeaders } from "@/lib/api";

type Booking = {
  _id: string;
  serviceId: string;
  vendorId: string;
  eventDate: string;
  eventLocation: string;
  status: string;
  createdAt: string;
  service?: {
    serviceName?: string;
    images?: string[];
  };
  vendor?: {
    name?: string;
    businessName?: string;
    email?: string;
    image?: string;
  };
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Accepted:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Rejected: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    Cancelled: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",
  };

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CustomerBookingsPage() {
  const { data: session } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const customerId = session?.user?.id;

  const requestBookings = useCallback(async (): Promise<Booking[]> => {
    if (!customerId) return [];

    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/customer/bookings`, {
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to load bookings");
    }

    return Array.isArray(result) ? result : result.bookings || [];
  }, [customerId]);

  useEffect(() => {
    if (!customerId) return;

    let cancelled = false;

    const loadBookings = async () => {
      try {
        const data = await requestBookings();

        if (!cancelled) {
          setBookings(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadBookings();

    return () => {
      cancelled = true;
    };
  }, [customerId, requestBookings]);

  const fetchBookings = useCallback(async () => {
    if (!customerId) return;

    try {
      setLoading(true);
      setError("");

      const data = await requestBookings();

      setBookings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [customerId, requestBookings]);

  const handleCancel = async () => {
    if (!selectedBooking || !customerId) return;

    try {
      setCancelling(true);

      const headers = await getAuthHeaders();

      const response = await fetch(
        `${API_URL}/customer/bookings/${selectedBooking._id}/cancel`,
        {
          method: "PATCH",
          headers,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Could not cancel booking"
        );
      }

      toast.success("Booking cancelled successfully");

      setSelectedBooking(null);

      await fetchBookings();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to cancel booking"
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="border-b border-[#EAE5E5] dark:border-white/10 pb-4">
        <h1 className="font-serif text-2xl font-bold text-[#272326] dark:text-gray-100">
          My Bookings
        </h1>

        <p className="mt-1 text-xs leading-5 text-[#8B8589] dark:text-gray-400">
          View all your submitted booking requests and cancel pending inquiries if plans change.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          {error}

          <button
            onClick={() => void fetchBookings()}
            className="ml-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-[#EEE9E9] dark:border-white/10 bg-white dark:bg-[#1D1C24]">
          <Loader2
            className="animate-spin text-[#963348] dark:text-[#E88BAA]"
            size={25}
          />
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-[#EEE9E9] dark:border-white/10 bg-white dark:bg-[#1D1C24] px-5 text-center">
          <div className="rounded-full bg-[#FCECF2] dark:bg-white/10 p-4 text-[#963348] dark:text-[#E88BAA]">
            <CalendarCheck size={28} />
          </div>

          <h3 className="mt-4 font-serif text-lg font-semibold text-[#49333F] dark:text-gray-100">
            No Bookings Yet
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-[#987B88] dark:text-gray-400">
            You haven't sent any booking requests yet. Explore services and
            find the perfect vendors for your wedding.
          </p>

          <Link
            href="/services"
            className="mt-4 rounded-lg bg-[#963348] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#7F293B]"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const image = booking.service?.images?.[0];

            return (
              <div
                key={booking._id}
                className="rounded-xl border border-[#EAE5E5] dark:border-white/10 bg-white dark:bg-[#1D1C24] px-3 py-3 shadow-sm transition hover:shadow-md sm:px-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#FFF5F8] dark:bg-white/5">
                    {image ? (
                      <Image
                        src={image}
                        alt={booking.service?.serviceName || "Service"}
                        width={80}
                        height={64}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-[#B49AA5] dark:text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-sm font-bold text-[#292326] dark:text-gray-100">
                        {booking.service?.serviceName || "Service"}
                      </h3>

                      <StatusBadge status={booking.status} />
                    </div>

                    <p className="mt-1 text-[11px] text-[#777075] dark:text-gray-400">
                      Vendor:{" "}
                      <span className="font-medium text-[#51464B] dark:text-gray-200">
                        {booking.vendor?.businessName ||
                          booking.vendor?.name ||
                          "Not available"}
                      </span>
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="flex items-center gap-1 text-[10px] text-[#81777D] dark:text-gray-400">
                        <CalendarDays size={12} className="shrink-0" />
                        Event: {formatDate(booking.eventDate)}
                      </p>

                      <p className="flex items-center gap-1 text-[10px] text-[#81777D] dark:text-gray-400">
                        <MapPin size={12} className="shrink-0" />
                        <span className="max-w-36 truncate">
                          {booking.eventLocation || "Location not available"}
                        </span>
                      </p>

                      <p className="text-[10px] text-[#81777D] dark:text-gray-400">
                        Requested: {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    <Link
                      href={`/dashboard/customer/bookings/${booking._id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E9E3E3] dark:border-white/10 bg-white dark:bg-[#1D1C24] px-3 py-2 text-[11px] font-semibold text-[#51464B] dark:text-gray-200 transition hover:border-[#963348] dark:hover:border-[#E88BAA] hover:bg-[#FFF5F8] dark:hover:bg-white/10 hover:text-[#963348] dark:hover:text-[#E88BAA]"
                    >
                      <Eye size={13} />
                      Details
                    </Link>

                    {booking.status === "Pending" && (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-[11px] font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                      >
                        <X size={13} />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1D1C24] p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#49333F] dark:text-gray-100">
                Cancel Booking?
              </h3>

              <button
                onClick={() => setSelectedBooking(null)}
                disabled={cancelling}
                className="rounded-lg p-1 text-[#987B88] dark:text-gray-400 hover:bg-[#FFF5F8] dark:hover:bg-white/10"
              >
                <X size={19} />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-[#987B88] dark:text-gray-400">
              Are you sure you want to cancel this booking request? This
              action cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setSelectedBooking(null)}
                disabled={cancelling}
                className="rounded-lg border border-[#F0E2E7] dark:border-white/10 px-4 py-2.5 text-xs font-semibold text-[#765D68] dark:text-gray-300 hover:bg-[#FFF9F6] dark:hover:bg-white/10"
              >
                Keep Booking
              </button>

              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {cancelling && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
