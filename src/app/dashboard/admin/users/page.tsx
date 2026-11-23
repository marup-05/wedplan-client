"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Search,
  RefreshCw,
  Eye,
  Ban,
  CheckCircle2,
  Users,
  X,
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

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  isBlocked?: boolean;
  createdAt?: string;
};

export default function ManageUsersPage() {
  const { data: session } = authClient.useSession();
  const adminId = session?.user?.id;

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState("");

  const fetchUsers = useCallback(
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
        if (role !== "All") params.set("role", role.toLowerCase());

        const response = await fetch(
          `${API_URL}/admin/users?${params.toString()}`,
          {
            headers: await getAuthHeaders(false),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load users");
        }

        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not load users"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [adminId, search, role]
  );

  useEffect(() => {
    if (!adminId) return;

    let cancelled = false;

    const loadUsers = async () => {
      try {
        const params = new URLSearchParams();

        if (search.trim()) params.set("search", search.trim());
        if (role !== "All") params.set("role", role.toLowerCase());

        const response = await fetch(
          `${API_URL}/admin/users?${params.toString()}`,
          {
            headers: await getAuthHeaders(false),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load users");
        }

        if (!cancelled) {
          setUsers(Array.isArray(data) ? data : data.users || []);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          toast.error(
            error instanceof Error ? error.message : "Could not load users"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, [adminId, search, role]);

  const viewDetails = async (user: User) => {
    if (!adminId) return;

    setDetailUser(user);
    setDetailsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/admin/users/${user._id}`,
        {
          headers: await getAuthHeaders(false),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load user details");
      }

      setDetailUser(data.user || data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not load details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateBlockStatus = async () => {
    if (!adminId || !selectedUser) return;

    setProcessing(selectedUser._id);

    try {
      const response = await fetch(
        `${API_URL}/admin/users/${selectedUser._id}/status`,
        {
          method: "PATCH",
          headers: await getAuthHeaders(),
          body: JSON.stringify({
            isBlocked: !selectedUser.isBlocked,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user");
      }

      toast.success(
        selectedUser.isBlocked
          ? "User unblocked successfully"
          : "User blocked successfully"
      );

      setDialogOpen(false);
      setSelectedUser(null);

      await fetchUsers(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update user"
      );
    } finally {
      setProcessing("");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#49333F] dark:text-gray-100">Manage Users</h2>
          <p className="mt-1 text-xs text-[#987B88] dark:text-gray-400">
            View, search and manage registered platform users.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchUsers(true)}
          disabled={loading || refreshing}
          className="flex items-center gap-2 rounded-lg border border-[#EEDFE5] dark:border-white/10 bg-white dark:bg-[#1D1C24] px-3 py-2 text-xs font-semibold text-[#765D68] dark:text-gray-300 hover:bg-[#FFF5F8] dark:hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#1D1C24] p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B49AA5] dark:text-gray-500"
          />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setLoading(true);
            }}
            placeholder="Search by name or email..."
            className="h-10 w-full rounded-lg border border-[#F0E2E7] dark:border-white/10 bg-[#FFFCFD] dark:bg-[#25232B] pl-9 pr-3 text-xs text-[#49333F] dark:text-gray-100 outline-none dark:placeholder:text-gray-500 focus:border-[#E477A0]"
          />
        </div>

        <select
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            setLoading(true);
          }}
          className="h-10 rounded-lg border border-[#F0E2E7] dark:border-white/10 bg-[#FFFCFD] dark:bg-[#25232B] px-3 text-xs text-[#765D68] dark:text-gray-300 outline-none focus:border-[#E477A0] sm:w-44"
        >
          <option value="All">All Roles</option>
          <option value="admin">Admin</option>
          <option value="vendor">Vendor</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#1D1C24]">
        <div className="flex items-center justify-between border-b border-[#F0E2E7] dark:border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#D96F96]" />
            <h3 className="text-sm font-bold text-[#49333F] dark:text-gray-100">All Users</h3>
          </div>
          <span className="text-[11px] text-[#987B88] dark:text-gray-400">
            {users.length} users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-[#FFF9F6] dark:bg-white/5 text-[10px] uppercase tracking-wide text-[#987B88] dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F5EAF0] dark:divide-white/10">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-xs text-[#987B88] dark:text-gray-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-xs text-[#987B88] dark:text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="text-xs hover:bg-[#FFFCFD] dark:hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#FCECF2] dark:bg-white/10">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name || "User"}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-bold text-[#D96F96]">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[190px] truncate font-semibold text-[#49333F] dark:text-gray-100">
                            {user.name}
                          </p>
                          <p className="max-w-[190px] truncate text-[10px] text-[#987B88] dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#FCECF2] dark:bg-white/10 px-2.5 py-1 text-[10px] font-semibold capitalize text-[#D96F96]">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          user.isBlocked
                            ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-green-50 dark:bg-emerald-500/15 text-green-700 dark:text-emerald-300"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-[#987B88] dark:text-gray-400">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => void viewDetails(user)}
                          className="rounded-lg border border-[#EEDFE5] dark:border-white/10 p-2 text-[#987B88] dark:text-gray-400 hover:bg-[#FFF5F8] dark:hover:bg-white/10 hover:text-[#D96F96]"
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setDialogOpen(true);
                          }}
                          disabled={processing === user._id}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-2 text-[10px] font-semibold disabled:opacity-50 ${
                            user.isBlocked
                              ? "bg-green-50 dark:bg-emerald-500/15 text-green-700 dark:text-emerald-300 hover:bg-green-100 dark:hover:bg-emerald-500/25"
                              : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20"
                          }`}
                        >
                          {user.isBlocked ? (
                            <CheckCircle2 size={13} />
                          ) : (
                            <Ban size={13} />
                          )}
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detailUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setDetailUser(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1D1C24] p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#49333F] dark:text-gray-100">
                User Details
              </h3>
              <button
                onClick={() => setDetailUser(null)}
                className="rounded-lg p-1 text-[#987B88] dark:text-gray-400 hover:bg-[#FFF5F8] dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {detailsLoading ? (
              <p className="py-8 text-center text-xs text-[#987B88] dark:text-gray-400">
                Loading details...
              </p>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 border-b border-[#F5EAF0] dark:border-white/10 pb-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#FCECF2] dark:bg-white/10">
                    {detailUser.image ? (
                      <Image
                        src={detailUser.image}
                        alt={detailUser.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-bold text-[#D96F96]">
                        {detailUser.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-[#49333F] dark:text-gray-100">
                      {detailUser.name}
                    </p>
                    <p className="mt-1 text-[#987B88] dark:text-gray-400">
                      {detailUser.email}
                    </p>
                  </div>
                </div>

                <p className="flex justify-between gap-3">
                  <span className="text-[#987B88] dark:text-gray-400">Role</span>
                  <span className="font-semibold capitalize text-[#49333F] dark:text-gray-100">
                    {detailUser.role}
                  </span>
                </p>

                <p className="flex justify-between gap-3">
                  <span className="text-[#987B88] dark:text-gray-400">Status</span>
                  <span className="font-semibold text-[#49333F] dark:text-gray-100">
                    {detailUser.isBlocked ? "Blocked" : "Active"}
                  </span>
                </p>

                <p className="flex justify-between gap-3">
                  <span className="text-[#987B88] dark:text-gray-400">Joined</span>
                  <span className="font-semibold text-[#49333F] dark:text-gray-100">
                    {detailUser.createdAt
                      ? new Date(detailUser.createdAt).toLocaleString()
                      : "—"}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#49333F] dark:text-gray-100">
              {selectedUser?.isBlocked ? "Unblock User?" : "Block User?"}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-[#987B88] dark:text-gray-400">
              {selectedUser?.isBlocked
                ? `Allow ${selectedUser?.name} to access the platform again?`
                : `Block ${selectedUser?.name}? This user should no longer access protected platform features.`}
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
              onClick={updateBlockStatus}
              disabled={!!processing}
              className="rounded-lg bg-[#D96F96] text-white hover:bg-[#C95C84]"
            >
              {processing
                ? "Updating..."
                : selectedUser?.isBlocked
                  ? "Unblock"
                  : "Block User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}