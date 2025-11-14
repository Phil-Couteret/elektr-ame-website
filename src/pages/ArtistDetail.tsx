import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArtistProfile from "@/components/ArtistProfile";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { SEO } from "@/components/SEO";

interface Artist {
  id: string;
  name: string;
  nickname?: string;
  bio: string;
  picture?: string;
  socialLinks: { [key: string]: string };
}

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArtist(id);
    }
  }, [id]);

  const fetchArtist = async (artistId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/artists-list.php', {
        credentials: 'include'
      });
      
      const result = await response.json();
      
      if (result.success) {
        const foundArtist = result.artists.find((a: any) => a.id.toString() === artistId);
        if (foundArtist) {
          setArtist(foundArtist);
        }
      }
    } catch (error) {
      console.error('Error fetching artist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-24 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto"></div>
          <p className="text-white/70 mt-4">Loading artist...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-24 text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-white/30" />
          <h1 className="text-2xl font-bold mb-2">Artist Not Found</h1>
          <p className="text-white/70 mb-6">The artist you're looking for doesn't exist.</p>
          <Button 
            onClick={() => navigate('/#artists')}
            className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Artists
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const artistImage = artist?.picture 
    ? (artist.picture.startsWith('/') ? artist.picture : `/${artist.picture}`)
    : "https://www.elektr-ame.com/elektr-ame-media/85e5425f-9e5d-4f41-a064-2e7734dc6c51.png";

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title={artist ? `${artist.name} | Elektr-Âme` : "Artist | Elektr-Âme"}
        description={artist ? `${artist.name} - ${artist.bio?.substring(0, 150) || 'Artist profile on Elektr-Âme'}...` : "Artist profile on Elektr-Âme"}
        image={artistImage}
        url={`https://www.elektr-ame.com/artist/${id}`}
        type="profile"
        keywords={artist ? `${artist.name}, electronic music, Barcelona, DJ, producer, ${artist.nickname || ''}` : "electronic music, Barcelona"}
      />
      <Header />
      
      {/* Artist Header */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-deep-purple to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={() => navigate('/#artists')}
            className="mb-6 bg-electric-blue hover:bg-electric-blue/80 text-deep-purple font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Artists
          </Button>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {artist.picture ? (
              <img
                src={artist.picture}
                alt={artist.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-electric-blue/50"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-electric-blue/20 to-neon-pink/20 flex items-center justify-center border-4 border-white/20">
                <User className="h-24 w-24 text-white/30" />
              </div>
            )}

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{artist.name}</h1>
              {artist.nickname && (
                <p className="text-2xl text-electric-blue mb-4">"{artist.nickname}"</p>
              )}
              <p className="text-white/80 text-lg mb-6 max-w-3xl">{artist.bio}</p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {Object.entries(artist.socialLinks).map(([platform, url]) => {
                  if (!url || url === '#') return null;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-electric-blue/20 text-electric-blue rounded-lg hover:bg-electric-blue/30 transition-colors text-sm font-medium"
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artist Gallery */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Gallery</h2>
          <ArtistProfile 
            artistId={parseInt(id!)} 
            artistName={artist.name} 
            isAdmin={false}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArtistDetail;

