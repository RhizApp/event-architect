"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbitRingProps {
  radius: number; // Base radius in px
  duration?: number; // Seconds for a full wobble/rotation cycle
  direction?: "clockwise" | "counter-clockwise";
  eccentricity?: number; // 0 to 1, where 0 is perfect circle
  variant?: "sway" | "continuous";
  className?: string;
  children?: React.ReactNode;
  delay?: number;
}

export const OrbitRing: React.FC<OrbitRingProps> = ({
  radius,
  duration = 20,
  direction = "clockwise",
  eccentricity = 0.1, // Slight oval
  variant = "sway",
  className,
  children,
  delay = 0,
}) => {
  // Calculate dimensions based on radius and eccentricity
  const width = radius * 2;
  const height = width * (1 - eccentricity);

  // Animation variants
  const animations = {
    sway: {
      rotate: direction === "clockwise" ? [0, 15, 0] : [0, -15, 0],
      transition: {
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse" as const, // TS fix: Explicitly cast literal
        ease: "easeInOut" as const,
        delay: delay,
      }
    },
    continuous: {
      rotate: direction === "clockwise" ? 360 : -360,
      transition: {
        duration: duration,
        repeat: Infinity,
        ease: "linear" as const,
        delay: delay,
      }
    }
  };

  const currentAnim = animations[variant];

  return (
    <div
      className={cn("absolute flex items-center justify-center pointer-events-none", className)}
      style={{
        width: width,
        height: height,
        zIndex: 10,
      }}
    >
      {/* The Visual Ring (Border) - Optional, maybe just for debugging or subtle effect */}
      <motion.div
        className="absolute inset-0 rounded-full border border-gray-500/10 dark:border-white/5"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: delay * 0.5 }}
      />
      
      {/* The Container that rotates/sways */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ rotate: currentAnim.rotate }}
        transition={currentAnim.transition}
      >
        {children}
      </motion.div>
    </div>
  );
};
