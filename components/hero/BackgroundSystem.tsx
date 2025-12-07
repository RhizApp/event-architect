import React from 'react';
import { HeroTheme, THEMES } from './theme';
import styles from './hero.module.css';

interface BackgroundSystemProps {
  theme: HeroTheme;
  backgroundImage?: string;
  hasMedia?: boolean;
}

export const BackgroundSystem: React.FC<BackgroundSystemProps> = ({
  theme,
  backgroundImage,
}) => {
  const themeConfig = THEMES[theme];

  // If we have an image, use it with the theme overlay
  if (backgroundImage) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Full-bleed Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        
        {/* Subtle Animated Veil */}
        <div 
          className="absolute inset-0 z-10 mix-blend-multiply transition-opacity duration-1000"
          style={{ background: themeConfig.gradients.overlay, opacity: 0.35 }}
        />

        {/* Noise Texture */}
        <div className={styles.noiseOverlay} />
      </div>
    );
  }

  // Procedural Backgrounds
  return (
    <div 
      className={`absolute inset-0 w-full h-full overflow-hidden ${styles.backgroundDrift}`}
      style={{ background: themeConfig.gradients.base }}
    >
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
          {renderPattern(theme)}
      </div>

       {/* Noise Texture */}
       <div className={styles.noiseOverlay} />
    </div>
  );
};

const renderPattern = (theme: HeroTheme) => {
  switch (theme) {
    case 'professional':
      return (
        <svg  width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
           {/* Tech Grid touches */}
           <path d="M 0 100 L 100 0" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" fill="none"/>
        </svg>
      );
    case 'vibrant':
      return (
         <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2">
                <path d="M-100,50 C150,200 350,-100 900,100" />
                <path d="M-100,150 C200,300 400,0 900,200" />
                <path d="M-100,250 C250,400 450,100 900,300" />
            </g>
         </svg>
      );
    case 'luxury':
      return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
             <pattern id="hex" width="40" height="70" patternTransform="scale(0.5)" patternUnits="userSpaceOnUse">
                <path d="M20 0 L40 17.5 L40 52.5 L20 70 L0 52.5 L0 17.5 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
             </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>
      );
  }
};
