import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Photography & Videography",
    description: "Capture every beautiful moment.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900",
  },
  {
    name: "Wedding Venues",
    description: "Find the perfect place to celebrate.",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900",
  },
  {
    name: "Decoration & Florist",
    description: "Create your dream wedding atmosphere.",
    image:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=900",
  },
  {
    name: "Catering Services",
    description: "Delight your guests with amazing food.",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=900",
  },
  {
    name: "Makeup & Styling",
    description: "Look and feel your absolute best.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900",
  },
  {
    name: "Wedding Fashion",
    description: "Discover your perfect wedding outfit.",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900",
  },
];

export function ServiceCategories() {
  return (
    <section className="bg-[#FDF7F5] px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#987B88]">
            Explore By Category
          </p>

          <h2 className="font-logo text-3xl font-bold text-[#743443] sm:text-4xl">
            Find Services for Every Detail
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#987B88]">
            From stunning venues to beautiful decorations, discover
            everything you need for your perfect wedding day.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/services?category=${encodeURIComponent(category.name)}`}
              className="group relative h-64 overflow-hidden rounded-2xl"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <div className="pr-3">
                  <h3 className="text-lg font-semibold text-white">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs text-white/80">
                    {category.description}
                  </p>
                </div>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#743443] transition-colors group-hover:bg-[#E88BAA] group-hover:text-white">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
