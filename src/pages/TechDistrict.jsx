import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { devices } from '../data/devices';

const DECISION_LABELS = {
  repair: { label: 'REPAIR', color: 'var(--accent-green)', desc: 'Fix and continue using' },
  reuse: { label: 'REUSE / DONATE', color: 'var(--accent-blue)', desc: 'Give to another user' },
  recycle: { label: 'RECYCLE', color: 'var(--accent-amber)', desc: 'Send to authorized e-waste' },
  garbage: { label: 'REGULAR GARBAGE', color: 'var(--accent-red)', desc: 'Throw in normal bin' },
};

export default function TechDistrict({ gameState, recordDecision, markDeviceInspected, completePuzzle, onComplete, navigate, addEasterEgg }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [phase, setPhase] = useState('scene'); // scene | inspect | decision | result | puzzle
  const [decisionResult, setDecisionResult] = useState(null);
  const [completedDevices, setCompletedDevices] = useState({});
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(gameState.completedPuzzles.includes('circuit-puzzle'));

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
    setPhase('result');
    setCompletedDevices(prev => ({ ...prev, [selectedDevice.id]: { choice, correct: result.correct } }));
  };

  const handleNext = () => {
    setSelectedDevice(null);
    setDecisionResult(null);
    setPhase('scene');
  };

  const hazardColors = { red: 'var(--accent-red)', amber: 'var(--accent-amber)', green: 'var(--accent-green)' };

  return (
    <div className="page-enter" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('map')} style={{ gap: '0.25rem' }}>
            <ChevronLeft size={14} /> MAP
          </button>
          <div>
            <div className="data-label">LOCATION 01</div>
            <h1 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              🏢 TECH DISTRICT
            </h1>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-red">CRITICAL</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {Object.keys(completedDevices).length}/{techDevices.length} devices
            </span>
          </div>
        </div>

        {/* Scene */}
        {phase === 'scene' && !showPuzzle && (
          <div>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="status-dot status-dot-red" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  ACTIVE INVESTIGATION SCENE — TECH DISTRICT
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                Multiple electronic devices have been found abandoned in this commercial zone. 
                Click each device to inspect it and make a responsible disposal decision.
              </p>

              {/* Device Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '1rem',
              }}>
                {techDevices.map(device => {
                  const done = completedDevices[device.id];
                  const doneData = done;
                  return (
                    <div
                      key={device.id}
                      onClick={() => !done && handleDeviceClick(device)}
                      style={{
                        background: done
                          ? done.correct ? 'rgba(0,214,143,0.08)' : 'rgba(239,68,68,0.08)'
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${done
                          ? done.correct ? 'rgba(0,214,143,0.3)' : 'rgba(239,68,68,0.3)'
                          : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem 1rem',
                        textAlign: 'center',
                        cursor: done ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative',
                        animation: !done ? 'glow-pulse 3s ease-in-out infinite' : 'none',
                      }}
                      onMouseEnter={e => { if (!done) e.currentTarget.style.borderColor = 'var(--accent-green)'; }}
                      onMouseLeave={e => { if (!done) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                      tabIndex={done ? -1 : 0}
                      role="button"
                      aria-label={`Inspect ${device.name}`}
                      onKeyDown={e => e.key === 'Enter' && !done && handleDeviceClick(device)}
                    >
                      {done && (
                        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                          {done.correct
                            ? <CheckCircle size={14} color="var(--accent-green)" />
                            : <X size={14} color="var(--accent-red)" />
                          }
                        </div>
                      )}
                      <div style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>{device.emoji}</div>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: done ? 'var(--text-secondary)' : 'var(--text-primary)',
                        lineHeight: 1.3,
                      }}>
                        {device.name}
                      </div>
                      {!done && (
                        <div style={{
                          marginTop: '0.5rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          color: 'var(--accent-green)',
                          letterSpacing: '0.05em',
                        }}>
                          CLICK TO INSPECT
                        </div>
                      )}
                      {done && (
                        <div style={{
                          marginTop: '0.5rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          color: done.correct ? 'var(--accent-green)' : 'var(--accent-red)',
                          textTransform: 'uppercase',
                        }}>
                          {DECISION_LABELS[done.choice]?.label}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Puzzle & Complete section */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Circuit Puzzle */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div className="card" style={{
                  border: puzzleSolved ? '1px solid rgba(0,214,143,0.3)' : '1px solid var(--border-card)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '1.5rem' }}>⚡</div>
                    <div>
                      <div className="data-label" style={{ marginBottom: '2px' }}>PUZZLE 01</div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>THE BROKEN CIRCUIT</h3>
                    </div>
                    {puzzleSolved && <span className="badge badge-green" style={{ marginLeft: 'auto' }}>SOLVED</span>}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                    Identify which components must NOT be disposed of with regular waste.
                  </p>
                  <button
                    className={puzzleSolved ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
                    onClick={() => setShowPuzzle(true)}
                  >
                    {puzzleSolved ? 'Review Puzzle' : 'START PUZZLE'}
                  </button>
                </div>
              </div>

              {/* Complete Button */}
              {allDevicesDone && puzzleSolved && (
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div className="card" style={{ border: '1px solid rgba(0,214,143,0.3)', background: 'rgba(0,214,143,0.05)' }}>
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-green)' }}>✅ Zone Clear</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      All devices inspected and circuit puzzle solved. Residential Block is now accessible.
                    </p>
                    <button className="btn btn-primary" onClick={onComplete}>
                      ADVANCE TO NEXT ZONE <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
              {allDevicesDone && !puzzleSolved && (
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div className="card" style={{ border: '1px solid rgba(245,158,11,0.3)' }}>
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-amber)' }}>⚡ Complete the Puzzle</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      All devices inspected. Solve the circuit puzzle to unlock the next zone.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
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

        {/* Inspect Panel */}
        {phase === 'inspect' && selectedDevice && (
          <InspectPanel device={selectedDevice} onDecide={() => setPhase('decision')} onBack={handleNext} />
        )}

        {/* Decision Panel */}
        {phase === 'decision' && selectedDevice && (
          <DecisionPanel device={selectedDevice} onDecision={handleDecision} onBack={() => setPhase('inspect')} />
        )}

        {/* Result Panel */}
        {phase === 'result' && selectedDevice && decisionResult && (
          <ResultPanel device={selectedDevice} result={decisionResult} onNext={handleNext} />
        )}
      </div>
    </div>
  );
}

function InspectPanel({ device, onDecide, onBack }) {
  const hazardColors = { red: 'var(--accent-red)', amber: 'var(--accent-amber)', green: 'var(--accent-green)' };

  return (
    <div className="animate-fadeUp">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          <ChevronLeft size={14} /> BACK
        </button>
        <span className="data-label">DEVICE SCAN — {device.name.toUpperCase()}</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
      }}>
        {/* Device visualization */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }} className="scanline">
          <div style={{ fontSize: '6rem', animation: 'float 4s ease-in-out infinite' }}>
            {device.emoji}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.375rem', marginBottom: '0.25rem' }}>{device.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{device.description}</p>
          </div>
        </div>

        {/* Scan data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Status indicators */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
          }}>
            <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              DEVICE SCAN RESULTS
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
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--border-subtle)',
                gap: '1rem',
              }}>
                <span className="data-label">{item.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-primary)', textAlign: 'right' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Materials & Additional Clue */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div>
              <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
                MATERIALS DETECTED
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {device.materials.map(m => (
                  <span key={m} style={{
                    padding: '2px 10px',
                    background: 'rgba(0,180,216,0.08)',
                    border: '1px solid rgba(0,180,216,0.2)',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    color: 'var(--accent-blue)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Clue (Raw Factual Observation) */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(0,214,143,0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.875rem 1rem',
            }}>
              <div className="data-label" style={{ marginBottom: '0.375rem', color: 'var(--accent-green)' }}>
                🔍 ADDITIONAL CLUE
              </div>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                color: 'var(--text-primary)',
                lineHeight: 1.5,
              }}>
                "{device.additionalClue || 'No additional abnormalities detected.'}"
              </p>
            </div>
          </div>

          <button className="btn btn-primary" onClick={onDecide} style={{ marginTop: 'auto' }}>
            MAKE DISPOSAL DECISION <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .inspect-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function DecisionPanel({ device, onDecision, onBack }) {
  const decisions = [
    { key: 'repair', icon: '🔧', label: 'REPAIR', desc: 'Fix and extend the device\'s useful life', color: 'var(--accent-green)' },
    { key: 'reuse', icon: '🤝', label: 'REUSE / DONATE', desc: 'Give to another user who can use it', color: 'var(--accent-blue)' },
    { key: 'recycle', icon: '♻️', label: 'AUTHORIZED RECYCLING', desc: 'Send to certified e-waste processing', color: 'var(--accent-amber)' },
    { key: 'garbage', icon: '🗑️', label: 'REGULAR GARBAGE', desc: 'Dispose in household trash bin', color: 'var(--accent-red)' },
  ];

  return (
    <div className="animate-fadeUp">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          <ChevronLeft size={14} /> BACK
        </button>
        <div>
          <div className="data-label">DECISION REQUIRED</div>
          <h2 style={{ fontSize: '1.125rem' }}>What should be done with the {device.name}?</h2>
        </div>
      </div>

      {/* Pip's Kid-Friendly Guide Prompt */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1.5px solid rgba(74, 222, 128, 0.35)',
        borderRadius: '18px',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid #4ade80',
          boxShadow: '0 0 10px rgba(74, 222, 128, 0.4)',
          flexShrink: 0,
        }}>
          <img src="/avatars/frog_avatar.jpg" alt="Pip" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4ade80', letterSpacing: '0.04em' }}>
            Pip's Eco-Cadet Clue 🌱
          </div>
          <div style={{ fontSize: '0.84rem', color: '#f0fdf4', lineHeight: 1.45 }}>
            "Can this gadget be fixed or donated? If it's too broken, send it to certified recycling! Never pick regular garbage!"
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}>
        {decisions.map(d => (
          <button
            key={d.key}
            onClick={() => onDecision(d.key)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem 1.5rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = d.color;
              e.currentTarget.style.background = `${d.color}10`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-card)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
            id={`decision-${d.key}-btn`}
          >
            <div style={{ fontSize: '2rem' }}>{d.icon}</div>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: d.color,
                letterSpacing: '0.05em',
                marginBottom: '0.375rem',
              }}>
                {d.label}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {d.desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultPanel({ device, result, onNext }) {
  const { choice, result: resultData } = result;
  const isCorrect = resultData.correct;

  const impactItems = [
    { label: 'Eco Impact', value: resultData.ecoImpact, format: v => (v >= 0 ? '+' : '') + v },
    { label: 'Resource Recovery', value: resultData.resourceRecovery, format: v => (v >= 0 ? '+' : '') + v },
    { label: 'City Risk', value: resultData.cityRisk, format: v => (v >= 0 ? '+' : '') + v },
    { label: 'Score', value: resultData.score, format: v => '+' + v + ' pts' },
  ];

  return (
    <div className="animate-scaleIn">
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'var(--bg-card)',
        border: `1px solid ${isCorrect ? 'rgba(0,214,143,0.3)' : 'rgba(239,68,68,0.3)'}`,
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
      }}>
        {/* Result header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: '2.5rem' }}>
            {isCorrect ? '✅' : '❌'}
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: isCorrect ? 'var(--accent-green)' : 'var(--accent-red)',
              letterSpacing: '0.1em',
              marginBottom: '0.25rem',
            }}>
              {isCorrect ? 'CORRECT DECISION' : 'POOR DECISION'}
            </div>
            <h2 style={{ fontSize: '1.125rem' }}>
              {device.name} → {DECISION_LABELS[choice]?.label}
            </h2>
          </div>
          <div style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: isCorrect ? 'var(--accent-green)' : 'var(--accent-red)',
          }}>
            +{resultData.score}
          </div>
        </div>

        {/* Feedback */}
        <p style={{ color: 'var(--text-primary)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1rem' }}>
          {resultData.feedback}
        </p>

        {/* Pip's Reaction Banner */}
        <div style={{
          background: isCorrect ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.1)',
          border: `1.5px solid ${isCorrect ? 'rgba(74, 222, 128, 0.35)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: '16px',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <span style={{ fontSize: '1.5rem' }}>{isCorrect ? '🎉' : '🌱'}</span>
          <div style={{ fontSize: '0.82rem', color: isCorrect ? '#86efac' : '#fca5a5', lineHeight: 1.45 }}>
            {isCorrect
              ? 'Pip says: "Fantastic job, Cadet! You prevented battery acids from hurting our soil and reclaimed valuable materials!"'
              : 'Pip says: "Don\'t worry! Even master rangers make mistakes. Remember: electronics always need special green bins!"'}
          </div>
        </div>

        {/* Revealed Post-Decision Analysis */}
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          textAlign: 'center',
        }}>
          <div>
            <div className="data-label" style={{ marginBottom: '4px' }}>Hazard Level</div>
            <span className={`badge badge-${device.hazardColor}`}>{device.hazardLevel}</span>
          </div>
          <div>
            <div className="data-label" style={{ marginBottom: '4px' }}>Recovery Value</div>
            <span className="badge badge-green">{device.recoveryValue}</span>
          </div>
          <div>
            <div className="data-label" style={{ marginBottom: '4px' }}>Repairability</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
              {device.repairability}%
            </span>
          </div>
        </div>

        {/* Impact grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}>
          {impactItems.map(item => {
            const isPositiveGood = item.label !== 'City Risk';
            const isGood = isPositiveGood ? item.value > 0 : item.value < 0;
            const color = isGood ? 'var(--accent-green)' : item.value === 0 ? 'var(--text-muted)' : 'var(--accent-red)';
            return (
              <div key={item.label} style={{
                textAlign: 'center',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}>
                <div className="data-label" style={{ marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color, fontSize: '1rem' }}>
                  {item.format(item.value)}
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn btn-primary w-full" onClick={onNext}>
          CONTINUE INVESTIGATION <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// Circuit Puzzle Component
const CIRCUIT_COMPONENTS = [
  { id: 'battery', name: 'Battery', emoji: '🔋', category: 'hazardous', reason: 'Contains lithium, cobalt — fire/chemical hazard' },
  { id: 'pcb', name: 'Circuit Board (PCB)', emoji: '🟢', category: 'hazardous', reason: 'Contains lead solder and flame retardants' },
  { id: 'capacitor', name: 'Capacitor', emoji: '⚫', category: 'hazardous', reason: 'Stores charge, contains electrolytes — hazardous' },
  { id: 'copper', name: 'Copper Wire', emoji: '🟠', category: 'recoverable', reason: 'Pure copper — highly recoverable material' },
  { id: 'plastic', name: 'Plastic Casing', emoji: '⬜', category: 'recoverable', reason: 'Recyclable plastics — goes to plastic stream' },
];

function CircuitPuzzle({ onSolve, onClose, solved }) {
  const [placements, setPlacements] = useState({});
  const [dragOver, setDragOver] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [mistakes, setMistakes] = useState(0);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('componentId', id);
  };

  const handleDrop = (e, zone) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('componentId');
    const component = CIRCUIT_COMPONENTS.find(c => c.id === id);
    if (!component) return;

    const correct = component.category === zone;
    setPlacements(prev => ({ ...prev, [id]: zone }));
    setDragOver(null);

    if (!correct) {
      setMistakes(prev => prev + 1);
      setFeedback({ correct: false, msg: `Hint: ${component.reason}` });
      setTimeout(() => setFeedback(null), 2500);
    } else {
      const newPlacements = { ...placements, [id]: zone };
      const allCorrect = CIRCUIT_COMPONENTS.every(c => newPlacements[c.id] === c.category);
      if (allCorrect) {
        setFeedback({ correct: true, msg: 'All components correctly sorted! Clue unlocked.' });
      }
    }
  };

  const unplaced = CIRCUIT_COMPONENTS.filter(c => !placements[c.id]);
  const allDone = CIRCUIT_COMPONENTS.every(c => placements[c.id] === c.category);

  return (
    <div className="animate-fadeUp">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>
          <ChevronLeft size={14} /> BACK
        </button>
        <div>
          <div className="data-label">ESCAPE ROOM PUZZLE 01</div>
          <h2 style={{ fontSize: '1.25rem' }}>⚡ THE BROKEN CIRCUIT</h2>
        </div>
        {mistakes > 0 && (
          <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>
            {mistakes} mistake{mistakes !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
        Drag each component into the correct disposal zone. 
        Identify which components are <strong style={{ color: 'var(--accent-red)' }}>hazardous</strong> and which are <strong style={{ color: 'var(--accent-green)' }}>recoverable materials</strong>.
      </p>

      {/* Unplaced components */}
      {unplaced.length > 0 && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.1em' }}>
            CIRCUIT COMPONENTS — DRAG TO SORT
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {unplaced.map(comp => (
              <div
                key={comp.id}
                draggable
                onDragStart={e => handleDragStart(e, comp.id)}
                className="draggable"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.625rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'grab',
                  userSelect: 'none',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-card)'}
              >
                <span style={{ fontSize: '1.25rem' }}>{comp.emoji}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{comp.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drop zones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { zone: 'hazardous', label: '⚠️ HAZARDOUS E-WASTE', color: 'var(--accent-red)', bg: 'rgba(239,68,68,0.06)' },
          { zone: 'recoverable', label: '♻️ RECOVERABLE MATERIALS', color: 'var(--accent-green)', bg: 'rgba(0,214,143,0.06)' },
        ].map(({ zone, label, color, bg }) => {
          const zoneItems = CIRCUIT_COMPONENTS.filter(c => placements[c.id] === zone);
          return (
            <div
              key={zone}
              onDragOver={e => { e.preventDefault(); setDragOver(zone); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(e, zone)}
              style={{
                background: dragOver === zone ? `${bg}` : 'var(--bg-card)',
                border: `2px dashed ${dragOver === zone ? color : 'var(--border-card)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem',
                minHeight: '160px',
                transition: 'all 0.15s',
              }}
            >
              <h3 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color,
                letterSpacing: '0.1em',
                marginBottom: '1rem',
              }}>
                {label}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {zoneItems.map(comp => {
                  const correct = comp.category === zone;
                  return (
                    <div key={comp.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.875rem',
                      background: correct ? 'rgba(0,214,143,0.1)' : 'rgba(239,68,68,0.1)',
                      border: `1px solid ${correct ? 'rgba(0,214,143,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8125rem',
                    }}>
                      <span>{comp.emoji}</span>
                      <span>{comp.name}</span>
                      {correct ? <CheckCircle size={12} color="var(--accent-green)" /> : <X size={12} color="var(--accent-red)" />}
                    </div>
                  );
                })}
                {zoneItems.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontStyle: 'italic' }}>
                    Drop components here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div style={{
          padding: '1rem 1.25rem',
          background: feedback.correct ? 'rgba(0,214,143,0.08)' : 'rgba(245,158,11,0.08)',
          border: `1px solid ${feedback.correct ? 'rgba(0,214,143,0.3)' : 'rgba(245,158,11,0.3)'}`,
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1rem',
          animation: 'fadeIn 0.3s ease',
        }}>
          <p style={{
            color: feedback.correct ? 'var(--accent-green)' : 'var(--accent-amber)',
            fontSize: '0.9rem',
          }}>
            {feedback.msg}
          </p>
        </div>
      )}

      {allDone && (
        <div style={{
          padding: '1.25rem',
          background: 'rgba(0,214,143,0.08)',
          border: '1px solid rgba(0,214,143,0.3)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1rem',
        }}>
          <h3 style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }}>🎉 Puzzle Complete!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            All 5 components correctly classified. Electronic components contain both hazardous substances and valuable recoverable materials — which is why proper e-waste handling is critical.
          </p>
          <button className="btn btn-primary" onClick={onSolve}>
            CLAIM REWARD (+130 pts) <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Cheat sheet */}
      <div style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
          CLASSIFICATION GUIDE
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {CIRCUIT_COMPONENTS.map(comp => (
            <div key={comp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: placements[comp.id] ? 0.5 : 1 }}>
              <span style={{ fontSize: '1rem' }}>{comp.emoji}</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, minWidth: '160px' }}>{comp.name}</span>
              <span className={`badge badge-${comp.category === 'hazardous' ? 'red' : 'green'}`} style={{ fontSize: '0.625rem' }}>
                {comp.category.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comp.reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
