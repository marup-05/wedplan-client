
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Star,
} from "lucide-react";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type Service = {
  _id: string;
  vendorId: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  isActive: boolean;
};

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`${API_URL}/services/${id}`);
        if (!response.ok) throw new Error("Service not found");

        const data = await response.json();
        setService(data);
      } catch {
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchService();
  }, [id]);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in to book this service.");
      router.push("/sign-in");
      return;
    }

    if (session.user.role !== "customer") {
      toast.error("Only customers can book services.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: service?._id,
          vendorId: service?.vendorId,
          customerId: session.user.id,
          eventDate,
          eventLocation,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      toast.success("Booking request sent successfully!");
      setEventDate("");
      setEventLocation("");
      setMessage("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || sessionLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FFF9F6]">
        <Loader2 className="animate-spin text-[#D96F96]" size={32} />
      </main>
    );
  }

  if (!service) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#FFF9F6] px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5E8EC] text-[#D96F96]">
            <Heart size={30} />
          </div>
          <h1 className="mt-6 font-logo text-3xl font-semibold text-[#49333F]">
            Service Not Found
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#987B88]">
            This service may no longer be available.
          </p>
          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#E88BAA] px-6 py-3 text-sm font-semibold text-white hover:bg-[#D96F96]"
          >
            <ArrowLeft size={16} />
            Browse Services
          </Link>
        </div>
      </main>
    );
  }

  const images = service.images?.filter(Boolean) || [];

  return (
    <main className="min-h-screen bg-[#FFF9F6]">
      <div className="mx-auto max-w-7xl px-5 pt-7 md:px-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#987B88] hover:text-[#D96F96]"
        >
          <ArrowLeft size={17} />
          Back to Services
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-7 md:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px]">
          {/* Service Information */}
          <div>
            {/* Small Image Gallery */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {images.length > 0 ? (
                <>
                  <div className="relative h-[220px] w-full overflow-hidden rounded-xl sm:w-[65%]">
                    <Image
                      src={images[0]}
                      alt={service.serviceName}
                      fill
                      priority
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 450px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex gap-3 sm:w-[35%] sm:flex-col">
                    {images.slice(1, 3).map((image, index) => (
                      <div
                        key={index}
                        className="relative h-[100px] flex-1 overflow-hidden rounded-xl sm:h-[103px] sm:w-full"
                      >
                        <Image
                          src={image}
                          alt={`${service.serviceName} ${index + 2}`}
                          fill
                          unoptimized
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex h-[180px] w-full items-center justify-center rounded-xl bg-[#F5E8EC] text-sm text-[#987B88]">
                  No images available
                </div>
              )}
            </div>

            {/* Service Details */}
            <div className="mt-7">
              <span className="inline-flex rounded-full bg-[#F5E8EC] px-4 py-2 text-xs font-semibold text-[#D96F96]">
                {service.category}
              </span>

              <h1 className="mt-4 font-logo text-3xl font-semibold leading-tight text-[#49333F] sm:text-4xl">
                {service.serviceName}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-[#987B88]">
                <span className="flex items-center gap-2">
                  <MapPin size={17} />
                  {service.location}
                </span>
              </div>

              <div className="mt-8 border-t border-[#F0E3E7] pt-7">
                <h2 className="font-logo text-2xl font-semibold text-[#49333F]">
                  About This Service
                </h2>
                <p className="mt-3 text-sm leading-8 text-[#806C77]">
                  {service.description}
                </p>
              </div>

              <div className="mt-8 border-t border-[#F0E3E7] pt-7">
                <h2 className="font-logo text-2xl font-semibold text-[#49333F]">
                  Service Benefits
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 text-sm text-[#66525E]">
                    <CheckCircle2 size={18} className="text-[#D96F96]" />
                    Professional wedding vendor
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#66525E]">
                    <CheckCircle2 size={18} className="text-[#D96F96]" />
                    Personalized service
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#66525E]">
                    <ShieldCheck size={18} className="text-[#D96F96]" />
                    Approved service
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form - Right Side */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#F0E3E7] bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-medium text-[#987B88]">
                Starting from
              </p>

              <p className="mt-2 text-3xl font-bold text-[#D96F96]">
                ${Number(service.price).toLocaleString("en-US")}
              </p>

              <div className="my-5 border-t border-[#F0E3E7]" />

              <h2 className="font-logo text-2xl font-semibold text-[#49333F]">
                Book This Service
              </h2>

              <p className="mt-2 text-xs leading-6 text-[#987B88]">
                Send a booking request to this service vendor.
              </p>

              {!session?.user ? (
                <div className="mt-5">
                  <Link
                    href="/sign-in"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E88BAA] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#D96F96]"
                  >
                    <CalendarDays size={17} />
                    Sign In to Book
                  </Link>
                  <p className="mt-3 text-center text-xs text-[#987B88]">
                    Sign in with your customer account to book.
                  </p>
                </div>
              ) : session.user.role !== "customer" ? (
                <p className="mt-5 rounded-xl bg-[#FFF4E8] p-4 text-sm text-[#987B88]">
                  Only customer accounts can book a service.
                </p>
              ) : (
                <form onSubmit={handleBooking} className="mt-5 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#66525E]">
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full rounded-xl border border-[#F0E3E7] bg-[#FFFCFB] px-4 py-3 text-sm text-[#49333F] outline-none focus:border-[#E88BAA]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#66525E]">
                      Event Location
                    </label>
                    <input
                      type="text"
                      required
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="Enter event location"
                      className="w-full rounded-xl border border-[#F0E3E7] bg-[#FFFCFB] px-4 py-3 text-sm text-[#49333F] outline-none focus:border-[#E88BAA]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#66525E]">
                      Additional Message
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write any additional details..."
                      className="w-full resize-none rounded-xl border border-[#F0E3E7] bg-[#FFFCFB] px-4 py-3 text-sm text-[#49333F] outline-none focus:border-[#E88BAA]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E88BAA] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#D96F96] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <CalendarDays size={17} />
                        Book Service
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs leading-5 text-[#987B88]">
                    Your booking request will be sent with Pending status.
                  </p>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
