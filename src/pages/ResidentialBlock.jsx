import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Shield, AlertTriangle, X, CheckCircle, Sparkles } from 'lucide-react';

// Puzzle 2: Recycling Code Breaker
const CODE_SYMBOLS = [
  { id: 'battery', symbol: '⚡', name: 'Battery', color: '#ef4444' },
  { id: 'plastic', symbol: '⬡', name: 'Plastic', color: '#8b5cf6' },
  { id: 'metal', symbol: '◈', name: 'Metal', color: '#00b4d8' },
  { id: 'glass', symbol: '◇', name: 'Glass', color: '#f59e0b' },
  { id: 'circuit', symbol: '⊕', name: 'Circuit Board', color: '#00d68f' },
];

const ROUTES = [
  { id: 'battery-center', label: 'A. Battery Collection Center', correct: true },
  { id: 'general-recycle', label: 'B. General Recycling Bin', correct: false },
  { id: 'landfill', label: 'C. Municipal Landfill', correct: false },
  { id: 'incinerator', label: 'D. Waste Incinerator', correct: false },
];

// Data wipe steps
const WIPE_STEPS = [
  { label: 'Scanning device storage sectors...', duration: 1000 },
  { label: 'Cryptographic data erasure in progress...', duration: 1200 },
  { label: 'Removing personal credentials & files...', duration: 1400 },
  { label: 'Zeroing flash storage blocks...', duration: 1100 },
  { label: 'Verifying complete data removal...', duration: 900 },
  { label: 'DEVICE READY FOR RECYCLING', duration: 0, final: true },
];

export default function ResidentialBlock({ gameState, recordDecision, completePuzzle, onComplete, navigate }) {
  const [phase, setPhase] = useState('scene'); // scene | code-puzzle | data-puzzle
  const [codePuzzleSolved, setCodePuzzleSolved] = useState(gameState?.completedPuzzles?.includes('recycling-code') || false);
  const [dataPuzzleSolved, setDataPuzzleSolved] = useState(gameState?.completedPuzzles?.includes('data-wipe') || false);

  const allDone = codePuzzleSolved && dataPuzzleSolved;

  return (
    <div className="page-enter residential-page" style={{
      minHeight: '100dvh',
      padding: 'calc(var(--safe-top, 0px) + 0.75rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 1.5rem)',
      background: 'radial-gradient(ellipse at top, #0f2419 0%, #030d07 85%)',
      color: '#f0fdf4',
      overflowX: 'hidden',
    }}>
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto', padding: '0 0.25rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              className="btn btn-ghost"
              onClick={() => navigate('map')}
              style={{ minHeight: '44px', minWidth: '44px', padding: '0.4rem 0.75rem', gap: '0.25rem', fontSize: '0.875rem' }}
            >
              <ChevronLeft size={16} /> MAP
            </button>
            <div>
              <div className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                LOCATION 02
              </div>
              <h1 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', margin: 0, fontWeight: 800 }}>
                🏘️ RESIDENTIAL BLOCK
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-amber" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>HIGH ALERT</span>
          </div>
        </div>

        {phase === 'scene' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Status & Briefing Card */}
            <div style={{
              background: 'rgba(6, 30, 18, 0.75)',
              border: '1.5px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '20px',
              padding: '1.25rem',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="status-dot status-dot-amber" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#86efac', fontWeight: 600 }}>
                  RESIDENTIAL SANCTUARY — INVESTIGATION
                </span>
              </div>

              {/* Pip's Zone Briefing */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
                border: '1.5px solid rgba(74, 222, 128, 0.35)',
                borderRadius: '16px',
                padding: '0.85rem 1.15rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
              }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #4ade80', flexShrink: 0 }}>
                  <img src="/avatars/frog_avatar.jpg" alt="Pip" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#4ade80' }}>Pip's Zone Briefing 🌱</div>
                  <div style={{ fontSize: '0.875rem', color: '#f0fdf4', lineHeight: 1.5 }}>
                    "Oh no! Someone threw an old battery with vegetable trash, and a laptop has saved personal passwords! Let's crack the recycling code and wipe the laptop clean!"
                  </div>
                </div>
              </div>

              <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                Residents are mixing toxic battery waste with household trash. Also, an intact laptop with personal credentials was discarded without being wiped. Solve both puzzles below to secure this block!
              </p>

              {/* 1-Column Puzzle Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Code Puzzle Card */}
                <div style={{
                  background: codePuzzleSolved ? 'rgba(0, 214, 143, 0.08)' : 'rgba(2, 20, 10, 0.65)',
                  border: `1.5px solid ${codePuzzleSolved ? '#00d68f' : 'rgba(74, 222, 128, 0.25)'}`,
                  borderRadius: '16px',
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>🔣</span>
                      <div>
                        <div className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem' }}>PUZZLE 02</div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>THE RECYCLING CODE</h3>
                      </div>
                    </div>
                    {codePuzzleSolved ? (
                      <span className="badge badge-green" style={{ fontSize: '0.8125rem', padding: '4px 10px' }}>SOLVED</span>
                    ) : (
                      <span className="badge badge-amber" style={{ fontSize: '0.8125rem', padding: '4px 10px' }}>PENDING</span>
                    )}
                  </div>
                  
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Decode a multi-component recycling symbol sequence to identify the required processing route.
                  </p>

                  <button
                    className={codePuzzleSolved ? 'btn btn-secondary' : 'btn btn-primary'}
                    onClick={() => setPhase('code-puzzle')}
                    style={{ width: '100%', minHeight: '48px', fontSize: '0.9375rem', fontWeight: 700 }}
                  >
                    {codePuzzleSolved ? 'REVIEW PUZZLE 02' : 'CRACK THE RECYCLING CODE →'}
                  </button>
                </div>

                {/* Data Puzzle Card */}
                <div style={{
                  background: dataPuzzleSolved ? 'rgba(0, 214, 143, 0.08)' : 'rgba(2, 20, 10, 0.65)',
                  border: `1.5px solid ${dataPuzzleSolved ? '#00d68f' : 'rgba(74, 222, 128, 0.25)'}`,
                  borderRadius: '16px',
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>🛡️</span>
                      <div>
                        <div className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem' }}>PUZZLE 03</div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>DATA SECURITY</h3>
                      </div>
                    </div>
                    {dataPuzzleSolved ? (
                      <span className="badge badge-green" style={{ fontSize: '0.8125rem', padding: '4px 10px' }}>SOLVED</span>
                    ) : (
                      <span className="badge badge-amber" style={{ fontSize: '0.8125rem', padding: '4px 10px' }}>PENDING</span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    An unencrypted laptop with active bank passwords was found. Execute proper sanitization before disposal.
                  </p>

                  <button
                    className={dataPuzzleSolved ? 'btn btn-secondary' : 'btn btn-primary'}
                    onClick={() => setPhase('data-puzzle')}
                    id="data-security-btn"
                    style={{ width: '100%', minHeight: '48px', fontSize: '0.9375rem', fontWeight: 700 }}
                  >
                    {dataPuzzleSolved ? 'REVIEW PUZZLE 03' : 'INVESTIGATE DATA SECURITY →'}
                  </button>
                </div>

              </div>
            </div>

            {/* Advance banner when both completed */}
            {allDone && (
              <div style={{
                background: 'rgba(0, 214, 143, 0.1)',
                border: '1.5px solid #00d68f',
                borderRadius: '20px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                <div>
                  <h3 style={{ color: '#00d68f', margin: '0 0 0.35rem 0', fontSize: '1.1rem', fontWeight: 800 }}>
                    ✅ Residential Block Secured!
                  </h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                    Both puzzles solved. You saved personal identity data and redirected toxic chemicals away from the landfill.
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={onComplete}
                  style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
                >
                  ADVANCE TO REPAIR LAB <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>
        )}

        {/* Phase: Code Puzzle */}
        {phase === 'code-puzzle' && (
          <RecyclingCodePuzzle
            onSolve={() => {
              completePuzzle('recycling-code');
              setCodePuzzleSolved(true);
              setPhase('scene');
            }}
            onBack={() => setPhase('scene')}
            solved={codePuzzleSolved}
          />
        )}

        {/* Phase: Data Puzzle */}
        {phase === 'data-puzzle' && (
          <DataSecurityPuzzle
            onSolve={() => {
              completePuzzle('data-wipe');
              setDataPuzzleSolved(true);
              setPhase('scene');
            }}
            onBack={() => setPhase('scene')}
            solved={dataPuzzleSolved}
          />
        )}

      </div>
    </div>
  );
}

/* =========================================================================
   PUZZLE 02: RECYCLING CODE BREAKER
   Full-width option buttons + Explanation in Mobile Bottom Sheet
   ========================================================================= */
function RecyclingCodePuzzle({ onSolve, onBack, solved }) {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showExplanationSheet, setShowExplanationSheet] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);

  const sequence = ['battery', 'circuit', 'metal'];

  const handleSelectRoute = (routeId) => {
    setSelectedRoute(routeId);
    const isCorrect = routeId === 'battery-center';
    setLastSubmission({
      routeId,
      isCorrect,
    });
    setShowExplanationSheet(true);
  };

  const handleCloseSheet = () => {
    setShowExplanationSheet(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Sub-header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          className="btn btn-ghost"
          onClick={onBack}
          style={{ minHeight: '44px', minWidth: '44px', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
        >
          <ChevronLeft size={16} /> BACK
        </button>
        <div>
          <div className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem' }}>ESCAPE ROOM PUZZLE 02</div>
          <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800 }}>🔣 THE RECYCLING CODE</h2>
        </div>
      </div>

      {/* Symbol Codex Legend */}
      <div style={{
        background: 'rgba(6, 30, 18, 0.75)',
        border: '1.5px solid rgba(74, 222, 128, 0.25)',
        borderRadius: '20px',
        padding: '1.25rem',
      }}>
        <div className="data-label" style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
          NOVA CITY RECYCLING SYMBOL CODEX
        </div>

        {/* 2-column wrapping codex chips */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '0.5rem',
          marginBottom: '1.25rem',
        }}>
          {CODE_SYMBOLS.map(sym => (
            <div key={sym.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
            }}>
              <span style={{ fontSize: '1.35rem', color: sym.color, lineHeight: 1 }}>{sym.symbol}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0fdf4' }}>{sym.name}</span>
            </div>
          ))}
        </div>

        {/* The Equation */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1.5px solid rgba(0, 214, 143, 0.3)',
          borderRadius: '16px',
          padding: '1.25rem 0.75rem',
          textAlign: 'center',
          marginBottom: '1.25rem',
        }}>
          <div className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
            DEVICE WASTE CODE DETECTED
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}>
            {sequence.map((symId, idx) => {
              const sym = CODE_SYMBOLS.find(s => s.id === symId);
              return (
                <React.Fragment key={symId}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '10px',
                    minWidth: '55px',
                  }}>
                    <span style={{ fontSize: '1.75rem', color: sym.color, lineHeight: 1 }}>{sym.symbol}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>{sym.name}</span>
                  </div>
                  {idx < sequence.length - 1 && (
                    <span style={{ fontSize: '1.5rem', color: '#4ade80', fontWeight: 800 }}>+</span>
                  )}
                </React.Fragment>
              );
            })}
            <span style={{ fontSize: '1.5rem', color: '#4ade80', fontWeight: 800 }}>=</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 214, 143, 0.15)',
              border: '1.5px dashed #00d68f',
              borderRadius: '10px',
              width: '50px',
              height: '50px',
            }}>
              <span style={{ fontSize: '1.75rem', color: '#00d68f', fontWeight: 800 }}>?</span>
            </div>
          </div>

          <p style={{ marginTop: '0.85rem', color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.5, margin: '0.85rem 0 0 0' }}>
            A gadget containing <strong>Battery + Circuit + Metal</strong> must be sent to which facility?
          </p>
        </div>

        {/* Route Decision Options: Large full-width buttons */}
        <div>
          <div className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
            TAP PROCESSING ROUTE TO SUBMIT
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ROUTES.map(route => {
              const isSelected = selectedRoute === route.id;
              return (
                <button
                  key={route.id}
                  onClick={() => handleSelectRoute(route.id)}
                  style={{
                    width: '100%',
                    minHeight: '54px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    background: isSelected ? 'rgba(0, 214, 143, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1.5px solid ${isSelected ? '#00d68f' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#00d68f' : '#64748b'}`,
                      background: isSelected ? '#00d68f' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#052e16' }} />}
                    </div>
                    <span>{route.label}</span>
                  </div>
                  <ChevronRight size={18} color="#64748b" />
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Sheet for Scenario Decision Explanation */}
      {showExplanationSheet && lastSubmission && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
        }}>
          {/* Backdrop click to close */}
          <div style={{ flex: 1 }} onClick={handleCloseSheet} />

          {/* Sheet container */}
          <div style={{
            background: '#071d12',
            borderTop: `2px solid ${lastSubmission.isCorrect ? '#00d68f' : '#ef4444'}`,
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '1.25rem 1rem calc(var(--safe-bottom, 0px) + 1.25rem)',
            maxHeight: '85dvh',
            overflowY: 'auto',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
          }}>
            {/* Grab handle */}
            <div style={{ width: '40px', height: '4px', background: '#334155', borderRadius: '2px', margin: '0 auto 1rem' }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{lastSubmission.isCorrect ? '🎉' : '⚠️'}</span>
                <div>
                  <h3 style={{
                    fontSize: '1.15rem',
                    margin: 0,
                    fontWeight: 800,
                    color: lastSubmission.isCorrect ? '#00d68f' : '#ef4444',
                  }}>
                    {lastSubmission.isCorrect ? 'Correct Route Verified!' : 'Hazardous Misdirection!'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                    {lastSubmission.isCorrect ? '+100 EXP ALLOCATED' : 'IMPROPER ROUTE'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseSheet}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Explanation Content */}
            <div style={{
              background: lastSubmission.isCorrect ? 'rgba(0, 214, 143, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1.5px solid ${lastSubmission.isCorrect ? 'rgba(0, 214, 143, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.25rem',
            }}>
              <p style={{ color: '#f0fdf4', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                {lastSubmission.isCorrect
                  ? '⚡ Battery + ⊕ Circuit Board + ◈ Metal = Specialized Battery Collection Center. Electronic gadgets with lithium batteries cannot be processed by generic recycling or municipal compactors due to thermal runaway risk.'
                  : '❌ Incorrect Route: General bins and incinerators cannot handle lithium cells and circuit solder. Burning releases neurotoxic vapors, and landfill disposal leaches cobalt and lithium into the water table.'}
              </p>
            </div>

            {/* Action button */}
            {lastSubmission.isCorrect ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleCloseSheet();
                  onSolve();
                }}
                id="claim-code-clue-btn"
                style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
              >
                UNLOCK PUZZLE CLUE (+100 PTS) →
              </button>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={handleCloseSheet}
                style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 700 }}
              >
                TRY ANOTHER ROUTE
              </button>
            )}

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

/* =========================================================================
   PUZZLE 03: DATA SECURITY
   Full-width option buttons + Explanation Bottom Sheet + Sanitization
   ========================================================================= */
function DataSecurityPuzzle({ onSolve, onBack, solved }) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [showExplanationSheet, setShowExplanationSheet] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [wiping, setWiping] = useState(false);
  const [wipeStep, setWipeStep] = useState(0);
  const [wipeComplete, setWipeComplete] = useState(false);

  const actions = [
    { id: 'throw', label: 'A. Throw it away in the trash', correct: false },
    { id: 'stranger', label: 'B. Give it directly to a stranger', correct: false },
    { id: 'wipe', label: 'C. Cryptographically erase all data', correct: true },
    { id: 'screen', label: 'D. Break the glass screen only', correct: false },
  ];

  const handleSelectAction = (actionId) => {
    setSelectedAction(actionId);
    const isCorrect = actionId === 'wipe';
    setLastSubmission({
      actionId,
      isCorrect,
    });
    setShowExplanationSheet(true);
  };

  const handleCloseSheet = () => {
    setShowExplanationSheet(false);
  };

  const handleStartWipe = () => {
    setShowExplanationSheet(false);
    setWiping(true);
    WIPE_STEPS.forEach((step, i) => {
      const totalDelay = WIPE_STEPS.slice(0, i).reduce((acc, s) => acc + s.duration, 0);
      setTimeout(() => {
        setWipeStep(i);
        if (step.final) {
          setTimeout(() => setWipeComplete(true), 600);
        }
      }, totalDelay + 100);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Sub-header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          className="btn btn-ghost"
          onClick={onBack}
          style={{ minHeight: '44px', minWidth: '44px', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
        >
          <ChevronLeft size={16} /> BACK
        </button>
        <div>
          <div className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem' }}>ESCAPE ROOM PUZZLE 03</div>
          <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800 }}>🛡️ DATA SECURITY</h2>
        </div>
      </div>

      {/* Main card */}
      <div style={{
        background: 'rgba(6, 30, 18, 0.75)',
        border: '1.5px solid rgba(74, 222, 128, 0.25)',
        borderRadius: '20px',
        padding: '1.25rem',
      }}>
        
        {/* Threat Warning Banner */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1.5px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '16px',
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          gap: '0.85rem',
          alignItems: 'flex-start',
        }}>
          <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ color: '#ef4444', margin: '0 0 0.35rem 0', fontSize: '0.9375rem', fontWeight: 800 }}>
              CRITICAL PRIVACY BREACH DETECTED
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
              Laptop scan discovered 3,240 family photos, browser history, autofill bank accounts, and work credentials. Discarding without sanitization compromises privacy!
            </p>
          </div>
        </div>

        {/* Device Status Box */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}>
          <div style={{ fontSize: '2.5rem' }}>💻</div>
          <div>
            <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', color: '#ffffff' }}>Unsanitized Work Laptop</h4>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-red" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>DATA EXPOSED</span>
              <span className="badge badge-amber" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>PENDING RECYCLE</span>
            </div>
          </div>
        </div>

        {!wiping && !wipeComplete && (
          <div>
            <p style={{ color: '#f0fdf4', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.85rem' }}>
              What MUST be performed BEFORE this device is recycled?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {actions.map(action => {
                const isSelected = selectedAction === action.id;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleSelectAction(action.id)}
                    style={{
                      width: '100%',
                      minHeight: '54px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      background: isSelected ? 'rgba(0, 214, 143, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1.5px solid ${isSelected ? '#00d68f' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: '#ffffff',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? '#00d68f' : '#64748b'}`,
                        background: isSelected ? '#00d68f' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#052e16' }} />}
                      </div>
                      <span>{action.label}</span>
                    </div>
                    <ChevronRight size={18} color="#64748b" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Wiping progress in terminal style */}
        {wiping && !wipeComplete && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.65)',
            border: '1.5px solid #00d68f',
            borderRadius: '16px',
            padding: '1.25rem',
            fontFamily: 'var(--font-mono)',
          }}>
            <div className="data-label" style={{ color: '#00d68f', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
              SANITIZATION CONSOLE — DOD 5220.22-M
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {WIPE_STEPS.slice(0, wipeStep + 1).map((step, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: i === wipeStep ? '#00d68f' : '#94a3b8',
                }}>
                  <span>{i < wipeStep ? '✓' : '▶'}</span>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>

            <div className="progress-track" style={{ height: '8px', background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="progress-fill progress-green"
                style={{
                  width: `${((wipeStep + 1) / WIPE_STEPS.length) * 100}%`,
                  transition: 'width 0.8s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Wipe Complete Screen */}
        {wipeComplete && (
          <div style={{
            background: 'rgba(0, 214, 143, 0.1)',
            border: '1.5px solid #00d68f',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔐</div>
            <h3 style={{ color: '#00d68f', margin: '0 0 0.5rem 0', fontSize: '1.15rem', fontWeight: 800 }}>
              CRYPTOGRAPHIC WIPE COMPLETE
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              All solid-state storage blocks cleared. Safe for component dismantling and circuit board recycling.
            </p>
            <button
              className="btn btn-primary"
              onClick={onSolve}
              id="complete-data-wipe-btn"
              style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
            >
              COMPLETE DATA SECURITY CHALLENGE (+120 PTS) →
            </button>
          </div>
        )}

      </div>

      {/* Bottom Sheet for Scenario Decision Explanation */}
      {showExplanationSheet && lastSubmission && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{ flex: 1 }} onClick={handleCloseSheet} />

          <div style={{
            background: '#071d12',
            borderTop: `2px solid ${lastSubmission.isCorrect ? '#00d68f' : '#ef4444'}`,
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '1.25rem 1rem calc(var(--safe-bottom, 0px) + 1.25rem)',
            maxHeight: '85dvh',
            overflowY: 'auto',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
          }}>
            <div style={{ width: '40px', height: '4px', background: '#334155', borderRadius: '2px', margin: '0 auto 1rem' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{lastSubmission.isCorrect ? '✅' : '❌'}</span>
                <div>
                  <h3 style={{
                    fontSize: '1.15rem',
                    margin: 0,
                    fontWeight: 800,
                    color: lastSubmission.isCorrect ? '#00d68f' : '#ef4444',
                  }}>
                    {lastSubmission.isCorrect ? 'Security Protocol Verified!' : 'Data Vulnerability!'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                    {lastSubmission.isCorrect ? 'PROCEDURE AUTHORIZED' : 'INCORRECT ACTION'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseSheet}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              background: lastSubmission.isCorrect ? 'rgba(0, 214, 143, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1.5px solid ${lastSubmission.isCorrect ? 'rgba(0, 214, 143, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.25rem',
            }}>
              <p style={{ color: '#f0fdf4', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                {lastSubmission.isCorrect
                  ? 'Securely sanitizing flash blocks with multi-pass zeroing or hardware cryptographic erasure is required before secondary transfer or recycling. Merely smashing glass leaves memory chips intact for scrap scavengers.'
                  : 'Breaking glass or giving the device away leaves SSD flash storage completely intact! Bad actors frequently extract intact NAND flash chips from discarded electronics to recover bank logins.'}
              </p>
            </div>

            {lastSubmission.isCorrect ? (
              <button
                className="btn btn-primary"
                onClick={handleStartWipe}
                id="start-secure-wipe-btn"
                style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
              >
                <Shield size={18} /> START SECURE DATA WIPE NOW →
              </button>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={handleCloseSheet}
                style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 700 }}
              >
                TRY AGAIN
              </button>
            )}

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
