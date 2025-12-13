import Hero, { MobileServicesSection } from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Stats from '@/components/Stats';
import Projects from '@/components/Projects';
import Partners from '@/components/Partners';

export default function Home() {
  return (
    <>
      <Hero />
      {/* Mobilde Hero'dan sonra ayrı section olarak kartlar */}
      <MobileServicesSection />
      <About />
      <Services />
      <Stats />
      <Projects />
      <Partners />
    </>
  );
}

