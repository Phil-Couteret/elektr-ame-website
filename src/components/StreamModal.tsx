import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Heart, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

interface StreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamUrl: string;
  streamTitle: string;
}

const StreamModal = ({ isOpen, onClose, streamUrl, streamTitle }: StreamModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Normalize the URL - handle both absolute URLs and relative paths
  const getStreamUrl = () => {
    if (!streamUrl) return '';
    
    // If it's already a full URL (http/https), use it as-is
    if (streamUrl.startsWith('http://') || streamUrl.startsWith('https://')) {
      return streamUrl;
    }
    
    // If it's a relative path, ensure it starts with /
    const normalizedPath = streamUrl.startsWith('/') ? streamUrl : `/${streamUrl}`;
    return normalizedPath;
  };

  // Convert YouTube URL to embed format if needed
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Check if it's a YouTube URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    // For other URLs, return as-is
    return url;
  };

  useEffect(() => {
    if (isOpen && streamUrl) {
      // Check if this stream is in favorites (localStorage)
      const favorites = JSON.parse(localStorage.getItem('favoriteStreams') || '[]');
      setIsFavorite(favorites.includes(streamUrl));
      
      // Debug logging
      const url = getStreamUrl();
      const embedUrl = getEmbedUrl(url);
      console.log('StreamModal - streamUrl:', streamUrl);
      console.log('StreamModal - normalized URL:', url);
      console.log('StreamModal - embed URL:', embedUrl);
      
      // Show loading for a brief moment, then show iframe immediately
      // YouTube embeds load better when visible
      setIsLoading(true);
      setError(null);
      
      // Short delay to show spinner, then show iframe (it will load in background)
      const showDelay = setTimeout(() => {
        setIsLoading(false);
      }, 500); // Half second buffer
      
      // Fallback timeout in case iframe never loads (5 seconds)
      const fallbackTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      
      return () => {
        clearTimeout(showDelay);
        clearTimeout(fallbackTimeout);
      };
    } else {
      setIsLoading(false);
    }
  }, [isOpen, streamUrl]);

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteStreams') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter((url: string) => url !== streamUrl);
      localStorage.setItem('favoriteStreams', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(streamUrl);
      localStorage.setItem('favoriteStreams', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleOpenInNewTab = () => {
    const url = getStreamUrl();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const url = getStreamUrl();
  const embedUrl = getEmbedUrl(url);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] bg-black/95 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <span>{streamTitle}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Action Buttons */}
          <div className="flex gap-2 mb-4 pb-4 border-b border-white/10">
            <Button
              onClick={handleToggleFavorite}
              variant={isFavorite ? "default" : "outline"}
              className={isFavorite 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "border-white/20 text-white hover:bg-white/10"
              }
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
            <Button
              onClick={handleOpenInNewTab}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              disabled={!url || isLoading || !!error}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 relative border border-white/10 rounded-lg overflow-hidden bg-black/50">
            {/* Show iframe immediately - it will load in background */}
            {embedUrl && (
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                title={streamTitle}
                onLoad={() => {
                  console.log('StreamModal - iframe loaded successfully');
                  setIsLoading(false);
                }}
                onError={(e) => {
                  console.error('StreamModal - iframe error:', e);
                  setError('Failed to load stream. The URL may be invalid or blocked.');
                  setIsLoading(false);
                }}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s ease-in' }}
              />
            )}
            
            {/* Loading overlay - only show briefly */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
                  <p className="text-white/70">Loading stream...</p>
                </div>
              </div>
            )}
            
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-400 mb-4">{error}</p>
                  <Button
                    onClick={handleOpenInNewTab}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Try Opening in New Tab
                  </Button>
                </div>
              </div>
            ) : !embedUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-400 mb-4">Invalid stream URL</p>
                  <p className="text-white/70 text-sm mb-4">URL: {streamUrl}</p>
                  <Button
                    onClick={handleOpenInNewTab}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Try Opening in New Tab
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StreamModal;

