import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Shield, AlertTriangle } from 'lucide-react';

// Puzzle 2: Recycling Code Breaker
const CODE_SYMBOLS = [
  { id: 'battery', symbol: '⚡', name: 'Battery', color: '#ef4444' },
  { id: 'plastic', symbol: '⬡', name: 'Plastic', color: '#8b5cf6' },
  { id: 'metal', symbol: '◈', name: 'Metal', color: '#00b4d8' },
  { id: 'glass', symbol: '◇', name: 'Glass', color: '#f59e0b' },
  { id: 'circuit', symbol: '⊕', name: 'Circuit Board', color: '#00d68f' },
];

const ROUTES = [
  { id: 'battery-center', label: 'Battery Collection Center', correct: true },
  { id: 'general-recycle', label: 'General Recycling Bin', correct: false },
  { id: 'landfill', label: 'Municipal Landfill', correct: false },
  { id: 'incinerator', label: 'Waste Incinerator', correct: false },
];

// Data wipe steps
const WIPE_STEPS = [
  { label: 'Scanning device storage...', duration: 1200 },
  { label: 'Encrypting existing data...', duration: 1500 },
  { label: 'Removing personal files...', duration: 2000 },
  { label: 'Clearing browser history & passwords...', duration: 1500 },
  { label: 'Verifying data removal...', duration: 1200 },
  { label: 'DEVICE READY FOR RECYCLING', duration: 0, final: true },
];

export default function ResidentialBlock({ gameState, recordDecision, completePuzzle, onComplete, navigate }) {
  const [phase, setPhase] = useState('scene'); // scene | code-puzzle | data-puzzle | complete
  const [codePuzzleSolved, setCodePuzzleSolved] = useState(gameState.completedPuzzles.includes('recycling-code'));
  const [dataPuzzleSolved, setDataPuzzleSolved] = useState(gameState.completedPuzzles.includes('data-wipe'));

  const allDone = codePuzzleSolved && dataPuzzleSolved;

  return (
    <div className="page-enter" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('map')} style={{ gap: '0.25rem' }}>
            <ChevronLeft size={14} /> MAP
          </button>
          <div>
            <div className="data-label">LOCATION 02</div>
            <h1 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              🏘️ RESIDENTIAL BLOCK
            </h1>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span className="badge badge-amber">HIGH ALERT</span>
          </div>
        </div>

        {phase === 'scene' && (
          <div>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="status-dot status-dot-amber" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#86efac' }}>
                  RESIDENTIAL SANCTUARY — INVESTIGATION REQUIRED
                </span>
              </div>

              {/* Pip's Zone Briefing */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
                border: '1.5px solid rgba(74, 222, 128, 0.35)',
                borderRadius: '16px',
                padding: '0.85rem 1.15rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #4ade80', flexShrink: 0 }}>
                  <img src="/avatars/frog_avatar.jpg" alt="Pip" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4ade80' }}>Pip's Zone Briefing 🌱</div>
                  <div style={{ fontSize: '0.84rem', color: '#f0fdf4', lineHeight: 1.45 }}>
                    "Oh no! Someone threw an old battery with vegetable trash, and a laptop has saved personal passwords! Let's crack the recycling code and wipe the laptop clean!"
                  </div>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Residents are mixing electronic waste with household garbage. 
                An old laptop was found with personal data accessible. 
                Solve both puzzles to protect privacy and our environment!
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {/* Code Puzzle Card */}
                <div className="card" style={{
                  border: codePuzzleSolved ? '1px solid rgba(0,214,143,0.3)' : '1px solid var(--border-card)',
                  background: codePuzzleSolved ? 'rgba(0,214,143,0.05)' : 'var(--bg-card)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '1.5rem' }}>🔣</div>
                    <div>
                      <div className="data-label" style={{ marginBottom: '2px' }}>PUZZLE 02</div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>THE RECYCLING CODE</h3>
                    </div>
                    {codePuzzleSolved && <span className="badge badge-green" style={{ marginLeft: 'auto' }}>SOLVED</span>}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                    Decode a fictional recycling symbol sequence to determine the correct processing route.
                  </p>
                  <button
                    className={codePuzzleSolved ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
                    onClick={() => setPhase('code-puzzle')}
                  >
                    {codePuzzleSolved ? 'Review' : 'CRACK THE CODE'}
                  </button>
                </div>

                {/* Data Puzzle Card */}
                <div className="card" style={{
                  border: dataPuzzleSolved ? '1px solid rgba(0,214,143,0.3)' : '1px solid var(--border-card)',
                  background: dataPuzzleSolved ? 'rgba(0,214,143,0.05)' : 'var(--bg-card)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '1.5rem' }}>🛡️</div>
                    <div>
                      <div className="data-label" style={{ marginBottom: '2px' }}>PUZZLE 03</div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>DATA SECURITY</h3>
                    </div>
                    {dataPuzzleSolved && <span className="badge badge-green" style={{ marginLeft: 'auto' }}>SOLVED</span>}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                    A laptop with personal data has been found. Ensure it is properly prepared before recycling.
                  </p>
                  <button
                    className={dataPuzzleSolved ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
                    onClick={() => setPhase('data-puzzle')}
                    id="data-security-btn"
                  >
                    {dataPuzzleSolved ? 'Review' : 'INVESTIGATE'}
                  </button>
                </div>
              </div>
            </div>

            {allDone && (
              <div style={{
                background: 'rgba(0,214,143,0.06)',
                border: '1px solid rgba(0,214,143,0.3)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
              }}>
                <div>
                  <h3 style={{ color: 'var(--accent-green)', marginBottom: '0.25rem' }}>✅ Residential Block Secured</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Both puzzles solved. Repair Lab is now accessible.
                  </p>
                </div>
                <button className="btn btn-primary" onClick={onComplete}>
                  ADVANCE TO REPAIR LAB <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

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

function RecyclingCodePuzzle({ onSolve, onBack, solved }) {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState(false);

  // The puzzle: Battery + Circuit + Metal → needs specialized processing
  const sequence = ['battery', 'circuit', 'metal'];

  const handleSubmit = () => {
    if (!selectedRoute) return;
    setAnswered(true);
  };

  const correct = selectedRoute === 'battery-center';

  return (
    <div className="animate-fadeUp">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          <ChevronLeft size={14} /> BACK
        </button>
        <div>
          <div className="data-label">ESCAPE ROOM PUZZLE 02</div>
          <h2 style={{ fontSize: '1.25rem' }}>🔣 THE RECYCLING CODE</h2>
        </div>
      </div>

      <div style={{ maxWidth: '680px' }}>
        {/* Symbol legend */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.1em' }}>
            NOVA CITY RECYCLING SYMBOL CODEX
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {CODE_SYMBOLS.map(sym => (
              <div key={sym.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.875rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.25rem',
                  color: sym.color,
                }}>
                  {sym.symbol}
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{sym.name}</span>
              </div>
            ))}
          </div>

          {/* The code equation */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(0,214,143,0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}>
            <div className="data-label" style={{ marginBottom: '1rem' }}>DEVICE WASTE CODE DETECTED</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {sequence.map((symId, i) => {
                const sym = CODE_SYMBOLS.find(s => s.id === symId);
                return (
                  <React.Fragment key={symId}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2rem',
                        color: sym.color,
                      }}>
                        {sym.symbol}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        color: 'var(--text-muted)',
                      }}>
                        {sym.name}
                      </span>
                    </div>
                    {i < sequence.length - 1 && (
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-muted)' }}>+</span>
                    )}
                  </React.Fragment>
                );
              })}
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-muted)' }}>=</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--accent-green)' }}>?</span>
            </div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              A device containing a Battery, Circuit Board, and Metal components must be sent to which processing route?
            </p>
          </div>

          {/* Route options */}
          {!answered ? (
            <div>
              <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
                SELECT PROCESSING ROUTE
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
                {ROUTES.map(route => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRoute(route.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.875rem',
                      padding: '0.875rem 1.25rem',
                      background: selectedRoute === route.id ? 'rgba(0,214,143,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedRoute === route.id ? 'rgba(0,214,143,0.4)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: `2px solid ${selectedRoute === route.id ? 'var(--accent-green)' : 'var(--border-card)'}`,
                      background: selectedRoute === route.id ? 'var(--accent-green)' : 'transparent',
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{route.label}</span>
                  </button>
                ))}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!selectedRoute}
                style={{ opacity: selectedRoute ? 1 : 0.5 }}
              >
                SUBMIT ANSWER
              </button>
            </div>
          ) : (
            <div style={{ animation: 'fadeUp 0.3s ease' }}>
              <div style={{
                padding: '1.25rem',
                background: correct ? 'rgba(0,214,143,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${correct ? 'rgba(0,214,143,0.3)' : 'rgba(239,68,68,0.3)'}`,
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1rem',
              }}>
                <h3 style={{ color: correct ? 'var(--accent-green)' : 'var(--accent-red)', marginBottom: '0.5rem' }}>
                  {correct ? '✅ Correct!' : '❌ Incorrect'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {correct
                    ? 'Battery + Circuit Board + Metal = Specialized Battery Collection Center. Devices with lithium batteries contain hazardous materials and require specialized processing — NOT general recycling.'
                    : 'The correct answer is Battery Collection Center. Devices containing lithium batteries and circuit boards must go to specialized e-waste processors — general recycling bins and incinerators cannot handle these safely.'}
                </p>
              </div>
              {correct ? (
                <button className="btn btn-primary" onClick={onSolve}>
                  UNLOCK CLUE (+100 pts) <ChevronRight size={14} />
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={() => { setAnswered(false); setSelectedRoute(null); }}>
                  TRY AGAIN
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DataSecurityPuzzle({ onSolve, onBack, solved }) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [wiping, setWiping] = useState(false);
  const [wipeStep, setWipeStep] = useState(0);
  const [wipeComplete, setWipeComplete] = useState(false);

  const actions = [
    { id: 'throw', label: 'A. Throw it away', correct: false },
    { id: 'stranger', label: 'B. Give directly to a stranger', correct: false },
    { id: 'wipe', label: 'C. Securely erase all data', correct: true },
    { id: 'screen', label: 'D. Break the screen only', correct: false },
  ];

  const handleSubmit = () => {
    setAnswered(true);
  };

  const handleStartWipe = () => {
    setWiping(true);
    WIPE_STEPS.forEach((step, i) => {
      const totalDelay = WIPE_STEPS.slice(0, i).reduce((acc, s) => acc + s.duration, 0);
      setTimeout(() => {
        setWipeStep(i);
        if (step.final) {
          setTimeout(() => setWipeComplete(true), 800);
        }
      }, totalDelay + 200);
    });
  };

  const correct = selectedAction === 'wipe';

  return (
    <div className="animate-fadeUp">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          <ChevronLeft size={14} /> BACK
        </button>
        <div>
          <div className="data-label">ESCAPE ROOM PUZZLE 03</div>
          <h2 style={{ fontSize: '1.25rem' }}>🛡️ DATA SECURITY</h2>
        </div>
      </div>

      <div style={{ maxWidth: '600px' }}>
        {/* Alert */}
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          <AlertTriangle size={24} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ color: 'var(--accent-red)', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
              ⚠️ DEVICE CONTAINS PERSONAL DATA
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              An old laptop was found. Scanning reveals: 3,240 personal photos, banking app data, stored passwords, company documents. 
              The device is destined for recycling — but there's a critical step required first.
            </p>
          </div>
        </div>

        {/* Device visual */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '2.5rem' }}>💻</div>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Recovered Laptop</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-red">DATA DETECTED</span>
                <span className="badge badge-amber">FOR RECYCLING</span>
              </div>
            </div>
          </div>

          {!answered && !wipeComplete && (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.875rem', fontSize: '0.9375rem' }}>
                What should happen BEFORE this laptop is recycled?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
                {actions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => setSelectedAction(action.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.875rem',
                      padding: '0.875rem 1.25rem',
                      background: selectedAction === action.id ? 'rgba(0,214,143,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedAction === action.id ? 'rgba(0,214,143,0.4)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: `2px solid ${selectedAction === action.id ? 'var(--accent-green)' : 'var(--border-card)'}`,
                      background: selectedAction === action.id ? 'var(--accent-green)' : 'transparent',
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{action.label}</span>
                  </button>
                ))}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!selectedAction}
                style={{ opacity: selectedAction ? 1 : 0.5 }}
              >
                CONFIRM
              </button>
            </div>
          )}

          {answered && !wiping && !wipeComplete && (
            <div style={{ animation: 'fadeUp 0.3s ease' }}>
              {correct ? (
                <div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(0,214,143,0.08)',
                    border: '1px solid rgba(0,214,143,0.2)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '1rem',
                  }}>
                    <p style={{ color: 'var(--accent-green)', fontWeight: 600, marginBottom: '0.25rem' }}>✅ Correct!</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      Securely erasing data is always required before recycling, donating, or selling any device. 
                      A basic factory reset alone is not sufficient — encrypted data wipe is needed.
                    </p>
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(0,180,216,0.06)',
                    border: '1px solid rgba(0,180,216,0.2)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '1rem',
                  }}>
                    <p style={{ color: 'var(--accent-blue)', fontWeight: 500, marginBottom: '0.25rem' }}>
                      🔐 Initiate Secure Data Wipe?
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      Complete the data wipe process to fully secure this device.
                    </p>
                  </div>
                  <button className="btn btn-primary" onClick={handleStartWipe} id="start-secure-wipe-btn">
                    <Shield size={14} />
                    START SECURE WIPE
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '1rem',
                  }}>
                    <p style={{ color: 'var(--accent-red)', fontWeight: 600, marginBottom: '0.25rem' }}>❌ Incorrect</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      The correct answer is C — Securely erase all data. 
                      Personal data must be properly wiped before any disposal. Breaking a screen or throwing away doesn't protect your data.
                    </p>
                  </div>
                  <button className="btn btn-secondary" onClick={() => { setAnswered(false); setSelectedAction(null); }}>
                    TRY AGAIN
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Wipe animation */}
          {wiping && !wipeComplete && (
            <div style={{ animation: 'fadeUp 0.3s ease' }}>
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(0,214,143,0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                fontFamily: 'var(--font-mono)',
              }}>
                {WIPE_STEPS.slice(0, wipeStep + 1).map((step, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    animation: 'fadeIn 0.3s ease',
                    color: i === wipeStep ? 'var(--accent-green)' : 'var(--text-secondary)',
                    fontSize: '0.8125rem',
                  }}>
                    {i < wipeStep ? '✓' : i === wipeStep && !step.final ? '▶' : step.final ? '✅' : '•'}
                    <span>{step.label}</span>
                    {i === wipeStep && !step.final && <span className="typewriter-cursor" />}
                  </div>
                ))}
                {wipeStep < WIPE_STEPS.length - 1 && (
                  <div style={{ marginTop: '1rem' }}>
                    <div className="progress-track">
                      <div
                        className="progress-fill progress-green"
                        style={{
                          width: `${(wipeStep / (WIPE_STEPS.length - 1)) * 100}%`,
                          transition: 'width 1s ease',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {wipeComplete && (
            <div style={{ animation: 'scaleIn 0.4s ease' }}>
              <div style={{
                background: 'rgba(0,214,143,0.08)',
                border: '1px solid rgba(0,214,143,0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                textAlign: 'center',
                marginBottom: '1rem',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔐</div>
                <h3 style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }}>DATA WIPE COMPLETE</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  All personal data has been securely erased. Device is now safe for recycling.
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span className="badge badge-green">DATA CLEARED</span>
                  <span className="badge badge-blue">SAFE FOR RECYCLING</span>
                </div>
              </div>
              <button className="btn btn-primary w-full" onClick={onSolve}>
                COMPLETE DATA SECURITY CHALLENGE (+120 pts) <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
