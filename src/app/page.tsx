
import { Hero } from "@/components/home/Hero";
import { Navbar } from "@/components/shared/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

     <main className="min-h-screen bg-[#FFF9F6]">
      <Hero />
        
      </main>
    </>
  );
}
