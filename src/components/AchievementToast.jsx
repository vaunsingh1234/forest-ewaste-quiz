import React, { useEffect, useState } from 'react';
import { rarityColors } from '../data/achievements';

export default function AchievementToast({ achievements }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    if (achievements && achievements.length > 0) {
      setVisible(achievements);
      const timer = setTimeout(() => setVisible([]), 4500);
      return () => clearTimeout(timer);
    }
  }, [achievements]);

  if (!visible.length) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '5rem',
      right: '1rem',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      {visible.map(achievement => (
        <div
          key={achievement.id}
          className="achievement-toast"
          style={{
            background: 'var(--bg-card)',
            border: `1px solid ${rarityColors[achievement.rarity] || 'var(--border-card)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '0.875rem 1.25rem',
            boxShadow: `var(--shadow-elevated), 0 0 20px ${rarityColors[achievement.rarity]}33`,
            minWidth: '260px',
            maxWidth: '320px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.25rem' }}>{achievement.icon}</span>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: rarityColors[achievement.rarity],
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '2px',
              }}>
                🏅 Achievement Unlocked
              </div>
              <div style={{
                fontWeight: 600,
                fontSize: '0.9375rem',
                color: 'var(--text-primary)',
              }}>
                {achievement.name}
              </div>
            </div>
            <div style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--accent-green)',
            }}>
              +{achievement.points}
            </div>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', paddingLeft: '1.875rem' }}>
            {achievement.description}
          </div>
        </div>
      ))}
    </div>
  );
}
