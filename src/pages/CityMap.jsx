import React, { useState } from 'react';
import { Lock, CheckCircle, ChevronRight, MapPin, AlertTriangle, Star, Sparkles, LayoutGrid, Map, Play, Shield, Zap } from 'lucide-react';
import { locations } from '../data/locations';
import { DEFAULT_AVATAR } from '../data/avatars';

const QUEST_METADATA = {
  'tech-district': {
    questTitle: 'Revealing Secrets',
    image: '/quests/revealing_secrets.jpg',
    starReward: '+5',
    stars: 4,
    progressLabel: '6 of 10 inspected',
    progressPct: 60,
  },
  'residential-block': {
    questTitle: 'Search in the Deep Jungle',
    image: '/quests/glowing_orb.jpg',
    starReward: '+6',
    stars: 3,
    progressLabel: '3 of 5 decrypts',
    progressPct: 50,
  },
  'repair-lab': {
    questTitle: 'The Neon-Leaf Workshop',
    image: '/quests/repair_lab.jpg',
    starReward: '+5',
    stars: 5,
    progressLabel: 'Diagnostic complete',
    progressPct: 80,
  },
  'scrap-yard': {
    questTitle: 'Hazardous Scrap Dunes',
    image: '/quests/scrap_yard.jpg',
    starReward: '+7',
    stars: 4,
    progressLabel: '4 of 6 violations',
    progressPct: 65,
  },
  'recycling-center': {
    questTitle: 'The Circular Core Sanctuary',
    image: '/quests/glowing_orb.jpg',
    starReward: '+8',
    stars: 5,
    progressLabel: 'Sorting master',
    progressPct: 100,
  },
};

export default function CityMap({ gameState, onLocationSelect, navigate, timer }) {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'map'
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const currentAvatar = gameState.avatar || DEFAULT_AVATAR;

  const isUnlocked = (loc) => gameState.unlockedLocations.includes(loc.id);
  const isCompleted = (loc) => gameState.completedLocations.includes(loc.id);

  const statusColors = {
    red: '#ef4444',
    amber: '#f59e0b',
    green: '#10b981',
  };

  return (
    <div className="page-enter city-map-page" style={{
      minHeight: 'calc(100vh - 4rem)',
      padding: '1.5rem 1rem 4rem',
      background: 'radial-gradient(ellipse at top, #133a27 0%, #06150e 85%)',
    }}>
      <div className="container" style={{ maxWidth: '1180px' }}>
        
        {/* Top Header & Avatar Profile Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(0, 214, 143, 0.1)',
              border: '1px solid rgba(0, 214, 143, 0.25)',
              borderRadius: '100px',
              padding: '0.25rem 0.85rem',
              marginBottom: '0.4rem',
            }}>
              <Sparkles size={13} color="#00d68f" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: '#00d68f',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}>
                MISSION DISPATCH CENTER
              </span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
              letterSpacing: '0.04em',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
            }}>
              NOVA CITY QUEST HUBS
            </h1>
            <p style={{
              margin: '0.25rem 0 0',
              color: '#94a3b8',
              fontSize: '0.9375rem',
            }}>
              Choose an active district to investigate. Clear sectors in sequence to crack the mystery!
            </p>
          </div>

          {/* Quick Avatar Chip & View Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('avatar_select')}
              style={{
                background: 'linear-gradient(135deg, rgba(17, 28, 54, 0.9) 0%, rgba(10, 17, 34, 0.95) 100%)',
                border: '1.5px solid rgba(250, 204, 21, 0.4)',
                borderRadius: '16px',
                padding: '0.4rem 0.85rem 0.4rem 0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              }}
              title="Change Avatar & Wardrobe"
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #facc15',
              }}>
                <img
                  src={currentAvatar.avatarImg || '/avatars/frog_avatar.jpg'}
                  alt="Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.625rem', fontFamily: 'var(--font-mono)', color: '#facc15', fontWeight: 600 }}>
                  WARDROBE
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                  {currentAvatar.headgearName || 'Frog Hat'}
                </div>
              </div>
            </button>

            {/* View Mode Toggle */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '3px',
            }}>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  background: viewMode === 'cards' ? '#00d68f' : 'transparent',
                  color: viewMode === 'cards' ? '#090e1a' : '#94a3b8',
                  border: 'none',
                  borderRadius: '11px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <LayoutGrid size={14} />
                <span>CARDS</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                style={{
                  background: viewMode === 'map' ? '#00d68f' : 'transparent',
                  color: viewMode === 'map' ? '#090e1a' : '#94a3b8',
                  border: 'none',
                  borderRadius: '11px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <Map size={14} />
                <span>MAP</span>
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 1: QUEST CARDS MODE (Exact recreation of top right panel from reference image) */}
        {viewMode === 'cards' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}>
            {locations.map((loc) => {
              const unlocked = isUnlocked(loc);
              const completed = isCompleted(loc);
              const meta = QUEST_METADATA[loc.id] || {
                questTitle: loc.name,
                image: '/quests/revealing_secrets.jpg',
                starReward: '+5',
                stars: 4,
                progressLabel: '3 of 5 done',
                progressPct: 60,
              };

              return (
                <div
                  key={loc.id}
                  onClick={() => unlocked && onLocationSelect(loc.id)}
                  style={{
                    background: 'linear-gradient(180deg, #133827 0%, #0a1f16 100%)',
                    border: completed
                      ? '2px solid #22c55e'
                      : unlocked
                      ? '1.5px solid rgba(74, 222, 128, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: unlocked ? 'pointer' : 'not-allowed',
                    opacity: unlocked ? 1 : 0.65,
                    boxShadow: unlocked
                      ? '0 12px 30px rgba(0,0,0,0.4), 0 0 20px rgba(74, 222, 128, 0.15)'
                      : '0 6px 15px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => unlocked && (e.currentTarget.style.transform = 'translateY(-4px)')}
                  onMouseLeave={(e) => unlocked && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {/* Top Artwork Area */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1.5',
                    overflow: 'hidden',
                    background: '#07150e',
                  }}>
                    <img
                      src={meta.image}
                      alt={loc.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: unlocked ? 'none' : 'grayscale(70%)',
                        transition: 'transform 0.4s ease',
                      }}
                    />

                    {/* Gradient Overlay for card contrast */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, #133827 0%, transparent 60%)',
                    }} />

                    {/* Star Reward Pill in Top-Right (matching reference image) */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(250, 204, 21, 0.5)',
                      borderRadius: '100px',
                      padding: '0.25rem 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                    }}>
                      <Star size={14} color="#facc15" fill="#facc15" />
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#facc15',
                      }}>
                        {meta.starReward}
                      </span>
                    </div>

                    {/* Status Pill in Top-Left */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                    }}>
                      {completed ? (
                        <span style={{
                          background: 'rgba(0, 214, 143, 0.9)',
                          color: '#090e1a',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '100px',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}>
                          <CheckCircle size={12} />
                          COMPLETED
                        </span>
                      ) : unlocked ? (
                        <span style={{
                          background: 'rgba(56, 189, 248, 0.25)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(56, 189, 248, 0.5)',
                          color: '#38bdf8',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '100px',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                        }}>
                          ZONE {loc.id === 'tech-district' ? '1' : loc.id === 'residential-block' ? '2' : loc.id === 'repair-lab' ? '3' : loc.id === 'scrap-yard' ? '4' : '5'}
                        </span>
                      ) : (
                        <span style={{
                          background: 'rgba(15, 23, 42, 0.85)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#94a3b8',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '100px',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}>
                          <Lock size={11} />
                          LOCKED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Details Area */}
                  <div style={{
                    padding: '1.25rem 1.25rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    flex: 1,
                  }}>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: '#00d68f',
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                        marginBottom: '0.2rem',
                      }}>
                        {loc.name.toUpperCase()}
                      </div>
                      <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: 0,
                      }}>
                        {meta.questTitle}
                      </h2>
                    </div>

                    <p style={{
                      fontSize: '0.8125rem',
                      color: '#94a3b8',
                      margin: 0,
                      lineHeight: 1.45,
                      flex: 1,
                    }}>
                      {loc.description}
                    </p>

                    {/* Progress Segment or Stars (Exactly as in the top-right screenshot) */}
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.4rem',
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: '#e2e8f0',
                          fontWeight: 600,
                        }}>
                          {meta.progressLabel}
                        </span>

                        {/* 5-Star Rating display */}
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[1, 2, 3, 4, 5].map((starIdx) => (
                            <Star
                              key={starIdx}
                              size={13}
                              color={starIdx <= meta.stars ? '#facc15' : 'rgba(255,255,255,0.15)'}
                              fill={starIdx <= meta.stars ? '#facc15' : 'none'}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Segmented cyan progress bar (matching reference) */}
                      <div style={{
                        display: 'flex',
                        gap: '4px',
                        height: '8px',
                      }}>
                        {[...Array(10)].map((_, segIdx) => {
                          const isActive = segIdx < Math.round((meta.progressPct / 100) * 10);
                          return (
                            <div
                              key={segIdx}
                              style={{
                                flex: 1,
                                borderRadius: '3px',
                                background: isActive
                                  ? 'linear-gradient(90deg, #38bdf8 0%, #00d68f 100%)'
                                  : 'rgba(255, 255, 255, 0.08)',
                                boxShadow: isActive ? '0 0 6px rgba(56, 189, 248, 0.4)' : 'none',
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Card Action Button */}
                    <div style={{ marginTop: '0.5rem' }}>
                      {unlocked ? (
                        <button
                          className="btn"
                          style={{
                            width: '100%',
                            background: completed
                              ? 'rgba(0, 214, 143, 0.15)'
                              : 'linear-gradient(135deg, #00d68f 0%, #00b4d8 100%)',
                            border: completed ? '1px solid rgba(0, 214, 143, 0.4)' : 'none',
                            color: completed ? '#00d68f' : '#090e1a',
                            fontWeight: 700,
                            borderRadius: '14px',
                            padding: '0.65rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                          }}
                        >
                          <Play size={14} fill={completed ? 'none' : 'currentColor'} />
                          <span>{completed ? 'REPLAY MISSION' : 'ENTER MISSION'}</span>
                        </button>
                      ) : (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '14px',
                          padding: '0.65rem 1rem',
                          textAlign: 'center',
                          color: '#64748b',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                        }}>
                          <Lock size={13} />
                          <span>Complete previous zone to unlock</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: SATELLITE MAP VIEW (Preserving the interactive SVG Map functionality) */}
        {viewMode === 'map' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '1.5rem',
            alignItems: 'start',
          }}>
            {/* SVG City Map */}
            <div style={{
              background: 'linear-gradient(180deg, #152238 0%, #0c1527 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <svg
                  viewBox="0 0 100 100"
                  style={{ width: '100%', aspectRatio: '1.4', display: 'block' }}
                  aria-label="Nova City interactive map"
                >
                  {/* Roads */}
                  <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
                  <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
                  <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                  <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                  <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                  <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>

                  {/* Connect lines */}
                  {locations.map((loc, i) => {
                    if (i === 0) return null;
                    const prev = locations[i - 1];
                    const unlocked = isUnlocked(loc);
                    return (
                      <line
                        key={`line-${loc.id}`}
                        x1={prev.x}
                        y1={prev.y}
                        x2={loc.x}
                        y2={loc.y}
                        stroke={unlocked ? 'rgba(0,214,143,0.4)' : 'rgba(255,255,255,0.08)'}
                        strokeWidth="0.75"
                        strokeDasharray={unlocked ? 'none' : '2,2'}
                      />
                    );
                  })}

                  {/* Nodes */}
                  {locations.map((loc) => {
                    const unlocked = isUnlocked(loc);
                    const completed = isCompleted(loc);
                    const hovered = hoveredLocation === loc.id;
                    const statusColor = statusColors[loc.statusColor] || '#94a3b8';

                    return (
                      <g
                        key={loc.id}
                        transform={`translate(${loc.x}, ${loc.y})`}
                        style={{ cursor: unlocked ? 'pointer' : 'not-allowed' }}
                        onClick={() => unlocked && onLocationSelect(loc.id)}
                        onMouseEnter={() => setHoveredLocation(loc.id)}
                        onMouseLeave={() => setHoveredLocation(null)}
                      >
                        {unlocked && !completed && (
                          <circle
                            r="7"
                            fill="none"
                            stroke={statusColor}
                            strokeWidth="0.5"
                            opacity="0.5"
                          >
                            <animate attributeName="r" values="5;9;5" dur="2s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
                          </circle>
                        )}

                        <circle
                          r={hovered ? 6 : 5}
                          fill={completed ? 'rgba(0,214,143,0.25)' : unlocked ? `${statusColor}30` : 'rgba(255,255,255,0.05)'}
                          stroke={completed ? '#00d68f' : unlocked ? statusColor : 'rgba(255,255,255,0.15)'}
                          strokeWidth={hovered ? 1.2 : 0.8}
                        />

                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{ fontSize: completed ? '4px' : '4.5px', userSelect: 'none' }}
                        >
                          {completed ? '✓' : loc.icon}
                        </text>

                        <text
                          y="9"
                          textAnchor="middle"
                          fill={completed ? '#00d68f' : unlocked ? '#ffffff' : '#64748b'}
                          style={{ fontSize: '3px', fontFamily: 'monospace', fontWeight: 600 }}
                        >
                          {loc.shortName}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Sidebar Inspector Panel */}
            <div style={{
              background: 'linear-gradient(180deg, #152238 0%, #0c1527 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '1.5rem',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: '#00d68f',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
              }}>
                SECTOR DOSSIER
              </div>
              <h2 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0 0 1rem' }}>
                Nova City Grid
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {locations.map((l) => {
                  const unlocked = isUnlocked(l);
                  const completed = isCompleted(l);
                  return (
                    <button
                      key={l.id}
                      onClick={() => unlocked && onLocationSelect(l.id)}
                      style={{
                        background: completed
                          ? 'rgba(0, 214, 143, 0.08)'
                          : unlocked
                          ? 'rgba(56, 189, 248, 0.08)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: completed
                          ? '1px solid rgba(0, 214, 143, 0.3)'
                          : unlocked
                          ? '1px solid rgba(56, 189, 248, 0.2)'
                          : '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '14px',
                        padding: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: unlocked ? 'pointer' : 'not-allowed',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span>{l.icon}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: unlocked ? '#ffffff' : '#64748b' }}>
                          {l.name}
                        </span>
                      </div>
                      {completed ? (
                        <CheckCircle size={15} color="#00d68f" />
                      ) : unlocked ? (
                        <ChevronRight size={15} color="#38bdf8" />
                      ) : (
                        <Lock size={14} color="#64748b" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
