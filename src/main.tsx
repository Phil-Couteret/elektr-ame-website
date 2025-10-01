
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
