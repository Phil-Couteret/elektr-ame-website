export interface SocialLinks {
  soundcloud?: string;
  instagram?: string;
  linktree?: string;
  spotify?: string;
}

export interface Artist {
  id: string;
  name: string;
  nickname?: string;
  bio: string; // Fallback bio (usually English)
  bioKey?: string; // Translation key for bio text
  bioTranslations?: { // Direct translations for bio text
    en?: string;
    es?: string;
    ca?: string;
  };
  picture?: string;
  socialLinks: SocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface MusicEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  image?: string;
  price?: string;
  ticketLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminData {
  events: MusicEvent[];
  artists: Artist[];
  gallery: GalleryItem[];
}
