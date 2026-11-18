
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Star,
  ShieldCheck,
  CalendarDays,
  Heart,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    id: "1",
    name: "Elegant Wedding Photography",
    category: "Photography & Videography",
    description:
      "Capture every beautiful moment of your special day with our professional wedding photography team. We focus on natural emotions, elegant portraits, and timeless memories that you will cherish forever.",
    price: 850,
    location: "Dhaka, Bangladesh",
    vendor: "Dream Moments Studio",
    vendorDescription:
      "Professional wedding photography and cinematography team creating beautiful wedding memories.",
    rating: "4.9",
    reviews: 124,
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
    ],
    approved: true,
    active: true,
  },
  {
    id: "2",
    name: "Luxury Garden Wedding Venue",
    category: "Wedding Venues",
    description:
      "Celebrate your wedding in a beautiful garden venue with elegant decoration, spacious arrangements, and a memorable atmosphere for your special guests.",
    price: 2500,
    location: "Chittagong, Bangladesh",
    vendor: "Royal Garden Events",
    vendorDescription:
      "Premium wedding venue and event management service.",
    rating: "4.8",
    reviews: 98,
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    ],
    approved: true,
    active: true,
  },
  {
    id: "3",
    name: "Premium Floral Decoration",
    category: "Decoration & Florist",
    description:
      "Transform your wedding venue with stunning floral arrangements, beautiful stage decoration, and carefully selected flowers to create a romantic atmosphere.",
    price: 1200,
    location: "Dhaka, Bangladesh",
    vendor: "Bloom Wedding Decor",
    vendorDescription:
      "Creative wedding decorators specializing in floral designs and elegant event styling.",
    rating: "4.9",
    reviews: 86,
    images: [
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1200",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800",
    ],
    approved: true,
    active: true,
  },
  {
    id: "4",
    name: "Luxury Wedding Catering",
    category: "Catering Services",
    description:
      "Make your celebration unforgettable with delicious food, professional catering arrangements, and carefully planned menus for your wedding guests.",
    price: 1800,
    location: "Sylhet, Bangladesh",
    vendor: "Royal Feast Catering",
    vendorDescription:
      "Professional catering team offering premium wedding dining experiences.",
    rating: "4.7",
    reviews: 72,
    images: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      "https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?w=800",
    ],
    approved: true,
    active: true,
  },
  {
    id: "5",
    name: "Bridal Makeup Package",
    category: "Makeup & Styling",
    description:
      "Look and feel your best on your wedding day with professional bridal makeup, personalized styling, and a beautiful finishing touch.",
    price: 650,
    location: "Dhaka, Bangladesh",
    vendor: "Glamour Bridal Studio",
    vendorDescription:
      "Professional bridal makeup artists focused on elegant and personalized looks.",
    rating: "4.9",
    reviews: 110,
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
    ],
    approved: true,
    active: true,
  },
  {
    id: "6",
    name: "Luxury Bridal Collection",
    category: "Wedding Fashion",
    description:
      "Discover elegant bridal fashion with beautiful designs, premium fabrics, and carefully crafted outfits for your special celebration.",
    price: 950,
    location: "Chittagong, Bangladesh",
    vendor: "Elegance Fashion House",
    vendorDescription:
      "Bridal fashion specialists offering elegant wedding collections.",
    rating: "4.8",
    reviews: 64,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800",
    ],
    approved: true,
    active: true,
  },
];

type ServiceDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  const { id } = await params;

  const service = services.find((item) => item.id === id);

  if (!service || !service.approved || !service.active) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#FFF9F6] px-5 py-16">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5E8EC] text-[#D96F96]">
            <Heart size={30} />
          </div>

          <h1 className="mt-6 font-logo text-4xl font-semibold text-[#49333F]">
            Service Not Found
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#987B88]">
            This service may no longer be available or the service
            link is invalid. Explore other wedding services instead.
          </p>

          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#E88BAA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#D96F96]"
          >
            <ArrowLeft size={16} />
            Browse Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9F6]">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-5 pt-8 md:px-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#987B88] transition hover:text-[#D96F96]"
        >
          <ArrowLeft size={17} />
          Back to Services
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        {/* Image Gallery */}
        <section className="grid grid-cols-1 gap-3 overflow-hidden rounded-2xl md:h-[480px] md:grid-cols-2">
          {/* Main Image */}
          <div className="relative h-[300px] overflow-hidden md:h-full">
            <Image
              src={service.images[0]}
              alt={service.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Additional Images */}
          <div className="grid grid-cols-1 grid-rows-2 gap-3 md:min-h-0">
            {service.images.slice(1, 3).map((image, index) => (
              <div
                key={index}
                className="relative min-h-[180px] overflow-hidden md:min-h-0"
              >
                <Image
                  src={image}
                  alt={`${service.name} image ${index + 2}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Service Information */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="inline-flex rounded-full bg-[#F5E8EC] px-4 py-2 text-xs font-semibold text-[#D96F96]">
              {service.category}
            </span>

            <h1 className="mt-5 font-logo text-4xl font-semibold leading-tight text-[#49333F] sm:text-5xl">
              {service.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-[#987B88]">
              <span className="flex items-center gap-2">
                <MapPin size={17} />
                {service.location}
              </span>

              <span className="flex items-center gap-2">
                <Star
                  size={17}
                  className="fill-[#E8B45B] text-[#E8B45B]"
                />
                <strong className="text-[#49333F]">
                  {service.rating}
                </strong>
                ({service.reviews} reviews)
              </span>
            </div>

            {/* Description */}
            <div className="mt-10 border-t border-[#F0E3E7] pt-8">
              <h2 className="font-logo text-3xl font-semibold text-[#49333F]">
                About This Service
              </h2>

              <p className="mt-4 text-sm leading-8 text-[#806C77]">
                {service.description}
              </p>
            </div>

            {/* Vendor Information */}
            <div className="mt-10 border-t border-[#F0E3E7] pt-8">
              <h2 className="font-logo text-3xl font-semibold text-[#49333F]">
                About the Vendor
              </h2>

              <div className="mt-5 flex items-start gap-4 rounded-2xl border border-[#F0E3E7] bg-white p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F5E8EC] text-xl font-bold text-[#D96F96]">
                  {service.vendor.charAt(0)}
                </div>

                <div>
                  <h3 className="font-semibold text-[#49333F]">
                    {service.vendor}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#987B88]">
                    {service.vendorDescription}
                  </p>

                  <p className="mt-3 flex items-center gap-2 text-xs font-medium text-[#4D9A78]">
                    <ShieldCheck size={15} />
                    Verified Vendor
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-[#F0E3E7] bg-white p-6 shadow-sm">
              <p className="text-xs font-medium text-[#987B88]">
                Starting from
              </p>

              <p className="mt-2 text-3xl font-bold text-[#D96F96]">
                ${service.price.toLocaleString("en-US")}
              </p>

              <p className="mt-1 text-xs text-[#987B88]">
                Contact vendor for package details
              </p>

              <div className="my-6 border-t border-[#F0E3E7]" />

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-[#66525E]">
                  <CheckCircle2 size={17} className="text-[#D96F96]" />
                  Professional wedding vendor
                </div>

                <div className="flex items-center gap-3 text-sm text-[#66525E]">
                  <CheckCircle2 size={17} className="text-[#D96F96]" />
                  Personalized service
                </div>

                <div className="flex items-center gap-3 text-sm text-[#66525E]">
                  <CheckCircle2 size={17} className="text-[#D96F96]" />
                  Booking request available
                </div>
              </div>

              <Link
                href="/sign-in"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#E88BAA] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#D96F96]"
              >
                <CalendarDays size={17} />
                Sign In to Book
              </Link>

              <p className="mt-4 text-center text-xs leading-6 text-[#987B88]">
                Sign in with your customer account to send a booking
                request to this vendor.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
