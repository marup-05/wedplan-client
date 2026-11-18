import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-6 md:py-8">
      <div className="grid min-h-[650px] overflow-hidden rounded-2xl border border-[#F0E3E7] bg-white shadow-sm lg:grid-cols-2">
        {/* Wedding Image */}
        <div className="relative min-h-[320px] overflow-hidden lg:min-h-[700px]">
          <img
            src="https://www.astramedicare.ca/uploads/6/4/4/7/6447121/astra-groom-bride-wedding-day-blog_orig.jpg"
            alt="Bride and groom on their wedding day"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1722]/75 via-[#2C1722]/10 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
            <p className="font-logo text-4xl font-semibold leading-tight sm:text-5xl">
              For the day
              <br />
              it all begins.
            </p>

            <p className="mt-4 max-w-sm text-sm leading-7 text-white/85">
              Every beautiful wedding starts with a dream.
              Let WedPlan help you make it unforgettable.
            </p>

            <p className="mt-8 font-logo text-4xl font-semibold tracking-wide text-[#F3B2C8]">
              WedPlan ♡
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </section>
  );
}