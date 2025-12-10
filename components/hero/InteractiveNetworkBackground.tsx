"use client";

import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  id: number;
}

export const InteractiveNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let points: Point[] = [];
    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Configuration
    const POINT_COUNT = 60;
    const CONNECTION_DISTANCE = 150;
    const MOUSE_DISTANCE = 200;
    const SPEED_FACTOR = 0.3;

    let mouseX = -1000;
    let mouseY = -1000;

    // Initialize points
    const initPoints = () => {
      points = [];
      for (let i = 0; i < POINT_COUNT; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * SPEED_FACTOR,
          vy: (Math.random() - 0.5) * SPEED_FACTOR,
          id: i,
        });
      }
    };

    const handleResize = () => {
      if (containerRef.current && canvas) {
        width = containerRef.current.offsetWidth;
        height = containerRef.current.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        initPoints();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Update and draw points
      points.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off walls
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        // Mouse interaction: push away slightly if too close
        const dxMouse = point.x - mouseX;
        const dyMouse = point.y - mouseY;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < MOUSE_DISTANCE) {
            const angle = Math.atan2(dyMouse, dxMouse);
            point.vx += Math.cos(angle) * 0.01;
            point.vy += Math.sin(angle) * 0.01;
        }

        // Draw Point
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)'; // Sky-400
        ctx.fill();
        
        // Connections
        points.forEach(otherPoint => {
            if (point.id === otherPoint.id) return;
            const dx = point.x - otherPoint.x;
            const dy = point.y - otherPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONNECTION_DISTANCE) {
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(otherPoint.x, otherPoint.y);
                const opacity = 1 - (distance / CONNECTION_DISTANCE);
                ctx.strokeStyle = `rgba(50, 189, 248, ${opacity * 0.2})`;
                ctx.stroke();
            }
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', handleResize);
    const currentContainer = containerRef.current;
    if(currentContainer) {
        currentContainer.addEventListener('mousemove', handleMouseMove);
    }
    
    // Initial setup
    handleResize();
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if(currentContainer) {
        currentContainer.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-[#0F172A]">
        {/* Deep Gradient Background base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#020617] to-[#1e293b] opacity-90" />
        
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-0"
            style={{ filter: 'blur(0px)' }}
        />
        
        {/* Overlay gradient to fade edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent z-10 pointer-events-none" />
    </div>
  );
};
