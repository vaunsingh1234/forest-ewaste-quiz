import React, { useState } from 'react';
import { Trophy, ChevronLeft, Crown, Award, Sparkles, RefreshCw, Trash2, ArrowLeft } from 'lucide-react';
import { DEFAULT_AVATAR } from '../data/avatars';

const DEFAULT_CHAMPIONS = [
  {
    rank: 1,
    name: 'Kaelen Storm',
    level: '14,820 lvl',
    score: 1482,
    avatarImg: '/avatars/chief_avatar.jpg',
    headgear: 'Nova Guardian Headdress',
    badge: '👑 CHAMPION',
  },
  {
    rank: 2,
    name: 'Dusty Vance',
    level: '12,450 lvl',
    score: 1245,
    avatarImg: '/avatars/cowboy_avatar.jpg',
    headgear: 'Wasteland Stetson',
    badge: '🥈 ELITE',
  },
  {
    rank: 3,
    name: 'Captain Ruby',
    level: '11,200 lvl',
    score: 1120,
    avatarImg: '/avatars/pirate_avatar.jpg',
    headgear: 'Corsair Tricorn',
    badge: '🥉 MASTER',
  },
  {
    rank: 4,
    name: 'Lila Anderson',
    level: '10,471 lvl',
    score: 1047,
    avatarImg: '/avatars/knight_avatar.jpg',
    headgear: 'Paladin Visor Helm',
  },
  {
    rank: 5,
    name: 'Nate Brown',
    level: '9,736 lvl',
    score: 973,
    avatarImg: '/avatars/frog_avatar.jpg',
    headgear: 'Emerald Frog Hat',
  },
  {
    rank: 6,
    name: 'Peter Davis',
    level: '9,254 lvl',
    score: 925,
    avatarImg: '/avatars/viking_avatar.jpg',
    headgear: 'Valkyrie Horns',
  },
  {
    rank: 7,
    name: 'Olivia Carter',
    level: '8,190 lvl',
    score: 819,
    avatarImg: '/avatars/beanie_avatar.jpg',
    headgear: 'Thermal Beanie',
  },
  {
    rank: 8,
    name: 'Jake K.',
    level: '7,647 lvl',
    score: 764,
    avatarImg: '/avatars/crown_avatar.jpg',
    headgear: 'Recycled Crown',
  },
];

export default function Leaderboard({ gameState, getRank, navigate }) {
  const currentAvatar = gameState.avatar || DEFAULT_AVATAR;
  const [filterTab, setFilterTab] = useState('global'); // 'global' | 'local'

  const [savedRecords, setSavedRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ewaste-leaderboard') || '[]');
    } catch {
      return [];
    }
  });

  const clearRecords = () => {
    localStorage.removeItem('ewaste-leaderboard');
    setSavedRecords([]);
  };

  // Build combined list
  const playerEntry = gameState.gameStarted ? {
    isPlayer: true,
    name: gameState.playerName || 'Officer Nova',
    level: `${gameState.score * 10} lvl`,
    score: gameState.score,
    avatarImg: currentAvatar.avatarImg || '/avatars/frog_avatar.jpg',
    headgear: currentAvatar.headgearName || 'Emerald Frog Hat',
  } : null;

  // Insert player into the ranks
  let fullList = [...DEFAULT_CHAMPIONS];
  if (savedRecords.length > 0) {
    const formattedSaved = savedRecords.map((r, i) => ({
      name: r.name,
      level: `${(r.score || 0) * 10} lvl`,
      score: r.score || 0,
      avatarImg: r.avatarImg || '/avatars/frog_avatar.jpg',
      headgear: r.headgear || 'Officer Gear',
    }));
    fullList = [...fullList, ...formattedSaved];
  }

  if (playerEntry && !fullList.some(item => item.isPlayer)) {
    fullList.push(playerEntry);
  }

  // Sort descending by score
  fullList.sort((a, b) => b.score - a.score);

  // Assign ranks
  const rankedEntries = fullList.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  const top1 = rankedEntries[0];
  const top2 = rankedEntries[1];
  const top3 = rankedEntries[2];
  const restEntries = rankedEntries.slice(3, 10);

  return (
    <div className="page-enter leaderboard-page" style={{
      minHeight: 'calc(100vh - 4rem)',
      padding: '1.5rem 1rem 4rem',
      background: 'radial-gradient(ellipse at top, #132247 0%, #080d1a 80%)',
    }}>
      <div className="container" style={{ maxWidth: '780px', margin: '0 auto' }}>
        
        {/* Mobile App Style Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}>
          <button
            onClick={() => navigate('map')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            title="Back to Map"
          >
            <ChevronLeft size={22} />
          </button>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '0.04em',
            }}>
              Leaderboard
            </h1>
            <div style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
            }}>
              NOVA CITY RECOVERY HALL OF FAME
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {savedRecords.length > 0 && (
              <button
                onClick={clearRecords}
                title="Clear local scores"
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '50%',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
            <div style={{ width: savedRecords.length > 0 ? '0' : '42px' }} />
          </div>
        </div>

        {/* Current Player Status Bar */}
        {gameState.gameStarted && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 214, 143, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)',
            border: '1px solid rgba(0, 214, 143, 0.35)',
            borderRadius: '20px',
            padding: '0.85rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            boxShadow: '0 8px 24px rgba(0, 214, 143, 0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #00d68f',
                boxShadow: '0 0 12px rgba(0, 214, 143, 0.4)',
              }}>
                <img
                  src={currentAvatar.avatarImg || '/avatars/frog_avatar.jpg'}
                  alt="Your Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                    {gameState.playerName || 'Officer Nova'}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#00d68f',
                    background: 'rgba(0, 214, 143, 0.15)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '100px',
                    fontWeight: 600,
                  }}>
                    YOU
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {currentAvatar.headgearName || 'Emerald Frog Hat'}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#00d68f',
              }}>
                {gameState.score * 10} lvl
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                {gameState.score} ECO PTS
              </div>
            </div>
          </div>
        )}

        {/* TOP 3 PODIUM (Exact layout from the left panel in the reference screenshot) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr 1fr',
          gap: '0.75rem',
          alignItems: 'flex-end',
          marginBottom: '2rem',
          padding: '0 0.5rem',
        }}>
          
          {/* #2 PODIUM (Left - Cowboy) */}
          {top2 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {/* Avatar circle */}
              <div style={{
                position: 'relative',
                marginBottom: '-16px',
                zIndex: 2,
              }}>
                <div style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #94a3b8',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                  background: '#152238',
                }}>
                  <img
                    src={top2.avatarImg}
                    alt={top2.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Podium Base #2 */}
              <div style={{
                width: '100%',
                height: '115px',
                background: 'linear-gradient(180deg, #1f2f4c 0%, #131f33 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                borderTop: 'none',
                borderRadius: '20px 20px 14px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem 0.5rem 0.5rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#94a3b8',
                  lineHeight: 1,
                  marginBottom: '0.25rem',
                }}>
                  2
                </div>
                <div style={{
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  color: '#ffffff',
                  textAlign: 'center',
                  maxWidth: '90%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {top2.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: '#38bdf8',
                  fontWeight: 600,
                }}>
                  {top2.level}
                </div>
              </div>
            </div>
          )}

          {/* #1 PODIUM (Center - Tallest, Crown / Chief) */}
          {top1 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {/* Crown Icon floating above avatar */}
              <div style={{
                color: '#facc15',
                marginBottom: '4px',
                animation: 'bounce 2s infinite',
                filter: 'drop-shadow(0 2px 8px rgba(250, 204, 21, 0.6))',
              }}>
                <Crown size={28} />
              </div>

              {/* Avatar circle */}
              <div style={{
                position: 'relative',
                marginBottom: '-20px',
                zIndex: 2,
              }}>
                <div style={{
                  width: '98px',
                  height: '98px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3.5px solid #facc15',
                  boxShadow: '0 0 25px rgba(250, 204, 21, 0.45), 0 8px 25px rgba(0,0,0,0.6)',
                  background: '#152238',
                }}>
                  <img
                    src={top1.avatarImg}
                    alt={top1.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Podium Base #1 */}
              <div style={{
                width: '100%',
                height: '145px',
                background: 'linear-gradient(180deg, #274068 0%, #15243d 100%)',
                border: '2px solid rgba(250, 204, 21, 0.4)',
                borderTop: 'none',
                borderRadius: '24px 24px 16px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem 0.5rem 0.5rem',
                boxShadow: '0 12px 35px rgba(0,0,0,0.5)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: '#facc15',
                  lineHeight: 1,
                  marginBottom: '0.25rem',
                }}>
                  1
                </div>
                <div style={{
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  color: '#ffffff',
                  textAlign: 'center',
                  maxWidth: '90%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {top1.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#facc15',
                  fontWeight: 700,
                }}>
                  {top1.level}
                </div>
              </div>
            </div>
          )}

          {/* #3 PODIUM (Right - Pirate) */}
          {top3 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {/* Avatar circle */}
              <div style={{
                position: 'relative',
                marginBottom: '-16px',
                zIndex: 2,
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #cd7f32',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                  background: '#152238',
                }}>
                  <img
                    src={top3.avatarImg}
                    alt={top3.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Podium Base #3 */}
              <div style={{
                width: '100%',
                height: '98px',
                background: 'linear-gradient(180deg, #1c2b45 0%, #111a2c 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                borderTop: 'none',
                borderRadius: '20px 20px 14px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem 0.5rem 0.5rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: '#cd7f32',
                  lineHeight: 1,
                  marginBottom: '0.2rem',
                }}>
                  3
                </div>
                <div style={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: '#ffffff',
                  textAlign: 'center',
                  maxWidth: '90%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {top3.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: '#38bdf8',
                  fontWeight: 600,
                }}>
                  {top3.level}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RANKED LIST (#4 through #8) - Sleek rounded pill cards matching the reference */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}>
          {restEntries.map((entry) => {
            const isCurrentPlayer = entry.isPlayer;
            return (
              <div
                key={entry.rank}
                style={{
                  background: isCurrentPlayer
                    ? 'linear-gradient(90deg, rgba(0, 214, 143, 0.15) 0%, rgba(17, 28, 54, 0.95) 100%)'
                    : 'linear-gradient(90deg, #152238 0%, #101c30 100%)',
                  border: isCurrentPlayer
                    ? '1.5px solid #00d68f'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '0.75rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Rank number badge */}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#94a3b8',
                    width: '20px',
                    textAlign: 'center',
                  }}>
                    {entry.rank}
                  </span>

                  {/* Circular Avatar */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: isCurrentPlayer ? '2px solid #00d68f' : '1.5px solid rgba(255,255,255,0.15)',
                    background: '#0a1120',
                    flexShrink: 0,
                  }}>
                    <img
                      src={entry.avatarImg}
                      alt={entry.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Player Name and Hat */}
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: isCurrentPlayer ? '#00d68f' : '#ffffff',
                    }}>
                      {entry.name} {isCurrentPlayer && '(You)'}
                    </div>
                    <div style={{
                      fontSize: '0.72rem',
                      color: '#94a3b8',
                    }}>
                      {entry.headgear}
                    </div>
                  </div>
                </div>

                {/* Level / Score */}
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: isCurrentPlayer ? '#00d68f' : '#e2e8f0',
                  letterSpacing: '0.02em',
                }}>
                  {entry.level}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
