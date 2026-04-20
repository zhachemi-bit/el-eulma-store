import { Hero } from '@/sections/Hero';
import { Features } from '@/sections/Features';
import { FeaturedProducts } from '@/sections/FeaturedProducts';
import { Categories } from '@/sections/Categories';
import { HowItWorks } from '@/sections/HowItWorks';
import { Statistics } from '@/sections/Statistics';
import { Testimonials } from '@/sections/Testimonials';
import { VendorCTA } from '@/sections/VendorCTA';
import { FireOffers } from '@/sections/FireOffers';
import { Footer } from '@/components/Footer';
import { StarBackground } from '@/components/StarBackground';

export function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <FireOffers />
      <FeaturedProducts />
      <Categories />
      <HowItWorks />
      <Statistics />
      <Testimonials />
      
      {/* Unified Celestial Bottom Section */}
      <section className="relative overflow-hidden">
        <StarBackground />
        <div className="relative z-10">
          <VendorCTA embedded />
          <div className="border-t border-white/10 mx-auto max-w-7xl my-4 opacity-50" />
          <Footer embedded />
        </div>
      </section>
    </main>
  );
}
