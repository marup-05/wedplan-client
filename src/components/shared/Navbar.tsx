
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  UserRound,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useTheme } from "next-themes";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
];

const roleLinks: Record<string, { name: string; href: string }> = {
  vendor: { name: "Vendor Hub", href: "/dashboard/vendor" },
  customer: { name: "My Wedding", href: "/dashboard/customer" },
  admin: { name: "Admin Console", href: "/dashboard/admin" },
};

type User = {
  name?: string;
  email?: string;
  image?: string;
  role?: string;
};

function getInitial(user: User) {
  return (
    user.name?.trim()?.[0] ||
    user.email?.trim()?.[0] ||
    "U"
  ).toUpperCase();
}

function UserAvatar({
  user,
  size = "h-11 w-11",
}: {
  user: User;
  size?: string;
}) {
  return user.image ? (
    <Image
      src={user.image}
      alt={user.name || "Profile"}
      width={44}
      height={44}
      className={`${size} rounded-full object-cover`}
      unoptimized
    />
  ) : (
    <span
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-[#F5E8EC] dark:bg-white/10 font-semibold text-[#D96F96]`}
    >
      {getInitial(user)}
    </span>
  );
}

function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={
        mobile
          ? "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#66525E] transition hover:bg-[#F5E8EC] dark:text-gray-200 dark:hover:bg-white/10"
          : "flex h-10 w-10 items-center justify-center rounded-full border border-[#F0E3E7] bg-white text-[#66525E] transition hover:border-[#E8B5C7] hover:text-[#D96F96] dark:border-white/10 dark:bg-[#25232B] dark:text-gray-200 dark:hover:bg-white/10"
      }
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
      {mobile && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
    </button>
  );
}

function ProfileMenu({
  user,
  onLogout,
  onNavigate,
  loggingOut,
}: {
  user: User;
  onLogout: () => void;
  onNavigate: () => void;
  loggingOut: boolean;
}) {
  const role = user.role?.toLowerCase() || "customer";
  const dashboard = roleLinks[role];

  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-[#F0E3E7] bg-white p-2 shadow-xl shadow-[#49333F]/10 dark:border-white/10 dark:bg-[#1D1C24] dark:shadow-black/30">
      <div className="flex items-center gap-3 rounded-xl bg-[#FFF5F7] p-3 dark:bg-white/5">
        <UserAvatar user={user} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#49333F] dark:text-gray-100">
            {user.name || "WedPlan User"}
          </p>
          <p className="mt-0.5 text-xs lowercase text-[#D96F96]">
            {role}
          </p>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {dashboard && (
          <Link
            href={dashboard.href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#66525E] transition hover:bg-[#FFF3F7] hover:text-[#D96F96] dark:text-gray-300 dark:hover:bg-white/10"
          >
            <LayoutDashboard size={17} />
            Dashboard
          </Link>
        )}

        <Link
          href="/profile-settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#66525E] transition hover:bg-[#FFF3F7] hover:text-[#D96F96] dark:text-gray-300 dark:hover:bg-white/10"
        >
          <UserRound size={17} />
          Profile Settings
        </Link>
      </div>

      <div className="my-2 border-t border-[#F0E3E7] dark:border-white/10" />

      <button
        onClick={onLogout}
        disabled={loggingOut}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-500/10"
      >
        <LogOut size={17} />
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}

function NavbarContent() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as User | undefined;

  const dashboardLink = user?.role
    ? roleLinks[user.role.toLowerCase()]
    : null;

  const links = dashboardLink
    ? [...navLinks, dashboardLink]
    : navLinks;

  const handleSignOut = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(
          result.error.message || "Logout failed. Please try again."
        );
        setLoggingOut(false);
        return;
      }

      setProfileOpen(false);
      setIsOpen(false);

      toast.success("You have been logged out successfully!");

      window.location.href = "/";
    } catch {
      toast.error("Logout failed. Please try again.");
      setLoggingOut(false);
    }
  };

  const closeMenus = () => {
    setProfileOpen(false);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#F0E3E7] bg-[#FFF9F6] dark:border-white/10 dark:bg-[#15141B]">
      <nav className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center px-5 py-3 md:grid-cols-3 md:px-8">
        <Link
          href="/"
          onClick={closeMenus}
          className="flex items-center gap-2.5 justify-self-start"
        >
          <Image
            src="/images/wedplan-logo-transparent.png"
            alt="WedPlan"
            width={1346}
            height={807}
            priority
            className="h-16 w-auto dark:brightness-[3] sm:h-20"
          />
        </Link>

        <div className="hidden items-center justify-center gap-8 md:flex">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" &&
                pathname.startsWith(link.href + "/"));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#D96F96]"
                    : "text-[#66525E] hover:text-[#D96F96] dark:text-gray-300"
                }`}
              >
                {link.name}

                {isActive && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-[#E88BAA]" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center justify-self-end gap-4 md:flex">
          <ThemeToggle />

          {!isPending &&
            (user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full border border-[#F0E3E7] bg-white p-1.5 pr-3 transition hover:border-[#E8B5C7] dark:border-white/10 dark:bg-[#25232B]"
                  aria-expanded={profileOpen}
                  aria-label="Open profile menu"
                >
                  <UserAvatar user={user} size="h-9 w-9" />

                  <ChevronDown
                    size={16}
                    className={`text-[#987B88] dark:text-gray-400 transition ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <ProfileMenu
                    user={user}
                    onLogout={handleSignOut}
                    onNavigate={() => setProfileOpen(false)}
                    loggingOut={loggingOut}
                  />
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-[#49333F] hover:text-[#D96F96] dark:text-gray-200"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-full bg-[#E88BAA] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#D96F96]"
                >
                  Get Started
                </Link>
              </>
            ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="justify-self-end rounded-lg p-2 text-[#49333F] transition-colors hover:bg-[#F5E8EC] dark:text-gray-200 dark:hover:bg-white/10 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-[#F0E3E7] bg-[#FFF9F6] px-5 py-4 dark:border-white/10 dark:bg-[#15141B] md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" &&
                  pathname.startsWith(link.href + "/"));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#F5E8EC] text-[#D96F96] dark:bg-white/10"
                      : "text-[#66525E] hover:bg-[#F5E8EC] hover:text-[#D96F96] dark:text-gray-300 dark:hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <ThemeToggle mobile />

            {!isPending &&
              (user ? (
                <>
                  <div className="my-2 border-t border-[#F0E3E7] dark:border-white/10" />

                  <div className="flex items-center gap-3 rounded-xl bg-white p-3 dark:bg-white/5">
                    <UserAvatar user={user} size="h-10 w-10" />

                    <div>
                      <p className="text-sm font-semibold text-[#49333F] dark:text-gray-100">
                        {user.name || "WedPlan User"}
                      </p>

                      <p className="text-xs lowercase text-[#D96F96]">
                        {user.role || "customer"}
                      </p>
                    </div>
                  </div>

                  {dashboardLink && (
                    <Link
                      href={dashboardLink.href}
                      onClick={closeMenus}
                      className="rounded-lg px-4 py-3 text-sm text-[#66525E] hover:bg-[#F5E8EC] dark:text-gray-300 dark:hover:bg-white/10"
                    >
                      Dashboard
                    </Link>
                  )}

                  <Link
                    href="/profile-settings"
                    onClick={closeMenus}
                    className="rounded-lg px-4 py-3 text-sm text-[#66525E] hover:bg-[#F5E8EC] dark:text-gray-300 dark:hover:bg-white/10"
                  >
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleSignOut}
                    disabled={loggingOut}
                    className="rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-500/10"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={closeMenus}
                    className="rounded-lg px-4 py-3 text-sm font-semibold text-[#49333F] hover:bg-[#F5E8EC] dark:text-gray-200 dark:hover:bg-white/10"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={closeMenus}
                    className="mt-1 rounded-full bg-[#E88BAA] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#D96F96]"
                  >
                    Get Started
                  </Link>
                </>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<div className="h-16" />}>
      <NavbarContent />
    </Suspense>
  );
}
