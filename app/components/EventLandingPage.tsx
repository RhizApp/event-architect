'use client';

import React from 'react';
import { EventAppConfig } from "@/lib/baml_client/baml_client/types";
import { HeroSection } from '@/components/hero/HeroSection';
import { SpeakerSpotlight } from './speakers/SpeakerSpotlight';
import { NetworkingPreview } from '@/components/networking/NetworkingPreview';
import { ScheduleGrid } from '@/components/schedule/ScheduleGrid';
import type { HeroTheme } from '@/components/hero/theme';

interface EventLandingPageProps {
  config: EventAppConfig;
}

export function EventLandingPage({ config }: EventLandingPageProps) {
  // Map config to theme
  // Default to 'professional' if not found or no mapping obvious
  // The config has branding.toneKeywords which might contain relevant keywords
  const determineTheme = (toneKeywords: string[]): HeroTheme => {
    if (toneKeywords.includes('luxury')) return 'luxury';
    if (toneKeywords.includes('vibrant') || toneKeywords.includes('playful')) return 'vibrant';
    return 'professional';
  };

  const theme = determineTheme(config.branding.toneKeywords);

  // MOCK DATA for display purposes until real content generation is wired up
  
  // Speakers
  const mockSpeakers = [
    {
      name: "Elena Rigby",
      role: "Chief Product Officer",
      company: "FutureRay",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
      bio: "Elena is a visionary product leader who has scaled platforms to millions of users.",
    },
    {
      name: "David Chen",
      role: "Founding Partner",
      company: "Horizon Ventures",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
      bio: "David invests in deep tech and AI infrastructure shaping the next decade.",
    },
    {
      name: "Sarah Jenkins",
      role: "AI Ethics Researcher",
      company: "Open Institute",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
      bio: "Sarah's work focuses on the intersection of human values and machine learning systems.",
    },
    {
      name: "Marcus Johnson",
      role: "CTO",
      company: "Velocite Systems",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
      bio: "Marcus is an expert in distributed systems and cloud native architectures.",
    }
  ];

  // Schedule
  const mockSessions = [
    {
      id: "1",
      time: "09:00 AM",
      title: "Opening Keynote: The Future of Connection",
      speaker: { name: "Elena Rigby", avatar: mockSpeakers[0].imageUrl, role: "CPO, FutureRay" },
      track: "Main Stage" as const,
      isWide: true,
    },
    {
      id: "2",
      time: "10:30 AM",
      title: "Building Community in the Digital Age",
      speaker: { name: "David Chen", avatar: mockSpeakers[1].imageUrl, role: "Partner, Horizon" },
      track: "Workshop" as const,
    },
    {
      id: "3",
      time: "10:30 AM",
      title: "Networking & Coffee Break",
      speaker: { name: "Hosts", avatar: "", role: "Rhiz Team" },
      track: "Networking" as const,
    },
    {
      id: "4",
      time: "01:00 PM",
      title: "AI & Ethics Panel",
      speaker: { name: "Sarah Jenkins", avatar: mockSpeakers[2].imageUrl, role: "Researcher, Open Institute" },
      track: "Main Stage" as const,
      isWide: true,
    },
    {
      id: "5",
      time: "03:00 PM",
      title: "Scaling Distributed Systems",
      speaker: { name: "Marcus Johnson", avatar: mockSpeakers[3].imageUrl, role: "CTO, Velocite" },
      track: "Workshop" as const,
    }
  ];

  // Attendees for Networking
  const mockAttendees = [
    { id: "1", imageFromUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", interests: ["AI", "Design"], name: "Alice" },
    { id: "2", imageFromUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", interests: ["Tech", "Startup"], name: "Bob" },
    { id: "3", imageFromUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200", interests: ["Investing"], name: "Charlie" },
    { id: "4", imageFromUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200", interests: ["Music"], name: "Diana" },
    { id: "5", imageFromUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", interests: ["Code"], name: "Eve" },
    { id: "6", imageFromUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200", interests: ["Design"], name: "Frank" },
    { id: "7", imageFromUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", interests: ["AI"], name: "Grace" },
  ];

  return (
    <div className="w-full bg-white dark:bg-black min-h-screen">
       {/* Hero Section */}
       <HeroSection 
         // Fallback values since config doesn't have appName/tagline yet
         title={"Rhiz Event"}
         subtitle={"An immersive experience designed for connection."}
         date="Oct 12-14, 2025"
         location="San Francisco, CA"
         primaryAction={{ label: "Get Tickets", onClick: () => alert("Ticket flow placeholder") }}
         theme={theme}
       />
       
       {/* Speakers Section */}
       <SpeakerSpotlight 
         speakers={mockSpeakers}
         layout="carousel" // Could be made dynamic based on config later
       />

       {/* Schedule Section */}
       <section className="py-20 bg-neutral-900 border-y border-neutral-800">
          <div className="container mx-auto px-6 mb-12 text-center">
             <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Event Schedule</h2>
             <p className="text-neutral-400 max-w-2xl mx-auto">
               Curated sessions designed to inspire and connect.
             </p>
          </div>
          <ScheduleGrid sessions={mockSessions} />
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
                <button className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors">
                  Join the Network
                </button>
             </div>
             <div className="relative">
                <NetworkingPreview 
                  featuredAttendees={mockAttendees}
                  totalCount={500}
                  matchmakingEnabled={config.matchmakingConfig.enabled}
                />
             </div>
          </div>
       </section>
    </div>
  );
}
