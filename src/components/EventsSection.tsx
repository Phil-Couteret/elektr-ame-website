
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicData } from "@/hooks/usePublicData";
import { MusicEvent } from "@/types/admin";

const EventCard = ({ event }: { event: MusicEvent }) => {
  const { t } = useLanguage();
  
  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase();
  };
  
  return (
    <div className="flex flex-col overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl rounded-xl bg-gradient-to-br from-black/80 to-gray-800/80 backdrop-blur border border-white/5">
      <div className="h-48 relative overflow-hidden">
        {event.picture ? (
          <img 
            src={event.picture} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-electric-blue/20 to-neon-pink/20 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-white/30" />
          </div>
        )}
        <div className="absolute top-0 left-0 m-4 px-3 py-1 bg-blue-dark/90 text-white font-semibold rounded-full text-sm">
          {formatEventDate(event.date)}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
        <p className="text-white/70 mb-4 flex-grow">{event.description || 'Event details coming soon...'}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">{event.location}</span>
          <Button variant="ghost" className="text-blue-light hover:bg-blue-light/20 px-0">
            {t('events.details')}
          </Button>
        </div>
      </div>
    </div>
  );
};

const EventsSection = () => {
  const { t } = useLanguage();
  const { events } = usePublicData();
  
  return (
    <section id="events" className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-12 gap-4">
          <Calendar className="h-10 w-10 text-blue-medium" />
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">{t('events.title')}</h2>
            <p className="text-white/70 mt-2">{t('events.subtitle')}</p>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/70 text-lg">No upcoming events at the moment.</p>
            <p className="text-white/50 text-sm mt-2">Check back soon for exciting new events!</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button 
            className="bg-black/30 hover:bg-black/50 text-blue-light border border-blue-light/50"
          >
            {t('events.viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
