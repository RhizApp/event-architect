import { cubicBezier } from "framer-motion";

// Custom easings for organic, non-mechanical motion
export const rhizEasings = {
  // A gentle ease-in-out that feels like floating in water
  float: cubicBezier(0.45, 0, 0.55, 1),
  // A sharper ease for deciding movements
  snap: cubicBezier(0.22, 1, 0.36, 1),
  // Soft pulse breathing
  pulse: cubicBezier(0.4, 0, 0.6, 1),
};

// Organic motion presets
export const rhizMotion = {
  // Random float duration between min and max
  randomFloatDuration: (min = 3.2, max = 6.8) => 
    Math.random() * (max - min) + min,
  
  // Random float delay to desynchronize elements
  randomDelay: (max = 2) => Math.random() * max,

  // Subtle angular drift (wobble)
  corkscrew: {
    rotate: [
      -2, 
      2, 
      -1, 
      1, 
      0
    ],
    transition: {
      repeat: Infinity,
      repeatType: "mirror" as const,
      duration: 12,
      ease: rhizEasings.float
    }
  },
  
  // The heartbeat of the "AI Match" badge
  intelligencePulse: {
    scale: [1, 1.02, 0.98, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: rhizEasings.pulse
    }
  }
};

// Grid/Orbit generation helpers
export const generateOrbitPath = (radius: number, eccentricity: number = 0) => {
  // In a real SVG path we'd use these, but for CSS layout we'll use absolute positioning + rotation
  return {
    width: radius * 2,
    height: (radius * 2) * (1 - eccentricity)
  };
};
