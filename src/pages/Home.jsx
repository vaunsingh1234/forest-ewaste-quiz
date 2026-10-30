import React, { useState } from 'react';
import { Play, BookOpen, Volume2, Shield, Leaf, Trees, BatteryCharging, Check } from 'lucide-react';
import { GUIDE_CHARACTERS } from '../data/gradeData';
import { playGuideChime, speakGuideText } from '../utils/audio';

const QUICK_CADET_NAMES = [
  'Cyber-Ranger',
  'Circuit-Sam',
  'Nova-Scout',
  'Maya Green',
];

export default function Home({ onStart, gameState, navigate, updateState }) {
  const [playerName, setPlayerName] = useState(gameState?.playerName || '');
  const [crtClicks, setCrtClicks] = useState(0);
  const [isHopping, setIsHopping] = useState(false);

  const guideChar = GUIDE_CHARACTERS[0]; // Pip the Explorer Frog

  const handleNameChange = (name) => {
    setPlayerName(name);
    if (updateState) {
      updateState(prev => ({ ...prev, playerName: name }));
    }
  };

  const handleStart = () => {
    playGuideChime('cheer');
    const name = playerName.trim() || 'Eco Cadet';
    if (updateState) {
      updateState(prev => ({ ...prev, playerName: name }));
    }
    onStart(name, gameState?.studentGrade || '3rd');
  };

  const handlePipClick = () => {
    setIsHopping(true);
    playGuideChime('cheer');
    speakGuideText(`Ribbit! Hi friend! I'm Pip! Tap Start Mission to begin our e-waste rescue!`);
    setTimeout(() => setIsHopping(false), 700);
  };

  const handleCrtClick = () => {
    const next = crtClicks + 1;
    setCrtClicks(next);
    if (next >= 5) {
      window.dispatchEvent(new CustomEvent('easter-egg', { detail: 'crt-secret' }));
    }
  };

  return (
    <div className="page-enter forest-home-page" style={{ minHeight: '100dvh', background: '#05130b', color: '#f0fdf4' }}>
      
      {/* HERO SECTION: CINEMATIC ENCHANTED FOREST */}
      <section style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'calc(var(--safe-top, 0px) + 0.75rem) 1rem calc(var(--bottom-nav-total-height, 70px) + 1rem)',
        backgroundImage: `radial-gradient(ellipse at center, rgba(5, 19, 11, 0.5) 0%, rgba(4, 14, 8, 0.92) 100%), url('/assets/forest_hero_bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        overflowX: 'hidden',
      }}>
        
        {/* Floating Bioluminescent Spores */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
          {[
            { top: '15%', left: '12%', size: '6px', delay: '0s' },
            { top: '30%', left: '75%', size: '8px', delay: '1.2s' },
            { top: '60%', left: '20%', size: '5px', delay: '2.5s' },
            { top: '75%', left: '80%', size: '7px', delay: '1.8s' },
          ].map((spore, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: spore.top,
                left: spore.left,
                width: spore.size,
                height: spore.size,
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 14px #4ade80, 0 0 25px #22c55e',
                animation: 'float-spore 4.5s ease-in-out infinite',
                animationDelay: spore.delay,
              }}
            />
          ))}
        </div>

        {/* TOP STATUS BAR: Compact on mobile */}
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', width: '100%', padding: '0 0.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span className="status-dot status-dot-green" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: '#86efac',
                letterSpacing: '0.1em',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
                Nova Sanctuary
              </span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '100px',
              background: 'rgba(74, 222, 128, 0.12)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              fontSize: '0.65rem',
              color: '#bbf7d0',
              backdropFilter: 'blur(8px)',
            }}>
              <span>🛡️</span>
              <span>Eco Intelligence</span>
            </div>
          </div>
        </div>

        {/* MAIN HERO CONTENT: Big Hero with CTA at thumb reach */}
        <div className="container" style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '520px',
          width: '100%',
          margin: '0 auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 0.25rem',
        }}>
          
          {/* Hero Branding Header */}
          <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            <h1 style={{
              fontSize: 'clamp(3.4rem, 15vw, 5.4rem)',
              fontWeight: 300,
              lineHeight: 0.95,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              margin: '0 0 0.25rem 0',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.85)',
              fontFamily: "'Inter', -apple-system, sans-serif",
            }}>
              forest<span style={{ color: '#4ade80' }}>.</span>
            </h1>

            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.8rem, 3.2vw, 1rem)',
              fontWeight: 700,
              color: '#86efac',
              letterSpacing: '0.22em',
              marginBottom: '0.4rem',
              textShadow: '0 2px 10px rgba(0,0,0,0.6)',
            }}>
              E-WASTE: THE LAST DEVICE
            </div>

            <p style={{
              fontSize: '0.875rem',
              color: '#d1fae5',
              margin: '0 auto',
              lineHeight: 1.4,
              maxWidth: '380px',
              fontWeight: 400,
              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
            }}>
              Rescue discarded electronics. Protect Nova City's forests and waterways.
            </p>
          </div>

          {/* COMPACT INTERACTIVE PIP MASCOT & CALLSIGN CARD */}
          <div style={{
            background: 'rgba(6, 26, 16, 0.85)',
            border: '1.5px solid rgba(74, 222, 128, 0.38)',
            borderRadius: '20px',
            padding: '0.85rem 1rem',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(74, 222, 128, 0.12)',
            marginBottom: '0.85rem',
          }}>
            {/* Pip mini guide bar */}
            <div
              onClick={handlePipClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.35rem 0.5rem',
                background: 'rgba(74, 222, 128, 0.08)',
                borderRadius: '14px',
                border: '1px solid rgba(74, 222, 128, 0.22)',
                marginBottom: '0.75rem',
                cursor: 'pointer',
              }}
              title="Tap Pip to hear voice"
            >
              <div style={{
                position: 'relative',
                width: '42px',
                height: '42px',
                flexShrink: 0,
              }}>
                <img
                  src="/avatars/pip_frog_guide.png"
                  alt="Pip Guide"
                  className={isHopping ? 'hop-anim' : ''}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#86efac' }}>Pip Guide</span>
                  <span style={{ fontSize: '0.6rem', color: '#4ade80', background: 'rgba(74,222,128,0.2)', padding: '1px 5px', borderRadius: '100px', fontWeight: 700 }}>
                    ONLINE
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#f0fdf4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  "Ribbit! Tap Start Mission to deploy!"
                </div>
              </div>
              <Volume2 size={16} color="#4ade80" style={{ flexShrink: 0 }} />
            </div>

            {/* Callsign Input */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label htmlFor="cadet-name-input" style={{ fontSize: '0.72rem', color: '#86efac', fontFamily: 'var(--font-mono)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Shield size={13} color="#4ade80" />
                CADET CALLSIGN:
              </label>
              <span style={{ fontSize: '0.625rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                READY
              </span>
            </div>

            <input
              type="text"
              value={playerName}
              onChange={e => handleNameChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
              placeholder="Enter cadet callsign..."
              maxLength={25}
              id="cadet-name-input"
              style={{
                width: '100%',
                background: 'rgba(3, 14, 8, 0.92)',
                border: '1.5px solid rgba(74, 222, 128, 0.45)',
                borderRadius: '12px',
                padding: '0.65rem 0.85rem',
                color: '#f0fdf4',
                fontSize: '1rem', // Prevents iOS zoom
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                minHeight: '44px',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
            />

            {/* Quick Pick Chips (>=44px touch targets) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.55rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>Quick:</span>
              {QUICK_CADET_NAMES.map(name => {
                const isSelected = playerName === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      playGuideChime('pop');
                      handleNameChange(name);
                    }}
                    style={{
                      background: isSelected ? 'rgba(74, 222, 128, 0.35)' : 'rgba(255, 255, 255, 0.07)',
                      border: isSelected ? '1.5px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.15)',
                      color: isSelected ? '#4ade80' : '#bbf7d0',
                      borderRadius: '100px',
                      padding: '0.35rem 0.75rem',
                      minHeight: '44px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    {isSelected && <Check size={12} />}
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRIMARY START MISSION BUTTON: Right at Thumb Reach */}
          <button
            className="btn btn-primary"
            onClick={handleStart}
            id="hero-start-btn"
            style={{
              width: '100%',
              minHeight: '52px',
              background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
              color: '#04170d',
              fontWeight: 800,
              fontSize: '1.05rem',
              letterSpacing: '0.04em',
              padding: '0.85rem 1.5rem',
              borderRadius: '16px',
              boxShadow: '0 8px 25px rgba(34, 197, 94, 0.55), 0 0 20px rgba(74, 222, 128, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
            }}
          >
            <Play size={20} fill="#04170d" />
            <span>START MISSION</span>
          </button>

          {/* Subtle Know More Link */}
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <button
              onClick={() => navigate('learn')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#86efac',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                textDecoration: 'underline',
                cursor: 'pointer',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <BookOpen size={14} />
              <span>Explore Lore & Field Guide →</span>
            </button>
          </div>

        </div>

        {/* BOTTOM BADGES ROW: Compact without overflow */}
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', width: '100%', padding: '0 0.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Leaf size={14} color="#4ade80" />
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#ffffff' }}>SAVE FOREST</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Trees size={14} color="#4ade80" />
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#ffffff' }}>LIVE GREEN</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BatteryCharging size={14} color="#4ade80" />
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#ffffff' }}>RESCUE TECH</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '0.4rem', fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.45)' }}>
            E-Waste: The Last Device • 2026 •{' '}
            <button
              onClick={() => navigate('admin')}
              style={{ background: 'none', border: 'none', color: '#6ee7b7', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.65rem', padding: '2px' }}
            >
              Admin
            </button>
          </div>
        </div>
      </section>

      {/* Hidden CRT Easter Egg */}
      <div
        onClick={handleCrtClick}
        style={{
          position: 'fixed',
          bottom: 'calc(var(--bottom-nav-total-height, 70px) + 0.35rem)',
          left: '0.5rem',
          width: '32px',
          height: '32px',
          opacity: crtClicks > 0 ? 0.6 : 0.15,
          cursor: 'pointer',
          fontSize: '1.1rem',
          transition: 'opacity 0.3s',
          userSelect: 'none',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={crtClicks > 0 ? `${crtClicks}/5` : undefined}
        aria-hidden="true"
      >
        📺
      </div>
    </div>
  );
}
