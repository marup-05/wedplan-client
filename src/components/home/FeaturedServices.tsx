
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";

const featuredServices = [
  {
    id: 1,
    name: "Bespoke Garden Arch & Candlelight",
    category: "Decoration & Florist",
    price: "$3,400",
    location: "San Francisco, CA",
    description:
      "Custom seasonal ceremony arch installation, bridal bouquets, and elegant floral arrangements.",
    vendor: "Atelier Lumiere Weddings",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900",
  },
  {
    id: 2,
    name: "Haute Bridal Couture & Custom Gown",
    category: "Wedding Fashion",
    price: "$2,900",
    location: "Beverly Hills, CA",
    description:
      "Private showroom appointments with elegant bridal gowns and custom wedding designs.",
    vendor: "Atelier Lumiere Weddings",
    image:
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=900",
  },
  {
    id: 3,
    name: "Super 8mm Documentary Wedding Film",
    category: "Photography & Videography",
    price: "$3,100",
    location: "Santa Barbara, CA",
    description:
      "Nostalgic Super 8mm film blended with digital 4K audio capture for your special day.",
    vendor: "Atelier Lumiere Weddings",
    image:
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900",
  },
  {
    id: 4,
    name: "Luxury Garden Wedding Venue",
    category: "Wedding Venues",
    price: "$5,500",
    location: "Los Angeles, CA",
    description:
      "A beautiful outdoor wedding venue surrounded by elegant gardens and natural scenery.",
    vendor: "Rosewood Events",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900",
  },
  {
    id: 5,
    name: "Premium Wedding Photography",
    category: "Photography & Videography",
    price: "$2,500",
    location: "New York, NY",
    description:
      "Professional wedding photography capturing every beautiful moment of your celebration.",
    vendor: "Everlasting Moments",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900",
  },
  {
    id: 6,
    name: "Luxury Bridal Makeup & Styling",
    category: "Makeup & Styling",
    price: "$850",
    location: "Miami, FL",
    description:
      "Personalized bridal makeup and styling to create your perfect wedding-day look.",
    vendor: "Blush Bridal Studio",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900",
  },
];

export function FeaturedServices() {
  return (
    <section className="bg-[#FFF9F6] px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section Heading */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#987B88]">
              Curated Showcase
            </p>

            <h2 className="font-logo text-3xl font-bold text-[#743443] sm:text-4xl">
              Featured Wedding Services
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#806D76]">
              Explore approved, active wedding experiences hand-picked
              from our top creative partners and Premium vendors.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-[#E9DFE2] bg-white px-4 py-2.5 text-sm font-medium text-[#49333F] hover:bg-[#F5E8EC] sm:self-auto"
          >
            View All Services
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <article
              key={service.id}
              className="overflow-hidden rounded-xl border border-[#EAE1E3] bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />

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
                  {service.price}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="truncate font-logo text-xl font-bold text-[#49333F]">
                  {service.name}
                </h3>

                <div className="mt-1.5 flex items-center gap-1 text-xs text-[#987B88]">
                  <MapPin size={13} />
                  {service.location}
                </div>

                <p className="mt-3 min-h-10 text-xs leading-5 text-[#806D76] line-clamp-2">
                  {service.description}
                </p>

                {/* Vendor */}
                <div className="mt-3 flex items-center gap-2 border-t border-[#F0E7E9] pt-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5E8EC] text-xs font-bold text-[#743443]">
                    {service.vendor.charAt(0)}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#49333F]">
                      {service.vendor}
                    </p>
                    <p className="text-[10px] text-[#987B88]">
                      Premium Vendor
                    </p>
                  </div>
                </div>

                {/* Button */}
                <Link
                  href={`/services/${service.id}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#8D263D] py-2.5 text-xs font-semibold text-white hover:bg-[#702033]"
                >
                  View Details
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
