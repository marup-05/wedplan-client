
import { Search, CalendarCheck, PartyPopper } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover Your Services",
    description:
      "Explore wedding services by category, location, and budget to find the right vendors for your special day.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Request a Booking",
    description:
      "Choose your preferred service, share your event details, and send a booking request to the vendor.",
  },
  {
    number: "03",
    icon: PartyPopper,
    title: "Plan & Celebrate",
    description:
      "Track your booking updates from your dashboard and get ready to celebrate your beautiful day.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#D96F96]">
            Simple Steps, Beautiful Moments
          </p>

          <h2 className="font-logo text-4xl font-bold text-[#49333F] sm:text-5xl">
            Your Wedding Journey Starts Here
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#987B88]">
            From finding the perfect vendor to sending your first booking
            request, planning your wedding is easier with WedPlan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-[#F0E3E7] bg-[#FFF9F6] p-7"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5E4EA] text-[#C65D83]">
                    <Icon size={25} strokeWidth={1.7} />
                  </div>

                  <span className="font-logo text-4xl font-bold text-[#EBD5DE]">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[#49333F]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#987B88]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
