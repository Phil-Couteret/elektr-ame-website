export interface MusicEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  time: string;
  location: string; // Can be "TBA"
  picture?: string; // URL or base64
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  soundcloud?: string;
  beatport?: string;
  instagram?: string;
  residentAdvisor?: string;
  linktree?: string;
  tiktok?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  spotify?: string;
}

export interface Artist {
  id: string;
  name: string;
  nickname?: string;
  bio: string;
  bioKey?: string; // Key for translation (e.g., 'artist.mixel.bio')
  socialLinks: SocialLinks;
  picture?: string; // URL or base64
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  picture: string; // URL or base64 - required for gallery
  createdAt: string;
  updatedAt: string;
}

export interface AdminData {
  events: MusicEvent[];
  artists: Artist[];
  gallery: GalleryItem[];
}
