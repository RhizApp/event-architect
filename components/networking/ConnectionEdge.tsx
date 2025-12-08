"use client";

import React from "react";
import { motion } from "framer-motion";

interface ConnectionEdgeProps {
  startX: number;
  startY: number;
  endX: number; // Of the center of the orbit container
  endY: number;
  orbitRadius: number;
  orbitAngle: number;
  score: number; // 0 to 1
}

/**
 * Draws a line effectively from center to the orbiting avatar.
 * Since the avatar is orbiting, we need to calculate its position here too or accept it.
 * Simplified approach: This component lives inside the OrbitRing to share rotation?
 * Or we calculate the position based on the same math.
 * 
 * Let's calculate the position:
 * Target X = CenterX + Radius * cos(angle)
 * Target Y = CenterY + Radius * sin(angle) (modified by eccentricity if needed)
 */
export const ConnectionEdge: React.FC<ConnectionEdgeProps> = ({
  startX, // Center of container (usually width/2)
  startY,
  orbitRadius,
  orbitAngle,
  score,
}) => {
  // If score < 0.2, don't render line
  if (score < 0.2) return null;

  // Convert angle to radians
  const radian = (orbitAngle * Math.PI) / 180;
  
  // NOTE: If OrbitRing has eccentricity or rotation, this needs to match.
  // NetworkingPreview currently handles rotation via a CSS transform on the ring container.
  // This makes drawing lines from a STATIC center to a ROTATING node tricky if the line isn't also rotating.
  // BEST APPROACH: Put the lines in a separate layer that DOES NOT rotate, 
  // but we animate the 'end' of the line to match the orbit speed? Hard to sync.
  
  // EASIER APPROACH: The line rotates WITH the orbit ring. It goes from Center (0,0 locally) to the node.
  // Since the Node is at (Radius, 0) relative to the rotated container? 
  // No, the node is at (Radius * cos, Radius * sin).
  
  // If we place this INSIDE the OrbitRing, the whole coordinate system rotates.
  // So a line from (0,0) to (NodeX, NodeY) will rotate perfectly with the node.
  // However, the OrbitRing is usually centered.
  
  // We need the coordinates of the node relative to the center.
  // In `AvatarNode`, we use:
  // x = Radius * cos(radian)
  // y = Radius * sin(radian) * (1-eccentricity)
  // But due to the parent rotation `continuous`, the actual screen position changes.
  
  return (
    <motion.svg
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <line
        x1={0} // Center logic handled by parent placement
        y1={0}
        x2={orbitRadius} // If we are inside the rotating ring, we just point to the radius? 
                         // No, because the nodes themselves are placed at specific angles inside the ring.
                         // Wait, in `NetworkingPreview`, nodes are passed `angle`. 
                         // And the ring ITSELF rotates.
        y2={0} 
        stroke="url(#edge-gradient)"
        strokeWidth={score * 2}
        strokeOpacity={score}
      />
      <defs>
        <linearGradient id="edge-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(99, 102, 241, 0.6)" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};
