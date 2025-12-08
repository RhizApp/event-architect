import React from 'react';
import Image from 'next/image';
import styles from './schedule.module.css';

export interface Session {
  id: string;
  time: string;
  title: string;
  speaker: { name: string; avatar: string; role: string };
  track?: 'Main Stage' | 'Workshop' | 'Networking';
  // Layout hint for the grid
  isWide?: boolean; 
}

interface SessionCardProps {
  session: Session;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const { title, time, speaker, track = 'Main Stage', isWide } = session;

  return (
    <div 
      className={`${styles.card} ${isWide ? styles.span2 : ''}`}
      data-track={track}
    >
      <div className={styles.shinyOverlay} />
      
      {/* Header: Time & Track */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <span className="font-mono text-sm text-gray-400 tracking-tight">{time}</span>
        {track && (
          <span className={styles.badge} data-track={track}>
            {track}
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-grow flex flex-col justify-end gap-6">
        <h3 className={`text-xl md:text-2xl font-semibold leading-tight text-white ${styles.cardTitle}`}>
            {title}
        </h3>
        
        {/* Speaker Line */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          {speaker.avatar && (
            <Image
              src={speaker.avatar} 
              alt={speaker.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"
            />
          )}
          <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
            <span className="text-sm font-medium text-gray-200">{speaker.name}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{speaker.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
