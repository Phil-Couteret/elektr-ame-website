import { Button } from "@/components/ui/button";
import { Volume, ChevronDown, ChevronUp, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { usePublicData } from "@/hooks/usePublicData";
import { Artist } from "@/types/admin";

const ArtistCard = ({ artist }: { artist: Artist }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();
  
  // Get role display text
  const getRoleDisplay = () => {
    if (artist.nickname && artist.nickname.trim()) {
      return artist.nickname;
    }
    return "DJ / Producer"; // Default role
  };

  // Get bio text - use translation if bioKey exists, otherwise fallback to bio
  const getBioText = () => {
    if (artist.bioKey) {
      return t(artist.bioKey, artist.bio);
    }
    return artist.bio;
  };

  return (
    <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-black/80 to-gray-800/60 backdrop-blur border border-white/5 group">
      <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-2 border-blue-medium/50 group-hover:border-blue-medium transition-all">
        {artist.picture ? (
          <img 
            src={artist.picture} 
            alt={artist.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-electric-blue/20 to-neon-pink/20 flex items-center justify-center">
            <User className="h-16 w-16 text-white/30" />
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{artist.name}</h3>
      <p className="text-blue-light mb-4">{getRoleDisplay()}</p>
      
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="w-full">
        <div className="text-white/70 text-sm text-center mb-6 leading-relaxed">
          <div className={`${!isExpanded ? 'line-clamp-2' : ''}`}>
            {getBioText()}
          </div>
          <CollapsibleTrigger className="flex items-center justify-center w-full mt-2 text-blue-medium hover:text-white transition-colors">
            {isExpanded ? (
              <>
                <span className="mr-1">{t('artists.showLess', 'Show less')}</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span className="mr-1">{t('artists.readMore', 'Read more')}</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </CollapsibleTrigger>
        </div>
      </Collapsible>
      
      <div className="flex space-x-3 flex-wrap justify-center gap-y-2">
        {Object.entries(artist.socialLinks).map(([platform, url]) => {
          if (!url || url === '#') return null;
          
          const getSocialIcon = (platform: string) => {
            switch (platform) {
              case 'soundcloud':
                return (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.56 8.87V17h1.87V9c-.52-.28-1.3-.4-1.87-.13zm-1.87 3.82c-.2-.13-.4-.13-.53 0V17h.53V12.7zm-2.13.39c0-.13 0-.13-.13-.26a.8.8 0 0 0-.4 0c-.13.13-.27.13-.27.26V17h.67v-4.1h.13zm-2.13-.26c0-.27-.13-.27-.27-.4-.13 0-.4 0-.53.13V17h.67v-4.36h.13zm-2.14.52c.13 0 .13-.13.26-.13s.27-.13.27-.26a.5.5 0 0 0-.27-.4c-.13 0-.13.14-.26.27v.53zm-1.2 2.26A2.74 2.74 0 0 1 2 14.79v.79c0 .26.14.52.27.79.13.13.26.39.4.52.13 0 .26.13.26.26h.14c.26-.26.53-.52.66-.92 0-.13.13-.13.13-.26V14.4c0-.26-.13-.39-.13-.66a.47.47 0 0 0-.66-.26c-.13 0-.13.13-.26.13zm17.07-6.48a7.52 7.52 0 0 0-1.73-2.74 7.19 7.19 0 0 0-2.6-1.87 8.33 8.33 0 0 0-3.06-.66c-1.2 0-2.34.27-3.47.67-.4.13-.66.26-1.06.39-.27.13-.53.13-.8.26 0 0-.13.13-.13 0V4.4c0-.39-.13-.52-.53-.52h-.8c-.93 0-1.2.39-1.33 1.19v.13s-.14 1.2-.14 2.79c0 1.59.14 3.18.14 3.31v.4c0 .4 0 .8.13 1.2.13.92.92 1.05 1.73 1.05h.4c.8 0 1.2-.13 1.33-.92v-.26-1.7c0-.4.13-.67.53-.67h.13c.94.53 1.87.92 2.94 1.05 1.2.27 2.4.27 3.6 0a7.2 7.2 0 0 0 2.26-.92c1.07-.53 1.87-1.33 2.4-2.39.52-1.05.79-2.1.79-3.31s-.13-2.52-.53-3.44zM14.5 14.26c0 .4-.14.67-.4.93-.27.27-.67.27-1.07.27a1.5 1.5 0 0 1-1.06-.27c-.27-.26-.4-.53-.4-.92V9.52c0-.26.13-.53.26-.66.14-.13.27-.13.54-.13a.95.95 0 0 1 .8.13c.26.13.26.4.26.66v4.74h1.07z" />
                  </svg>
                );
              case 'instagram':
                return (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.041 0 2.67.01 2.986.058 4.04.045.977.207 1.505.344 1.858.182.466.398.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058 2.67 0 2.987-.01 4.04-.058.977-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041 0-2.67-.01-2.986-.058-4.04-.045-.977-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.041-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.469a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                  </svg>
                );
              case 'linktree':
                return (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.951 10.146l-3.566 3.567c-.22.22-.526.366-.853.366s-.632-.146-.853-.366L7.113 9.147a1.208 1.208 0 0 1 1.706-1.706l3.18 3.181 3.18-3.181a1.208 1.208 0 0 1 1.706 1.706z"/>
                  </svg>
                );
              default:
                return (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.36 5.64a9 9 0 1 1-12.73 0"/>
                    <line x1="12" y1="2" x2="12" y2="12"/>
                  </svg>
                );
            }
          };
          
          return (
            <a 
              key={platform}
              href={url} 
              className="text-white/60 hover:text-blue-light transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
              title={platform.charAt(0).toUpperCase() + platform.slice(1)}
            >
              {getSocialIcon(platform)}
            </a>
          );
        })}
      </div>
    </div>
  );
};

const ArtistSection = () => {
  const { t } = useLanguage();
  const { artists } = usePublicData();
  
  return (
    <section id="artists" className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-12 gap-4">
          <Volume className="h-10 w-10 text-blue-medium" />
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">{t('artists.title')}</h2>
            <p className="text-white/70 mt-2">{t('artists.subtitle')}</p>
          </div>
        </div>

        {artists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-16 w-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/70 text-lg">No artists to showcase at the moment.</p>
            <p className="text-white/50 text-sm mt-2">Check back soon for featured artists!</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button 
            className="bg-black/30 hover:bg-black/50 text-blue-light border border-blue-light/50"
          >
            {t('artists.viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArtistSection;
