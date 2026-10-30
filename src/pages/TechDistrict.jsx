import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, AlertTriangle, CheckCircle, Zap, Shield, Sparkles } from 'lucide-react';
import { devices } from '../data/devices';

const DECISION_LABELS = {
  repair: { label: 'REPAIR', color: 'var(--accent-green)', desc: 'Fix and continue using' },
  reuse: { label: 'REUSE / DONATE', color: 'var(--accent-blue)', desc: 'Give to another user' },
  recycle: { label: 'RECYCLE', color: 'var(--accent-amber)', desc: 'Send to authorized e-waste' },
  garbage: { label: 'REGULAR GARBAGE', color: 'var(--accent-red)', desc: 'Throw in normal bin' },
};

export default function TechDistrict({ gameState, recordDecision, markDeviceInspected, completePuzzle, onComplete, navigate, addEasterEgg }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [phase, setPhase] = useState('scene'); // scene | inspect | decision
  const [decisionResult, setDecisionResult] = useState(null);
  const [completedDevices, setCompletedDevices] = useState({});
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(gameState?.completedPuzzles?.includes('circuit-puzzle') || false);

  const techDevices = devices.filter(d => d.location === 'tech-district');
  const allDevicesDone = techDevices.every(d => completedDevices[d.id]);

  const handleDeviceClick = (device) => {
    if (completedDevices[device.id]) return;
    setSelectedDevice(device);
    setPhase('inspect');
    markDeviceInspected(device.id);
  };

  const handleDecision = (choice) => {
    const result = selectedDevice.decisions[choice];
    recordDecision(
      selectedDevice.id,
      choice,
      result.correct,
      result.score,
      result.ecoImpact,
      result.resourceRecovery,
      result.cityRisk
    );
    setDecisionResult({ choice, result });
    setCompletedDevices(prev => ({ ...prev, [selectedDevice.id]: { choice, correct: result.correct } }));
  };

  const handleCloseBottomSheet = () => {
    setSelectedDevice(null);
    setDecisionResult(null);
    setPhase('scene');
  };

  return (
    <div className="page-enter tech-district-page" style={{
      minHeight: '100dvh',
      padding: 'calc(var(--safe-top, 0px) + 0.75rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 1.5rem)',
      background: 'radial-gradient(ellipse at top, #0c2618 0%, #030f08 85%)',
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
                LOCATION 01
              </div>
              <h1 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', margin: 0, fontWeight: 800 }}>
                🏢 TECH DISTRICT
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-red" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>CRITICAL</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#86efac', fontWeight: 600 }}>
              {Object.keys(completedDevices).length}/{techDevices.length}
            </span>
          </div>
        </div>

        {/* Scene Phase */}
        {phase === 'scene' && !showPuzzle && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Mission brief card */}
            <div style={{
              background: 'rgba(6, 26, 16, 0.85)',
              border: '1.5px solid rgba(74, 222, 128, 0.35)',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="status-dot status-dot-red" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#86efac', fontWeight: 700 }}>
                  ABANDONED DEVICES IN COMMERCIAL ZONE
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9375rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Commercial devices were found abandoned. Tap each device to inspect hardware, batteries, and data before making a responsible disposal decision!
              </p>

              {/* Device Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
              }}>
                {techDevices.map(device => {
                  const done = completedDevices[device.id];
                  return (
                    <button
                      key={device.id}
                      onClick={() => !done && handleDeviceClick(device)}
                      style={{
                        background: done
                          ? done.correct ? 'rgba(0, 214, 143, 0.15)' : 'rgba(239, 68, 68, 0.15)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: `1.5px solid ${done
                          ? done.correct ? 'rgba(0, 214, 143, 0.45)' : 'rgba(239, 68, 68, 0.45)'
                          : 'rgba(74, 222, 128, 0.3)'}`,
                        borderRadius: '16px',
                        padding: '1rem 0.75rem',
                        textAlign: 'center',
                        cursor: done ? 'default' : 'pointer',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '120px',
                        width: '100%',
                      }}
                      tabIndex={done ? -1 : 0}
                      aria-label={`Inspect ${device.name}`}
                    >
                      {done && (
                        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                          {done.correct
                            ? <CheckCircle size={18} color="#00d68f" />
                            : <X size={18} color="#ef4444" />
                          }
                        </div>
                      )}
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem', lineHeight: 1 }}>{device.emoji}</div>
                      <div style={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: done ? '#94a3b8' : '#ffffff',
                        lineHeight: 1.25,
                      }}>
                        {device.name}
                      </div>
                      {!done ? (
                        <div style={{
                          marginTop: '0.4rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: '#4ade80',
                          fontWeight: 700,
                        }}>
                          TAP TO SCAN
                        </div>
                      ) : (
                        <div style={{
                          marginTop: '0.4rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: done.correct ? '#00d68f' : '#ef4444',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}>
                          {DECISION_LABELS[done.choice]?.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Puzzle Card & Next Zone advance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="card" style={{
                border: puzzleSolved ? '1.5px solid rgba(0, 214, 143, 0.4)' : '1.5px solid rgba(74, 222, 128, 0.3)',
                background: 'rgba(6, 26, 16, 0.85)',
                borderRadius: '20px',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                  <div style={{ fontSize: '1.75rem' }}>⚡</div>
                  <div>
                    <div className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem' }}>PUZZLE 01</div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>THE BROKEN CIRCUIT</h3>
                  </div>
                  {puzzleSolved && (
                    <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>
                      SOLVED
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '1rem', lineHeight: 1.5 }}>
                  Sort circuit components into hazardous vs recoverable streams.
                </p>
                <button
                  className={puzzleSolved ? 'btn btn-secondary' : 'btn btn-primary'}
                  onClick={() => setShowPuzzle(true)}
                  style={{ width: '100%', minHeight: '48px', fontSize: '0.9375rem', fontWeight: 700 }}
                >
                  {puzzleSolved ? 'REVIEW CIRCUIT PUZZLE' : 'START CIRCUIT PUZZLE ⚡'}
                </button>
              </div>

              {allDevicesDone && puzzleSolved && (
                <div className="card" style={{
                  border: '1.5px solid rgba(0, 214, 143, 0.5)',
                  background: 'rgba(0, 214, 143, 0.1)',
                  borderRadius: '20px',
                  padding: '1.25rem',
                }}>
                  <h3 style={{ marginBottom: '0.4rem', color: '#00d68f', fontSize: '1.1rem', fontWeight: 800 }}>
                    ✅ District Clearance Achieved
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '1rem' }}>
                    All commercial devices inspected and circuit puzzle decoded! Residential Block is unlocked.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={onComplete}
                    style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800, gap: '0.5rem' }}
                  >
                    <span>ADVANCE TO RESIDENTIAL BLOCK</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Inspect Phase: Single-Column Full Mobile View */}
        {phase === 'inspect' && selectedDevice && (
          <InspectPanel
            device={selectedDevice}
            onDecide={() => setPhase('decision')}
            onBack={() => setPhase('scene')}
          />
        )}

        {/* Decision Phase: Full-Width Option Buttons with Explanation in Bottom Sheet */}
        {phase === 'decision' && selectedDevice && (
          <DecisionPanel
            device={selectedDevice}
            onDecision={handleDecision}
            onBack={() => setPhase('inspect')}
          />
        )}

        {/* Circuit Puzzle */}
        {showPuzzle && (
          <CircuitPuzzle
            onSolve={() => {
              completePuzzle('circuit-puzzle');
              setPuzzleSolved(true);
              setShowPuzzle(false);
            }}
            onClose={() => setShowPuzzle(false)}
            solved={puzzleSolved}
          />
        )}

      </div>

      {/* =========================================================================
          BOTTOM SHEET MODAL FOR SCENARIO DECISION EXPLANATION
          ========================================================================= */}
      {decisionResult && selectedDevice && typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          {/* Dimmed backdrop */}
          <div
            onClick={handleCloseBottomSheet}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              animation: 'fadeIn 0.2s ease',
            }}
          />

          {/* Bottom Sheet Drawer */}
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '85dvh',
            overflowY: 'auto',
            background: 'linear-gradient(180deg, #0e2a1e 0%, #06150e 100%)',
            borderTop: `2.5px solid ${decisionResult.result.correct ? '#00d68f' : '#ef4444'}`,
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '0.75rem 1.25rem calc(var(--safe-bottom, 0px) + 1rem)',
            boxShadow: '0 -12px 40px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 214, 143, 0.25)',
            animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            zIndex: 10000,
            color: '#f0fdf4',
          }}>
            {/* Grab Handle */}
            <div style={{
              width: '40px',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255, 255, 255, 0.3)',
              margin: '0 auto 0.75rem',
            }} />

            {/* Header: Result Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{decisionResult.result.correct ? '✅' : '❌'}</span>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: decisionResult.result.correct ? '#00d68f' : '#ef4444',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                  }}>
                    {decisionResult.result.correct ? 'CORRECT DISPOSAL' : 'POOR DISPOSAL ROUTE'}
                  </div>
                  <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800 }}>
                    {selectedDevice.name} → {DECISION_LABELS[decisionResult.choice]?.label}
                  </h2>
                </div>
              </div>

              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: decisionResult.result.correct ? '#00d68f' : '#ef4444',
              }}>
                +{decisionResult.result.score} pts
              </div>
            </div>

            {/* Detailed Explanation */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '0.85rem 1rem',
              marginBottom: '0.85rem',
            }}>
              <p style={{ color: '#f0fdf4', fontSize: '0.9375rem', lineHeight: 1.55, margin: 0 }}>
                {decisionResult.result.feedback}
              </p>
            </div>

            {/* Pip's Guidance Quote */}
            <div style={{
              background: decisionResult.result.correct ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.1)',
              border: `1.5px solid ${decisionResult.result.correct ? 'rgba(74, 222, 128, 0.35)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '14px',
              padding: '0.65rem 0.85rem',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🐸</span>
              <div style={{ fontSize: '0.875rem', color: decisionResult.result.correct ? '#86efac' : '#fca5a5', lineHeight: 1.4 }}>
                {decisionResult.result.correct
                  ? 'Pip says: "Superb decision! By choosing the right route, toxic acids stay sealed and clean metals get recovered!"'
                  : 'Pip says: "Remember Cadet, electronics contain hazardous heavy metals and cannot be tossed into common household trash!"'}
              </div>
            </div>

            {/* Impact stats grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>ECO IMPACT</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: decisionResult.result.ecoImpact >= 0 ? '#00d68f' : '#ef4444' }}>
                  {decisionResult.result.ecoImpact >= 0 ? '+' : ''}{decisionResult.result.ecoImpact}
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>RECOVERY</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>
                  +{decisionResult.result.resourceRecovery}
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>CITY RISK</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: decisionResult.result.cityRisk <= 0 ? '#00d68f' : '#ef4444' }}>
                  {decisionResult.result.cityRisk}
                </div>
              </div>
            </div>

            {/* Close / Next Button */}
            <button
              className="btn btn-primary"
              onClick={handleCloseBottomSheet}
              id="bottomsheet-continue-btn"
              style={{
                width: '100%',
                minHeight: '52px',
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                color: '#04170d',
                cursor: 'pointer',
              }}
            >
              CONTINUE INVESTIGATION →
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function InspectPanel({ device, onDecide, onBack }) {
  return (
    <div className="animate-fadeUp" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ minHeight: '44px', minWidth: '44px', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>
          <ChevronLeft size={16} /> BACK
        </button>
        <span className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem' }}>
          DEVICE SCAN — {device.name.toUpperCase()}
        </span>
      </div>

      {/* Visual Scan Box */}
      <div style={{
        background: 'rgba(6, 26, 16, 0.85)',
        border: '1.5px solid rgba(74, 222, 128, 0.35)',
        borderRadius: '20px',
        padding: '1.5rem 1rem',
        textAlign: 'center',
      }} className="scanline">
        <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem', animation: 'float 3.5s ease-in-out infinite' }}>
          {device.emoji}
        </div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: 800 }}>{device.name}</h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>{device.description}</p>
      </div>

      {/* Scan Results Table */}
      <div style={{
        background: 'rgba(6, 26, 16, 0.85)',
        border: '1.5px solid rgba(74, 222, 128, 0.25)',
        borderRadius: '18px',
        padding: '1rem',
      }}>
        <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', color: '#86efac', marginBottom: '0.75rem' }}>
          DIAGNOSTIC TELEMETRY
        </h3>
        {[
          { label: 'Age', value: device.age },
          { label: 'Condition', value: device.condition },
          { label: 'Battery', value: device.battery },
          { label: 'Data Status', value: device.data },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.65rem 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <span className="data-label" style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{item.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#ffffff', fontWeight: 600 }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Materials & Clue */}
      <div style={{
        background: 'rgba(6, 26, 16, 0.85)',
        border: '1.5px solid rgba(74, 222, 128, 0.25)',
        borderRadius: '18px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        <div>
          <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', color: '#86efac', marginBottom: '0.5rem' }}>
            MATERIALS DETECTED
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {device.materials.map(m => (
              <span key={m} style={{
                padding: '4px 10px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '100px',
                fontSize: '0.875rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
              }}>
                {m}
              </span>
            ))}
          </div>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(74, 222, 128, 0.25)',
          borderRadius: '12px',
          padding: '0.75rem',
        }}>
          <div className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            🔍 FACTUAL OBSERVATION
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#f0fdf4', lineHeight: 1.5, margin: 0 }}>
            "{device.additionalClue || 'No additional abnormalities detected.'}"
          </p>
        </div>
      </div>

      {/* Proceed Button */}
      <button
        className="btn btn-primary"
        onClick={onDecide}
        id="inspect-proceed-btn"
        style={{
          width: '100%',
          minHeight: '52px',
          fontSize: '1rem',
          fontWeight: 800,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        <span>MAKE DISPOSAL DECISION</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function DecisionPanel({ device, onDecision, onBack }) {
  const decisions = [
    { key: 'repair', icon: '🔧', label: 'REPAIR', desc: 'Fix & extend hardware lifespan', color: '#4ade80' },
    { key: 'reuse', icon: '🤝', label: 'REUSE / DONATE', desc: 'Pass along to a school or user', color: '#38bdf8' },
    { key: 'recycle', icon: '♻️', label: 'AUTHORIZED RECYCLING', desc: 'Certified hazardous e-waste facility', color: '#fbbf24' },
    { key: 'garbage', icon: '🗑️', label: 'REGULAR GARBAGE', desc: 'Household mixed trash bin', color: '#ef4444' },
  ];

  return (
    <div className="animate-fadeUp" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ minHeight: '44px', minWidth: '44px', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>
          <ChevronLeft size={16} /> BACK
        </button>
        <div>
          <div className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem' }}>DECISION REQUIRED</div>
          <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800 }}>
            What should be done with {device.name}?
          </h2>
        </div>
      </div>

      {/* Pip Guide Banner */}
      <div style={{
        background: 'rgba(74, 222, 128, 0.1)',
        border: '1.5px solid rgba(74, 222, 128, 0.35)',
        borderRadius: '16px',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>🐸</span>
        <div style={{ fontSize: '0.875rem', color: '#f0fdf4', lineHeight: 1.45 }}>
          "Can this gadget be fixed or donated? If it's too broken, send it to certified recycling! Never pick regular garbage!"
        </div>
      </div>

      {/* FULL-WIDTH SCENARIO DECISION OPTION BUTTONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {decisions.map(d => (
          <button
            key={d.key}
            onClick={() => onDecision(d.key)}
            id={`decision-${d.key}-btn`}
            style={{
              width: '100%',
              minHeight: '64px',
              background: 'rgba(6, 26, 16, 0.85)',
              border: `1.5px solid ${d.color}60`,
              borderRadius: '16px',
              padding: '0.85rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ fontSize: '2rem', flexShrink: 0 }}>{d.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9375rem',
                fontWeight: 800,
                color: d.color,
                letterSpacing: '0.04em',
                marginBottom: '2px',
              }}>
                {d.label}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.35 }}>
                {d.desc}
              </div>
            </div>
            <ChevronRight size={18} color={d.color} style={{ flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// Mobile-Friendly Circuit Puzzle with Touch Pointer Drag & Tap-to-Select Fallback
const CIRCUIT_COMPONENTS = [
  { id: 'battery', name: 'Battery', emoji: '🔋', category: 'hazardous', reason: 'Contains lithium & cobalt — fire and chemical risk' },
  { id: 'pcb', name: 'Circuit Board (PCB)', emoji: '🟢', category: 'hazardous', reason: 'Contains lead solder & toxic flame retardants' },
  { id: 'capacitor', name: 'Capacitor', emoji: '⚫', category: 'hazardous', reason: 'Stores electrical charge & contains toxic electrolytes' },
  { id: 'copper', name: 'Copper Wire', emoji: '🟠', category: 'recoverable', reason: 'Pure copper — 100% recyclable conductive metal' },
  { id: 'plastic', name: 'Plastic Casing', emoji: '⬜', category: 'recoverable', reason: 'Thermoplastics — re-meltable into new enclosures' },
];

function CircuitPuzzle({ onSolve, onClose, solved }) {
  const [placements, setPlacements] = useState({});
  const [selectedCompId, setSelectedCompId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [mistakes, setMistakes] = useState(0);

  const handlePlace = (compId, zone) => {
    const comp = CIRCUIT_COMPONENTS.find(c => c.id === compId);
    if (!comp) return;

    const correct = comp.category === zone;
    const newPlacements = { ...placements, [compId]: zone };
    setPlacements(newPlacements);
    setSelectedCompId(null);

    if (!correct) {
      setMistakes(prev => prev + 1);
      setFeedback({ correct: false, msg: `Hint: ${comp.reason}` });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      const allCorrect = CIRCUIT_COMPONENTS.every(c => newPlacements[c.id] === c.category);
      if (allCorrect) {
        setFeedback({ correct: true, msg: '🎉 Circuit sorted perfectly! Clue unlocked.' });
      }
    }
  };

  const handlePointerDrop = (e, zone) => {
    const compId = e.dataTransfer ? e.dataTransfer.getData('compId') : selectedCompId;
    if (compId) {
      handlePlace(compId, zone);
    }
  };

  const unplaced = CIRCUIT_COMPONENTS.filter(c => !placements[c.id]);
  const allDone = CIRCUIT_COMPONENTS.every(c => placements[c.id] === c.category);

  return (
    <div className="animate-fadeUp" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <button className="btn btn-ghost" onClick={onClose} style={{ minHeight: '44px', minWidth: '44px', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>
          <ChevronLeft size={16} /> BACK
        </button>
        <div>
          <div className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem' }}>ESCAPE ROOM PUZZLE 01</div>
          <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800 }}>⚡ THE BROKEN CIRCUIT</h2>
        </div>
        {mistakes > 0 && (
          <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
            {mistakes} mistake{mistakes !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
        Tap a component below to select it, then tap the correct disposal zone. Hazardous components must stay out of the general stream!
      </p>

      {/* Unplaced Components: Tap to select */}
      {unplaced.length > 0 && (
        <div style={{
          background: 'rgba(6, 26, 16, 0.85)',
          border: '1.5px solid rgba(74, 222, 128, 0.35)',
          borderRadius: '18px',
          padding: '1rem',
        }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#86efac', fontWeight: 700, marginBottom: '0.65rem' }}>
            CIRCUIT COMPONENTS (TAP TO SELECT):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {unplaced.map(comp => {
              const isSelected = selectedCompId === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedCompId(isSelected ? null : comp.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 0.95rem',
                    minHeight: '48px',
                    background: isSelected ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                    border: isSelected ? '2px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{comp.emoji}</span>
                  <span>{comp.name}</span>
                  {isSelected && <span style={{ color: '#4ade80', fontSize: '0.75rem' }}>● SELECTED</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Drop Zones (Single column on mobile) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {[
          { zone: 'hazardous', label: '⚠️ HAZARDOUS E-WASTE', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.4)' },
          { zone: 'recoverable', label: '♻️ RECOVERABLE METALS & PLASTIC', color: '#00d68f', bg: 'rgba(0, 214, 143, 0.12)', border: 'rgba(0, 214, 143, 0.4)' },
        ].map(z => {
          const placedHere = CIRCUIT_COMPONENTS.filter(c => placements[c.id] === z.zone);
          return (
            <div
              key={z.zone}
              onClick={() => selectedCompId && handlePlace(selectedCompId, z.zone)}
              style={{
                background: z.bg,
                border: `2px dashed ${selectedCompId ? z.color : z.border}`,
                borderRadius: '18px',
                padding: '1rem',
                minHeight: '110px',
                cursor: selectedCompId ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                fontWeight: 800,
                color: z.color,
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>{z.label}</span>
                {selectedCompId && <span style={{ fontSize: '0.75rem', textDecoration: 'underline' }}>TAP HERE TO PLACE</span>}
              </div>

              {/* Placed badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {placedHere.map(comp => (
                  <div
                    key={comp.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.75rem',
                      background: 'rgba(0,0,0,0.5)',
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      color: '#ffffff',
                      border: `1px solid ${comp.category === z.zone ? '#00d68f' : '#ef4444'}`,
                    }}
                  >
                    <span>{comp.emoji}</span>
                    <span>{comp.name}</span>
                    <span>{comp.category === z.zone ? '✅' : '❌'}</span>
                  </div>
                ))}
                {placedHere.length === 0 && (
                  <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    No components placed yet
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: '14px',
          background: feedback.correct ? 'rgba(0, 214, 143, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1.5px solid ${feedback.correct ? '#00d68f' : '#ef4444'}`,
          fontSize: '0.875rem',
          color: feedback.correct ? '#00d68f' : '#fca5a5',
          lineHeight: 1.45,
        }}>
          {feedback.msg}
        </div>
      )}

      {/* Solve button */}
      {allDone && (
        <button
          className="btn btn-primary"
          onClick={onSolve}
          id="circuit-solve-btn"
          style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
        >
          CLAIM CIRCUIT CLUE (+100 PTS) →
        </button>
      )}
    </div>
  );
}
