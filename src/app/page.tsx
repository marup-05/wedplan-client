
import { connection } from "next/server";

import { FeaturedServices } from "@/components/home/FeaturedServices";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ServiceCategories } from "@/components/home/ServiceCategories";
import { VendorCTA } from "@/components/home/VendorCTA";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export default async function Home() {
  await connection();

  return (
    <main className="min-h-screen bg-[#FFF9F6] dark:bg-[#15141B]">
      <Hero />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseUs />
      <HowItWorks />
      <VendorCTA />
    </main>
  );
}
