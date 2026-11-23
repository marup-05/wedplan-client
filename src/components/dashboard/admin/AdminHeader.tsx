"use client";

import { ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function AdminHeader() {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex h-[68px] items-center justify-between border-b border-[#F0E2E7] dark:border-white/10 bg-white dark:bg-[#15141B] px-5 md:px-8">
      <div>
        <h1 className="text-sm font-bold text-[#49333F] dark:text-gray-100">
          Administration
        </h1>
        <p className="mt-0.5 text-[11px] text-[#987B88] dark:text-gray-400">
          Manage your WedPlan platform
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-[#FFF5F8] dark:bg-white/5 px-3 py-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FCECF2] dark:bg-white/10 text-[#D96F96]">
          <ShieldCheck size={15} />
        </div>

        <div className="hidden sm:block">
          <p className="text-xs font-semibold text-[#49333F] dark:text-gray-100">
            {session?.user?.name || "Administrator"}
          </p>
          <p className="text-[10px] text-[#987B88] dark:text-gray-400">Admin</p>
        </div>
      </div>
    </header>
  );
}