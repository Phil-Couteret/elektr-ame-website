import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicData } from "@/hooks/usePublicData";
import { GalleryItem } from "@/types/admin";
import { useState } from "react";

const GalleryCard = ({ item }: { item: GalleryItem }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-black/80 to-gray-800/80 backdrop-blur border border-white/5 hover:border-electric-blue/30 transition-all">
      <div className="aspect-square relative overflow-hidden">
        {!imageError ? (
          <img 
            src={item.picture} 
            alt={item.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-electric-blue/20 to-neon-pink/20 flex items-center justify-center">
            <Image className="h-16 w-16 text-white/30" />
          </div>
        )}
        
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 to-neon-pink/20 flex items-center justify-center">
            <Image className="h-16 w-16 text-white/30 animate-pulse" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
            {item.description && (
              <p className="text-white/80 text-sm line-clamp-2">{item.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GallerySection = () => {
  const { t } = useLanguage();
  const { gallery } = usePublicData();
  
  return (
    <section id="gallery" className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-12 gap-4">
          <Image className="h-10 w-10 text-blue-medium" />
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Gallery</h2>
            <p className="text-white/70 mt-2">Moments from our events and community</p>
          </div>
        </div>

        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gallery.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Image className="h-16 w-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/70 text-lg">No gallery items yet.</p>
            <p className="text-white/50 text-sm mt-2">Check back soon for photos and moments!</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button 
            className="bg-black/30 hover:bg-black/50 text-blue-light border border-blue-light/50"
          >
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;




