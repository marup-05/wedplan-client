
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const dashboardPaths: Record<string, string> = {
  vendor: "/dashboard/vendor",
  customer: "/dashboard/customer",
  admin: "/dashboard/admin",
};

export default function AuthRedirectPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current || isPending) return;

    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const error = params.get("error");

    if (error) {
      handled.current = true;
      toast.error("Google authentication failed. Please try again.");
      router.replace(from === "signup" ? "/sign-up" : "/sign-in");
      return;
    }

    if (!session) {
      handled.current = true;
      toast.error("Unable to sign in with Google. Please try again.");
      router.replace(from === "signup" ? "/sign-up" : "/sign-in");
      return;
    }

    handled.current = true;

    toast.success(
      from === "signup"
        ? "Your account has been created successfully!"
        : "Successfully signed in with Google!"
    );

    const role = (session.user as { role?: string }).role;

    router.replace(dashboardPaths[role?.toLowerCase() || ""] || "/");
    router.refresh();
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF9F6]">
      <p className="text-sm font-medium text-[#D96F96]">
        Redirecting to your dashboard...
      </p>
    </div>
  );
}
