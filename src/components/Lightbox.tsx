import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    src: string;
    alt?: string;
    title?: string;
    description?: string;
  }>;
  currentIndex: number;
  onNavigate?: (index: number) => void;
}

export const Lightbox = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}: LightboxProps) => {
  // Filter out any invalid images (undefined, null, or missing src) - memoized for stability
  const validImages = useMemo(() => {
    if (!images || !Array.isArray(images)) return [];
    return images.filter(img => {
      return img && 
             typeof img === 'object' && 
             img.src && 
             typeof img.src === 'string' && 
             img.src.trim().length > 0;
    });
  }, [images]);
  
  const [index, setIndex] = useState(() => {
    if (validImages.length === 0) return 0;
    return Math.max(0, Math.min(currentIndex, validImages.length - 1));
  });

  useEffect(() => {
    if (validImages.length === 0) {
      setIndex(0);
      return;
    }
    const validIndex = Math.max(0, Math.min(currentIndex, validImages.length - 1));
    // Ensure the image at this index actually exists and has a valid src
    if (validImages[validIndex] && validImages[validIndex].src) {
      setIndex(validIndex);
    } else {
      // If the requested index is invalid, find the first valid image
      const firstValidIndex = validImages.findIndex(img => img && img.src);
      if (firstValidIndex !== -1) {
        setIndex(firstValidIndex);
      } else {
        setIndex(0);
      }
    }
  }, [currentIndex, validImages.length, validImages]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, index]);

  // Close lightbox if no valid images (use effect to avoid hooks rule violation)
  useEffect(() => {
    if (isOpen && validImages.length === 0) {
      if (onClose) onClose();
    }
  }, [isOpen, validImages.length, onClose]);

  // Early return if not open
  if (!isOpen) {
    return null;
  }

  // Early return if no valid images
  if (validImages.length === 0) {
    return null;
  }

  // Safety check: ensure index is valid and currentImage exists
  const validIndex = Math.max(0, Math.min(index, validImages.length - 1));
  const currentImage = validImages[validIndex];
  
  // Final safety check before rendering - but don't close immediately, try to find valid image first
  useEffect(() => {
    if (isOpen && validImages.length > 0) {
      // If current image is invalid, try to find a valid one
      if (!currentImage || !currentImage.src || typeof currentImage.src !== 'string') {
        const firstValidIndex = validImages.findIndex(img => img && img.src && typeof img.src === 'string');
        if (firstValidIndex !== -1) {
          setIndex(firstValidIndex);
          if (onNavigate) onNavigate(firstValidIndex);
        } else {
          // Only close if no valid images exist at all
          console.error('Lightbox: No valid images found');
          if (onClose) onClose();
        }
      }
    }
  }, [isOpen, currentImage, validIndex, validImages.length, index, onClose, onNavigate, validImages]);
  
  // If current image is invalid, use first valid image as fallback
  const imageToRender = (currentImage && currentImage.src && typeof currentImage.src === 'string') 
    ? currentImage 
    : validImages.find(img => img && img.src && typeof img.src === 'string');
  
  // Early return only if no valid images exist at all
  if (!imageToRender || !imageToRender.src || typeof imageToRender.src !== 'string') {
    return null;
  }
  
  const hasMultiple = validImages.length > 1;

  const handlePrevious = () => {
    const newIndex = index > 0 ? index - 1 : validImages.length - 1;
    setIndex(newIndex);
    if (onNavigate) onNavigate(newIndex);
  };

  const handleNext = () => {
    const newIndex = index < validImages.length - 1 ? index + 1 : 0;
    setIndex(newIndex);
    if (onNavigate) onNavigate(newIndex);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Previous button */}
      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="absolute left-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {(() => {
          const imageSrc = imageToRender.src;
          const normalizedSrc = imageSrc.startsWith("/") ? imageSrc : `/${imageSrc}`;
          return (
            <img
              key={`${normalizedSrc}-${validIndex}`} // Force re-render on src/index change
              src={normalizedSrc}
              alt={imageToRender.alt || imageToRender.title || "Gallery image"}
              className="max-w-full max-h-[85vh] object-contain"
              onError={(e) => {
                console.error('Lightbox: Failed to load image', imageSrc);
                // Try next image instead of hiding
                const currentIdx = validImages.indexOf(imageToRender);
                if (currentIdx !== -1 && currentIdx < validImages.length - 1) {
                  const nextIdx = currentIdx + 1;
                  setIndex(nextIdx);
                  if (onNavigate) onNavigate(nextIdx);
                } else if (currentIdx > 0) {
                  const prevIdx = currentIdx - 1;
                  setIndex(prevIdx);
                  if (onNavigate) onNavigate(prevIdx);
                } else {
                  e.currentTarget.style.display = 'none';
                }
              }}
            />
          );
        })()}

        {/* Image info */}
        {(imageToRender?.title || imageToRender?.description) && (
          <div className="mt-4 text-center text-white max-w-2xl">
            {imageToRender?.title && (
              <h3 className="text-xl font-semibold mb-2">{imageToRender.title}</h3>
            )}
            {imageToRender?.description && (
              <p className="text-white/80 text-sm">{imageToRender.description}</p>
            )}
          </div>
        )}

        {/* Image counter */}
        {hasMultiple && (
          <div className="mt-4 text-white/70 text-sm">
            {validIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Next button */}
      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

