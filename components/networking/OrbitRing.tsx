"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbitRingProps {
  radius: number; // Base radius in px
  duration?: number; // Seconds for a full wobble/rotation cycle
  direction?: "clockwise" | "counter-clockwise";
  eccentricity?: number; // 0 to 1, where 0 is perfect circle
  className?: string;
  children?: React.ReactNode;
  delay?: number;
}

export const OrbitRing: React.FC<OrbitRingProps> = ({
  radius,
  duration = 20,
  direction = "clockwise",
  eccentricity = 0.1, // Slight oval
  className,
  children,
  delay = 0,
}) => {
  // Calculate dimensions based on radius and eccentricity
  // If eccentricity is 0.1, the height is 90% of width
  const width = radius * 2;
  const height = width * (1 - eccentricity);

  const rotateValues =
    direction === "clockwise" ? [0, 15, 0] : [0, -15, 0];

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
        animate={{
          rotate: rotateValues,
  
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut", // Gentle sway
          delay: delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
