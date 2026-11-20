
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
];

const roleLinks: Record<string, { name: string; href: string }> = {
  vendor: { name: "Vendor Hub", href: "/dashboard/vendor" },
  customer: { name: "My Wedding", href: "/dashboard/customer" },
  admin: { name: "Admin Console", href: "/dashboard/admin" },
};

function RoseLogo() {
  return (
    <svg
      viewBox="0 0 100 120"
      className="h-10 w-9 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M48 55 C28 49 23 29 38 18 C45 7 64 11 69 23 C83 20 91 36 81 47 C77 58 62 64 50 62 C37 60 30 51 34 40 C37 29 51 26 59 34 C67 42 59 53 50 52 C43 50 43 43 49 40" />
      <path d="M32 45 C17 39 17 25 29 18 M43 15 C47 4 64 5 71 16 M70 26 C84 22 91 35 84 46 M78 48 C76 62 62 68 51 61" />
      <path d="M48 59 C47 77 43 95 27 110 M48 76 C35 69 21 64 13 51 C29 51 42 57 48 76 Z" />
      <path d="M43 89 C56 70 72 66 87 69 C78 83 62 91 43 89 Z" />
      <path d="M23 59 C29 65 36 70 43 73 M79 72 C67 76 56 83 48 91" />
    </svg>
  );
}

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as
    | { name?: string; role?: string }
    | undefined;

  const dashboardLink = user?.role
    ? roleLinks[user.role.toLowerCase()]
    : null;

  const handleSignOut = async () => {
    await authClient.signOut();
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  const links = dashboardLink
    ? [...navLinks, dashboardLink]
    : navLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-[#F0E3E7] bg-[#FFF9F6]">
      <nav className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center px-5 py-3 md:grid-cols-3 md:px-8">

        {/* Logo - Left */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2.5 justify-self-start"
        >
          <span className="text-[#E477A0]">
            <RoseLogo />
          </span>
          <span className="font-logo text-3xl font-semibold tracking-tight text-[#49333F]">
            WedPlan
          </span>
        </Link>

        {/* Desktop Navigation - Center */}
        <div className="hidden items-center justify-center gap-8 md:flex">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href + "/"));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#D96F96]"
                    : "text-[#66525E] hover:text-[#D96F96]"
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

        {/* Right Side */}
        <div className="hidden items-center justify-self-end gap-5 md:flex">
          {!isPending && (
            user ? (
              <button
                onClick={handleSignOut}
                className="text-sm font-semibold text-[#49333F] transition-colors hover:text-[#D96F96]"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-[#49333F] hover:text-[#D96F96]"
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
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="justify-self-end rounded-lg p-2 text-[#49333F] transition-colors hover:bg-[#F5E8EC] md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-[#F0E3E7] bg-[#FFF9F6] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href + "/"));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#F5E8EC] text-[#D96F96]"
                      : "text-[#66525E] hover:bg-[#F5E8EC] hover:text-[#D96F96]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {!isPending && (
              user ? (
                <button
                  onClick={handleSignOut}
                  className="rounded-lg px-4 py-3 text-left text-sm font-semibold text-[#49333F] hover:bg-[#F5E8EC]"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-semibold text-[#49333F] hover:bg-[#F5E8EC]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="mt-1 rounded-full bg-[#E88BAA] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#D96F96]"
                  >
                    Get Started
                  </Link>
                </>
              )
            )}
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
