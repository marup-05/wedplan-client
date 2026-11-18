
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";

export function VendorCTA() {
  return (
    <section className="bg-[#FFF9F6] px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-[#49333F] md:grid-cols-2">
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-[#F3B2C8]">
            <Crown size={15} />
            For Wedding Professionals
          </div>

          <h2 className="font-logo text-4xl font-bold leading-tight text-white sm:text-5xl">
            Turn Your Passion Into Beautiful Opportunities
          </h2>

          <p className="mt-5 text-sm leading-7 text-white/70">
            Join WedPlan, showcase your wedding services, connect with
            customers, and grow your business with the right audience.
          </p>

          <Link
            href="/sign-up?role=vendor"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#E88BAA] px-6 py-3.5 text-sm font-semibold text-[#49333F] transition-colors hover:bg-[#F3B2C8]"
          >
            Become a Vendor
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="relative min-h-[300px] md:min-h-[450px]">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200"
            alt="Wedding celebration"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#49333F]/35 to-transparent" />
        </div>
      </div>
    </section>
  );
}
