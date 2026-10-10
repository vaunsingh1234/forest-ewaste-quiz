import React, { useState } from 'react';
import { Play, BookOpen, Info, Sparkles, Volume2, Shield, Leaf, Trees, BatteryCharging, ArrowRight, Check } from 'lucide-react';
import { GUIDE_CHARACTERS } from '../data/gradeData';
import { playGuideChime, speakGuideText } from '../utils/audio';

const SUGGESTED_CADET_NAMES = [
  'Cyber-Ranger',
  'Circuit-Sam',
  'Nova-Scout',
  'Maya Green',
  'Echo-Zero',
  'Flora Hero',
  'Terra-Guard'
];

export default function Home({ onStart, gameState, navigate, updateState }) {
  const [playerName, setPlayerName] = useState(gameState.playerName || '');
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
    onStart(name, gameState.studentGrade || '3rd');
  };

  const handlePipClick = () => {
    setIsHopping(true);
    playGuideChime('cheer');
    speakGuideText(`Ribbit! Hi friend! I'm Pip, your Forest Guide! Enter your cadet callsign on the left and start our e-waste rescue mission!`);
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
    <div className="page-enter forest-home-page" style={{ minHeight: '100vh', background: '#05130b', color: '#f0fdf4' }}>
      
      {/* HERO SECTION: CINEMATIC ENCHANTED FOREST (Matching reference design) */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3.6rem 1.5rem 0.8rem',
        backgroundImage: `radial-gradient(ellipse at center, rgba(5, 19, 11, 0.45) 0%, rgba(4, 14, 8, 0.88) 100%), url('/assets/forest_hero_bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}>
        
        {/* Floating Bioluminescent Spores & Fireflies */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
          {[
            { top: '18%', left: '12%', size: '6px', delay: '0s' },
            { top: '28%', left: '45%', size: '8px', delay: '1.2s' },
            { top: '42%', left: '80%', size: '7px', delay: '2.5s' },
            { top: '65%', left: '22%', size: '5px', delay: '3.4s' },
            { top: '78%', left: '60%', size: '9px', delay: '0.8s' },
            { top: '85%', left: '88%', size: '6px', delay: '2.1s' },
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

        {/* TOP STATUS BAR */}
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="status-dot status-dot-green" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#86efac',
                letterSpacing: '0.18em',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
                Nova Forest Sanctuary • Eco Intelligence Command
              </span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.2rem 0.75rem',
              borderRadius: '100px',
              background: 'rgba(74, 222, 128, 0.12)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              fontSize: '0.7rem',
              color: '#bbf7d0',
              backdropFilter: 'blur(8px)',
            }}>
              <span>🛡️</span>
              <span>Active Biosphere Investigation</span>
            </div>
          </div>
        </div>

        {/* MAIN HERO CONTENT: Title, Subtitle, and LIVING CHIBI CHARACTER */}
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(300px, 0.85fr)',
            gap: '2.5rem',
            alignItems: 'center',
          }} className="forest-hero-grid">
            
            {/* LEFT COLUMN: Clean Minimalist Title, Subtitle & Organic Cadet Controls */}
            <div>
              {/* Massive Lowercase Serif/Sans Title with Period (Matching reference image) */}
              <h1 style={{
                fontSize: 'clamp(3.4rem, 7.5vw, 5.8rem)',
                fontWeight: 300,
                lineHeight: 0.95,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                margin: '0 0 0.5rem 0',
                textShadow: '0 4px 30px rgba(0, 0, 0, 0.8)',
                fontFamily: "'Inter', -apple-system, sans-serif",
              }}>
                forest<span style={{ color: '#4ade80' }}>.</span>
              </h1>

              {/* Sub-brand label */}
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
                fontWeight: 700,
                color: '#86efac',
                letterSpacing: '0.25em',
                marginBottom: '0.75rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.6)',
              }}>
                E-WASTE: THE LAST DEVICE
              </div>

              {/* Editorial Subtitle */}
              <p style={{
                fontSize: 'clamp(0.88rem, 1.4vw, 1.02rem)',
                color: '#e2e8f0',
                maxWidth: '520px',
                lineHeight: 1.55,
                marginBottom: '1rem',
                textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                fontWeight: 400,
              }}>
                An interactive nature sanctuary where every gadget has a second life. 
                <span style={{ display: 'block', color: '#86efac', marginTop: '0.25rem', fontWeight: 500 }}>
                  Your decisions help protect our forests, waterways, and wildlife from toxic electronic waste.
                </span>
              </p>

              {/* SLEEK CADET SETUP SECTION */}
              <div style={{
                background: 'rgba(6, 26, 16, 0.78)',
                border: '1.5px solid rgba(74, 222, 128, 0.35)',
                borderRadius: '20px',
                padding: '1.15rem 1.35rem',
                backdropFilter: 'blur(16px)',
                maxWidth: '520px',
                marginBottom: '1.25rem',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.55), 0 0 20px rgba(74, 222, 128, 0.1)',
              }}>
                {/* Cadet Name Input */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                    <label style={{ fontSize: '0.72rem', color: '#86efac', fontFamily: 'var(--font-mono)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', letterSpacing: '0.08em' }}>
                      <Shield size={13} color="#4ade80" />
                      CADET CALLSIGN:
                    </label>
                    <span style={{ fontSize: '0.66rem', color: '#86efac', fontFamily: 'var(--font-mono)', background: 'rgba(74, 222, 128, 0.12)', padding: '2px 8px', borderRadius: '100px', border: '1px solid rgba(74, 222, 128, 0.25)', fontWeight: 600 }}>
                      ECO RESPONSE UNIT
                    </span>
                  </div>

                  <input
                    type="text"
                    value={playerName}
                    onChange={e => handleNameChange(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleStart()}
                    placeholder="Enter your cadet name (e.g. Cyber-Ranger)..."
                    maxLength={25}
                    id="cadet-name-input"
                    style={{
                      width: '100%',
                      background: 'rgba(3, 14, 8, 0.85)',
                      border: '1.5px solid rgba(74, 222, 128, 0.35)',
                      borderRadius: '12px',
                      padding: '0.65rem 0.95rem',
                      color: '#f0fdf4',
                      fontSize: '0.92rem',
                      fontFamily: 'var(--font-mono)',
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#4ade80';
                      e.target.style.boxShadow = '0 0 15px rgba(74, 222, 128, 0.25)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(74, 222, 128, 0.35)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />

                  {/* Suggested Quick Nicknames */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.65rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.66rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>Quick Pick:</span>
                    {SUGGESTED_CADET_NAMES.map(name => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          playGuideChime('pop');
                          handleNameChange(name);
                        }}
                        style={{
                          background: playerName === name ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                          border: playerName === name ? '1px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: playerName === name ? '#4ade80' : '#bbf7d0',
                          borderRadius: '100px',
                          padding: '2px 9px',
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleStart}
                  id="hero-start-btn"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                    color: '#04170d',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    padding: '0.75rem 1.6rem',
                    borderRadius: '14px',
                    boxShadow: '0 6px 25px rgba(34, 197, 94, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <Play size={16} fill="#04170d" />
                  <span>START MISSION</span>
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('learn')}
                  style={{
                    background: 'rgba(5, 20, 12, 0.6)',
                    borderColor: 'rgba(74, 222, 128, 0.3)',
                    color: '#f0fdf4',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '14px',
                    backdropFilter: 'blur(10px)',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <BookOpen size={16} />
                  <span>KNOW MORE</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: CUTE CHIBI EXPLORER FROG (Pip) GUIDING FREELY (No Information Block!) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              justifyContent: 'center',
            }}>
              
              {/* ORGANIC SPEECH BUBBLE FROM PIP */}
              <div
                className="chibi-speech-balloon animate-fadeUp"
                style={{
                  maxWidth: '360px',
                  marginBottom: '0.85rem',
                  padding: '0.85rem 1.1rem',
                  cursor: 'pointer',
                }}
                onClick={handlePipClick}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>🐸</span>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#86efac' }}>
                      Pip the Forest Explorer
                    </span>
                    <span style={{
                      background: 'rgba(74, 222, 128, 0.2)',
                      color: '#4ade80',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '100px',
                    }}>
                      GUIDE
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePipClick();
                    }}
                    title="Listen to Pip"
                    style={{
                      background: 'rgba(74, 222, 128, 0.15)',
                      border: '1px solid rgba(74, 222, 128, 0.35)',
                      borderRadius: '8px',
                      color: '#4ade80',
                      padding: '2px 7px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Volume2 size={12} />
                    <span>Listen</span>
                  </button>
                </div>

                <p style={{ margin: 0, fontSize: '0.84rem', color: '#f0fdf4', lineHeight: 1.45 }}>
                  "Ribbit! Welcome, Cadet! Choose your callsign on the left and click Start Mission to explore Nova Sanctuary with me!"
                </p>

                {/* Downward speech bubble pointer tail pointing down to Pip */}
                <div className="chibi-speech-tail-down" />
              </div>

              {/* LIVING CHIBI FROG HERO CHARACTER */}
              <div
                style={{
                  position: 'relative',
                  width: '260px',
                  height: '260px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Bioluminescent Fairy Ring Glowing on Forest Floor */}
                <div
                  className="fairy-ring-glow"
                  style={{
                    position: 'absolute',
                    bottom: '6px',
                    width: '220px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.6) 0%, rgba(34, 197, 94, 0.25) 50%, transparent 80%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Pip character image */}
                <img
                  src="/avatars/pip_frog_guide.png"
                  alt="Pip the Chibi Explorer Frog Guide"
                  className={`chibi-guide-standing ${isHopping ? 'hop-anim' : ''}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 14px 24px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 15px rgba(74, 222, 128, 0.25))',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onClick={handlePipClick}
                  title="Click Pip! He will jump & guide you!"
                />
              </div>

              {/* Micro badge underneath Pip */}
              <div
                onClick={handlePipClick}
                style={{
                  marginTop: '0.35rem',
                  fontSize: '0.72rem',
                  color: '#86efac',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  background: 'rgba(6, 24, 15, 0.6)',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  border: '1px solid rgba(74, 222, 128, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>✨</span>
                <span>Click Pip to hear his voice!</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BADGES ROW (Exactly matching the reference image) */}
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', marginTop: '0.4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '2.5rem',
            flexWrap: 'wrap',
            paddingTop: '0.85rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            
            {/* Circular badge (matching UK STATE GOVT.) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1.5px solid rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.05em',
              }}>
                ECO
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f0fdf4', letterSpacing: '0.08em', lineHeight: 1.2 }}>
                <div>NATURE</div>
                <div style={{ color: '#86efac' }}>SANCTUARY</div>
              </div>
            </div>

            {/* SAVE FOREST */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Leaf size={18} color="#4ade80" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.08em' }}>
                SAVE FOREST
              </span>
            </div>

            {/* LIVE GREEN */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trees size={18} color="#4ade80" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.08em' }}>
                LIVE GREEN
              </span>
            </div>

            {/* RESCUE TECH */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BatteryCharging size={18} color="#4ade80" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.08em' }}>
                RESCUE TECH
              </span>
            </div>
          </div>

          {/* Minimalist Footer Copyright (matching reference) */}
          <div style={{
            textAlign: 'center',
            marginTop: '1.25rem',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.55)',
            letterSpacing: '0.02em',
          }}>
            Stay focused on a cleaner planet, wherever you are.
            <div style={{ fontSize: '0.68rem', marginTop: '0.2rem', color: 'rgba(255, 255, 255, 0.4)' }}>
              E-Waste: The Last Device • Copyright © 2026. All rights reserved.
            </div>
            <div style={{ marginTop: '0.4rem' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('admin')}
                style={{ fontSize: '0.7rem', color: 'rgba(110, 231, 183, 0.65)', gap: '4px', padding: '2px 8px' }}
                id="home-admin-footer-btn"
              >
                🔒 Teacher & Admin Control Center (/admin)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden CRT Easter Egg */}
      <div
        onClick={handleCrtClick}
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          width: '32px',
          height: '28px',
          opacity: crtClicks > 0 ? 0.5 : 0.1,
          cursor: 'pointer',
          fontSize: '1.3rem',
          transition: 'opacity 0.3s',
          userSelect: 'none',
          zIndex: 10,
        }}
        title={crtClicks > 0 ? `${crtClicks}/5` : undefined}
        aria-hidden="true"
      >
        📺
      </div>
    </div>
  );
}
