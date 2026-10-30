import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, BarChart2, Award, ChevronRight, Check, ArrowRight } from 'lucide-react';

const RANK_DATA = [
  { rank: 'NOVA CITY E-WASTE HERO', min: 1200, color: '#f59e0b', icon: '🏆', desc: 'Exceptional e-waste awareness and decision-making. Nova City is safer because of you.' },
  { rank: 'CIRCULAR ECONOMY CHAMPION', min: 900, color: '#00d68f', icon: '🌿', desc: 'Outstanding environmental choices. You understand the full circular economy cycle.' },
  { rank: 'ECO INVESTIGATOR', min: 650, color: '#00b4d8', icon: '🔍', desc: 'Strong e-waste knowledge. A few areas to refine, but you are making real impact.' },
  { rank: 'RESOURCE SAVER', min: 400, color: '#8b5cf6', icon: '♻️', desc: 'Good awareness of e-waste issues. Keep learning and improving your decisions.' },
  { rank: 'E-WASTE ROOKIE', min: 0, color: '#8b9ab8', icon: '🎖️', desc: 'You have started your e-waste journey. Every correct decision counts.' },
];

function getRankData(score) {
  return RANK_DATA.find(r => score >= r.min) || RANK_DATA[RANK_DATA.length - 1];
}

function getProfileAnalysis(decisions) {
  if (!decisions || decisions.length === 0) return null;

  const repairCount = decisions.filter(d => d.choice === 'repair').length;
  const recycleCount = decisions.filter(d => d.choice === 'recycle').length;
  const badDecisions = decisions.filter(d => !d.correct).length;
  const garbageCount = decisions.filter(d => d.choice === 'garbage').length;

  let strongSkill = 'Making responsible device decisions';
  let improvArea = 'Continue improving your e-waste knowledge';
  let profile = 'BALANCED RESPONDER';

  if (repairCount >= 2) {
    strongSkill = 'Recognizing when devices can be repaired';
    profile = 'REPAIR ADVOCATE';
  } else if (recycleCount >= 2) {
    strongSkill = 'Directing devices to authorized recycling';
    profile = 'RECYCLING CHAMPION';
  }

  if (garbageCount >= 2) {
    improvArea = 'Avoiding regular garbage for electronic devices';
  } else if (badDecisions >= 3) {
    improvArea = 'Making more informed disposal decisions overall';
  } else {
    improvArea = 'Identifying battery hazards and data security requirements';
  }

  return { strongSkill, improvArea, profile };
}

export default function Results({ gameState, getRank, timer, navigate, onReset }) {
  const [animating, setAnimating] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [animScore, setAnimScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const [nameInput, setNameInput] = useState(gameState?.playerName || '');

  const rankData = getRankData(gameState?.score || 0);
  const profile = getProfileAnalysis(gameState?.decisions || []);

  const ecoColor = (gameState?.ecoImpact || 0) >= 0 ? '#00d68f' : '#ef4444';
  const riskColor = (gameState?.cityRisk || 50) > 70 ? '#ef4444' : (gameState?.cityRisk || 50) > 40 ? '#f59e0b' : '#00d68f';

  useEffect(() => {
    const target = gameState?.score || 0;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimScore(target);
        clearInterval(interval);
        setTimeout(() => { setAnimating(false); setShowDetails(true); }, 250);
      } else {
        setAnimScore(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [gameState?.score]);

  const saveToLeaderboard = () => {
    const name = nameInput.trim() || gameState?.playerName || 'Officer';
    const entry = {
      name,
      score: gameState?.score || 0,
      rank: rankData.rank,
      ecoImpact: gameState?.ecoImpact || 0,
      resourceRecovery: gameState?.resourceRecovery || 0,
      cityRisk: gameState?.cityRisk || 0,
      timeRemaining: gameState?.timeRemaining || 0,
      date: new Date().toLocaleDateString(),
      avatarImg: (gameState?.avatar && gameState?.avatar?.avatarImg) || '/avatars/frog_avatar.jpg',
      headgear: (gameState?.avatar && gameState?.avatar?.headgearName) || 'Emerald Frog Hat',
    };
    try {
      const existing = JSON.parse(localStorage.getItem('ewaste-leaderboard') || '[]');
      existing.push(entry);
      existing.sort((a, b) => b.score - a.score);
      localStorage.setItem('ewaste-leaderboard', JSON.stringify(existing.slice(0, 20)));
      setSaved(true);
    } catch (e) {
      console.error('Leaderboard save error:', e);
    }
  };

  return (
    <div className="page-enter results-page" style={{
      minHeight: '100dvh',
      padding: 'calc(var(--safe-top, 0px) + 0.75rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 2rem)',
      background: 'radial-gradient(ellipse at top, #14281f 0%, #041009 85%)',
      color: '#f0fdf4',
      overflowX: 'hidden',
    }}>
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto', padding: '0 0.25rem' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="data-label" style={{ color: '#00d68f', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            NOVA SANCTUARY AUDIT
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            margin: '0 0 0.35rem',
            color: '#ffffff',
          }}>
            E-WASTE IMPACT REPORT
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0 }}>
            Mission {gameState?.emergencyMode ? 'completed in emergency mode' : 'completed successfully'} — {gameState?.completedLocations?.length || 5}/5 zones secured
          </p>
        </div>

        {/* Circular Score Meter & Rank (Single Column) */}
        <div style={{
          background: 'rgba(6, 30, 18, 0.75)',
          border: '1.5px solid rgba(74, 222, 128, 0.25)',
          borderRadius: '24px',
          padding: '1.5rem 1rem',
          textAlign: 'center',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}>
          {/* Circular SVG Meter (Scales smoothly to container width) */}
          <div style={{ position: 'relative', width: '180px', height: '180px' }}>
            <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', display: 'block' }}>
              <circle
                cx="100" cy="100" r="85"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="14"
              />
              <circle
                cx="100" cy="100" r="85"
                fill="none"
                stroke={rankData.color}
                strokeWidth="14"
                strokeDasharray={`${2 * Math.PI * 85}`}
                strokeDashoffset={`${2 * Math.PI * 85 * (1 - Math.min(animScore / 1500, 1))}`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                style={{ transition: 'stroke-dashoffset 0.15s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 900,
                color: rankData.color,
                lineHeight: 1,
              }}>
                {animScore}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#94a3b8',
                letterSpacing: '0.1em',
                marginTop: '4px',
              }}>
                TOTAL SCORE
              </div>
            </div>
          </div>

          {/* Rank Badge */}
          {showDetails && (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <div style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>{rankData.icon}</div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: rankData.color,
                letterSpacing: '0.05em',
                margin: '0 0 0.35rem',
              }}>
                {rankData.rank}
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0, lineHeight: 1.5, maxWidth: '340px' }}>
                {rankData.desc}
              </p>
            </div>
          )}
        </div>

        {showDetails && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Pip's Graduation Diploma Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.18) 0%, rgba(16, 185, 129, 0.1) 100%)',
              border: '1.5px solid rgba(74, 222, 128, 0.4)',
              borderRadius: '20px',
              padding: '1.15rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #4ade80',
                flexShrink: 0,
              }}>
                <img src="/avatars/frog_avatar.jpg" alt="Pip" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#f0fdf4' }}>Pip's Eco-Officer Diploma 🎉</span>
                  <span className="badge badge-green" style={{ fontSize: '0.6875rem', padding: '2px 8px' }}>GRADUATE</span>
                </div>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#bbf7d0', lineHeight: 1.5 }}>
                  "Congratulations {gameState?.playerName || 'Cadet'}! You proved that conscious choices save trees, soil, and drinking water. Keep old gadgets out of regular trash!"
                </p>
              </div>
            </div>

            {/* Metrics Breakdown Grid (Single Column Cards) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
            }}>
              {[
                { label: 'ECO IMPACT', value: ((gameState?.ecoImpact || 0) >= 0 ? '+' : '') + (gameState?.ecoImpact || 0), color: ecoColor, icon: '🌿' },
                { label: 'RESOURCE RECOVERY', value: '+' + (gameState?.resourceRecovery || 0), color: '#00b4d8', icon: '⚡' },
                { label: 'CITY RISK', value: (gameState?.cityRisk || 50) + '%', color: riskColor, icon: '⚠️' },
                { label: 'DEVICES INSPECTED', value: gameState?.inspectedDevices?.length || 0, color: '#f0fdf4', icon: '🔍' },
                { label: 'DEVICES RECYCLED', value: gameState?.devicesRecycled || 0, color: '#f59e0b', icon: '♻️' },
                { label: 'DEVICES REPAIRED', value: gameState?.devicesRepaired || 0, color: '#00d68f', icon: '🔧' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '0.75rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '2px' }}>{stat.icon}</div>
                  <div className="data-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>{stat.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Personalized Profile Analysis */}
            {profile && (
              <div style={{
                background: 'rgba(6, 30, 18, 0.75)',
                border: '1.5px solid rgba(74, 222, 128, 0.25)',
                borderRadius: '20px',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Trophy size={18} color="#f59e0b" />
                  <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 800 }}>Personalized Evaluation</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.25)', borderRadius: '14px', padding: '0.75rem 0.85rem' }}>
                    <div className="data-label" style={{ color: '#00d68f', fontSize: '0.75rem', marginBottom: '2px' }}>STRONGEST SKILL</div>
                    <div style={{ fontSize: '0.875rem', color: '#f0fdf4' }}>{profile.strongSkill}</div>
                  </div>

                  <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '14px', padding: '0.75rem 0.85rem' }}>
                    <div className="data-label" style={{ color: '#f59e0b', fontSize: '0.75rem', marginBottom: '2px' }}>GROWTH FOCUS</div>
                    <div style={{ fontSize: '0.875rem', color: '#f0fdf4' }}>{profile.improvArea}</div>
                  </div>

                  <div style={{ background: 'rgba(0,180,216,0.08)', border: '1px solid rgba(0,180,216,0.25)', borderRadius: '14px', padding: '0.75rem 0.85rem' }}>
                    <div className="data-label" style={{ color: '#00b4d8', fontSize: '0.75rem', marginBottom: '2px' }}>ECO PROFILE</div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#00b4d8' }}>{profile.profile}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Save to Local Records */}
            <div style={{
              background: 'rgba(6, 30, 18, 0.75)',
              border: '1.5px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 800 }}>Save to Sanctuary Hall of Fame</h3>
              
              {!saved ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    placeholder="Enter your cadet name..."
                    maxLength={30}
                    style={{
                      width: '100%',
                      minHeight: '48px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1.5px solid rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem',
                      color: '#ffffff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1rem',
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={saveToLeaderboard}
                    style={{ width: '100%', minHeight: '48px', fontSize: '0.9375rem', fontWeight: 800 }}
                  >
                    SAVE CADET RECORD
                  </button>
                </div>
              ) : (
                <div style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(0,214,143,0.1)',
                  border: '1.5px solid #00d68f',
                  borderRadius: '12px',
                  color: '#00d68f',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <Check size={18} /> Record saved to Local Mission Records!
                </div>
              )}
            </div>

            {/* Quick Navigation Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('leaderboard')}
                style={{ minHeight: '48px', fontSize: '0.875rem', fontWeight: 700, justifyContent: 'center' }}
              >
                <Trophy size={16} /> LEADERBOARD
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('impact')}
                style={{ minHeight: '48px', fontSize: '0.875rem', fontWeight: 700, justifyContent: 'center' }}
              >
                <BarChart2 size={16} /> DASHBOARD
              </button>
            </div>

            {/* Sticky Action Button: Restart Mission */}
            <div style={{
              position: 'sticky',
              bottom: 'calc(var(--bottom-nav-total-height, 70px) + 0.5rem)',
              zIndex: 40,
              padding: '0.5rem 0',
            }}>
              <button
                className="btn btn-danger"
                onClick={onReset}
                style={{
                  width: '100%',
                  minHeight: '52px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <RotateCcw size={18} />
                <span>START NEW INVESTIGATION MISSION</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
