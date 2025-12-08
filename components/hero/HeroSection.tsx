import React from 'react';
import { HeroTheme, THEMES } from './theme';
import { BackgroundSystem } from './BackgroundSystem';
import { InteractiveNetworkBackground } from './InteractiveNetworkBackground';
import styles from './hero.module.css';

export interface HeroProps {
  title: string;
  subtitle: string;
  date: string;
  location: string;
  backgroundImage?: string;
  primaryAction: { label: string; onClick: () => void };
  theme: HeroTheme;
}

export const HeroSection: React.FC<HeroProps> = ({
  title,
  subtitle,
  date,
  location,
  backgroundImage,
  primaryAction,
  theme,
}) => {
  const themeConfig = THEMES[theme];
  
  // Inline styles for theme-dynamic values
  const containerStyle = {
    color: themeConfig.colors.text.primary,
    fontFamily: themeConfig.typography.subtitle.split(';')[0].replace('font-family:', '').trim(),
    '--theme-accent': themeConfig.colors.text.accent,
    '--theme-bg': themeConfig.colors.background,
  } as React.CSSProperties;

  const titleStyle = {
      // Parse the CSS string from theme config to react style logic roughly or just set via style attribute
      // Since the theme config strings are literal CSS properties, it's safer to just set the style tag logic 
      fontFamily: themeConfig.typography.title.match(/font-family:([^;]+)/)?.[1]?.trim(),
  } as React.CSSProperties;

  return (
    <section 
      className="relative w-full h-[700px] flex items-center justify-center overflow-hidden" // Fixed 700px as requested "first 700px"
      style={containerStyle}
    >
      {/* Background System */}
      {backgroundImage === 'dynamic-network' ? (
        <InteractiveNetworkBackground />
      ) : (
        <BackgroundSystem theme={theme} backgroundImage={backgroundImage} />
      )}

      {/* Content Container */}
      {/* Using a grid to allow for the 'Creative composition grid' requirement on desktop */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
        
        {/* Layout Switch: Desktop vs Mobile is handled via grid/flex responsive classes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center h-full">
          
          {/* Main Text Content */}
          <div className={`col-span-1 lg:col-span-8 flex flex-col gap-6 
             ${theme === 'professional' ? 'lg:text-left text-center items-center lg:items-start' : ''}
             ${theme === 'vibrant' ? 'lg:text-center text-center items-center' : ''}
             ${theme === 'luxury' ? 'lg:text-center text-center items-center' : ''}
             /* Centering logic override based on requirements "Center or Offset" - defaulting to Left/Center Mix */
          `}>
             
             {/* Date & Location Tag */}
             <div 
               className={`${styles.animateEntrance} opacity-0 text-sm md:text-base tracking-wider mb-2`}
               style={{ 
                   color: themeConfig.colors.text.accent, 
                   fontFamily: themeConfig.typography.meta.match(/font-family:([^;]+)/)?.[1]
               }}
             >
                {date} • {location}
             </div>

             {/* Title */}
             <h1 
               className={`${styles.animateEntrance} ${styles.delay100} text-5xl md:text-7xl lg:text-8xl leading-[0.95] drop-shadow-2xl`}
               style={{
                   ...titleStyle, // Font family
                   color: themeConfig.colors.text.primary,
                   // Font weight/style extracted from string manually for simplicity or passed via separate class if possible.
                   // Here we rely on the theme string having valid CSS or just font-family and we add utilities
               }}
             >
                {/* Manual injection of styles for the specific typographic requirements */}
               <span style={{ 
                   fontWeight: theme === 'vibrant' ? 800 : (theme === 'professional' ? 700 : 400),
                   fontStyle: theme === 'luxury' ? 'italic' : 'normal',
                   letterSpacing: theme === 'professional' ? '-0.02em' : (theme === 'vibrant' ? '-0.01em' : '0em')
               }}>
                  {title}
               </span>
             </h1>

             {/* Subtitle */}
             <p 
               className={`${styles.animateEntrance} ${styles.delay200} text-lg md:text-2xl opacity-90 max-w-2xl`}
               style={{ 
                   color: themeConfig.colors.text.secondary,
                   fontFamily: themeConfig.typography.subtitle.match(/font-family:([^;]+)/)?.[1]
               }}
             >
               {subtitle}
             </p>

            {/* CTA Button */}
            <div className={`mt-8 ${styles.animateEntrance} ${styles.delay300}`}>
               <button
                 onClick={primaryAction.onClick}
                 data-theme={theme}
                 className={`
                    ${styles.heroButton} 
                    px-8 py-4 
                    text-base md:text-lg 
                    font-bold 
                    tracking-wide
                    cursor-pointer
                    ${theme === 'professional' ? 'rounded-md' : (theme === 'vibrant' ? 'rounded-full' : 'rounded-none')}
                 `}
                 style={{
                     backgroundColor: themeConfig.colors.button.bg,
                     color: themeConfig.colors.button.text,
                 }}
               >
                 <span className="relative z-10">{primaryAction.label}</span>
               </button>
            </div>
          </div>

          {/* Spacer / Compositional Balancer for Desktop */}
          {/* This empty col helps push content or creates negative space as per "Creative composition" */}
          <div className="hidden lg:block col-span-4">
               {/* Could contain a subtle graphic if needed, but per specs mainly relying on background composition */}
          </div>
          
        </div>
      </div>
    </section>
  );
};
