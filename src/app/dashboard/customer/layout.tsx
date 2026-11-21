
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { CustomerSidebar } from "@/components/dashboard/customer/CustomerSidebar";
import { CustomerHeader } from "@/components/dashboard/customer/CustomerHeader";

export default function CustomerDashboardLayout({
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

    const role = (session.user as { role?: string }).role?.toLowerCase();

    if (role !== "customer") {
      if (role === "admin") {
        router.replace("/dashboard/admin");
      } else if (role === "vendor") {
        router.replace("/dashboard/vendor");
      } else {
        router.replace("/");
      }
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F6]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#F5D6E2] border-t-[#E477A0]" />
      </div>
    );
  }

  const role = (session.user as { role?: string }).role?.toLowerCase();

  if (role !== "customer") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F6] text-sm text-[#987B88]">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F6] lg:flex">
      <CustomerSidebar />

      <div className="min-w-0 flex-1">
        <CustomerHeader />

        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
