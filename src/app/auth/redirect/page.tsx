
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const dashboardPaths: Record<string, string> = {
  vendor: "/dashboard/vendor",
  customer: "/dashboard/customer",
  admin: "/dashboard/admin",
};

export default function AuthRedirectPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    const role = (session.user as { role?: string }).role;
    router.replace(dashboardPaths[role?.toLowerCase() || ""] || "/");
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF9F6]">
      <p className="text-sm font-medium text-[#D96F96]">
        Redirecting to your dashboard...
      </p>
    </div>
  );
}
