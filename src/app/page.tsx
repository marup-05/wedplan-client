
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ServiceCategories } from "@/components/home/ServiceCategories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <>
    
     <main className="min-h-screen bg-[#FFF9F6]">
      <Hero />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseUs />
      <HowItWorks />
        
      </main>
    </>
  );
}
