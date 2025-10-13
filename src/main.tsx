
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import translations
import enTranslations from './locales/en';
import esTranslations from './locales/es';
import caTranslations from './locales/ca';

// Load translations into global object
declare global {
  interface Window {
    translations: {
      en: Record<string, string>;
      es: Record<string, string>;
      ca: Record<string, string>;
    };
  }
}

// Expose translations globally
window.translations = {
  en: enTranslations,
  es: esTranslations,
  ca: caTranslations,
};

createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered successfully:', registration.scope);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available, show update notification
                console.log('[PWA] New content available, please refresh!');
                // You can show a toast/notification here
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  });
}
