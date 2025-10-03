import { useState, useEffect } from 'react';
import { MusicEvent, Artist, AdminData, GalleryItem } from '@/types/admin';

const STORAGE_KEY = 'elektrame_admin_data';

// This hook provides read-only access to the admin data for public display
export const usePublicData = () => {
  const [events, setEvents] = useState<MusicEvent[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsedData: AdminData = JSON.parse(savedData);
          // Check if data is valid and has the expected structure
          if (parsedData && typeof parsedData === 'object' && 
              Array.isArray(parsedData.events) && Array.isArray(parsedData.artists)) {
            setEvents(parsedData.events || []);
            setArtists(parsedData.artists || []);
            setGallery(parsedData.gallery || []);
            console.log('Loaded data:', { 
              events: parsedData.events.length, 
              artists: parsedData.artists.length,
              gallery: (parsedData.gallery || []).length 
            });
          } else {
            console.log('Invalid data structure, loading initial data');
            loadInitialData();
          }
        } catch (error) {
          console.error('Failed to load public data:', error);
          // Fallback to initial data if parsing fails
          loadInitialData();
        }
      } else {
        console.log('No saved data found, loading initial data');
        // Load initial data if no saved data exists
        loadInitialData();
      }
    };

    const loadInitialData = () => {
      // Initial data with existing content
      const initialEvents: MusicEvent[] = [
        {
          id: "1",
          title: "Techno Night: Barcelona Underground",
          description: "A night of cutting-edge techno with Barcelona's best local talent.",
          date: "2025-05-28T20:00:00.000Z",
          time: "20:00",
          location: "Club Apolo, Barcelona",
          picture: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&h=300",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "2",
          title: "Electronic Beach Session",
          description: "Sunset to sunrise electronic music experience on the beach.",
          date: "2025-06-15T19:00:00.000Z",
          time: "19:00",
          location: "Barceloneta Beach",
          picture: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=500&h=300",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "3",
          title: "Digital Dreams Festival",
          description: "Our annual electronic music festival featuring international artists.",
          date: "2025-07-05T18:00:00.000Z",
          time: "18:00",
          location: "Parc del Fòrum, Barcelona",
          picture: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=500&h=300",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      const initialArtists: Artist[] = [
        {
          id: "1",
          name: "Mixel",
          nickname: "",
          bio: "Barcelona-based electronic music producer known for blending deep house with ambient textures. Mixel has been crafting immersive soundscapes since 2018.",
          bioKey: "artist.mixel.bio",
          picture: "/elektr-ame-media/999c996c-ad69-4db9-b585-0fcdc4c5f718.png",
          socialLinks: {
            soundcloud: "#",
            instagram: "#"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "2",
          name: "Rakel",
          nickname: "Raquel Porta",
          bio: "Born in Lleida, Raquel Porta —better known as Rakel— is passionate about music and everything related to creativity. Her artistic universe is marked by a wide and diverse musical influence that has been part of her life from a very young age, both personally and professionally. For Rakel, music is pure electricity. That energy that runs through the body is impossible to contain: you have to let it flow. After 15 years living in London, where she began her career as a DJ, Rakel moved to Barcelona, the city where she currently resides and where she has developed her career professionally. She has performed at numerous private events and clubs throughout Barcelona and beyond. Rakel doesn't just play music, she lives it, transforms it and shares it. Currently, co-founder of 'Elektr'Âme', a musical association based in Barcelona and focused on developing new projects.",
          bioKey: "artist.rakel.bio",
          picture: "/elektr-ame-media/40fb0100-2718-415c-b9d2-84d7887d7471.png",
          socialLinks: {
            soundcloud: "https://soundcloud.com/rakel_raquel-porta",
            instagram: "#",
            linktree: "https://linktr.ee/rakel_raquel"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      setEvents(initialEvents);
      setArtists(initialArtists);
      setGallery([]);

      // Save initial data to localStorage if nothing exists
      const initialData: AdminData = {
        events: initialEvents,
        artists: initialArtists,
        gallery: []
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    };

    loadData();

    // Listen for storage changes (when admin updates data)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events in the same tab
    const handleDataUpdate = () => {
      loadData();
    };

    window.addEventListener('adminDataUpdated', handleDataUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adminDataUpdated', handleDataUpdate);
    };
  }, []);

  return {
    events,
    artists,
    gallery
  };
};
