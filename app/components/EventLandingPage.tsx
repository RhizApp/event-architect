'use client';

import React from 'react';
import { EventAppConfig } from "@/lib/baml_client/baml_client/types";
import { PersonRead, RelationshipDetail, IntroductionSuggestion } from "@/lib/protocol-sdk/types";
import { HeroSection } from '@/components/hero/HeroSection';
import { SpeakerSpotlight } from './speakers/SpeakerSpotlight';
import { NetworkingGraph } from '@/components/networking/NetworkingGraph';
import { ScheduleGrid } from '@/components/schedule/ScheduleGrid';
import type { HeroTheme } from '@/components/hero/theme';
import { rhizClient } from '@/lib/rhizClient';
import type { GraphAttendee as NetworkingAttendee } from '@/lib/types';
import { AttendeeDetailModal } from '@/components/networking/AttendeeDetailModal';
import { Speaker } from './speakers/SpeakerCard';

interface EventLandingPageProps {
  config: EventAppConfig & { eventId?: string };
}


interface ContentAttendee {
  id?: string;
  name: string;
  imageUrl?: string;
  interests?: string[];
  handle?: string;
  did?: string;
}

import { RegistrationModal } from '@/components/registration/RegistrationModal';

// ... other imports

export function EventLandingPage({ config }: EventLandingPageProps) {
  // ... existing code ...

  const [userProfile, setUserProfile] = React.useState<{ name: string; email: string } | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = React.useState(false);

  // Restore session on load
  React.useEffect(() => {
    const saved = localStorage.getItem(`rhiz_user_${config.eventId}`);
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) { console.error("Failed to parse user session", e); }
    }
  }, [config.eventId]);

  const handleRegister = async (data: { name: string; email: string }) => {
    // 1. Save locally
    setUserProfile(data);
    localStorage.setItem(`rhiz_user_${config.eventId}`, JSON.stringify(data));
    
    // 2. Trigger re-sync (will happen automatically due to useEffect dependency on userProfile? No, we need to add it or call syncRhiz)
    // Actually syncRhiz is dependent on useCallback, let's update that dependency chain or just rely on a separate effect/call.
    // The easiest way is to let the userProfile state change trigger the effect if we add it to the dependency array.
  };

  const syncRhiz = React.useCallback(async () => {
      try {
        setIsLoading(true);
        setGraphError(null);

        // 1. Ensure current user has an identity
        // Use registered profile OR fallback to "Event Organizer" (Guest)
        const identityParams = userProfile 
            ? { name: userProfile.name, email: userProfile.email }
            : { name: "Event Organizer" };

        const currentUser = await rhizClient.ensureIdentity(identityParams);
        setCurrentUserId(currentUser.id);

        if (!config.eventId) {
          console.warn("Rhiz: No event ID provided in config, skipping Protocol sync");
          setIsLoading(false);
          return;
        }

        const eventId = config.eventId;

        // 2. Fetch real relationships & matches
        const [suggestions, matches] = await Promise.all([
             rhizClient.getSuggestedConnections({
                eventId,
                identityId: currentUser.id,
                limit: 10,
             }),
             rhizClient.getOpportunityMatches({
                eventId,
                identityId: currentUser.id,
                limit: 3
             })
        ]);

        console.log("Rhiz: Fetched data for", identityParams.name, suggestions);
        setRelationships(suggestions);
        setOpportunities(matches);

      } catch (err) {
        console.error("Rhiz: Sync failed", err);
        setGraphError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }, [config.eventId, userProfile]); // Re-sync when userProfile changes


  // Effect: Ingest attendees & fetch relationships
  React.useEffect(() => {
    syncRhiz();
  }, [syncRhiz]);


  // ... mapped data ...

  return (
    <div className="w-full bg-white dark:bg-black min-h-screen">
       {/* Hero Section */}
       <HeroSection 
         title={config.content.eventName}
         subtitle={config.content.tagline}
         date={config.content.date}
         location={config.content.location}
         primaryAction={{ 
             label: userProfile ? `Welcome, ${userProfile.name}` : "Get Tickets", 
             onClick: () => userProfile ? null : setIsRegistrationOpen(true) 
         }}
         theme={theme}
       />
       
       {/* ... Speakers ... */}
       <SpeakerSpotlight 
         speakers={speakers.map(s => ({ ...s, id: `speaker_${s.name.replace(/\s+/g, '_')}` }))}
         layout="carousel"
         onSpeakerClick={handleSpeakerClick}
       />
       
       {/* ... Schedule ... */}
       <section className="py-20 bg-neutral-900 border-y border-neutral-800">
           {/* ... schedule content ... */}
           <div className="container mx-auto px-6 mb-12 text-center">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Event Schedule</h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">
                Curated sessions designed to inspire and connect.
              </p>
           </div>
           <ScheduleGrid sessions={sessions} />
       </section>

       {/* Networking Preview Section */}
       <section className="py-20 bg-black text-white overflow-hidden">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
                <h2 className="text-3xl md:text-5xl font-serif mb-6">
                  Intelligent Networking
                </h2>
                <p className="text-lg text-neutral-400 mb-8">
                  {config.matchmakingConfig.enabled 
                    ? "Our AI-powered matchmaking connects you with the right people effortlessly." 
                    : "Connect with like-minded peers in an organic, curated environment."}
                </p>
                <button 
                    onClick={() => setIsRegistrationOpen(true)}
                    className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors"
                >
                  {userProfile ? "Update Profile" : "Join the Network"}
                </button>
             </div>
             <div className="relative">
                <NetworkingGraph 
                  featuredAttendees={attendees}
                  totalCount={500}
                  matchmakingEnabled={config.matchmakingConfig.enabled}
                  relationships={relationships}
                  opportunities={opportunities}
                  onNodeClick={handleNodeClick}
                  isLoading={isLoading}
                  error={graphError}
                  onRetry={syncRhiz}
                />
             </div>
          </div>
       </section>

       {/* Interactive Modals */}
       <AttendeeDetailModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         attendee={selectedAttendee}
         onConnect={handleConnect}
       />
       
       <RegistrationModal
          isOpen={isRegistrationOpen}
          onClose={() => setIsRegistrationOpen(false)}
            onRegister={handleRegister}
       />
    </div>
  );
}
