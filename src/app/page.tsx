import Image from "next/image";
import HeroSection from "@/components/heroeSection";
import FooterSection from "@/components/footer";
import IntegrationsSection from "@/components/IntegrationsSection";
import StatsSection from "@/components/StatsSections";
import FeaturedAlbums from "@/components/FeaturedAlbums";
export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedAlbums />
      <IntegrationsSection />
      <FooterSection />
    </>
  );
}
