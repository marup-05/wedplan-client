
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Mail,
  Loader2,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { API_URL, getAuthHeaders } from "@/lib/api";

type Booking = {
  _id: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: string;
  createdAt: string;
  service?: {
    serviceName?: string;
    description?: string;
    images?: string[];
    category?: string;
  };
  vendor?: {
    name?: string;
    businessName?: string;
    email?: string;
    image?: string;
  };
};

function formatDate(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Accepted:
      "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
    Rejected: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    Cancelled: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}

export default function CustomerBookingDetailsPage() {
  const params = useParams<{ bookingId: string }>();
  const { data: session } = authClient.useSession();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const customerId = session?.user?.id;
  const bookingId = params.bookingId;

  useEffect(() => {
    if (!customerId || !bookingId) return;

    let cancelled = false;

    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const headers = await getAuthHeaders();

        const response = await fetch(
          `${API_URL}/customer/bookings/${bookingId}`,
          { headers }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Booking not found");
        }

        if (!cancelled) {
          setBooking(result.booking || result);
        }
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

    void fetchBooking();

    return () => {
      cancelled = true;
    };
  }, [customerId, bookingId]);

  const handleCancel = async () => {
    if (!customerId || !booking) return;

    try {
      setCancelling(true);

      const headers = await getAuthHeaders();

      const response = await fetch(
        `${API_URL}/customer/bookings/${booking._id}/cancel`,
        {
          method: "PATCH",
          headers,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not cancel booking");
      }

      setBooking({ ...booking, status: "Cancelled" });
      toast.success("Booking cancelled successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to cancel booking"
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#D96F96]" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="rounded-xl border border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#1D1C24] p-8 text-center">
        <p className="text-sm text-red-500 dark:text-red-400">
          {error || "Booking not found"}
        </p>
        <Link
          href="/dashboard/customer/bookings"
          className="mt-4 inline-flex text-xs font-semibold text-[#D96F96] hover:underline"
        >
          Back to My Bookings
        </Link>
      </div>
    );
  }

  const image = booking.service?.images?.[0];

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link
        href="/dashboard/customer/bookings"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#987B88] dark:text-gray-400 hover:text-[#D96F96]"
      >
        <ArrowLeft size={16} />
        Back to My Bookings
      </Link>

      <div className="rounded-xl border border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#1D1C24] p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#D96F96]">
              Booking Information
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#49333F] dark:text-gray-100">
              Booking Details
            </h2>
          </div>

          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-[200px_1fr]">
          <div className="h-40 overflow-hidden rounded-xl bg-[#FFF5F8] dark:bg-white/5 sm:h-40">
            {image ? (
              <Image
                src={image}
                alt={booking.service?.serviceName || "Service"}
                width={200}
                height={160}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[#B49AA5] dark:text-gray-500">
                No Image
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#49333F] dark:text-gray-100">
              {booking.service?.serviceName || "Service"}
            </h3>

            {booking.service?.category && (
              <p className="mt-1 text-xs text-[#987B88] dark:text-gray-400">
                {booking.service.category}
              </p>
            )}

            <p className="mt-3 text-sm leading-6 text-[#765D68] dark:text-gray-300">
              {booking.service?.description || "No service description available."}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-[#F0E2E7] dark:border-white/10 pt-5">
          <h3 className="text-sm font-bold text-[#49333F] dark:text-gray-100">
            Event Information
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#FCECF2] dark:bg-white/10 p-2 text-[#D96F96]">
                <CalendarDays size={17} />
              </div>
              <div>
                <p className="text-xs text-[#987B88] dark:text-gray-400">Event Date</p>
                <p className="mt-1 text-sm font-semibold text-[#49333F] dark:text-gray-100">
                  {formatDate(booking.eventDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#FCECF2] dark:bg-white/10 p-2 text-[#D96F96]">
                <MapPin size={17} />
              </div>
              <div>
                <p className="text-xs text-[#987B88] dark:text-gray-400">Event Location</p>
                <p className="mt-1 text-sm font-semibold text-[#49333F] dark:text-gray-100">
                  {booking.eventLocation || "Not available"}
                </p>
              </div>
            </div>
          </div>

          {booking.message && (
            <div className="mt-5 rounded-lg bg-[#FFF9F6] dark:bg-white/5 p-4">
              <p className="text-xs font-semibold text-[#49333F] dark:text-gray-100">
                Your Message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#765D68] dark:text-gray-300">
                {booking.message}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-[#F0E2E7] dark:border-white/10 pt-5">
          <h3 className="text-sm font-bold text-[#49333F] dark:text-gray-100">
            Vendor Information
          </h3>

          <div className="mt-4 flex items-center gap-3">
            {booking.vendor?.image ? (
              <Image
                src={booking.vendor.image}
                alt="Vendor"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div className="rounded-full bg-[#FCECF2] dark:bg-white/10 p-3 text-[#D96F96]">
                <Store size={19} />
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-[#49333F] dark:text-gray-100">
                {booking.vendor?.businessName ||
                  booking.vendor?.name ||
                  "Vendor"}
              </p>

              {booking.vendor?.email && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#987B88] dark:text-gray-400">
                  <Mail size={12} />
                  {booking.vendor.email}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[#F0E2E7] dark:border-white/10 pt-5">
          <div className="flex flex-wrap justify-between gap-3 text-xs">
            <div>
              <p className="text-[#987B88] dark:text-gray-400">Booking Request Date</p>
              <p className="mt-1 font-semibold text-[#49333F] dark:text-gray-100">
                {formatDate(booking.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-[#987B88] dark:text-gray-400">Booking Status</p>
              <div className="mt-1">
                <StatusBadge status={booking.status} />
              </div>
            </div>
          </div>
        </div>

        {booking.status === "Pending" && (
          <div className="mt-6 flex justify-end border-t border-[#F0E2E7] dark:border-white/10 pt-5">
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-lg border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              {cancelling ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
