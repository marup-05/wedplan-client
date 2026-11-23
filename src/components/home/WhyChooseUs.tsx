
import {
  BadgeCheck,
  CheckCircle2,
  Crown,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "./animations";

const features = [
  {
    icon: ShieldCheck,
    title: "Curated & Admin-Vetted Vendors",
    description:
      "Every wedding service undergoes administrative review before appearing publicly, ensuring trusted professionals for your celebration.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent Pricing & Easy Requests",
    description:
      "Compare service prices upfront, explore vendors by location, and submit booking requests in just a few steps.",
  },
  {
    icon: HeartHandshake,
    title: "Dedicated Role Dashboards",
    description:
      "Customers track booking requests while vendors manage services, schedules, and bookings from one workspace.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Premium Vendor Badges",
    description:
      "Premium vendors receive a special badge and promotional visibility to showcase their wedding services.",
  },
];

const steps = [
  {
    number: "01",
    title: "Discover Curated Services",
    description:
      "Explore approved photography, venues, florists, catering, beauty, and fashion services.",
  },
  {
    number: "02",
    title: "Send a Booking Request",
    description:
      "Choose your wedding date, add event details, and send a request to your chosen vendor.",
  },
  {
    number: "03",
    title: "Track & Celebrate",
    description:
      "Follow booking updates from your dashboard and keep your wedding plans organized.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-[#FFF9F6] dark:bg-[#15141B] px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Left Side */}
        <Reveal>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#987B88] dark:text-gray-400">
            The WedPlan Promise
          </p>

          <h2 className="font-logo text-4xl font-bold leading-tight text-[#49333F] dark:text-gray-100 sm:text-5xl">
            Why Choose WedPlan?
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#806D76] dark:text-gray-300">
            Designed for modern couples and ambitious wedding vendors alike,
            WedPlan brings trusted partnerships and streamlined booking
            experiences together in one place.
          </p>

          <Stagger className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <StaggerItem
                  key={feature.title}
                  hover="lift"
                  className="rounded-xl border border-[#EAE1E3] dark:border-white/10 bg-white dark:bg-[#1D1C24] p-5 shadow-sm"
                >
                  <Icon
                    size={19}
                    className="mb-3 text-[#8D344D] dark:text-[#E88BAA]"
                    strokeWidth={1.8}
                  />

                  <h3 className="text-sm font-semibold text-[#49333F] dark:text-gray-100">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#987B88] dark:text-gray-400">
                    {feature.description}
                  </p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Reveal>

        {/* Right Side - Premium Vendor */}
        <Reveal
          delay={0.12}
          className="rounded-2xl border border-[#EADDE1] dark:border-white/10 bg-gradient-to-br from-[#F9EDEF] via-white to-[#FFF9F6] dark:from-[#1D1C24] dark:via-[#1D1C24] dark:to-[#15141B] p-6 shadow-sm sm:p-8"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#F5DDE4] dark:bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#84374F] dark:text-[#E88BAA]">
            <Crown size={14} />
            For Wedding Businesses
          </div>

          <h3 className="font-logo text-3xl font-bold leading-tight text-[#49333F] dark:text-gray-100 sm:text-4xl">
            Grow Your Studio With WedPlan Premium
          </h3>

          <p className="mt-4 text-sm leading-6 text-[#806D76] dark:text-gray-300">
            Start free with up to 3 active services, or unlock unlimited
            listings, a verified Premium Vendor badge, and promotional
            benefits with a Premium subscription.
          </p>

          <div className="my-6 border-t border-[#EADDE1] dark:border-white/10" />

          <Stagger className="space-y-5" gap={0.14}>
            {steps.map((step) => (
              <StaggerItem key={step.number} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8D263D] text-xs font-bold text-white">
                  {step.number}
                </span>

                <div>
                  <h4 className="text-sm font-semibold text-[#49333F] dark:text-gray-100">
                    {step.title}
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-[#987B88] dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-6 flex items-center gap-2 border-t border-[#EADDE1] dark:border-white/10 pt-5 text-xs text-[#987B88] dark:text-gray-400">
            <Sparkles size={15} className="text-[#B7794C]" />
            Premium subscription payments are securely handled through Stripe.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
