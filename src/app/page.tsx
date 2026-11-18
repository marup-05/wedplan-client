
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { Hero } from "@/components/home/Hero";
import { ServiceCategories } from "@/components/home/ServiceCategories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Navbar } from "@/components/shared/Navbar";

export default function Home() {
  return (
    <>
    
     <main className="min-h-screen bg-[#FFF9F6]">
      <Hero />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseUs />
        
      </main>
    </>
  );
}
