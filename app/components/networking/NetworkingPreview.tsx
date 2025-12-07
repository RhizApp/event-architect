"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { useMemo } from "react";
import { EASING, TRANSITIONS } from "./motion-utils";
import { User } from "lucide-react";

export interface Attendee {
  id: string;
  imageFromUrl: string;
  interests: string[];
}

export interface NetworkingProps {
  featuredAttendees: Attendee[];
  totalCount: number;
  matchmakingEnabled: boolean;
}

const ORBIT_RADII = [140, 260]; // Mobile radii
const ORBIT_RADII_DESKTOP = [200, 360];

const GradientField = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/5 to-transparent blur-3xl opacity-40 animate-pulse-slow" />
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const AvatarNode = ({
  attendee,
  index,
  totalInOrbit,
  radius,
  delayOffset,
}: {
  attendee: Attendee | null; // null for placeholder
  index: number;
  totalInOrbit: number;
  radius: number;
  delayOffset: number;
}) => {
  const angle = (index / totalInOrbit) * 360;
  // Convert polar to cartesian
  const radian = (angle * Math.PI) / 180;
  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;

  // Personalized organic motion parameters
  const floatDuration = useMemo(() => 3.2 + Math.random() * 3.6, []);
  const randomY = useMemo(() => (Math.random() - 0.5) * 15, []);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      initial={{ x, y, opacity: 0, scale: 0 }}
      animate={{
        x,
        y: y + randomY, // Add slight vertical drift base
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 1.2,
        delay: delayOffset * 0.1,
        ease: EASING.living,
        // Continuous float
        y: {
           duration: floatDuration,
           repeat: Infinity,
           repeatType: "reverse",
           ease: "easeInOut"
        }
      }}
    >
        {/* Node Frame */}
      <div className={clsx(
          "relative w-10 h-10 md:w-14 md:h-14 rounded-full p-[1px]",
          "bg-gradient-to-b from-white/20 to-white/5",
          "shadow-lg shadow-black/10"
      )}>
        <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 border border-white/5">
            {attendee ? (
                 <img
                 src={attendee.imageFromUrl}
                 alt="Attendee"
                 className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                 onError={(e) => {
                     // Fallback to initial
                     e.currentTarget.style.display = 'none';
                     e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                 }}
               />
            ) : null}
            
            {/* Fallback / Placeholder content rendered if img fails or is placeholder */}
            <div className={clsx(
                "w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500 text-xs font-medium",
                attendee ? "hidden peer-hover:flex" : "flex" // Hide if real image loaded successfully logic would require state, utilizing simplified layout here
            )}>
              {attendee ? "U" : <User size={14} className="opacity-50" />}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function NetworkingPreview({
  featuredAttendees = [],
  totalCount,
  matchmakingEnabled,
}: NetworkingProps) {
  // Placeholder generation if empty
  const displayAttendees = useMemo(() => {
     if (featuredAttendees.length > 0) return featuredAttendees;
     return Array(7).fill(null);
  }, [featuredAttendees]);

  // Split into 2 orbits
  const orbit1 = displayAttendees.slice(0, Math.ceil(displayAttendees.length / 2));
  const orbit2 = displayAttendees.slice(Math.ceil(displayAttendees.length / 2));

  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-zinc-950 rounded-3xl border border-white/5">
      <GradientField />

      {/* Orbit Container handles rotation */}
      <div className="absolute inset-0 flex items-center justify-center">
         {/* Orbit 1 - Inner */}
        <motion.div
           className="absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full border border-white/[0.03]"
           animate={{ rotate: 360 }}
           transition={TRANSITIONS.orbit(60)}
        >
             {orbit1.map((attendee, i) => (
                 <AvatarNode
                    key={attendee?.id || `p1-${i}`}
                    attendee={attendee}
                    index={i}
                    totalInOrbit={orbit1.length}
                    radius={140} // Will need responsive logic ideally, simplifying for "Lego block"
                    delayOffset={i}
                 />
             ))}
        </motion.div>

         {/* Orbit 2 - Outer */}
         <motion.div
           className="absolute w-[520px] h-[520px] md:w-[720px] md:h-[720px] rounded-full border border-white/[0.03]"
           animate={{ rotate: -360 }}
           transition={TRANSITIONS.orbit(90)}
        >
            {orbit2.map((attendee, i) => (
                 <AvatarNode
                    key={attendee?.id || `p2-${i}`}
                    attendee={attendee}
                    index={i}
                    totalInOrbit={orbit2.length}
                    radius={260}
                    delayOffset={i + orbit1.length}
                 />
             ))}
        </motion.div>

      </div>

      {/* Center Node */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
         {matchmakingEnabled && (
             <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mb-4"
             >
                 <div className="relative px-3 py-1 bg-zinc-900 rounded-full border border-white/10 flex items-center gap-2 shadow-2xl">
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-blue-500"
                        animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">AI Match</span>
                 </div>
             </motion.div>
         )}

         <h3 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-2">
            Connect with <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">{totalCount}+</span>
         </h3>
         <p className="text-zinc-500 text-sm md:text-base uppercase tracking-widest opacity-60">
             Attendees
         </p>
      </div>

    </div>
  );
}
