'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Speaker, SpeakerCard } from './SpeakerCard';

interface SpeakerSpotlightProps {
  speakers: Speaker[];
  layout: 'carousel' | 'grid';
  className?: string;
}

export function SpeakerSpotlight({ speakers, layout, className }: SpeakerSpotlightProps) {
  if (!speakers || speakers.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className={cn("py-16 w-full bg-neutral-50 dark:bg-black", className)}>
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl md:text-5xl font-serif font-medium tracking-tight text-neutral-900 dark:text-white mb-2">
          Featured Speakers
        </h2>
        <div className="h-1 w-24 bg-neutral-900 dark:bg-white/20" />
      </div>

      {layout === 'carousel' ? (
        <CarouselLayout speakers={speakers} />
      ) : (
        <GridLayout speakers={speakers} />
      )}
    </section>
  );
}

function CarouselLayout({ speakers }: { speakers: Speaker[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="relative w-full group">
      {/* Fade Gradients for Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 z-10 bg-linear-to-r from-neutral-50 via-neutral-50/80 to-transparent dark:from-black dark:via-black/80 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 z-10 bg-linear-to-l from-neutral-50 via-neutral-50/80 to-transparent dark:from-black dark:via-black/80 pointer-events-none" />

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 px-8 md:px-[20vw] py-8 snap-x snap-mandatory scroll-smooth items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      >
        {speakers.map((speaker, index) => (
          <div key={`${speaker.name}-${index}`} className="snap-center shrink-0">
             <SpeakerCard 
                speaker={speaker} 
                layout="carousel" 
                // subtle width variation for rhythm
                className={cn(
                  "transition-all duration-500",
                  index % 3 === 0 ? "w-[280px] md:w-[340px]" : 
                  index % 3 === 1 ? "w-[260px] md:w-[300px]" : "w-[290px] md:w-[320px]"
                )}
             />
          </div>
        ))}
      </div>
    </div>
  );
}

function GridLayout({ speakers }: { speakers: Speaker[] }) {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {speakers.map((speaker, index) => (
          <div 
            key={`${speaker.name}-${index}`}
            className={cn(
              "flex flex-col",
              // Organic offsets for grid rhythm
              // Mobile/Tablet: Offset every even item
              "sm:even:translate-y-8",
              // Desktop: More complex rhythm (e.g. 2nd and 4th columns pushed, or random-feeling)
              "lg:translate-y-0", // reset
              (index % 4 === 1) && "lg:translate-y-12",
              (index % 4 === 3) && "lg:translate-y-6"
            )}
          >
            <SpeakerCard 
              speaker={speaker} 
              layout="grid"
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  const placeholders = Array(4).fill(null);
  return (
    <section className="py-16 w-full bg-neutral-50 dark:bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-serif text-neutral-400 dark:text-neutral-800 mb-8">
          Speakers TBA
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {placeholders.map((_, i) => (
            <div 
              key={i} 
              className="aspect-3/4 bg-neutral-200 dark:bg-neutral-900/50 rounded-sm relative overflow-hidden"
            >
               <div className="absolute inset-0 opacity-10" 
                  style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }} 
               />
               <div className="absolute bottom-6 left-6 right-6">
                 <div className="h-1 w-8 bg-neutral-400/50 mb-4" />
                 <div className="h-6 w-32 bg-neutral-400/30 rounded-sm mb-2" />
                 <div className="h-4 w-24 bg-neutral-400/20 rounded-sm" />
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
