import { useState, useEffect } from 'react';
import { MusicEvent, Artist, AdminData, SocialLinks, GalleryItem } from '@/types/admin';

const STORAGE_KEY = 'elektrame_admin_data';

// Initial data with existing content
const initialData: AdminData = {
  events: [
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
  ],
  artists: [
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
  ],
  gallery: []
};

export const useAdminData = () => {
  const [data, setData] = useState<AdminData>(initialData);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to load admin data:', error);
        setData(initialData);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Dispatch custom event to notify public components
    window.dispatchEvent(new Event('adminDataUpdated'));
  }, [data]);

  // Event management
  const addEvent = (eventData: Omit<MusicEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: MusicEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setData(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
  };

  const updateEvent = (id: string, eventData: Partial<MusicEvent>) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(event =>
        event.id === id
          ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
          : event
      )
    }));
  };

  const deleteEvent = (id: string) => {
    setData(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== id)
    }));
  };

  // Artist management
  const addArtist = (artistData: Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newArtist: Artist = {
      ...artistData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setData(prev => ({
      ...prev,
      artists: [...prev.artists, newArtist]
    }));
  };

  const updateArtist = (id: string, artistData: Partial<Artist>) => {
    setData(prev => ({
      ...prev,
      artists: prev.artists.map(artist =>
        artist.id === id
          ? { ...artist, ...artistData, updatedAt: new Date().toISOString() }
          : artist
      )
    }));
  };

  const deleteArtist = (id: string) => {
    setData(prev => ({
      ...prev,
      artists: prev.artists.filter(artist => artist.id !== id)
    }));
  };

  // Validation helpers
  const validateEvent = (eventData: Partial<MusicEvent>): string[] => {
    const errors: string[] = [];
    
    if (!eventData.title?.trim()) errors.push('Title is required');
    if (!eventData.date) errors.push('Date is required');
    if (!eventData.time?.trim()) errors.push('Time is required');
    if (!eventData.location?.trim()) errors.push('Location is required');
    
    return errors;
  };

  const validateArtist = (artistData: Partial<Artist>): string[] => {
    const errors: string[] = [];
    
    if (!artistData.name?.trim()) errors.push('Name is required');
    if (!artistData.bio?.trim()) errors.push('Bio is required');
    
    // Check if at least one social link is provided
    const socialLinks = artistData.socialLinks || {};
    const hasAnySocialLink = Object.values(socialLinks).some(link => link?.trim());
    if (!hasAnySocialLink) {
      errors.push('At least one social media link is required');
    }
    
    return errors;
  };

  // Gallery management
  const addGalleryItem = (galleryData: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: GalleryItem = {
      ...galleryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setData(prev => ({
      ...prev,
      gallery: [...prev.gallery, newItem]
    }));
  };

  const updateGalleryItem = (id: string, galleryData: Partial<GalleryItem>) => {
    setData(prev => ({
      ...prev,
      gallery: prev.gallery.map(item =>
        item.id === id
          ? { ...item, ...galleryData, updatedAt: new Date().toISOString() }
          : item
      )
    }));
  };

  const deleteGalleryItem = (id: string) => {
    setData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(item => item.id !== id)
    }));
  };

  const validateGalleryItem = (galleryData: Partial<GalleryItem>): string[] => {
    const errors: string[] = [];
    
    if (!galleryData.title?.trim()) errors.push('Title is required');
    if (!galleryData.picture?.trim()) errors.push('Picture is required');
    
    return errors;
  };

  return {
    data,
    events: data.events,
    artists: data.artists,
    gallery: data.gallery,
    addEvent,
    updateEvent,
    deleteEvent,
    addArtist,
    updateArtist,
    deleteArtist,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    validateEvent,
    validateArtist,
    validateGalleryItem
  };
};
