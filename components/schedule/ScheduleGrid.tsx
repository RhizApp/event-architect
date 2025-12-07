import React from 'react';
import { Session, SessionCard } from './SessionCard';
import styles from './schedule.module.css';

interface ScheduleProps {
  sessions: Session[];
}

export const ScheduleGrid: React.FC<ScheduleProps> = ({ sessions }) => {
  return (
    <div className={`w-full max-w-7xl mx-auto px-6 py-12 ${styles.container}`}>
      {/* Grid Container */}
      <div className={styles.bentoGrid}>
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
};
