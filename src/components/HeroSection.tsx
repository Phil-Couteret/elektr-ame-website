
import { Button } from "@/components/ui/button";
import { Volume } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-darker to-black">
        {/* Animated circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-light/20 filter blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-blue-medium/30 filter blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="inline-block mb-8 p-2 rounded-full bg-black/20 backdrop-blur border border-blue-light/20">
            <Volume className="h-10 w-10 text-blue-medium" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            <span className="text-blue-light">Elektr</span>-Âme
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12">
            {t('hero.description')}
          </p>
          <div className="flex justify-center">
            <Button className="bg-blue-dark hover:bg-blue-darker text-white text-lg px-8 py-6">
              {t('hero.events')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
