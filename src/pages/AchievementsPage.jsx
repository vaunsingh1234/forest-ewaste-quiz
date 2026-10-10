import React, { useState } from 'react';
import { Award, Lock, Sparkles, ArrowLeft, Trophy, Star, Shield, HelpCircle, CheckCircle } from 'lucide-react';
import { achievements, rarityColors } from '../data/achievements';

export default function AchievementsPage({ gameState, navigate }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unlocked' | 'locked' | 'secret'
  const unlockedIds = gameState.achievements || [];

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
    return true; // 'all'
  });

  return (
    <div className="page-enter achievements-page" style={{
      minHeight: 'calc(100vh - 4rem)',
      padding: '2rem 1.25rem 5rem',
      background: 'radial-gradient(ellipse at top, #133a27 0%, #06150e 85%)',
    }}>
      <div className="container" style={{ maxWidth: '1180px' }}>
        
        {/* Navigation Breadcrumb / Back button */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate(gameState.gameStarted ? 'map' : 'home')}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '0.45rem 0.95rem',
              color: '#86efac',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft size={15} />
            <span>{gameState.gameStarted ? 'RETURN TO 3D MAP' : 'BACK TO HOME'}</span>
          </button>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(0, 214, 143, 0.1)',
            border: '1px solid rgba(0, 214, 143, 0.25)',
            borderRadius: '100px',
            padding: '0.25rem 0.85rem',
          }}>
            <Sparkles size={13} color="#00d68f" />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: '#00d68f',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}>
              NOVA SANCTUARY // CADET BADGES
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(16, 44, 30, 0.9) 0%, rgba(9, 26, 18, 0.95) 100%)',
          border: '1.5px solid rgba(74, 222, 128, 0.35)',
          borderRadius: '24px',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.2vw, 2.3rem)',
              letterSpacing: '0.04em',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 0.4rem',
            }}>
              ACHIEVEMENTS & TROPHIES
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Unlock badges by investigating devices, repairing components, preventing hazards, and making responsible disposal choices.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
          }}>
            <div style={{
              background: 'rgba(0, 214, 143, 0.1)',
              border: '1px solid rgba(0, 214, 143, 0.25)',
              borderRadius: '16px',
              padding: '0.85rem 1.25rem',
              minWidth: '130px',
            }}>
              <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#86efac' }}>
                BADGES UNLOCKED
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00d68f', fontFamily: 'var(--font-display)' }}>
                {unlockedList.length} / {achievements.length}
              </div>
            </div>

            <div style={{
              background: 'rgba(250, 204, 21, 0.1)',
              border: '1px solid rgba(250, 204, 21, 0.25)',
              borderRadius: '16px',
              padding: '0.85rem 1.25rem',
              minWidth: '130px',
            }}>
              <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#fde047' }}>
                POINTS EARNED
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#facc15', fontFamily: 'var(--font-display)' }}>
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
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#86efac', fontWeight: 600 }}>
              SECTOR COMPLETION PROGRESS
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#00d68f', fontWeight: 800 }}>
              {completionPct}%
            </span>
          </div>
          <div style={{
            height: '10px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
          }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, completionPct))}%`,
                background: 'linear-gradient(90deg, #38bdf8 0%, #00d68f 100%)',
                boxShadow: '0 0 10px rgba(0, 214, 143, 0.5)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Filter Switcher Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '4px',
          borderRadius: '16px',
          width: 'fit-content',
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
                border: 'none',
                background: activeFilter === tab.id ? 'linear-gradient(135deg, #00d68f 0%, #059669 100%)' : 'transparent',
                color: activeFilter === tab.id ? '#06150e' : '#94a3b8',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: activeFilter === tab.id ? '0 0 12px rgba(0, 214, 143, 0.35)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
        }}>
          {filteredItems.map((achievement) => {
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
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    opacity: 0.75,
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(0, 214, 143, 0.08)',
                    border: '1px solid rgba(0, 214, 143, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}>
                    ❓
                  </div>
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#ffffff',
                      marginBottom: '0.2rem',
                    }}>
                      Secret Achievement
                    </div>
                    <p style={{
                      fontSize: '0.78rem',
                      color: '#94a3b8',
                      margin: 0,
                      lineHeight: 1.4,
                    }}>
                      Hidden inside Nova City. Inspect secret devices to uncover this badge!
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={achievement.id}
                style={{
                  background: isUnlocked
                    ? 'linear-gradient(145deg, rgba(16, 44, 30, 0.95) 0%, rgba(9, 26, 18, 0.98) 100%)'
                    : 'rgba(6, 21, 14, 0.65)',
                  border: isUnlocked
                    ? `1.5px solid ${color}`
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  boxShadow: isUnlocked
                    ? `0 8px 24px rgba(0,0,0,0.5), 0 0 15px ${color}25`
                    : '0 4px 12px rgba(0,0,0,0.3)',
                  opacity: isUnlocked ? 1 : 0.65,
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Badge Icon */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: isUnlocked ? `${color}20` : 'rgba(255, 255, 255, 0.04)',
                  border: `1.5px solid ${isUnlocked ? color : 'rgba(255, 255, 255, 0.12)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  flexShrink: 0,
                  boxShadow: isUnlocked ? `0 0 15px ${color}35` : 'none',
                }}>
                  {isUnlocked ? achievement.icon : <Lock size={18} color="#94a3b8" />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '0.35rem',
                  }}>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      color: isUnlocked ? '#ffffff' : '#cbd5e1',
                    }}>
                      {achievement.name}
                    </span>
                    <span style={{
                      fontSize: '0.625rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color,
                      background: `${color}18`,
                      border: `1px solid ${color}40`,
                      padding: '1px 7px',
                      borderRadius: '100px',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}>
                      {rarity}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    lineHeight: 1.45,
                    margin: '0 0 0.5rem',
                  }}>
                    {achievement.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#facc15',
                    }}>
                      +{achievement.points} XP
                    </span>

                    {isUnlocked ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#00d68f',
                        fontWeight: 700,
                      }}>
                        <CheckCircle size={12} />
                        UNLOCKED
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#64748b',
                      }}>
                        LOCKED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Filter State */}
        {filteredItems.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            color: '#94a3b8',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#ffffff' }}>No Badges In This Filter</h3>
            <p style={{ fontSize: '0.85rem', margin: '0 0 1.25rem' }}>
              Switch to "ALL" to inspect all available achievements in Nova City.
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                background: 'linear-gradient(135deg, #00d68f 0%, #059669 100%)',
                border: 'none',
                color: '#06150e',
                fontWeight: 700,
                borderRadius: '12px',
                padding: '0.55rem 1.25rem',
                cursor: 'pointer',
              }}
            >
              SHOW ALL BADGES
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
