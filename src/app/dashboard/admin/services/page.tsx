"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Search,
  RefreshCw,
  MapPin,
  Check,
  X,
  Trash2,
  Clock,
  BriefcaseBusiness,
} from "lucide-react";
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
  vendorId: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: "Pending" | "Approved" | "Rejected";
  isActive: boolean;
  createdAt?: string;
  vendor?: {
    _id?: string;
    name?: string;
    email?: string;
    image?: string;
  };
};

export default function ManageServicesPage() {
  const { data: session } = authClient.useSession();
  const adminId = session?.user?.id;

  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchServices = useCallback(
    async (refresh = false) => {
      if (!adminId) return;

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const params = new URLSearchParams();

        if (search.trim()) params.set("search", search.trim());
        if (status !== "All") params.set("status", status);
        if (category !== "All") params.set("category", category);

        const response = await fetch(
          `${API_URL}/admin/services?${params.toString()}`,
          {
            headers: await getAuthHeaders(false),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load services");
        }

        setServices(Array.isArray(data) ? data : data.services || []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not load services"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [adminId, search, status, category]
  );

  useEffect(() => {
    if (!adminId) return;

    let cancelled = false;

    const loadServices = async () => {
      try {
        const params = new URLSearchParams();

        if (search.trim()) params.set("search", search.trim());
        if (status !== "All") params.set("status", status);
        if (category !== "All") params.set("category", category);

        const response = await fetch(
          `${API_URL}/admin/services?${params.toString()}`,
          {
            headers: await getAuthHeaders(false),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load services");
        }

        if (!cancelled) {
          setServices(Array.isArray(data) ? data : data.services || []);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error ? error.message : "Could not load services"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadServices();

    return () => {
      cancelled = true;
    };
  }, [adminId, search, status, category]);

  const categories = useMemo(
    () =>
      [...new Set(services.map((service) => service.category).filter(Boolean))],
    [services]
  );

  const updateServiceStatus = async (
    service: Service,
    nextStatus: "Approved" | "Rejected"
  ) => {
    if (!adminId) return;

    setProcessing(service._id);

    try {
      const response = await fetch(
        `${API_URL}/admin/services/${service._id}/status`,
        {
          method: "PATCH",
          headers: await getAuthHeaders(),
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update service");
      }

      toast.success(
        nextStatus === "Approved"
          ? "Service approved successfully"
          : "Service rejected successfully"
      );

      await fetchServices(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update service"
      );
    } finally {
      setProcessing("");
    }
  };

  const deleteService = async () => {
    if (!adminId || !selectedService) return;

    setProcessing(selectedService._id);

    try {
      const response = await fetch(
        `${API_URL}/admin/services/${selectedService._id}`,
        {
          method: "DELETE",
          headers: await getAuthHeaders(false),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete service");
      }

      toast.success("Service deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedService(null);

      await fetchServices(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete service"
      );
    } finally {
      setProcessing("");
    }
  };

  const statusStyle = (value: string) => {
    if (value === "Approved") return "bg-green-50 text-green-700";
    if (value === "Rejected") return "bg-red-50 text-red-600";
    return "bg-amber-50 text-amber-700";
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#49333F]">
            Manage Services
          </h2>
          <p className="mt-1 text-xs text-[#987B88]">
            Review submitted services and manage their publishing status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchServices(true)}
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

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#F0E2E7] bg-white p-3 sm:grid-cols-3">
        <div className="relative sm:col-span-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B49AA5]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search services..."
            className="h-10 w-full rounded-lg border border-[#F0E2E7] bg-[#FFFCFD] pl-9 pr-3 text-xs text-[#49333F] outline-none focus:border-[#E477A0]"
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-10 rounded-lg border border-[#F0E2E7] bg-[#FFFCFD] px-3 text-xs text-[#765D68] outline-none focus:border-[#E477A0]"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-10 rounded-lg border border-[#F0E2E7] bg-[#FFFCFD] px-3 text-xs text-[#765D68] outline-none focus:border-[#E477A0]"
        >
          <option value="All">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness size={16} className="text-[#D96F96]" />
          <h3 className="text-sm font-bold text-[#49333F]">
            Submitted Services
          </h3>
        </div>
        <span className="text-[11px] text-[#987B88]">
          {services.length} services
        </span>
      </div>

      {loading ? (
        <div className="rounded-xl border border-[#F0E2E7] bg-white py-14 text-center text-xs text-[#987B88]">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#EEDFE5] bg-white px-5 py-14 text-center">
          <BriefcaseBusiness size={25} className="mx-auto text-[#D9B8C6]" />
          <p className="mt-3 text-sm font-semibold text-[#49333F]">
            No services found
          </p>
          <p className="mt-1 text-xs text-[#987B88]">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <article
              key={service._id}
              className="flex min-w-0 flex-col gap-3 rounded-xl border border-[#F0E2E7] bg-white p-3 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg bg-[#FFF5F8] sm:h-[92px] sm:w-[110px]">
                {service.images?.[0] ? (
                  <Image
                    src={service.images[0]}
                    alt={service.serviceName}
                    fill
                    sizes="110px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#B49AA5]">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-[#49333F]">
                    {service.serviceName}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${statusStyle(service.status)}`}
                  >
                    {service.status}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                      service.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-1 text-[11px] font-medium text-[#D96F96]">
                  {service.category}
                </p>

                <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#987B88]">
                  {service.description}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#987B88]">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {service.location}
                  </span>

                  <span className="font-bold text-[#D96F96]">
                    ${Number(service.price || 0).toLocaleString("en-US")}
                  </span>

                  <span>
                    Vendor: {service.vendor?.name || service.vendorId}
                  </span>

                  {service.createdAt && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(service.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {service.vendor?.email && (
                  <p className="mt-1 truncate text-[10px] text-[#B49AA5]">
                    {service.vendor.email}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
                {service.status !== "Approved" && (
                  <button
                    type="button"
                    onClick={() =>
                      void updateServiceStatus(service, "Approved")
                    }
                    disabled={!!processing}
                    className="flex items-center justify-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check size={13} />
                    Approve
                  </button>
                )}

                {service.status !== "Rejected" && (
                  <button
                    type="button"
                    onClick={() =>
                      void updateServiceStatus(service, "Rejected")
                    }
                    disabled={!!processing}
                    className="flex items-center justify-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-[10px] font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    <X size={13} />
                    Reject
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedService(service);
                    setDeleteDialogOpen(true);
                  }}
                  disabled={!!processing}
                  className="flex items-center justify-center gap-1 rounded-lg border border-[#F0E2E7] px-3 py-2 text-[10px] font-semibold text-[#987B88] hover:bg-[#FFF5F8] hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#49333F]">
              Delete Service?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-[#987B88]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#49333F]">
                {selectedService?.serviceName}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={!!processing}
              className="rounded-lg"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={deleteService}
              disabled={!!processing}
              className="rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              {processing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}