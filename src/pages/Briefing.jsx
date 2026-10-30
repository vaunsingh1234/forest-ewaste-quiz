import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, FastForward, Shield, Check } from 'lucide-react';
import { DEFAULT_AVATAR } from '../data/avatars';

const BRIEFING_LINES = [
  { text: '02:17 AM — NOVA CITY', delay: 0, style: 'timestamp' },
  { text: '', delay: 500 },
  { text: 'Emergency systems have detected abnormal electronic waste activity across the city.', delay: 700 },
  { text: '', delay: 2000 },
  { text: 'Three collection centers are reporting unexplained contamination.', delay: 2200 },
  { text: '', delay: 3500 },
  { text: 'Hazardous materials have been identified in residential zones.', delay: 3700 },
  { text: '', delay: 5000 },
  { text: 'Personal data from discarded devices is being accessed by unknown parties.', delay: 5200 },
  { text: '', delay: 6500 },
  { text: 'You have 15 minutes to identify the source and neutralize the crisis.', delay: 6700, style: 'warning' },
  { text: '', delay: 8200 },
  { text: 'You are the E-Waste Response Officer.', delay: 8400, style: 'emphasis' },
  { text: 'Nova City is counting on you.', delay: 9600, style: 'emphasis' },
];

export default function Briefing({ onAccept, playerName, gameState }) {
  const currentAvatar = (gameState && gameState.avatar) || DEFAULT_AVATAR;
  const [displayedLines, setDisplayedLines] = useState([]);
  const [showAccept, setShowAccept] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const timeoutsRef = useRef([]);
  const terminalEndRef = useRef(null);

  const playBriefing = () => {
    setDisplayedLines([]);
    setShowAccept(false);
    BRIEFING_LINES.forEach(({ text, delay, style }) => {
      const t = setTimeout(() => {
        setDisplayedLines(prev => [...prev, { text, style }]);
      }, delay);
      timeoutsRef.current.push(t);
    });
    const t = setTimeout(() => setShowAccept(true), 10800);
    timeoutsRef.current.push(t);
  };

  const skipBriefing = () => {
    timeoutsRef.current.forEach(clearTimeout);
    setDisplayedLines(BRIEFING_LINES.map(l => ({ text: l.text, style: l.style })));
    setShowAccept(true);
    setSkipped(true);
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedLines]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('skip') === '1') {
      skipBriefing();
      return;
    }
    playBriefing();
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  return (
    <div className="page-enter briefing-page" style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'calc(var(--safe-top, 0px) + 1rem) 1rem calc(var(--bottom-nav-total-height, 70px) + 1.5rem)',
      background: 'radial-gradient(ellipse at top, #0d281a 0%, #030d07 80%)',
    }}>
      <div style={{ maxWidth: '640px', width: '100%' }}>
        
        {/* Officer badge header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'linear-gradient(135deg, rgba(0, 214, 143, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)',
          border: '1.5px solid rgba(0, 214, 143, 0.35)',
          borderRadius: '18px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #00d68f',
            boxShadow: '0 0 12px rgba(0, 214, 143, 0.5)',
            flexShrink: 0,
          }}>
            <img
              src={currentAvatar.avatarImg || '/avatars/frog_avatar.jpg'}
              alt="Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="data-label" style={{ color: '#4ade80', fontSize: '0.6875rem', letterSpacing: '0.08em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              OFFICER • {currentAvatar.headgearName || 'Forest Guardian'}
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {playerName || 'Eco Cadet'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            <div className="status-dot status-dot-green" />
            <span className="badge badge-green" style={{ borderRadius: '100px', padding: '0.25rem 0.6rem', fontSize: '0.6875rem', fontWeight: 700 }}>
              ACTIVE
            </span>
          </div>
        </div>

        {/* Terminal briefing card */}
        <div
          onClick={!showAccept ? skipBriefing : undefined}
          title={!showAccept ? "Tap to reveal full briefing" : undefined}
          style={{
            background: 'rgba(3, 15, 9, 0.88)',
            border: '1.5px solid rgba(74, 222, 128, 0.3)',
            borderRadius: '22px',
            padding: '1.25rem 1rem',
            minHeight: '320px',
            fontFamily: 'var(--font-mono)',
            marginBottom: '1.25rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(0, 214, 143, 0.05)',
            cursor: !showAccept ? 'pointer' : 'default',
          }}
        >
          {/* Scanline effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 214, 143, 0.03) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            
            {/* Terminal header with prominent SKIP button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              borderBottom: '1px solid rgba(74, 222, 128, 0.2)',
              paddingBottom: '0.65rem',
              gap: '0.5rem',
            }}>
              <div style={{
                fontSize: '0.72rem',
                color: '#86efac',
                letterSpacing: '0.12em',
                fontWeight: 700,
              }}>
                DISPATCH // MISSION BRIEFING
              </div>

              {!showAccept && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    skipBriefing();
                  }}
                  className="btn btn-ghost"
                  style={{
                    minHeight: '44px',
                    minWidth: '44px',
                    padding: '0.35rem 0.85rem',
                    color: '#86efac',
                    background: 'rgba(74, 222, 128, 0.12)',
                    border: '1px solid rgba(74, 222, 128, 0.35)',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                  }}
                  aria-label="Skip briefing animation"
                >
                  <FastForward size={14} />
                  <span>SKIP</span>
                </button>
              )}
            </div>

            {/* Typewriter text stream: 16-18px readable typography */}
            <div style={{
              maxHeight: '42dvh',
              overflowY: 'auto',
              paddingRight: '4px',
              scrollBehavior: 'smooth',
            }}>
              {displayedLines.map((line, i) => (
                <div key={i} style={{
                  marginBottom: '0.4rem',
                  animation: 'fadeIn 0.25s ease',
                }}>
                  {line.text === '' ? (
                    <div style={{ height: '0.65rem' }} />
                  ) : (
                    <p style={{
                      fontSize: 'clamp(1rem, 4.2vw, 1.125rem)', // 16px - 18px text
                      color: line.style === 'timestamp'
                        ? '#4ade80'
                        : line.style === 'warning'
                        ? '#f59e0b'
                        : line.style === 'emphasis'
                        ? '#ffffff'
                        : '#e2e8f0',
                      fontWeight: line.style === 'timestamp' || line.style === 'emphasis' ? 700 : 400,
                      letterSpacing: line.style === 'timestamp' ? '0.08em' : 'normal',
                      lineHeight: 1.65,
                      margin: 0,
                    }}>
                      {line.style !== 'timestamp' && (
                        <span style={{ color: '#4ade80', marginRight: '0.5rem', fontWeight: 700 }}>{'>'}</span>
                      )}
                      {line.text}
                    </p>
                  )}
                </div>
              ))}

              {!showAccept && (
                <span className="typewriter-cursor" style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '1.1rem',
                  background: '#4ade80',
                  marginLeft: '4px',
                  verticalAlign: 'middle',
                  animation: 'pulse 0.8s infinite',
                }} />
              )}
              <div ref={terminalEndRef} />
            </div>

            {!showAccept && (
              <div style={{
                marginTop: '0.75rem',
                fontSize: '0.72rem',
                color: 'rgba(134, 239, 172, 0.7)',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
              }}>
                (Tap to reveal full briefing immediately)
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions: Large thumb-reach CTA button */}
        <div style={{
          position: 'sticky',
          bottom: 'calc(var(--bottom-nav-total-height, 70px) + 0.5rem)',
          width: '100%',
          zIndex: 10,
        }}>
          {!showAccept ? (
            <button
              className="btn btn-secondary"
              onClick={skipBriefing}
              style={{
                width: '100%',
                minHeight: '52px',
                background: 'rgba(6, 26, 16, 0.8)',
                border: '1.5px solid rgba(74, 222, 128, 0.4)',
                borderRadius: '16px',
                color: '#86efac',
                fontSize: '0.95rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <FastForward size={16} />
              <span>SKIP BRIEFING & ACCEPT</span>
            </button>
          ) : (
            <button
              className="btn btn-primary btn-lg"
              onClick={onAccept}
              id="accept-mission-btn"
              style={{
                width: '100%',
                minHeight: '52px',
                background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                color: '#04170d',
                borderRadius: '16px',
                fontSize: '1.05rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                boxShadow: '0 8px 30px rgba(34, 197, 94, 0.5), 0 0 20px rgba(74, 222, 128, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                animation: 'fadeUp 0.35s ease',
              }}
            >
              <span>ACCEPT MISSION</span>
              <ChevronRight size={20} strokeWidth={2.8} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
