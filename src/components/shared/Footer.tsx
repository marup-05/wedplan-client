
import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#49333F] px-5 py-7 text-white md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 border-b border-white/15 pb-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-logo text-2xl font-bold text-[#F3B2C8]"
            >
              WedPlan
            </Link>

            <p className="mt-2 max-w-xs text-xs leading-6 text-white/65">
              Discover trusted wedding professionals and bring your
              dream wedding to life with WedPlan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">
              Quick Links
            </h3>

            <div className="flex flex-col gap-2 text-xs text-white/65">
              <Link href="/" className="transition-colors hover:text-[#F3B2C8]">
                Home
              </Link>

              <Link
                href="/services"
                className="transition-colors hover:text-[#F3B2C8]"
              >
                Browse Services
              </Link>
            </div>
          </div>

          {/* Wedding Categories */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">
              Wedding Categories
            </h3>

            <div className="flex flex-col gap-2 text-xs text-white/65">
              <p
                // href="/services?category=Photography%20%26%20Videography"
                className="transition-colors hover:text-[#F3B2C8]"
              >
                Photography & Videography
              </p>

              <Link
                href="/services?category=Wedding%20Venues"
                className="transition-colors hover:text-[#F3B2C8]"
              >
                Wedding Venues
              </Link>

              <Link
                href="/services?category=Decoration%20%26%20Florist"
                className="transition-colors hover:text-[#F3B2C8]"
              >
                Decoration & Florist
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-2 pt-5 text-center text-[11px] text-white/55 sm:flex-row sm:text-left">
          <p>© 2026 WedPlan. All rights reserved.</p>

          <p className="flex items-center gap-1.5">
            Made with
            <Heart
              size={12}
              className="fill-[#E88BAA] text-[#E88BAA]"
            />
            for your special day
          </p>
        </div>
      </div>
    </footer>
  );
}
