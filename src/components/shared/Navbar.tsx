
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
];

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

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#F0E3E7] bg-[#FFF9F6]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2.5"
        >
          <span className="text-[#E477A0]">
            <RoseLogo />
          </span>

          <span className="font-logo text-3xl font-semibold tracking-tight text-[#49333F]">
            WedPlan
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-sm font-medium transition-colors duration-200 ${
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#49333F] transition-colors hover:bg-[#F5E8EC] md:hidden"
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
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

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
          </div>
        </div>
      )}
    </header>
  );
}
