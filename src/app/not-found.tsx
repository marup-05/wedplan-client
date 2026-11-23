
import Link from "next/link";
import { ArrowLeft, Heart, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#FFF9F6] dark:bg-[#15141B] px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5E5EB] dark:bg-white/10 text-[#D96F96]">
          <Heart size={36} strokeWidth={1.5} />
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D96F96]">
          Oops! Lost in Love
        </p>

        <h1 className="mt-4 font-logo text-7xl font-bold text-[#49333F] dark:text-gray-100 sm:text-8xl">
          404
        </h1>

        <h2 className="mt-4 text-xl font-semibold text-[#49333F] dark:text-gray-100 sm:text-2xl">
          This Page Couldn&apos;t Be Found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#987B88] dark:text-gray-400">
          Looks like this page has wandered off. Don&apos;t worry,
          your perfect wedding journey is still waiting for you!
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E88BAA] px-7 py-3.5 text-sm font-semibold text-[#49333F] transition-colors hover:bg-[#F3B2C8]"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E88BAA] px-7 py-3.5 text-sm font-semibold text-[#D96F96] transition-colors hover:bg-[#F5E8EC] dark:hover:bg-white/10"
          >
            <Search size={17} />
            Explore Services
          </Link>
        </div>
      </div>
    </main>
  );
}
