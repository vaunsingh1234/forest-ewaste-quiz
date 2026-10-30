import React, { useState } from 'react';
import { Award, Lock, Sparkles, ArrowLeft, Trophy, Star, Shield, HelpCircle, CheckCircle } from 'lucide-react';
import { achievements, rarityColors } from '../data/achievements';

export default function AchievementsPage({ gameState, navigate }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unlocked' | 'locked' | 'secret'
  const unlockedIds = gameState?.achievements || [];

  const unlockedList = achievements.filter(a => unlockedIds.includes(a.id));
  const lockedList = achievements.filter(a => !unlockedIds.includes(a.id) && !a.secret);
  const secretList = achievements.filter(a => !unlockedIds.includes(a.id) && a.secret);
  const totalPoints = unlockedList.reduce((acc, a) => acc + (a.points || 0), 0);

  const nonSecretTotal = achievements.length - achievements.filter(a => a.secret).length;
  const completionPct = Math.round((unlockedList.length / (nonSecretTotal || 1)) * 100);

  const filteredItems = achievements.filter(a => {
    const isUnlocked = unlockedIds.includes(a.id);
    if (activeFilter === 'unlocked') return isUnlocked;
    if (activeFilter === 'locked') return !isUnlocked && !a.secret;
    if (activeFilter === 'secret') return a.secret;
    return true;
  });

  return (
    <div className="page-enter achievements-page" style={{
      minHeight: '100dvh',
      padding: 'calc(var(--safe-top, 0px) + 0.75rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 1.5rem)',
      background: 'radial-gradient(ellipse at top, #133a27 0%, #06150e 85%)',
      color: '#f0fdf4',
      overflowX: 'hidden',
    }}>
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto', padding: '0 0.25rem' }}>
        
        {/* Navigation Breadcrumb / Back button */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate(gameState?.gameStarted ? 'map' : 'home')}
            style={{
              minHeight: '44px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '0.45rem 0.85rem',
              color: '#86efac',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={16} />
            <span>{gameState?.gameStarted ? 'RETURN TO MAP' : 'BACK HOME'}</span>
          </button>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(0, 214, 143, 0.1)',
            border: '1px solid rgba(0, 214, 143, 0.25)',
            borderRadius: '100px',
            padding: '0.3rem 0.75rem',
          }}>
            <Sparkles size={13} color="#00d68f" />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: '#00d68f',
              fontWeight: 700,
            }}>
              CADET BADGES
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(16, 44, 30, 0.9) 0%, rgba(9, 26, 18, 0.95) 100%)',
          border: '1.5px solid rgba(74, 222, 128, 0.35)',
          borderRadius: '24px',
          padding: '1.25rem',
          marginBottom: '1rem',
          boxShadow: '0 12px 35px rgba(0,0,0,0.5)',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 0.35rem 0',
          }}>
            ACHIEVEMENTS & TROPHIES
          </h1>
          <p style={{ margin: '0 0 1rem 0', color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Earn badges through investigation, component repairs, and safe battery handling.
          </p>

          {/* Quick Metrics (2-Column Compact) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
            <div style={{
              background: 'rgba(0, 214, 143, 0.1)',
              border: '1px solid rgba(0, 214, 143, 0.25)',
              borderRadius: '14px',
              padding: '0.75rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#86efac', fontWeight: 600 }}>
                UNLOCKED
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#00d68f', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {unlockedList.length} / {achievements.length}
              </div>
            </div>

            <div style={{
              background: 'rgba(250, 204, 21, 0.1)',
              border: '1px solid rgba(250, 204, 21, 0.25)',
              borderRadius: '14px',
              padding: '0.75rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#fde047', fontWeight: 600 }}>
                XP POINTS
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#facc15', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {totalPoints} XP
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#86efac', fontWeight: 600 }}>
              SANCTUARY COMPLETION
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#00d68f', fontWeight: 800 }}>
              {completionPct}%
            </span>
          </div>
          <div className="progress-track" style={{ height: '8px' }}>
            <div
              className="progress-fill progress-green"
              style={{ width: `${Math.min(100, Math.max(0, completionPct))}%` }}
            />
          </div>
        </div>

        {/* Filter Switcher Tabs (Responsive Single Row / Scrollable) */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          marginBottom: '1.25rem',
          padding: '4px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '16px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>
          {[
            { id: 'all', label: `ALL (${achievements.length})` },
            { id: 'unlocked', label: `UNLOCKED (${unlockedList.length})` },
            { id: 'locked', label: `LOCKED (${lockedList.length})` },
            { id: 'secret', label: `SECRET (${secretList.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                flex: 1,
                minHeight: '44px',
                border: 'none',
                background: activeFilter === tab.id ? '#22c55e' : 'transparent',
                color: activeFilter === tab.id ? '#06150e' : '#94a3b8',
                padding: '0.45rem 0.65rem',
                borderRadius: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Achievements List (Single-Column Cards) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredItems.map(achievement => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            const isSecret = !isUnlocked && achievement.secret;
            const rarity = achievement.rarity || 'common';
            const color = rarityColors[rarity] || '#00d68f';

            if (isSecret) {
              return (
                <div
                  key={achievement.id}
                  style={{
                    background: 'rgba(6, 21, 14, 0.7)',
                    border: '1.5px dashed rgba(74, 222, 128, 0.25)',
                    borderRadius: '20px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    opacity: 0.75,
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    color: '#94a3b8',
                    flexShrink: 0,
                  }}>
                    <Lock size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#94a3b8' }}>
                      CLASSIFIED SECRET BADGE
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                      Uncover hidden easter eggs in Nova City to unlock.
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={achievement.id}
                style={{
                  background: isUnlocked ? 'rgba(6, 30, 18, 0.85)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1.5px solid ${isUnlocked ? color : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '20px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  opacity: isUnlocked ? 1 : 0.65,
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: isUnlocked ? `${color}22` : 'rgba(0,0,0,0.4)',
                  border: `1.5px solid ${isUnlocked ? color : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  flexShrink: 0,
                }}>
                  {isUnlocked ? achievement.icon : <Lock size={20} color="#94a3b8" />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff' }}>
                      {achievement.name}
                    </span>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontFamily: 'var(--font-mono)',
                      color,
                      border: `1px solid ${color}44`,
                      background: `${color}15`,
                      padding: '1px 6px',
                      borderRadius: '100px',
                      fontWeight: 700,
                    }}>
                      {rarity.toUpperCase()}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                    {achievement.description}
                  </p>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 800, color: '#facc15' }}>
                    +{achievement.points}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: isUnlocked ? '#00d68f' : '#64748b', fontWeight: 700 }}>
                    {isUnlocked ? 'EARNED' : 'LOCKED'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
