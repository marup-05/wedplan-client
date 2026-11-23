
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, RefreshCw, MapPin } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_URL, getAuthHeaders } from "@/lib/api";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/services`, {
          headers: await getAuthHeaders(),
        });

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

  const loadServices = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/vendor/services`, {
        headers: await getAuthHeaders(),
      });

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

  const deleteService = async () => {
    if (!userId || !selectedService) return;

    const id = selectedService._id;
    setProcessing(id);

    try {
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: "DELETE",
        headers: await getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      toast.success("Service deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedService(null);
      await loadServices();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Delete failed"
      );
    } finally {
      setProcessing("");
    }
  };

  const toggleAvailability = async (service: Service) => {
    if (!userId) return;

    setProcessing(service._id);

    try {
      const response = await fetch(
        `${API_URL}/services/${service._id}/availability`,
        {
          method: "PATCH",
          headers: await getAuthHeaders(),
          body: JSON.stringify({
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
    if (status === "Approved")
      return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300";
    if (status === "Rejected")
      return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300";
    return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-[#987B88] dark:text-gray-400">
        Loading your services...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#49333F] dark:text-gray-100">
            My Services
          </h2>
          <p className="mt-1 text-xs text-[#987B88] dark:text-gray-400">
            Manage your submitted wedding services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadServices}
            className="rounded-lg border border-[#EEDFE5] dark:border-white/10 bg-white dark:bg-[#1D1C24] p-2 text-[#987B88] dark:text-gray-400 hover:text-[#D96F96]"
            title="Refresh"
            aria-label="Refresh services"
          >
            <RefreshCw size={15} />
          </button>

          <Link
            href="/dashboard/vendor/services/new"
            className="flex items-center gap-1.5 rounded-lg bg-[#E477A0] px-3 py-2 text-xs font-semibold text-white hover:bg-[#D96F96]"
          >
            <Plus size={15} />
            Add Service
          </Link>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#EEDFE5] dark:border-white/10 bg-white dark:bg-[#1D1C24] px-5 py-12 text-center">
          <h3 className="text-sm font-semibold text-[#49333F] dark:text-gray-100">
            No services yet
          </h3>

          <p className="mt-2 text-xs text-[#987B88] dark:text-gray-400">
            Add your first wedding service to get started.
          </p>

          <Link
            href="/dashboard/vendor/services/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#E477A0] px-4 py-2 text-xs font-semibold text-white"
          >
            <Plus size={14} />
            Create Service
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {services.map((service) => (
            <article
              key={service._id}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#1D1C24] p-2.5 shadow-sm transition hover:shadow-md sm:gap-4 sm:p-3"
            >
              <div className="relative h-[62px] w-[62px] shrink-0 overflow-hidden rounded-lg bg-[#FFF5F8] dark:bg-white/10 sm:h-[72px] sm:w-[72px]">
                <Image
                  src={service.images?.[0] || "/placeholder.png"}
                  alt={service.serviceName}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="max-w-full truncate text-xs font-bold text-[#49333F] dark:text-gray-100 sm:text-sm">
                    {service.serviceName}
                  </h3>

                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${statusStyle(
                      service.status
                    )}`}
                  >
                    {service.status}
                  </span>
                </div>

                <p className="mt-0.5 truncate text-[10px] text-[#D96F96]">
                  {service.category}
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="flex items-center gap-1 text-[10px] text-[#987B88] dark:text-gray-400">
                    <MapPin size={11} />
                    <span className="max-w-[110px] truncate">
                      {service.location}
                    </span>
                  </p>

                  <p className="text-[11px] font-bold text-[#D96F96]">
                    ${service.price.toLocaleString("en-US")}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[10px] font-medium text-[#987B88] dark:text-gray-400">
                    Active
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={service.isActive}
                    aria-label={`Turn ${
                      service.isActive ? "off" : "on"
                    } ${service.serviceName}`}
                    disabled={processing === service._id}
                    onClick={() => toggleAvailability(service)}
                    className={`relative inline-flex h-5 w-9 shrink-0 appearance-none items-center rounded-full p-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      service.isActive ? "bg-red-500" : "bg-gray-300 dark:bg-white/15"
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        service.isActive
                          ? "translate-x-4"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/dashboard/vendor/services/${service._id}/edit`
                      )
                    }
                    className="rounded-md border border-[#EEDFE5] dark:border-white/10 p-1.5 text-[#D96F96] transition hover:bg-[#FFF5F8] dark:hover:bg-white/10"
                    title="Edit service"
                    aria-label="Edit service"
                  >
                    <Pencil size={12} />
                  </button>

                  <button
                    type="button"
                    disabled={processing === service._id}
                    onClick={() => {
                      setSelectedService(service);
                      setDeleteDialogOpen(true);
                    }}
                    className="rounded-md border border-red-100 dark:border-red-500/30 p-1.5 text-red-500 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50"
                    title="Delete service"
                    aria-label="Delete service"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <AlertDialogContent className="rounded-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#49333F] dark:text-gray-100">
                      Delete Service?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-[#987B88] dark:text-gray-400">
                      Are you sure you want to delete{" "}
                      <span className="font-semibold text-[#49333F] dark:text-gray-100">
                        {selectedService?.serviceName}
                      </span>
                      ? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel
                      disabled={processing === selectedService?._id}
                      className="rounded-lg"
                    >
                      Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                      disabled={processing === selectedService?._id}
                      onClick={deleteService}
                      className="rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >
                      {processing === selectedService?._id
                        ? "Deleting..."
                        : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
