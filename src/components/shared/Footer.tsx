
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
];

export function Footer() {
  return (
    <footer className="bg-[#49333F] dark:bg-[#15141B] px-5 py-9 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 border-b border-white/15 dark:border-white/25 pb-7 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" aria-label="WedPlan home">
              <Image
                src="/images/wedplan-logo-transparent.png"
                alt="WedPlan"
                width={1346}
                height={807}
                className="h-10 w-auto dark:brightness-[3]"
              />
            </Link>

            <p className="mt-3 max-w-xs text-xs leading-6 text-white/65">
              Discover trusted wedding professionals and bring your
              dream wedding to life with WedPlan.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-4 text-white/65">
              <Link href="#" aria-label="Instagram" className="transition-colors hover:text-[#F3B2C8]">
                <FaInstagram size={17} />
              </Link>

              <Link href="#" aria-label="Facebook" className="transition-colors hover:text-[#F3B2C8]">
                <FaFacebookF size={17} />
              </Link>

              <Link href="#" aria-label="Twitter" className="transition-colors hover:text-[#F3B2C8]">
                <FaTwitter size={17} />
              </Link>

              <Link href="#" aria-label="LinkedIn" className="transition-colors hover:text-[#F3B2C8]">
                <FaLinkedinIn size={17} />
              </Link>

              <Link href="#" aria-label="X" className="transition-colors hover:text-[#F3B2C8]">
                <FaXTwitter size={17} />
              </Link>

              <Link href="#" aria-label="YouTube" className="transition-colors hover:text-[#F3B2C8]">
                <FaYoutube size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-xs text-white/65">
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
            <h3 className="mb-4 text-sm font-semibold text-white">
              Wedding Categories
            </h3>

            <div className="flex flex-col gap-3 text-xs text-white/65">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="transition-colors hover:text-[#F3B2C8]"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              Contact Information
            </h3>

            <div className="flex flex-col gap-4 text-xs text-white/65">
              <p className="flex items-center gap-3">
                <Mail size={15} className="shrink-0 text-[#F3B2C8]" />
                hello@wedplan.com
              </p>

              <p className="flex items-center gap-3">
                <Phone size={15} className="shrink-0 text-[#F3B2C8]" />
                +880 1XXX-XXXXXX
              </p>

              <p className="flex items-center gap-3">
                <MapPin size={15} className="shrink-0 text-[#F3B2C8]" />
                Bangladesh
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-3 pt-5 text-center text-[11px] text-white/55 sm:flex-row sm:text-left">
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
