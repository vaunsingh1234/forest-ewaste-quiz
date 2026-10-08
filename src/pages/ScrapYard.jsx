import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, X } from 'lucide-react';

const HAZARDS = [
  {
    id: 'burning',
    title: 'Open Burning',
    emoji: '🔥',
    description: 'Cables and plastics being burned openly to recover metal.',
    danger: 'Releases dioxins and furans — highly carcinogenic air pollutants.',
    x: 15, y: 25,
  },
  {
    id: 'dismantling',
    title: 'Unsafe Dismantling',
    emoji: '⚒️',
    description: 'Workers dismantling CRT monitors with bare hands.',
    danger: 'CRT monitors contain 4-8 lbs of lead. Skin contact causes lead poisoning.',
    x: 65, y: 20,
  },
  {
    id: 'no-ppe',
    title: 'No Protective Equipment',
    emoji: '👷',
    description: 'No masks, gloves, or safety gear anywhere on site.',
    danger: 'Mercury vapor, lead dust, and acid fumes cause serious health damage.',
    x: 40, y: 60,
  },
  {
    id: 'no-tracking',
    title: 'No Material Tracking',
    emoji: '📋',
    description: 'No records, no manifests, no chain of custody.',
    danger: 'Hazardous materials can end up in uncontrolled dumps with no accountability.',
    x: 75, y: 65,
  },
  {
    id: 'acid-baths',
    title: 'Acid Processing',
    emoji: '⚗️',
    description: 'Acid baths used to extract gold without containment.',
    danger: 'Acid waste dumped into local soil and waterways, contaminating groundwater.',
    x: 25, y: 75,
  },
];

export default function ScrapYard({ gameState, updateState, onComplete, navigate, completePuzzle }) {
  const [foundHazards, setFoundHazards] = useState(new Set());
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [routeChoice, setRouteChoice] = useState(null);
  const [routeAnswered, setRouteAnswered] = useState(false);
  const [phase, setPhase] = useState('investigation'); // investigation | route | complete

  const allHazardsFound = foundHazards.size >= HAZARDS.length;

  const handleHazardClick = (hazard) => {
    setSelectedHazard(hazard);
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

  const handleRouteSubmit = () => {
    setRouteAnswered(true);
    if (routeChoice === 'option-b') {
      completePuzzle('scrap-yard');
      updateState(prev => ({ ...prev, score: prev.score + 100 }));
    }
  };

  return (
    <div className="page-enter" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('map')} style={{ gap: '0.25rem' }}>
            <ChevronLeft size={14} /> MAP
          </button>
          <div>
            <div className="data-label">LOCATION 04</div>
            <h1 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              ⚠️ SCRAP YARD
            </h1>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-red">DANGER ZONE</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {foundHazards.size}/{HAZARDS.length} hazards
            </span>
          </div>
        </div>

        {phase === 'investigation' && (
          <div>
            <div style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            }}>
              <AlertTriangle size={20} color="var(--accent-red)" />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                You've entered an unauthorized scrap yard. Multiple unsafe practices have been detected. 
                <strong style={{ color: 'var(--text-primary)' }}> Click on all warning signs</strong> to document the violations.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
              {/* Interactive Scene */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                position: 'relative',
              }}>
                <div className="data-label" style={{ marginBottom: '1rem' }}>UNAUTHORIZED SCRAP FACILITY — CLICK TO IDENTIFY HAZARDS</div>

                {/* Scrap yard visual */}
                <div style={{ position: 'relative', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <svg viewBox="0 0 100 90" style={{ width: '100%', display: 'block' }}>
                    {/* Background */}
                    <rect width="100" height="90" fill="rgba(30,15,10,0.8)"/>

                    {/* Ground */}
                    <rect x="0" y="70" width="100" height="20" fill="rgba(60,40,20,0.6)"/>

                    {/* Piles of scrap */}
                    <ellipse cx="20" cy="70" rx="15" ry="6" fill="rgba(80,60,40,0.8)"/>
                    <ellipse cx="55" cy="72" rx="18" ry="5" fill="rgba(60,50,30,0.8)"/>
                    <ellipse cx="82" cy="71" rx="12" ry="5" fill="rgba(70,55,35,0.8)"/>

                    {/* Smoke from burning */}
                    <circle cx="17" cy="22" r="6" fill="rgba(80,80,80,0.3)"/>
                    <circle cx="16" cy="14" r="5" fill="rgba(80,80,80,0.2)"/>
                    <circle cx="18" cy="7" r="4" fill="rgba(80,80,80,0.15)"/>

                    {/* Fire */}
                    <ellipse cx="17" cy="28" rx="4" ry="2" fill="rgba(255,100,0,0.6)"/>

                    {/* Barrels */}
                    <rect x="60" y="50" width="8" height="12" fill="rgba(80,60,20,0.8)" rx="1"/>
                    <rect x="70" y="52" width="8" height="10" fill="rgba(80,60,20,0.8)" rx="1"/>

                    {/* Worker silhouettes */}
                    <circle cx="42" cy="55" r="4" fill="rgba(60,40,20,0.8)"/>
                    <rect x="39" y="59" width="6" height="10" fill="rgba(60,40,20,0.8)" rx="1"/>

                    {/* Acid pool */}
                    <ellipse cx="27" cy="78" rx="10" ry="3" fill="rgba(180,200,0,0.3)"/>

                    {/* Hazard markers */}
                    {HAZARDS.map(hazard => {
                      const found = foundHazards.has(hazard.id);
                      return (
                        <g
                          key={hazard.id}
                          transform={`translate(${hazard.x}, ${hazard.y})`}
                          onClick={() => handleHazardClick(hazard)}
                          style={{ cursor: 'pointer' }}
                        >
                          {!found && (
                            <circle r="5" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.6)" strokeWidth="0.5">
                              <animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite"/>
                              <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
                            </circle>
                          )}
                          <text textAnchor="middle" dominantBaseline="central" style={{ fontSize: '4px', userSelect: 'none' }}>
                            {found ? '✓' : hazard.emoji}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {allHazardsFound && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(0,214,143,0.08)',
                    border: '1px solid rgba(0,214,143,0.2)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}>
                    <p style={{ color: 'var(--accent-green)', fontSize: '0.875rem' }}>
                      ✅ All {HAZARDS.length} hazards documented!
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={() => setPhase('route')}>
                      NEXT STEP <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Hazard log */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <div className="data-label" style={{ marginBottom: '0.25rem' }}>
                  VIOLATION LOG — {foundHazards.size}/{HAZARDS.length} FOUND
                </div>
                {HAZARDS.map(hazard => {
                  const found = foundHazards.has(hazard.id);
                  const isSelected = selectedHazard?.id === hazard.id;
                  return (
                    <div
                      key={hazard.id}
                      style={{
                        background: found ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${found ? 'rgba(239,68,68,0.3)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '0.875rem',
                        opacity: found ? 1 : 0.5,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: found ? '0.375rem' : 0 }}>
                        <span style={{ fontSize: '1.125rem' }}>{hazard.emoji}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{hazard.title}</span>
                        {found ? (
                          <CheckCircle size={14} color="var(--accent-red)" style={{ marginLeft: 'auto' }} />
                        ) : (
                          <span style={{ marginLeft: 'auto', fontSize: '0.625rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>UNDETECTED</span>
                        )}
                      </div>
                      {found && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--accent-red)', lineHeight: 1.5 }}>
                          ⚠️ {hazard.danger}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {phase === 'route' && (
          <div style={{ maxWidth: '640px' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              marginBottom: '1.5rem',
            }}>
              <div className="data-label" style={{ marginBottom: '0.5rem', color: 'var(--accent-green)' }}>DECISION REQUIRED</div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                MAKE YOUR DECISION
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                After inspecting the site, you discover that the e-waste is being dismantled without proper safety measures and there is no verified tracking of where the material goes.
                <br /><br />
                <strong>What should you do with the e-waste?</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                  {
                    id: 'option-a',
                    label: 'A. Leave it at the site because the devices can still be processed',
                    correct: false,
                  },
                  {
                    id: 'option-b',
                    label: 'B. Transfer it to a verified authorized e-waste recycling facility',
                    correct: true,
                  },
                  {
                    id: 'option-c',
                    label: 'C. Mix it with regular waste so it can be collected normally',
                    correct: false,
                  },
                  {
                    id: 'option-d',
                    label: 'D. Burn the remaining material to reduce the waste volume',
                    correct: false,
                  },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => !routeAnswered && setRouteChoice(opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.125rem 1.25rem',
                      background: routeChoice === opt.id ? 'rgba(0, 214, 143, 0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${routeChoice === opt.id ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-lg)',
                      cursor: routeAnswered ? 'default' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${routeChoice === opt.id ? 'var(--accent-green)' : 'var(--border-card)'}`,
                      background: routeChoice === opt.id ? 'var(--accent-green)' : 'transparent',
                      flexShrink: 0,
                    }} />
                    <span style={{ fontWeight: 500, fontSize: '0.90rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              {!routeAnswered && (
                <button
                  className="btn btn-primary"
                  onClick={handleRouteSubmit}
                  disabled={!routeChoice}
                  style={{ opacity: routeChoice ? 1 : 0.5 }}
                >
                  CONFIRM CHOICE
                </button>
              )}

              {routeAnswered && (
                <div style={{ animation: 'fadeUp 0.3s ease' }}>
                  <div style={{
                    padding: '1.25rem',
                    background: routeChoice === 'option-b' ? 'rgba(0,214,143,0.08)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${routeChoice === 'option-b' ? 'rgba(0,214,143,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '1rem',
                  }}>
                    <p style={{
                      color: routeChoice === 'option-b' ? 'var(--accent-green)' : 'var(--accent-red)',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                    }}>
                      {routeChoice === 'option-b' ? '✅ Correct!' : '❌ Wrong choice'}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                      {routeChoice === 'option-b'
                        ? 'Authorized recycling centers have proper equipment, trained workers, and environmental controls. They ensure materials are recovered safely and hazardous substances are contained.'
                        : 'Unauthorized processing is dangerous, illegal, and causes serious environmental harm. Always use certified e-waste collection channels.'}
                    </p>
                  </div>
                  <button className="btn btn-primary" onClick={() => setPhase('complete')}>
                    {routeChoice === 'option-b' ? 'SECURE ZONE (+100 pts)' : 'CONTINUE'} <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'complete' && (
          <div style={{ maxWidth: '560px' }}>
            <div style={{
              background: 'rgba(0,214,143,0.06)',
              border: '1px solid rgba(0,214,143,0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <h2 style={{ color: 'var(--accent-green)', marginBottom: '0.75rem' }}>Scrap Yard Secured</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {HAZARDS.length} violations documented. E-waste rerouted to authorized processing. 
                The site has been flagged for regulatory action. Recycling Center is now accessible.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', padding: '0.875rem' }}>
                  <div className="data-label" style={{ marginBottom: '4px' }}>Violations</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-red)' }}>{HAZARDS.length}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', padding: '0.875rem' }}>
                  <div className="data-label" style={{ marginBottom: '4px' }}>Hazards</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-amber)' }}>Identified</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', padding: '0.875rem' }}>
                  <div className="data-label" style={{ marginBottom: '4px' }}>Zone Bonus</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-green)' }}>+140 pts</div>
                </div>
              </div>
              <button className="btn btn-primary" onClick={onComplete}>
                ADVANCE TO RECYCLING CENTER <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
