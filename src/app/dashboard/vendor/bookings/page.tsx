
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { API_URL, getAuthHeaders } from "@/lib/api";
import { toast } from "sonner";
import {
  CalendarDays,
  MapPin,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

type Booking = {
  _id: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: string;
  createdAt: string;
  service?: {
    serviceName?: string;
    images?: string[];
    price?: number;
  };
  customer?: {
    name?: string;
    email?: string;
    image?: string;
  };
};

export default function VendorBookingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState("");

  const loadBookings = useCallback(async () => {
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/vendor/bookings`, {
        headers: await getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load bookings");
      }

      setBookings(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not load bookings"
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isPending) return;

    let cancelled = false;

    const fetchBookings = async () => {
      if (!userId) {
        if (!cancelled) {
          setBookings([]);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${API_URL}/vendor/bookings`, {
          headers: await getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load bookings");
        }

        if (!cancelled) {
          setBookings(data);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not load bookings"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchBookings();

    return () => {
      cancelled = true;
    };
  }, [userId, isPending]);

  const updateStatus = async (
    bookingId: string,
    status: "Accepted" | "Rejected"
  ) => {
    if (!userId) return;

    setProcessing(bookingId);

    try {
      const response = await fetch(
        `${API_URL}/vendor/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: await getAuthHeaders(),
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not update booking");
      }

      toast.success(`Booking ${status.toLowerCase()} successfully`);
      await loadBookings();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Update failed"
      );
    } finally {
      setProcessing("");
    }
  };

  const badge = (status: string) => {
    if (status === "Accepted") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    if (status === "Cancelled") return "bg-gray-100 text-gray-600";
    return "bg-amber-100 text-amber-700";
  };

  if (isPending || loading) {
    return (
      <p className="py-20 text-center text-sm text-[#987B88]">
        Loading booking requests...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#49333F]">
            Booking Requests
          </h2>
          <p className="mt-1 text-sm text-[#987B88]">
            Review and manage customer booking requests.
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="flex items-center gap-2 rounded-xl border border-[#EEDFE5] bg-white px-4 py-2.5 text-sm text-[#765D68]"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EEDFE5] bg-white px-5 py-16 text-center">
          <CalendarDays
            className="mx-auto text-[#D96F96]"
            size={34}
          />

          <h3 className="mt-3 font-semibold text-[#49333F]">
            No booking requests yet
          </h3>

          <p className="mt-1 text-sm text-[#987B88]">
            New customer requests for your services will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-[#F0E2E7] bg-white"
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#F0E2E7] p-4">
                <div className="flex min-w-0 items-center gap-3">
                  {booking.customer?.image ? (
                    <Image
                      src={booking.customer.image}
                      alt={booking.customer.name || "Customer"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FCECF2] text-sm font-bold text-[#D96F96]">
                      {booking.customer?.name?.[0] || "C"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#49333F]">
                      {booking.customer?.name || "Customer"}
                    </p>

                    <p className="truncate text-xs text-[#987B88]">
                      {booking.customer?.email}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${badge(booking.status)}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="space-y-3 p-4">
                <div className="flex gap-3">
                  {booking.service?.images?.[0] && (
                    <Image
                      src={booking.service.images[0]}
                      alt={booking.service.serviceName || "Service"}
                      width={80}
                      height={64}
                      className="h-16 w-20 rounded-lg object-cover"
                    />
                  )}

                  <div>
                    <p className="text-xs text-[#987B88]">
                      Requested Service
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#49333F]">
                      {booking.service?.serviceName || "Service"}
                    </p>

                    {booking.service?.price !== undefined && (
                      <p className="mt-1 text-xs text-[#D96F96]">
                        ৳{booking.service.price.toLocaleString("en-BD")}
                      </p>
                    )}
                  </div>
                </div>

                <p className="flex items-center gap-2 text-sm text-[#765D68]">
                  <CalendarDays size={16} className="text-[#D96F96]" />
                  {booking.eventDate
                    ? new Date(booking.eventDate).toLocaleDateString()
                    : "Date not provided"}
                </p>

                <p className="flex items-center gap-2 text-sm text-[#765D68]">
                  <MapPin size={16} className="text-[#D96F96]" />
                  {booking.eventLocation || "Location not provided"}
                </p>

                <p className="text-sm leading-6 text-[#765D68]">
                  <span className="font-semibold text-[#49333F]">
                    Message:{" "}
                  </span>
                  {booking.message || "No message"}
                </p>
              </div>

              {booking.status === "Pending" && (
                <div className="flex gap-3 border-t border-[#F0E2E7] bg-[#FFFAFC] p-4">
                  <button
                    disabled={processing === booking._id}
                    onClick={() =>
                      updateStatus(booking._id, "Accepted")
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check size={16} />
                    {processing === booking._id
                      ? "Processing..."
                      : "Accept"}
                  </button>

                  <button
                    disabled={processing === booking._id}
                    onClick={() =>
                      updateStatus(booking._id, "Rejected")
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
