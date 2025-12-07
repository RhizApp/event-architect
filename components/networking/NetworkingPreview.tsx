"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { OrbitRing } from "./OrbitRing";
import { rhizMotion, rhizEasings } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Image from "next/image";

// --- Types ---

export interface Attendee {
  id: string;
  imageFromUrl: string;
  interests: string[];
  name?: string; // Optional name/initials
}

export interface NetworkingProps {
  featuredAttendees: Attendee[];
  totalCount: number;
  matchmakingEnabled: boolean;
  className?: string;
}

// --- Sub-components ---

const BackgroundField = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Noise Texture */}
    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    
    {/* Identity Gradient Mesh - Theme Neutral but Alive */}
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] 
      bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] 
      from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl"
    />
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] 
      bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] 
      from-blue-400/10 via-transparent to-transparent blur-2xl animate-pulse-slow"
    />
  </div>
);

const AvatarNode = ({ 
  attendee, 
  angle, 
  radius,
  eccentricity = 0
}: { 
  attendee: Attendee; 
  angle: number; 
  radius: number;
  eccentricity?: number;
}) => {
  // Convert polar to cartesian with eccentricity for elliptic placement
  const radian = (angle * Math.PI) / 180;
  
  const rX = radius;
  const rY = radius * (1 - eccentricity);
  const cX = rX;
  const cY = rY;

  const x = cX + rX * Math.cos(radian); 
  const y = cY + rY * Math.sin(radian);

  const floatDuration = useMemo(() => rhizMotion.randomFloatDuration(), []);
  const delay = useMemo(() => rhizMotion.randomDelay(), []);

  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        // Micro-drift handled here 
        y: [0, -4, 0, 4, 0],
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.6, delay, type: "spring" },
        y: { 
          duration: floatDuration, 
          repeat: Infinity, 
          ease: rhizEasings.float,
          repeatType: "mirror"
        }
      }}
    >
      {/* Centering transform to place center of avatar at x,y */}
      <div className="-translate-x-1/2 -translate-y-1/2 relative group">
        
        {/* Micro-frame / Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-white/0 p-[1px] opacity-70">
           <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-sm" />
        </div>

        {/* Avatar Image */}
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
          {attendee.imageFromUrl ? (
            <Image 
              src={attendee.imageFromUrl} 
              alt={attendee.name || "Attendee"} 
              width={48} 
              height={48} 
              className="object-cover w-full h-full"
              onError={(e) => {
                // Determine fallback logic if needed
                const target = e.target as HTMLElement;
                target.style.display = 'none';
                const sibling = target.nextElementSibling;
                if (sibling) sibling.classList.remove('hidden');
              }}
            />
          ) : null}
          
          {/* Fallback (Hidden by default if image exists, or shown if logic dictates) */}
          <div className={cn("absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900", attendee.imageFromUrl && "hidden")}>
             <span className="text-xs font-medium text-white/80">
               {(attendee.name || attendee.id).slice(0, 2).toUpperCase()}
             </span>
          </div>
        </div>

        {/* Optional Interest Dot */}
        {attendee.interests.length > 0 && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-teal-400 border border-black shadow-sm" />
        )}
      </div>
    </motion.div>
  );
};

const MatchBadge = () => (
  <motion.div
    className="absolute top-1/2 left-1/2 ml-16 -mt-12 z-30" // Offset placement
    initial={{ opacity: 0, scale: 0.8 }}
    animate={rhizMotion.intelligencePulse}
  >
    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md rounded-full shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]">
      <Sparkles className="w-3 h-3 text-emerald-400" />
      <span className="text-[10px] font-semibold tracking-wide text-emerald-300 uppercase">AI Match</span>
    </div>
  </motion.div>
);

// --- Main Component ---

export const NetworkingPreview: React.FC<NetworkingProps> = ({
  featuredAttendees,
  totalCount,
  matchmakingEnabled,
  className
}) => {
  // Graceful Degradation: Generate placeholders if empty
  const activeAttendees = useMemo(() => {
    if (featuredAttendees && featuredAttendees.length > 0) return featuredAttendees;
    
    // Generate placeholders
    return Array.from({ length: 7 }).map((_, i) => ({
      id: `placeholder-${i}`,
      imageFromUrl: "",
      name: ["Alex", "Sam", "Jordan", "Taylor", "Casey", "Riley", "Morgan"][i],
      interests: i % 2 === 0 ? ["Tech"] : []
    }));
  }, [featuredAttendees]);

  // Distribute into orbits
  // Ring 1: Inner (Small) - 3 items
  // Ring 2: Outer (Large) - Remainder
  const ring1 = activeAttendees.slice(0, 3);
  const ring2 = activeAttendees.slice(3, 10); // Cap at some reasonable number

  return (
    <div className={cn("relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-black/5 dark:bg-black/40 rounded-3xl border border-white/5", className)}>
      <BackgroundField />

      {/* Center Text Node */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 mix-blend-plus-lighter">
        <span className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-sm">
          {totalCount}+
        </span>
        <span className="text-sm font-medium text-white/40 mt-1 tracking-[0.2em] uppercase text-[10px]">
          Attendees
        </span>
        
        {/* Underline pulse */}
        <motion.div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
          animate={{ width: [0, 48, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {matchmakingEnabled && <MatchBadge />}

      {/* Orbit Rings - using 'pointer-events-none' on rings, but avatars should ideally be interactive if we add hover later */}
      
      {/* Inner Ring */}
      <OrbitRing radius={110} duration={25} direction="clockwise" eccentricity={0.05}>
        {ring1.map((attendee, i) => (
          <AvatarNode 
            key={attendee.id} 
            attendee={attendee} 
            angle={(360 / ring1.length) * i} 
            radius={110} 
            eccentricity={0.05}
          />
        ))}
      </OrbitRing>

      {/* Outer Ring */}
      {ring2.length > 0 && (
         <OrbitRing radius={170} duration={35} direction="counter-clockwise" eccentricity={0.08} delay={0.5}>
            {ring2.map((attendee, i) => (
              <AvatarNode 
                key={attendee.id} 
                attendee={attendee} 
                angle={(360 / ring2.length) * i + 45} // Offset angle
                radius={170}
                eccentricity={0.08} 
              />
            ))}
         </OrbitRing>
      )}

      {/* Interactive Overlay (Optional expansion hooks) */}
      <div className="absolute inset-0 pointer-events-none" />
    </div>
  );
};
