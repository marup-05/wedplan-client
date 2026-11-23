"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AdminSidebar } from "@/components/dashboard/admin/AdminSidebar";
import { AdminHeader } from "@/components/dashboard/admin/AdminHeader";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    const role = (session.user as { role?: string }).role;

    if (role?.toLowerCase() !== "admin") {
      if (role?.toLowerCase() === "vendor") {
        router.replace("/dashboard/vendor");
      } else {
        router.replace("/dashboard/customer");
      }
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F6] dark:bg-[#15141B]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#F5D6E2] border-t-[#E477A0] dark:border-white/10 dark:border-t-[#E477A0]" />
      </div>
    );
  }

  const role = (session.user as { role?: string }).role;

  if (role?.toLowerCase() !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F6] dark:bg-[#15141B] text-sm text-[#987B88] dark:text-gray-400">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F6] dark:bg-[#15141B] lg:flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <AdminHeader />

        <main className="p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}