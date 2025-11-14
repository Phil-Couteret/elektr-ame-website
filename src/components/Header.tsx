
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, LogIn } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isArtistPage = location.pathname.startsWith('/artist/');

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectionClick = (section: string) => {
    if (isArtistPage) {
      // If on artist page, navigate to home first, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(section);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      // On home page, just scroll
      const element = document.querySelector(section);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-center relative">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleSectionClick('#artists')} 
              className="text-white/80 hover:text-blue-light transition-colors"
            >
              {t('nav.artists')}
            </button>
            <button 
              onClick={() => handleSectionClick('#events')} 
              className="text-white/80 hover:text-blue-light transition-colors"
            >
              {t('nav.events')}
            </button>
            <button 
              onClick={() => handleSectionClick('#gallery')} 
              className="text-white/80 hover:text-blue-light transition-colors"
            >
              {t('nav.gallery')}
            </button>
            <button 
              onClick={() => handleSectionClick('#about')} 
              className="text-white/80 hover:text-blue-light transition-colors"
            >
              {t('nav.about')}
            </button>
            <LanguageSelector />
            <Link to="/join-us">
              <Button className="bg-blue-dark hover:bg-blue-darker text-white">
                {t('nav.joinUs')}
              </Button>
            </Link>
            <Link to="/member-login">
              <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-deep-purple flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                {t('nav.memberLogin')}
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
          <div className="flex md:hidden absolute right-0">
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
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleSectionClick('#artists');
              }}
              className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-gray-800/50 rounded-md"
            >
              {t('nav.artists')}
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleSectionClick('#events');
              }}
              className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-gray-800/50 rounded-md"
            >
              {t('nav.events')}
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleSectionClick('#gallery');
              }}
              className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-gray-800/50 rounded-md"
            >
              {t('nav.gallery')}
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleSectionClick('#about');
              }}
              className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-gray-800/50 rounded-md"
            >
              {t('nav.about')}
            </button>
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
              <Link to="/member-login" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-deep-purple">
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('nav.memberLogin')}
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
