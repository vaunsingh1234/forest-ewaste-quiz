import React, { useState } from 'react';
import { Trophy, ChevronLeft, Crown, Award, Sparkles, RefreshCw, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
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
  const currentAvatar = gameState?.avatar || DEFAULT_AVATAR;

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

  const playerEntry = gameState?.gameStarted ? {
    isPlayer: true,
    name: gameState?.playerName || 'Officer Nova',
    level: `${(gameState?.score || 0) * 10} lvl`,
    score: gameState?.score || 0,
    avatarImg: currentAvatar?.avatarImg || '/avatars/frog_avatar.jpg',
    headgear: currentAvatar?.headgearName || 'Emerald Frog Hat',
  } : null;

  let fullList = [...DEFAULT_CHAMPIONS];
  if (savedRecords.length > 0) {
    const formattedSaved = savedRecords.map((r) => ({
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

  fullList.sort((a, b) => b.score - a.score);

  const rankedEntries = fullList.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  const top1 = rankedEntries[0];
  const top2 = rankedEntries[1];
  const top3 = rankedEntries[2];
  const restEntries = rankedEntries.slice(3, 12);

  return (
    <div className="page-enter leaderboard-page" style={{
      minHeight: '100dvh',
      padding: 'calc(var(--safe-top, 0px) + 0.75rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 1.5rem)',
      background: 'radial-gradient(ellipse at top, #112338 0%, #060e18 85%)',
      color: '#f0fdf4',
      overflowX: 'hidden',
    }}>
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto', padding: '0 0.25rem' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}>
          <button
            onClick={() => navigate(gameState?.gameStarted ? 'map' : 'home')}
            style={{
              minHeight: '44px',
              minWidth: '44px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '0.4rem 0.75rem',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
            }}
          >
            <ChevronLeft size={16} /> MAP
          </button>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
            }}>
              Leaderboard
            </h1>
            <div style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
            }}>
              NOVA SANCTUARY HALL OF FAME
            </div>
          </div>

          <div>
            {savedRecords.length > 0 && (
              <button
                onClick={clearRecords}
                title="Clear local scores"
                style={{
                  minHeight: '44px',
                  minWidth: '44px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '0.4rem',
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
            {savedRecords.length === 0 && <div style={{ width: '44px' }} />}
          </div>
        </div>

        {/* Current Player Status Bar */}
        {gameState?.gameStarted && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 214, 143, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)',
            border: '1.5px solid rgba(0, 214, 143, 0.35)',
            borderRadius: '20px',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #00d68f',
                boxShadow: '0 0 12px rgba(0, 214, 143, 0.4)',
                flexShrink: 0,
              }}>
                <img
                  src={currentAvatar?.avatarImg || '/avatars/frog_avatar.jpg'}
                  alt="Your Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#ffffff' }}>
                    {gameState?.playerName || 'Officer Nova'}
                  </span>
                  <span className="badge badge-green" style={{ fontSize: '0.6875rem', padding: '1px 6px' }}>YOU</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {currentAvatar?.headgearName || 'Emerald Frog Hat'}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#00d68f',
              }}>
                {(gameState?.score || 0) * 10} lvl
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                {gameState?.score || 0} ECO PTS
              </div>
            </div>
          </div>
        )}

        {/* TOP 3 PODIUM (Responsive Fluid Columns) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr 1fr',
          gap: '0.45rem',
          alignItems: 'flex-end',
          marginBottom: '1.5rem',
        }}>
          {/* #2 PODIUM (Left) */}
          {top2 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 'clamp(58px, 17vw, 76px)',
                height: 'clamp(58px, 17vw, 76px)',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid #94a3b8',
                marginBottom: '-14px',
                zIndex: 2,
                background: '#152238',
              }}>
                <img src={top2.avatarImg} alt={top2.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{
                width: '100%',
                height: '105px',
                background: 'linear-gradient(180deg, #1f2f4c 0%, #131f33 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                borderTop: 'none',
                borderRadius: '16px 16px 12px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 0.25rem 0.4rem',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, color: '#94a3b8', lineHeight: 1 }}>
                  2
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#ffffff', maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {top2.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                  {top2.score} pts
                </div>
              </div>
            </div>
          )}

          {/* #1 PODIUM (Center - Tallest) */}
          {top1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ color: '#facc15', marginBottom: '2px', filter: 'drop-shadow(0 2px 6px rgba(250, 204, 21, 0.6))' }}>
                <Crown size={24} />
              </div>

              <div style={{
                width: 'clamp(68px, 20vw, 88px)',
                height: 'clamp(68px, 20vw, 88px)',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #facc15',
                boxShadow: '0 0 20px rgba(250, 204, 21, 0.4)',
                marginBottom: '-16px',
                zIndex: 2,
                background: '#152238',
              }}>
                <img src={top1.avatarImg} alt={top1.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{
                width: '100%',
                height: '130px',
                background: 'linear-gradient(180deg, #274068 0%, #15243d 100%)',
                border: '2px solid rgba(250, 204, 21, 0.4)',
                borderTop: 'none',
                borderRadius: '20px 20px 14px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem 0.25rem 0.5rem',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, color: '#facc15', lineHeight: 1 }}>
                  1
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#ffffff', maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {top1.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#facc15', fontWeight: 800 }}>
                  {top1.score} pts
                </div>
              </div>
            </div>
          )}

          {/* #3 PODIUM (Right) */}
          {top3 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 'clamp(56px, 16vw, 72px)',
                height: 'clamp(56px, 16vw, 72px)',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid #cd7f32',
                marginBottom: '-14px',
                zIndex: 2,
                background: '#152238',
              }}>
                <img src={top3.avatarImg} alt={top3.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{
                width: '100%',
                height: '92px',
                background: 'linear-gradient(180deg, #1c2b45 0%, #111a2c 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                borderTop: 'none',
                borderRadius: '16px 16px 12px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 0.25rem 0.4rem',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: '#cd7f32', lineHeight: 1 }}>
                  3
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#ffffff', maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {top3.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                  {top3.score} pts
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RANKED LIST (#4 through #12) (Single-Column Cards) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {restEntries.map(entry => {
            const isCurrentPlayer = entry.isPlayer;
            return (
              <div
                key={entry.rank}
                style={{
                  background: isCurrentPlayer ? 'rgba(0, 214, 143, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1.5px solid ${isCurrentPlayer ? '#00d68f' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '16px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  color: '#94a3b8',
                  width: '26px',
                  textAlign: 'center',
                  flexShrink: 0,
                }}>
                  #{entry.rank}
                </div>

                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `1.5px solid ${isCurrentPlayer ? '#00d68f' : 'rgba(255,255,255,0.15)'}`,
                  flexShrink: 0,
                }}>
                  <img src={entry.avatarImg} alt={entry.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff' }}>
                      {entry.name}
                    </span>
                    {isCurrentPlayer && (
                      <span className="badge badge-green" style={{ fontSize: '0.625rem', padding: '1px 5px' }}>YOU</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.headgear}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 800, color: '#00d68f' }}>
                    {entry.score}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                    PTS
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Action Button: Return to Map */}
        <div style={{
          position: 'sticky',
          bottom: 'calc(var(--bottom-nav-total-height, 70px) + 0.5rem)',
          zIndex: 40,
          padding: '0.5rem 0',
        }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('map')}
            style={{
              width: '100%',
              minHeight: '52px',
              fontSize: '1rem',
              fontWeight: 800,
              boxShadow: '0 8px 25px rgba(0, 214, 143, 0.4)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span>RETURN TO 3D SANCTUARY MAP</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
