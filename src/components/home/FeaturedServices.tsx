
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "./animations";

type Service = {
  _id: string;
  vendorId: string;
  serviceName: string;
  category: string;
  price: number;
  location: string;
  description: string;
  images: string[];
};

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

async function getFeaturedServices(): Promise<Service[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/services`,
      { cache: "no-store" },
    );

    if (!response.ok) return [];

    const data = await response.json();

    const services: Service[] = Array.isArray(data)
      ? data
      : data.services || data.data || [];

    return categories
      .map((category) =>
        services.find(
          (service) =>
            service.category.trim().toLowerCase() ===
            category.toLowerCase(),
        ),
      )
      .filter((service): service is Service => Boolean(service));
  } catch {
    return [];
  }
}

export async function FeaturedServices() {
  const featuredServices = await getFeaturedServices();

  return (
    <section className="bg-[#FFF9F6] dark:bg-[#15141B] px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section Heading */}
        <Reveal className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#987B88] dark:text-gray-400">
              Curated Showcase
            </p>

            <h2 className="font-logo text-3xl font-bold text-[#743443] dark:text-gray-100 sm:text-4xl">
              Featured Wedding Services
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#806D76] dark:text-gray-300">
              Explore approved, active wedding experiences hand-picked from our
              top creative partners and Premium vendors.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-[#E9DFE2] dark:border-white/10 bg-white dark:bg-[#1D1C24] px-4 py-2.5 text-sm font-medium text-[#49333F] dark:text-gray-100 hover:bg-[#F5E8EC] dark:hover:bg-white/10 sm:self-auto"
          >
            View All Services
            <ArrowRight size={15} />
          </Link>
        </Reveal>

        {/* Service Cards */}
        {featuredServices.length > 0 ? (
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <StaggerItem
                key={service._id}
                as="article"
                hover="lift"
                className="overflow-hidden rounded-xl border border-[#EAE1E3] dark:border-white/10 bg-white dark:bg-[#1D1C24] shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  {service.images?.[0] && (
                    <Image
                      src={service.images[0]}
                      alt={service.serviceName}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )}

                  {/* Category Badge */}
                  <span className="absolute left-3 top-3 max-w-[65%] truncate rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[#49333F] shadow-sm">
                    {service.category}
                  </span>

                  {/* Featured Partner Badge */}
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#FFF1CF] px-2.5 py-1 text-[10px] font-semibold text-[#805C1D] shadow-sm">
                    <Sparkles size={11} />
                    Featured Partner
                  </span>

                  {/* Price */}
                  <span className="absolute bottom-3 right-3 rounded-full bg-[#171313]/90 px-3 py-1.5 text-xs font-bold text-white">
                    ${service.price}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="truncate font-logo text-xl font-bold text-[#49333F] dark:text-gray-100">
                    {service.serviceName}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-1 text-xs text-[#987B88] dark:text-gray-400">
                    <MapPin size={13} />
                    {service.location}
                  </div>

                  <p className="mt-3 min-h-10 text-xs leading-5 text-[#806D76] dark:text-gray-300 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Vendor */}
                  <div className="mt-3 flex items-center gap-2 border-t border-[#F0E7E9] dark:border-white/10 pt-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5E8EC] dark:bg-white/10 text-xs font-bold text-[#743443] dark:text-gray-100">
                      W
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#49333F] dark:text-gray-100">
                        Wedding Vendor
                      </p>
                      <p className="text-[10px] text-[#987B88] dark:text-gray-400">
                        Service Provider
                      </p>
                    </div>
                  </div>

                  {/* Button */}
                  <Link
                    href={`/services/${service._id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#8D263D] py-2.5 text-xs font-semibold text-white hover:bg-[#702033]"
                  >
                    View Details
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <Reveal className="rounded-xl border border-[#EAE1E3] dark:border-white/10 bg-white dark:bg-[#1D1C24] py-16 text-center">
            <p className="text-sm font-medium text-[#743443] dark:text-gray-100">
              No featured services available right now.
            </p>
            <p className="mt-2 text-xs text-[#987B88] dark:text-gray-400">
              Please check back later.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
