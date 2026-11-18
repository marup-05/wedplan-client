"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Heart,
  ArrowUpDown,
  X,
} from "lucide-react";

const categories = [
  "All",
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const services = [
  {
    id: "1",
    name: "Elegant Wedding Photography",
    category: "Photography & Videography",
    location: "Dhaka",
    price: 850,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    vendor: "Dream Moments Studio",
    rating: "4.9",
  },
  {
    id: "2",
    name: "Luxury Garden Wedding Venue",
    category: "Wedding Venues",
    location: "Chittagong",
    price: 2500,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
    vendor: "Royal Garden Events",
    rating: "4.8",
  },
  {
    id: "3",
    name: "Premium Floral Decoration",
    category: "Decoration & Florist",
    location: "Dhaka",
    price: 1200,
    image: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800",
    vendor: "Bloom Wedding Decor",
    rating: "4.9",
  },
  {
    id: "4",
    name: "Luxury Wedding Catering",
    category: "Catering Services",
    location: "Sylhet",
    price: 1800,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800",
    vendor: "Royal Feast Catering",
    rating: "4.7",
  },
  {
    id: "5",
    name: "Bridal Makeup Package",
    category: "Makeup & Styling",
    location: "Dhaka",
    price: 650,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
    vendor: "Glamour Bridal Studio",
    rating: "4.9",
  },
  {
    id: "6",
    name: "Luxury Bridal Collection",
    category: "Wedding Fashion",
    location: "Chittagong",
    price: 950,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
    vendor: "Elegance Fashion House",
    rating: "4.8",
  },
];

export function ServicesView() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "All",
  );
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("default");

  const filteredServices = useMemo(() => {
    const result = services.filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || service.category === category;

      const matchesLocation = service.location
        .toLowerCase()
        .includes(location.toLowerCase());

      return matchesSearch && matchesCategory && matchesLocation;
    });

    if (sort === "low-to-high") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high-to-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, category, location, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setLocation("");
    setSort("default");
  };

  return (
    <main className="min-h-screen bg-[#FFF9F6]">
      {/* Page Header */}
      <section className="border-b border-[#F0E3E7] bg-white px-5 py-14 text-center md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D96F96]">
          Find Your Perfect Match
        </p>

        <h1 className="mt-4 font-logo text-4xl font-semibold text-[#49333F] sm:text-5xl md:text-6xl">
          Explore Wedding Services
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#987B88] md:text-base">
          Discover trusted wedding professionals and find everything you need to
          create your perfect celebration.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="mx-auto max-w-7xl px-5 pt-10 md:px-8">
        <div className="rounded-2xl border border-[#F0E3E7] bg-white p-5 shadow-sm md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#987B88]"
              />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-xl border border-[#F0E3E7] bg-[#FFF9F6] pl-11 pr-4 text-sm text-[#49333F] outline-none transition focus:border-[#E88BAA]"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <SlidersHorizontal
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#987B88]"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-[#F0E3E7] bg-[#FFF9F6] pl-11 pr-4 text-sm text-[#49333F] outline-none focus:border-[#E88BAA]"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Categories" : item}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#987B88]"
              />
              <input
                type="text"
                placeholder="Search location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 w-full rounded-xl border border-[#F0E3E7] bg-[#FFF9F6] pl-11 pr-4 text-sm text-[#49333F] outline-none focus:border-[#E88BAA]"
              />
            </div>

            {/* Sorting */}
            <div className="relative">
              <ArrowUpDown
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#987B88]"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-[#F0E3E7] bg-[#FFF9F6] pl-11 pr-4 text-sm text-[#49333F] outline-none focus:border-[#E88BAA]"
              >
                <option value="default">Sort by: Default</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#D96F96] transition hover:text-[#49333F]"
            >
              <X size={14} />
              Clear all filters
            </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D96F96]">
              Our Collection
            </p>
            <h2 className="mt-2 font-logo text-3xl font-semibold text-[#49333F] md:text-4xl">
              Wedding Services
            </h2>
          </div>

          <p className="text-sm text-[#987B88]">
            Showing{" "}
            <span className="font-semibold text-[#49333F]">
              {filteredServices.length}
            </span>{" "}
            services
          </p>
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <article
                key={service.id}
                className="group overflow-hidden rounded-2xl border border-[#F0E3E7] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#D96F96]">
                    {service.category}
                  </span>

                  <button
                    type="button"
                    aria-label="Save service"
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#D96F96] transition hover:bg-[#F5E8EC]"
                  >
                    <Heart size={17} />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-[#987B88]">{service.vendor}</p>
                    <span className="text-xs font-semibold text-[#49333F]">
                      ★ {service.rating}
                    </span>
                  </div>

                  <h3 className="mt-3 line-clamp-1 text-lg font-semibold text-[#49333F]">
                    {service.name}
                  </h3>

                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[#987B88]">
                    <MapPin size={14} />
                    {service.location}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-[#F0E3E7] pt-4">
                    <div>
                      <p className="text-[11px] text-[#987B88]">
                        Starting from
                      </p>
                      <p className="mt-1 text-xl font-bold text-[#D96F96]">
                        ${service.price.toLocaleString("en-US")}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service.id}`}
                      className="rounded-full bg-[#E88BAA] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#D96F96]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E8CBD5] bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5E8EC] text-[#D96F96]">
              <Search size={24} />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#49333F]">
              No Services Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#987B88]">
              We couldn't find any services matching your filters. Try changing
              your search or category.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-full bg-[#E88BAA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#D96F96]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
