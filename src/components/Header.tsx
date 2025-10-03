
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Updated with new cropped logo */}
          <div className="flex items-center">
            <Link to="/" onClick={handleHomeClick} className="cursor-pointer">
              <img 
                src="/elektr-ame-media/85e5425f-9e5d-4f41-a064-2e7734dc6c51.png" 
                alt="Elektr-Âme" 
                className="h-8 sm:h-10 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#artists" className="text-white/80 hover:text-blue-light transition-colors">
              {t('nav.artists')}
            </a>
            <a href="#events" className="text-white/80 hover:text-blue-light transition-colors">
              {t('nav.events')}
            </a>
            <a href="#about" className="text-white/80 hover:text-blue-light transition-colors">
              {t('nav.about')}
            </a>
            <LanguageSelector />
            <Link to="/join-us">
              <Button className="bg-blue-dark hover:bg-blue-darker text-white">
                {t('nav.joinUs')}
              </Button>
            </Link>
            <Link to="/" onClick={handleHomeClick}>
              <Button className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-light"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2 bg-black/90 backdrop-blur-md">
            <a
              href="#artists"
              className="block px-3 py-2 text-base font-medium text-white hover:bg-gray-800/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.artists')}
            </a>
            <a
              href="#events"
              className="block px-3 py-2 text-base font-medium text-white hover:bg-gray-800/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.events')}
            </a>
            <a
              href="#about"
              className="block px-3 py-2 text-base font-medium text-white hover:bg-gray-800/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.about')}
            </a>
            <div className="px-3 py-2">
              <LanguageSelector />
            </div>
            <div className="px-3 py-2">
              <Link to="/join-us" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-blue-dark hover:bg-blue-darker text-white">
                  {t('nav.joinUs')}
                </Button>
              </Link>
            </div>
            <div className="px-3 py-2">
              <Link 
                to="/" 
                className="block w-full" 
                onClick={() => {
                  setIsMenuOpen(false);
                  handleHomeClick();
                }}
              >
                <Button className="w-full bg-electric-blue hover:bg-electric-blue/80 text-deep-purple flex items-center justify-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
