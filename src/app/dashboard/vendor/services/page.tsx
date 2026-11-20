
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, RefreshCw, MapPin } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  isActive: boolean;
};

export default function MyServicesPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState("");

  // Initial data loading
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${API_URL}/vendor/${userId}/services`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load services");
        }

        if (!cancelled) {
          setServices(data);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not load services"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchServices();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Refresh and reload services
  const loadServices = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${API_URL}/vendor/${userId}/services`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load services");
      }

      setServices(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load services"
      );
    }
  }, [userId]);

  // Delete service
  const deleteService = async (id: string) => {
    if (!userId) return;

    if (!confirm("Are you sure you want to delete this service?")) return;

    setProcessing(id);

    try {
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      toast.success("Service deleted successfully");
      await loadServices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Delete failed"
      );
    } finally {
      setProcessing("");
    }
  };

  // Toggle service availability
  const toggleAvailability = async (service: Service) => {
    if (!userId) return;

    setProcessing(service._id);

    try {
      const response = await fetch(
        `${API_URL}/services/${service._id}/availability`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendorId: userId,
            isActive: !service.isActive,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Update failed");
      }

      toast.success(
        `Service ${
          service.isActive ? "deactivated" : "activated"
        } successfully`
      );

      await loadServices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Update failed"
      );
    } finally {
      setProcessing("");
    }
  };

  const statusStyle = (status: string) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-[#987B88]">
        Loading your services...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#49333F]">
            My Services
          </h2>
          <p className="mt-1 text-sm text-[#987B88]">
            Manage your submitted wedding services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadServices}
            className="rounded-xl border border-[#EEDFE5] bg-white p-2.5 text-[#987B88] hover:text-[#D96F96]"
            title="Refresh"
            aria-label="Refresh services"
          >
            <RefreshCw size={17} />
          </button>

          <Link
            href="/dashboard/vendor/services/new"
            className="flex items-center gap-2 rounded-xl bg-[#E477A0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#D96F96]"
          >
            <Plus size={17} />
            Add Service
          </Link>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EEDFE5] bg-white px-5 py-16 text-center">
          <h3 className="font-semibold text-[#49333F]">
            No services yet
          </h3>

          <p className="mt-2 text-sm text-[#987B88]">
            Add your first wedding service to get started.
          </p>

          <Link
            href="/dashboard/vendor/services/new"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#E477A0] px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            Create Service
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service._id}
              className="overflow-hidden rounded-2xl border border-[#F0E2E7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48 w-full bg-[#FFF5F8]">
                <Image
                  src={service.images?.[0] || "/placeholder.png"}
                  alt={service.serviceName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />

                <span
                  className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(service.status)}`}
                >
                  {service.status}
                </span>
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="text-xs font-medium text-[#D96F96]">
                    {service.category}
                  </p>

                  <h3 className="mt-1 line-clamp-1 text-base font-bold text-[#49333F]">
                    {service.serviceName}
                  </h3>

                  <p className="mt-1 flex items-center gap-1 text-xs text-[#987B88]">
                    <MapPin size={14} />
                    {service.location}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#F0E2E7] pt-3">
                  <div>
                    <p className="text-xs text-[#987B88]">
                      Service Price
                    </p>
                    <p className="mt-1 text-lg font-bold text-[#D96F96]">
                      ${service.price.toLocaleString("en-US")}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      service.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex gap-2 border-t border-[#F0E2E7] pt-3">
                  {service.status === "Approved" && (
                    <button
                      disabled={processing === service._id}
                      onClick={() => toggleAvailability(service)}
                      className="flex-1 rounded-lg border border-[#EEDFE5] px-3 py-2 text-xs font-semibold text-[#765D68] hover:bg-[#FFF5F8] disabled:opacity-50"
                    >
                      {processing === service._id
                        ? "Processing..."
                        : service.isActive
                          ? "Deactivate"
                          : "Activate"}
                    </button>
                  )}

                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/vendor/services/${service._id}/edit`
                      )
                    }
                    className="rounded-lg border border-[#EEDFE5] p-2.5 text-[#D96F96] hover:bg-[#FFF5F8]"
                    title="Edit service"
                    aria-label="Edit service"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    disabled={processing === service._id}
                    onClick={() => deleteService(service._id)}
                    className="rounded-lg border border-red-100 p-2.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                    title="Delete service"
                    aria-label="Delete service"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
