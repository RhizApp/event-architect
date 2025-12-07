import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export interface Speaker {
  name: string;
  company: string;
  bio: string;
  imageUrl: string;
}

interface SpeakerCardProps {
  speaker: Speaker;
  layout?: 'carousel' | 'grid';
  className?: string;
  classNameImage?: string;
  priority?: boolean;
}

export const SpeakerCard = ({ 
  speaker, 
  layout = 'grid', 
  className,
  classNameImage,
}: SpeakerCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className={cn(
        "group relative overflow-hidden bg-[#1a1a1a] cursor-pointer", // Matte dark bg
        "rounded-sm", // Editorial sharpness
        layout === 'grid' ? "aspect-[3/4] w-full" : "aspect-[3/4] w-[280px] md:w-[320px] flex-shrink-0",
        className
      )}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="absolute inset-0 overflow-hidden">
        {!imageError ? (
          <motion.img
            src={speaker.imageUrl}
            alt={speaker.name}
            className={cn(
              "h-full w-full object-cover transition-colors duration-700 ease-out",
              classNameImage
            )}
            style={{
              filter: isHovered ? 'grayscale(0%) brightness(1.02)' : 'grayscale(100%) brightness(0.9)',
            }}
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.05 }
            }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }} 
            onError={() => setImageError(true)}
          />
        ) : (
          /* Fallback Abstract Pattern */
          <div className="h-full w-full bg-neutral-900 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-20" 
                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} 
             />
             <User className="text-neutral-700 w-16 h-16" />
          </div>
        )}
      </div>

      {/* Surface Overlay (Matte/Shadow) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: 'linear-gradient(to top, rgba(15,15,15,0.95) 0%, rgba(15,15,15,0.6) 25%, transparent 60%)'
        }}
      />

      {/* Content Layer */}
      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
        
        {/* Decorative Line */}
        <motion.div 
          className="w-8 h-[1px] bg-white/40 mb-3"
          variants={{
            rest: { width: 32, opacity: 0.4 },
            hover: { width: 48, opacity: 1 }
          }}
        />

        <h3 className="text-white text-xl md:text-2xl font-medium tracking-tight font-serif">
          {speaker.name}
        </h3>
        
        <p className="text-white/60 text-sm font-medium uppercase tracking-wider mt-1 mb-2">
          {speaker.company}
        </p>

        {/* Bio Slide-up (Carousel Only or Condensed Grid) */}
        <motion.div
            className="overflow-hidden"
            variants={{
              rest: { height: 0, opacity: 0 },
              hover: { height: 'auto', opacity: 1 }
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="text-white/80 text-xs leading-relaxed line-clamp-3 mt-2 pr-2 font-mono">
            {speaker.bio}
          </p>
        </motion.div>
      </div>

      {/* Premium Border/Highlight on Hover */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-500 pointer-events-none" />
    </motion.div>
  );
};
