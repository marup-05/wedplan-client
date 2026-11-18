
import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#49333F] px-5 py-12 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link
              href="/"
              className="font-logo text-3xl font-bold text-[#F3B2C8]"
            >
              WedPlan
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">
              Discover trusted wedding professionals and bring your
              dream wedding to life with WedPlan.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-sm text-white/65">
              <Link href="/" className="hover:text-[#F3B2C8]">Home</Link>
              <Link href="/services" className="hover:text-[#F3B2C8]">Browse Services</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              Wedding Categories
            </h3>

            <div className="flex flex-col gap-3 text-sm text-white/65">
              <Link href="/services?category=Photography%20%26%20Videography" className="hover:text-[#F3B2C8]">
                Photography & Videography
              </Link>
              <Link href="/services?category=Wedding%20Venues" className="hover:text-[#F3B2C8]">
                Wedding Venues
              </Link>
              <Link href="/services?category=Decoration%20%26%20Florist" className="hover:text-[#F3B2C8]">
                Decoration & Florist
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-7 text-center text-xs text-white/55 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} WedPlan. All rights reserved.</p>

          <p className="flex items-center gap-1.5">
            Made with <Heart size={13} className="fill-[#E88BAA] text-[#E88BAA]" /> for your special day
          </p>
        </div>
      </div>
    </footer>
  );
}
