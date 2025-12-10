"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";

import Image from "next/image";

const AVATARS = [
  // Local Uploads
  "/hero-assets/avatar-1.jpg", 
  "/hero-assets/avatar-2.jpg", 
  "/hero-assets/avatar-3.jpg",
  // Unsplash High-Res Portraits
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces", // Woman in hat
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces", // Man portrait
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces", // Professional woman
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces", // Smiling man
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces", // Woman model
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces", // Man chin
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=faces", // Woman glasses
];

// Simplified Avatar Node for Hero
const HeroAvatar = ({ delay, x, y, size = "md", idx = 0 }: { delay: number; x: number; y: number; size?: "sm" | "md", idx?: number }) => {
  const imgUrl = AVATARS[idx % AVATARS.length];
  
  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      initial={{ x, y, scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: y + 10 // Float effect managed by parent or here? Let's just do static orbit here
      }}
      transition={{ delay: delay * 0.1, duration: 0.8 }}
    >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
          className={clsx(
              "relative rounded-full border border-white/20 backdrop-blur-md shadow-xl flex items-center justify-center overflow-hidden bg-black/40",
              size === "md" ? "w-10 h-10" : "w-8 h-8"
          )}
        >
             <Image 
               src={imgUrl} 
               alt="User" 
               fill 
               className="object-cover opacity-90 hover:opacity-100 transition-opacity"
               sizes="40px"
             />
        </motion.div>
    </motion.div>
  );
};

export function HeroGraph() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-zinc-950/80 to-zinc-950" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full animate-pulse-slow" />
        
        {/* Central Hub */}
        <div className="relative z-10 w-24 h-24 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-brand-500/20">
             <div className="absolute inset-0 rounded-full border border-brand-500/30 animate-ping-slow opacity-20" />
             <div className="text-white font-heading font-bold text-xl tracking-tight">CI</div>
        </div>

        {/* Orbit Inner */}
        <motion.div 
            className="absolute border border-white/5 rounded-full w-[200px] h-[200px]"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
             {[0, 90, 180, 270].map((deg, i) => {
                 const rad = deg * (Math.PI / 180);
                 const x = Math.cos(rad) * 100;
                 const y = Math.sin(rad) * 100;
                 return <HeroAvatar key={i} delay={i} x={x} y={y} size="sm" idx={i} />;
             })}
        </motion.div>

        {/* Orbit Outer */}
        <motion.div 
            className="absolute border border-white/5 rounded-full w-[350px] h-[350px]"
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
             {[45, 135, 225, 315].map((deg, i) => {
                 const rad = deg * (Math.PI / 180);
                 const x = Math.cos(rad) * 175;
                 const y = Math.sin(rad) * 175;
                 return <HeroAvatar key={i} delay={i+4} x={x} y={y} size="md" idx={i + 4} />;
             })}
        </motion.div>
        
        {/* Connection Lines (Static for simplicity in hero) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
             <circle cx="50%" cy="50%" r="100" stroke="#38BDF8" strokeWidth="1" fill="none" strokeDasharray="4 4" />
             <circle cx="50%" cy="50%" r="175" stroke="#A855F7" strokeWidth="1" fill="none" strokeDasharray="4 4" />
        </svg>

    </div>
  );
}
