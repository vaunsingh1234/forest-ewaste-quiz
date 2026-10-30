import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, X, Shield, Eye } from 'lucide-react';

const HAZARDS = [
  {
    id: 'burning',
    title: 'Open Burning',
    emoji: '🔥',
    description: 'Cables and plastics being burned openly to recover copper and aluminum wiring.',
    danger: 'Releases airborne dioxins and furans — highly carcinogenic persistent organic pollutants.',
    x: 18, y: 25,
  },
  {
    id: 'dismantling',
    title: 'Unsafe Dismantling',
    emoji: '⚒️',
    description: 'Workers shattering heavy CRT monitors and glass tubes with blunt hammers.',
    danger: 'CRT tubes contain 4-8 lbs of toxic lead. Glass implosion causes severe inhalation of lead phosphor dust.',
    x: 72, y: 22,
  },
  {
    id: 'no-ppe',
    title: 'No Protective Equipment',
    emoji: '👷',
    description: 'No respirators, heavy leather gloves, or eye shields worn anywhere in the yard.',
    danger: 'Direct skin contact with battery acids, mercury fumes, and cadmium causes organ failure.',
    x: 48, y: 55,
  },
  {
    id: 'no-tracking',
    title: 'No Material Tracking',
    emoji: '📋',
    description: 'Zero manifests, undocumented waste transfers, and missing chain-of-custody logs.',
    danger: 'Toxic circuit boards and heavy metals get dumped indiscriminately into rural wetlands.',
    x: 80, y: 65,
  },
  {
    id: 'acid-baths',
    title: 'Acid Leaching Baths',
    emoji: '⚗️',
    description: 'Uncovered open vats of cyanide and nitric acid used to leach gold from circuit pins.',
    danger: 'Acid runoff percolates directly into local aquifers, poisoning drinking wells for miles.',
    x: 24, y: 76,
  },
];

export default function ScrapYard({ gameState, updateState, onComplete, navigate, completePuzzle }) {
  const [foundHazards, setFoundHazards] = useState(new Set());
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [showHazardSheet, setShowHazardSheet] = useState(false);
  const [routeChoice, setRouteChoice] = useState(null);
  const [showDecisionSheet, setShowDecisionSheet] = useState(false);
  const [lastRouteSubmission, setLastRouteSubmission] = useState(null);
  const [phase, setPhase] = useState('investigation'); // investigation | route | complete

  const allHazardsFound = foundHazards.size >= HAZARDS.length;

  const handleHazardClick = (hazard) => {
    setSelectedHazard(hazard);
    setShowHazardSheet(true);

    if (!foundHazards.has(hazard.id)) {
      const newFound = new Set(foundHazards);
      newFound.add(hazard.id);
      setFoundHazards(newFound);
      updateState(prev => ({
        ...prev,
        hazardsFound: newFound.size,
        score: prev.score + 25,
      }));
    }
  };

  const handleSelectRouteOption = (optionId) => {
    setRouteChoice(optionId);
    const isCorrect = optionId === 'option-b';
    setLastRouteSubmission({
      optionId,
      isCorrect,
    });
    setShowDecisionSheet(true);

    if (isCorrect) {
      completePuzzle('scrap-yard');
      updateState(prev => ({ ...prev, score: prev.score + 100 }));
    }
  };

  const handleCloseDecisionSheet = () => {
    setShowDecisionSheet(false);
  };

  return (
    <div className="page-enter scrap-yard-page" style={{
      minHeight: '100dvh',
      padding: 'calc(var(--safe-top, 0px) + 0.75rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 1.5rem)',
      background: 'radial-gradient(ellipse at top, #231109 0%, #0a0402 85%)',
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
              <div className="data-label" style={{ color: '#ef4444', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                LOCATION 04
              </div>
              <h1 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', margin: 0, fontWeight: 800 }}>
                ⚠️ SCRAP YARD
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-red" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>DANGER ZONE</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#fca5a5' }}>
              {foundHazards.size}/{HAZARDS.length} found
            </span>
          </div>
        </div>

        {phase === 'investigation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Warning Alert Banner */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1.5px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '20px',
              padding: '1.15rem',
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'center',
            }}>
              <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0 }} />
              <p style={{ color: '#fca5a5', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
                You have infiltrated an unregulated informal scrap facility. <strong>Tap all 5 pulsing warning beacons</strong> on the map below to log violations!
              </p>
            </div>

            {/* Interactive Scene Map with >= 44px Hotspot Buttons */}
            <div style={{
              background: 'rgba(30, 15, 10, 0.75)',
              border: '1.5px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '20px',
              padding: '1.15rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div className="data-label" style={{ color: '#fca5a5', fontSize: '0.75rem' }}>
                  SURVEILLANCE SECTOR — TAP HOTSPOTS
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#4ade80' }}>
                  +25 PTS PER HAZARD
                </div>
              </div>

              {/* Map container with positioned >= 48px touch hotspots */}
              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#150a06',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
              }}>
                {/* SVG Visual Background */}
                <svg viewBox="0 0 100 90" style={{ width: '100%', display: 'block', pointerEvents: 'none' }}>
                  <rect width="100" height="90" fill="#1e0f0a" />
                  <rect x="0" y="68" width="100" height="22" fill="#382114" />
                  {/* Scrap piles */}
                  <ellipse cx="20" cy="70" rx="16" ry="7" fill="#4d2f1b" />
                  <ellipse cx="55" cy="72" rx="20" ry="6" fill="#432817" />
                  <ellipse cx="82" cy="71" rx="14" ry="6" fill="#4d2f1b" />
                  {/* Smoke and flames */}
                  <circle cx="18" cy="22" r="7" fill="rgba(120,120,120,0.25)" />
                  <circle cx="17" cy="14" r="6" fill="rgba(100,100,100,0.2)" />
                  <circle cx="19" cy="7" r="4.5" fill="rgba(80,80,80,0.15)" />
                  <ellipse cx="18" cy="28" rx="5" ry="2.5" fill="rgba(255,100,0,0.6)" />
                  {/* Oil & acid barrels */}
                  <rect x="62" y="48" width="7" height="11" fill="#5c381f" rx="1" />
                  <rect x="71" y="50" width="7" height="9" fill="#5c381f" rx="1" />
                  {/* Worker silhouette */}
                  <circle cx="48" cy="52" r="3.5" fill="#4a2916" />
                  <rect x="45.5" cy="55.5" width="5" height="9" fill="#4a2916" rx="1" />
                  {/* Acid pool */}
                  <ellipse cx="26" cy="78" rx="11" ry="3.5" fill="rgba(180,220,0,0.3)" />
                </svg>

                {/* Overlaid Tappable Hotspots (Exactly >= 48px Touch Targets) */}
                {HAZARDS.map(hazard => {
                  const isFound = foundHazards.has(hazard.id);
                  return (
                    <button
                      key={hazard.id}
                      onClick={() => handleHazardClick(hazard)}
                      aria-label={hazard.title}
                      style={{
                        position: 'absolute',
                        left: `${hazard.x}%`,
                        top: `${hazard.y}%`,
                        transform: 'translate(-50%, -50%)',
                        minWidth: '48px',
                        minHeight: '48px',
                        width: '48px',
                        height: '48px',
                        padding: 0,
                        border: isFound ? '2px solid #00d68f' : '2px solid #ef4444',
                        borderRadius: '50%',
                        background: isFound ? 'rgba(0, 214, 143, 0.4)' : 'rgba(239, 68, 68, 0.35)',
                        backdropFilter: 'blur(4px)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        boxShadow: isFound
                          ? '0 0 14px rgba(0,214,143,0.6)'
                          : '0 0 16px rgba(239,68,68,0.8)',
                        animation: isFound ? 'none' : 'pulse 1.8s infinite',
                        zIndex: 10,
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <span>{isFound ? '✓' : hazard.emoji}</span>
                    </button>
                  );
                })}
              </div>

              {/* All Found Banner */}
              {allHazardsFound && (
                <div style={{
                  marginTop: '1.15rem',
                  padding: '1rem',
                  background: 'rgba(0, 214, 143, 0.12)',
                  border: '1.5px solid #00d68f',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={20} color="#00d68f" />
                    <span style={{ color: '#00d68f', fontWeight: 800, fontSize: '0.9375rem' }}>
                      All 5 Critical Hazards Logged! (+125 pts)
                    </span>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                    Surveillance evidence confirmed hazardous pollution and unshielded worker exposure. Formulate an intervention decision.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setPhase('route')}
                    style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
                  >
                    PROCEED TO ACTION DECISION <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* 1-Column Violation Log */}
            <div style={{
              background: 'rgba(30, 15, 10, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}>
              <div className="data-label" style={{ color: '#fca5a5', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                VIOLATION EVIDENCE ARCHIVE — {foundHazards.size}/{HAZARDS.length} SECURED
              </div>

              {HAZARDS.map(hazard => {
                const isFound = foundHazards.has(hazard.id);
                return (
                  <div
                    key={hazard.id}
                    onClick={() => isFound && handleHazardClick(hazard)}
                    style={{
                      background: isFound ? 'rgba(239, 68, 68, 0.09)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1.5px solid ${isFound ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255, 255, 255, 0.06)'}`,
                      borderRadius: '14px',
                      padding: '0.85rem 1rem',
                      opacity: isFound ? 1 : 0.6,
                      cursor: isFound ? 'pointer' : 'default',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '1.3rem' }}>{hazard.emoji}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#ffffff' }}>{hazard.title}</span>
                      </div>
                      {isFound ? (
                        <span className="badge badge-red" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>DOCUMENTED</span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>UNDETECTED</span>
                      )}
                    </div>
                    {isFound && (
                      <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.875rem', color: '#fca5a5', lineHeight: 1.5 }}>
                        ⚠️ {hazard.danger}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Phase: Route / Scenario Decision */}
        {phase === 'route' && (
          <div style={{
            background: 'rgba(30, 15, 10, 0.75)',
            border: '1.5px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '20px',
            padding: '1.25rem',
          }}>
            <div className="data-label" style={{ color: '#00d68f', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
              CRITICAL INTERVENTION DECISION
            </div>
            <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.75rem 0', fontWeight: 800 }}>
              MAKE YOUR MANAGEMENT CHOICE
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
              Dismantling toxic hardware with bare hands and open acid pools severely harms workers and soils. <strong>What action must Nova City enforce for this stockpiled e-waste?</strong>
            </p>

            {/* 4 Large Full-Width Option Buttons (>= 54px) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  id: 'option-a',
                  label: 'A. Leave it at the scrap yard since materials are eventually reclaimed',
                  correct: false,
                },
                {
                  id: 'option-b',
                  label: 'B. Reroute all devices to a verified certified e-waste recycling plant',
                  correct: true,
                },
                {
                  id: 'option-c',
                  label: 'C. Mix remaining scrap with regular household waste bins',
                  correct: false,
                },
                {
                  id: 'option-d',
                  label: 'D. Torch the remaining heaps with incinerators to shrink volume',
                  correct: false,
                },
              ].map(opt => {
                const isSelected = routeChoice === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectRouteOption(opt.id)}
                    style={{
                      width: '100%',
                      minHeight: '56px',
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
                        {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0a0402' }} />}
                      </div>
                      <span>{opt.label}</span>
                    </div>
                    <ChevronRight size={18} color="#64748b" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Phase: Complete Screen */}
        {phase === 'complete' && (
          <div style={{
            background: 'rgba(30, 15, 10, 0.75)',
            border: '1.5px solid #00d68f',
            borderRadius: '20px',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🔒</div>
            <h2 style={{ color: '#00d68f', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800 }}>
              Scrap Yard Zone Secured!
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
              All {HAZARDS.length} hazards documented. Informal burning halted, and material streams rerouted to certified processors. Final zone unlocked: Recycling Center!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '0.85rem 0.5rem' }}>
                <div className="data-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>VIOLATIONS</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>
                  {HAZARDS.length}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '0.85rem 0.5rem' }}>
                <div className="data-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>STATUS</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: '#00d68f' }}>
                  FLAGGED
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '0.85rem 0.5rem' }}>
                <div className="data-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>ZONE BONUS</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: '#00d68f' }}>
                  +140 pts
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={onComplete}
              style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
            >
              ADVANCE TO RECYCLING CENTER <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>

      {/* Hazard Inspection Modal / Bottom Sheet */}
      {showHazardSheet && selectedHazard && createPortal(
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
          <div style={{ flex: 1 }} onClick={() => setShowHazardSheet(false)} />
          <div style={{
            background: '#190a05',
            borderTop: '2px solid #ef4444',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '1.25rem 1rem calc(var(--safe-bottom, 0px) + 1.25rem)',
            maxHeight: '80dvh',
            overflowY: 'auto',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
          }}>
            <div style={{ width: '40px', height: '4px', background: '#334155', borderRadius: '2px', margin: '0 auto 1rem' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '2rem' }}>{selectedHazard.emoji}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ef4444', fontWeight: 800 }}>
                    {selectedHazard.title}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#00d68f', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    VIOLATION RECORDED (+25 PTS)
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowHazardSheet(false)}
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

            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '14px', padding: '1rem', marginBottom: '1rem' }}>
              <div className="data-label" style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.35rem' }}>OBSERVED PRACTICE</div>
              <p style={{ margin: 0, color: '#f0fdf4', fontSize: '0.875rem', lineHeight: 1.5 }}>
                {selectedHazard.description}
              </p>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '14px', padding: '1rem', marginBottom: '1.25rem' }}>
              <div className="data-label" style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '0.35rem' }}>ENVIRONMENTAL & HEALTH THREAT</div>
              <p style={{ margin: 0, color: '#fca5a5', fontSize: '0.875rem', lineHeight: 1.5 }}>
                ⚠️ {selectedHazard.danger}
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowHazardSheet(false)}
              style={{ width: '100%', minHeight: '48px', fontSize: '0.9375rem', fontWeight: 700 }}
            >
              CONTINUE INVESTIGATION →
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Decision Explanation Bottom Sheet */}
      {showDecisionSheet && lastRouteSubmission && createPortal(
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
          <div style={{ flex: 1 }} onClick={handleCloseDecisionSheet} />

          <div style={{
            background: '#190a05',
            borderTop: `2px solid ${lastRouteSubmission.isCorrect ? '#00d68f' : '#ef4444'}`,
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
                <span style={{ fontSize: '1.75rem' }}>{lastRouteSubmission.isCorrect ? '✅' : '❌'}</span>
                <div>
                  <h3 style={{
                    fontSize: '1.15rem',
                    margin: 0,
                    fontWeight: 800,
                    color: lastRouteSubmission.isCorrect ? '#00d68f' : '#ef4444',
                  }}>
                    {lastRouteSubmission.isCorrect ? 'Certified Protocol Enforced!' : 'Hazardous Decision!'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: lastRouteSubmission.isCorrect ? '#00d68f' : '#ef4444' }}>
                    {lastRouteSubmission.isCorrect ? '+100 EXP AWARDED' : 'UNACCEPTABLE OUTCOME'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseDecisionSheet}
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
              background: lastRouteSubmission.isCorrect ? 'rgba(0, 214, 143, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1.5px solid ${lastRouteSubmission.isCorrect ? 'rgba(0, 214, 143, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.25rem',
            }}>
              <p style={{ color: '#f0fdf4', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                {lastRouteSubmission.isCorrect
                  ? 'Authorized certified e-waste facilities utilize closed-loop air scrubbers, HEPA dust collectors, sealed acid recovery systems, and automated optical sorters. Heavy metals are contained and recycled without threatening human life.'
                  : 'Leaving scrap or burning heaps releases toxic dioxins into the atmosphere and leaches heavy metals into drinking water. Certified industrial recycling is the only lawful path.'}
              </p>
            </div>

            {lastRouteSubmission.isCorrect ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleCloseDecisionSheet();
                  setPhase('complete');
                }}
                style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
              >
                SECURE ZONE (+100 PTS) →
              </button>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={handleCloseDecisionSheet}
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
