
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EventsSection from "@/components/EventsSection";
import AboutSection from "@/components/AboutSection";
import ArtistSection from "@/components/ArtistSection";
import GallerySection from "@/components/GallerySection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { getDefaultOrganizationData, generateWebSiteData } from "@/utils/structuredData";

const Index = () => {
  const structuredData = [
    getDefaultOrganizationData(),
    generateWebSiteData(
      'https://www.elektr-ame.com',
      'Elektr-Âme',
      "Barcelona's electronic music association. Join our community of artists, DJs, producers, and music lovers."
    ),
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="Elektr-Âme | Barcelona Electronic Music Association"
        description="Elektr-Âme - Barcelona's electronic music association. Join our community of artists, DJs, producers, and music lovers. Discover upcoming events, artist profiles, and more."
        url="https://www.elektr-ame.com"
        keywords="electronic music, Barcelona, DJ, producer, music association, events, concerts, techno, house music"
        structuredData={structuredData}
      />
      <Header />
      <HeroSection />
      <AboutSection />
      <EventsSection />
      <ArtistSection />
      <GallerySection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
