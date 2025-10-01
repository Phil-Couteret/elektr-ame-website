import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Calendar, Users, Home, Image } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import EventsManager from "@/components/admin/EventsManager";
import ArtistsManager from "@/components/admin/ArtistsManager";
import GalleryManager from "@/components/admin/GalleryManager";

const Admin = () => {
  const { logout, user } = useAuth();
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
                src="/lovable-uploads/85e5425f-9e5d-4f41-a064-2e7734dc6c51.png" 
                alt="Elektr-Âme" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              {user && (
                <span className="text-electric-blue text-sm">
                  Welcome, {user}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Link to="/" onClick={handleHomeClick}>
                <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue/20">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-red-400 text-red-400 hover:bg-red-400/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 border-white/10">
            <TabsTrigger 
              value="events" 
              className="data-[state=active]:bg-electric-blue data-[state=active]:text-deep-purple text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="artists"
              className="data-[state=active]:bg-electric-blue data-[state=active]:text-deep-purple text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Artists
            </TabsTrigger>
            <TabsTrigger 
              value="gallery"
              className="data-[state=active]:bg-electric-blue data-[state=active]:text-deep-purple text-white"
            >
              <Image className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
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
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;

