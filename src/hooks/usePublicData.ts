import { useState, useEffect } from 'react';
import { MusicEvent, Artist, GalleryItem } from '@/types/admin';

// This hook provides read-only access to the admin data for public display
// Now fetches from API instead of localStorage
export const usePublicData = () => {
  const [events, setEvents] = useState<MusicEvent[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch events, artists, and galleries from API
        const [eventsResponse, artistsResponse, galleriesResponse] = await Promise.all([
          fetch('/api/events-list.php?status=published', {
            credentials: 'include'
          }),
          fetch('/api/artists-list.php?status=active', {
            credentials: 'include'
          }),
          fetch('/api/galleries-list.php', {
            credentials: 'include'
          })
        ]);

        if (!eventsResponse.ok) {
          throw new Error('Failed to load events');
        }
        if (!artistsResponse.ok) {
          throw new Error('Failed to load artists');
        }
        if (!galleriesResponse.ok) {
          throw new Error('Failed to load galleries');
        }

        const eventsData = await eventsResponse.json();
        const artistsData = await artistsResponse.json();
        const galleriesData = await galleriesResponse.json();

        // Transform API data to match frontend format
        const events: MusicEvent[] = (eventsData.events || []).map((event: any) => {
          const dateTime = event.date && event.time 
            ? new Date(event.date + 'T' + event.time + ':00').toISOString()
            : new Date().toISOString();
          
          return {
            id: event.id.toString(),
            title: event.title,
            description: event.description || '',
            date: dateTime,
            time: event.time || '20:00',
            location: event.location || '',
            picture: event.picture || '', // Picture path from API (already includes /)
            createdAt: event.createdAt || new Date().toISOString(),
            updatedAt: event.updatedAt || new Date().toISOString()
          };
        });

        const artists: Artist[] = (artistsData.artists || []).map((artist: any) => ({
          id: artist.id.toString(),
          name: artist.name,
          nickname: artist.nickname || '',
          bio: artist.bio || '',
          bioKey: artist.bioKey || artist.bio_key || '',
          bioTranslations: artist.bioTranslations || { en: '', es: '', ca: '' },
          picture: artist.picture || '',
          socialLinks: artist.socialLinks || {},
          createdAt: artist.createdAt || new Date().toISOString(),
          updatedAt: artist.updatedAt || new Date().toISOString()
        }));

        // Transform gallery data to match GalleryItem type
        const galleries: GalleryItem[] = (galleriesData.galleries || []).map((gallery: any) => ({
          id: gallery.id.toString(),
          title: gallery.title || 'Untitled Gallery',
          description: gallery.description || '',
          image: gallery.cover_image_path 
            ? `/${gallery.cover_image_path}` 
            : '', // Format cover image path
          picture: gallery.cover_image_path 
            ? `/${gallery.cover_image_path}` 
            : '', // Also include picture for GallerySection compatibility
          createdAt: gallery.created_at || new Date().toISOString(),
          updatedAt: gallery.updated_at || new Date().toISOString()
        }));

        setEvents(events);
        setArtists(artists);
        setGallery(galleries);

        console.log('Loaded data from API:', { 
          events: events.length, 
          artists: artists.length,
          galleries: galleries.length
        });
      } catch (error) {
        console.error('Failed to load public data:', error);
        // Fallback to empty arrays on error
        setEvents([]);
        setArtists([]);
        setGallery([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Listen for custom events when admin updates data
    const handleDataUpdate = () => {
      loadData();
    };

    window.addEventListener('adminDataUpdated', handleDataUpdate);

    return () => {
      window.removeEventListener('adminDataUpdated', handleDataUpdate);
    };
  }, []);

  return {
    events,
    artists,
    gallery,
    isLoading
  };
};
