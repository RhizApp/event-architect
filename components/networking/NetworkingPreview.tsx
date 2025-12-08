"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { OrbitRing } from "./OrbitRing";
import { ConnectionEdge } from "./ConnectionEdge";
import { rhizMotion, rhizEasings } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { ConnectionSuggestion } from "@/lib/types"; // Keeping for reference if needed elsewhere, or remove if unused locally
import { PersonRead, RelationshipDetail, IntroductionSuggestion } from "@/lib/protocol-sdk/types";

// --- Types ---
// We now use Protocol Types directly


export interface NetworkingProps {
  featuredAttendees: PersonRead[];
  totalCount: number;
  matchmakingEnabled: boolean;
  relationships?: RelationshipDetail[];
  opportunities?: { suggestion: IntroductionSuggestion; candidate: PersonRead }[];
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
  eccentricity = 0,
  variant = "default"
}: { 
  attendee: PersonRead; 
  angle: number; 
  radius: number;
  eccentricity?: number;
  variant?: "default" | "opportunity";
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
        <div className={cn(
          "relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border shadow-lg group-hover:scale-110 transition-transform duration-300",
          variant === "opportunity" ? "border-emerald-400/50 border-dashed" : "border-white/10"
        )}>
          {variant === "opportunity" && (
             <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
          )}
          {/* We assume a profile image might be in tags or social handles for now, or fallback */}
          <div className={cn("absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900")}>
             <span className="text-xs font-medium text-white/80">
               {(attendee.preferred_name || attendee.legal_name || "??").slice(0, 2).toUpperCase()}
             </span>
          </div>
        </div>

        {/* Optional Interest Dot - Check tags for interests */}
        {attendee.tags && attendee.tags.length > 0 && (
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
  relationships,
  opportunities,
  className
}) => {
  // Graceful Degradation: Generate placeholders if empty
  const activeAttendees = useMemo(() => {
    if (featuredAttendees && featuredAttendees.length > 0) return featuredAttendees;
    
    // Generate placeholders if empty
    return Array.from({ length: 7 }).map((_, i) => ({
      person_id: `placeholder-${i}`,
      owner_id: "system",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      preferred_name: ["Alex", "Sam", "Jordan", "Taylor", "Casey", "Riley", "Morgan"][i],
      tags: i % 2 === 0 ? ["Tech"] : []
    } as PersonRead));
  }, [featuredAttendees]);

  // Distribute into orbits based on Relationship Score if available
  // Ring 1: Inner (High Relevance / Score > 0.6)
  // Ring 2: Outer (Lower Relevance)
  
  const ring1: PersonRead[] = [];
  const ring2: PersonRead[] = [];

  if (relationships && relationships.length > 0) {
    // If we have real relationship data, use it for sorting
    activeAttendees.forEach(attendee => {
      const rel = relationships.find(r => r.target_person_id === attendee.person_id);
      const score = rel?.strength_score || 0;
      
      if (score > 0.6) {
        ring1.push(attendee);
      } else {
        ring2.push(attendee);
      }
    });

    // If Ring 1 is too crowded (> 4), move excess to Ring 2
    if (ring1.length > 4) {
      const overflow = ring1.splice(4);
      ring2.unshift(...overflow);
    }
  } else {
    // Default fallback distribution
    ring1.push(...activeAttendees.slice(0, 3));
    ring2.push(...activeAttendees.slice(3, 10));
  }

  return (
    <div className={cn("relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-black/5 dark:bg-black/40 rounded-3xl border border-white/5", className)}>
      <BackgroundField />

      {/* Center Text Node */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 mix-blend-plus-lighter">
        <span className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-white/60 drop-shadow-sm">
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
      
      {/* Inner Ring - Slow Orbit */}
      <OrbitRing radius={110} duration={60} direction="clockwise" eccentricity={0.05} variant="continuous">
        {ring1.map((attendee, i) => {
          // Lookup score for edge visualization
          const rel = relationships?.find(r => r.target_person_id === attendee.person_id);
          const score = rel?.strength_score || 0;
          const angle = (360 / ring1.length) * i;

          return (
            <React.Fragment key={attendee.person_id}>
              <ConnectionEdge 
                startY={0} startX={0} // Center relative
                endX={0} endY={0} // Not used currently as line is drawn to radius
                orbitRadius={110}
                orbitAngle={angle}
                score={score}
              />
              <AvatarNode 
                attendee={attendee} 
                angle={angle} 
                radius={110} 
                eccentricity={0.05}
              />
            </React.Fragment>
          );
        })}
      </OrbitRing>

      {/* Outer Ring - Slower Reverse Orbit */}
      {ring2.length > 0 && (

         <OrbitRing radius={170} duration={80} direction="counter-clockwise" eccentricity={0.08} delay={0.5} variant="continuous">
            {ring2.map((attendee, i) => {
              const rel = relationships?.find(r => r.target_person_id === attendee.person_id);
              const score = rel?.strength_score || 0;
              const angle = (360 / ring2.length) * i + 45;

              return (
              <React.Fragment key={attendee.person_id}>
                 <ConnectionEdge 
                    startY={0} startX={0}
                    endX={0} endY={0}
                    orbitRadius={170}
                    orbitAngle={angle}
                    score={score}
                 />
                 <AvatarNode 
                    attendee={attendee} 
                    angle={angle} 
                    radius={170}
                    eccentricity={0.08} 
                 />
              </React.Fragment>
              );
            })}
         </OrbitRing>
      )}

      {/* Opportunity Field - Deep Outer Orbit (Ghost/Potential) */}
      {opportunities && opportunities.length > 0 && (
         <OrbitRing radius={220} duration={120} direction="clockwise" eccentricity={0.12} delay={1.5} variant="continuous">
            {opportunities.map((opp, i) => (
               <AvatarNode
                 key={opp.candidate.person_id}
                 attendee={opp.candidate}
                 angle={(360 / opportunities.length) * i + 90}
                 radius={220}
                 eccentricity={0.12}
                 variant="opportunity"
               />
            ))}
         </OrbitRing>
      )}

      {/* Interactive Overlay (Optional expansion hooks) */}
      <div className="absolute inset-0 pointer-events-none" />
    </div>
  );
};
