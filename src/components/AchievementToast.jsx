import React, { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
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

  const dismissToast = (id) => {
    setVisible(prev => prev.filter(a => a.id !== id));
  };

  if (!visible.length) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 'calc(var(--safe-top, 0px) + 0.5rem)',
      left: '0.75rem',
      right: '0.75rem',
      maxWidth: '420px',
      margin: '0 auto',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      pointerEvents: 'none',
    }}>
      {visible.map(achievement => (
        <div
          key={achievement.id}
          className="achievement-toast animate-scaleIn"
          style={{
            pointerEvents: 'auto',
            background: 'rgba(6, 26, 16, 0.95)',
            border: `1.5px solid ${rarityColors[achievement.rarity] || '#00d68f'}`,
            borderRadius: '16px',
            padding: '0.75rem 1rem',
            boxShadow: `0 8px 30px rgba(0,0,0,0.6), 0 0 20px ${rarityColors[achievement.rarity] || '#00d68f'}44`,
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div style={{
            fontSize: '1.75rem',
            lineHeight: 1,
            flexShrink: 0,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${rarityColors[achievement.rarity]}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {achievement.icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: rarityColors[achievement.rarity] || '#00d68f',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              <Sparkles size={12} />
              <span>ACHIEVEMENT UNLOCKED</span>
            </div>
            
            <div style={{
              fontWeight: 700,
              fontSize: '0.9375rem',
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: '1px 0',
            }}>
              {achievement.name}
            </div>

            <div style={{
              fontSize: '0.8125rem',
              color: '#94a3b8',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {achievement.description}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', flexShrink: 0 }}>
            <button
              onClick={() => dismissToast(achievement.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
              }}
            >
              <X size={14} />
            </button>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              fontWeight: 800,
              color: '#00d68f',
            }}>
              +{achievement.points}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
