import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Calendar, Users, Home, Image, UserCog, UserPlus, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContextNew";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import EventsManager from "@/components/admin/EventsManager";
import ArtistsManager from "@/components/admin/ArtistsManager";
import GalleryManager from "@/components/admin/GalleryManager";
import UsersManager from "@/components/admin/UsersManager";
import MembersManager from "@/components/admin/MembersManager";
import NewsletterManager from "@/components/admin/NewsletterManager";
import LanguageSelector from "@/components/LanguageSelector";

const Admin = () => {
  const { logout, user, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("events");

  const handleLogout = () => {
    logout();
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-deep-purple">
      {/* Admin Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/elektr-ame-media/85e5425f-9e5d-4f41-a064-2e7734dc6c51.png" 
                alt="Elektr-Âme" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold text-white">{t('admin.header.title')}</h1>
              {user && (
                <span className="text-electric-blue text-sm">
                  {t('admin.header.welcome')}, {user.name} {isSuperAdmin && `(${t('admin.header.superadmin')})`}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <Link to="/" onClick={handleHomeClick}>
                <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue/20">
                  <Home className="h-4 w-4 mr-2" />
                  {t('admin.header.home')}
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-red-400 text-red-400 hover:bg-red-400/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('admin.header.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${isSuperAdmin ? 'grid-cols-6' : 'grid-cols-5'} bg-black/40 border-white/10`}>
            <TabsTrigger 
              value="events" 
              className="data-[state=active]:bg-electric-blue data-[state=active]:text-deep-purple text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {t('admin.tabs.events')}
            </TabsTrigger>
            <TabsTrigger 
              value="artists"
              className="data-[state=active]:bg-electric-blue data-[state=active]:text-deep-purple text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              {t('admin.tabs.artists')}
            </TabsTrigger>
            <TabsTrigger 
              value="gallery"
              className="data-[state=active]:bg-electric-blue data-[state=active]:text-deep-purple text-white"
            >
              <Image className="h-4 w-4 mr-2" />
              {t('admin.tabs.gallery')}
            </TabsTrigger>
            <TabsTrigger 
              value="members"
              className="data-[state=active]:bg-electric-blue data-[state=active]:text-deep-purple text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {t('admin.tabs.members')}
            </TabsTrigger>
            <TabsTrigger 
              value="newsletter"
              className="data-[state=active]:bg-electric-blue data-[state=active]:text-deep-purple text-white"
            >
              <Mail className="h-4 w-4 mr-2" />
              {t('admin.tabs.newsletter')}
            </TabsTrigger>
            {isSuperAdmin && (
              <TabsTrigger 
                value="users"
                className="data-[state=active]:bg-electric-blue data-[state=active]:text-deep-purple text-white"
              >
                <UserCog className="h-4 w-4 mr-2" />
                {t('admin.tabs.users')}
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="events" className="mt-6">
            <EventsManager />
          </TabsContent>
          
          <TabsContent value="artists" className="mt-6">
            <ArtistsManager />
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <GalleryManager />
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <MembersManager />
          </TabsContent>

          <TabsContent value="newsletter" className="mt-6">
            <NewsletterManager />
          </TabsContent>

          {isSuperAdmin && (
            <TabsContent value="users" className="mt-6">
              <UsersManager />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;

