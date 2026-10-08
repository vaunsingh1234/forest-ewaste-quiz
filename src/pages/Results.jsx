import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, BarChart2, Award } from 'lucide-react';

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
  const [nameInput, setNameInput] = useState(gameState.playerName || '');

  const rankData = getRankData(gameState.score);
  const profile = getProfileAnalysis(gameState.decisions);

  const ecoColor = gameState.ecoImpact >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  const riskColor = gameState.cityRisk > 70 ? 'var(--accent-red)' : gameState.cityRisk > 40 ? 'var(--accent-amber)' : 'var(--accent-green)';

  // Animate score
  useEffect(() => {
    const target = gameState.score;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimScore(target);
        clearInterval(interval);
        setTimeout(() => { setAnimating(false); setShowDetails(true); }, 300);
      } else {
        setAnimScore(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  const saveToLeaderboard = () => {
    const name = nameInput.trim() || gameState.playerName || 'Officer';
    const entry = {
      name,
      score: gameState.score,
      rank: rankData.rank,
      ecoImpact: gameState.ecoImpact,
      resourceRecovery: gameState.resourceRecovery,
      cityRisk: gameState.cityRisk,
      timeRemaining: gameState.timeRemaining,
      date: new Date().toLocaleDateString(),
      avatarImg: (gameState.avatar && gameState.avatar.avatarImg) || '/avatars/frog_avatar.jpg',
      headgear: (gameState.avatar && gameState.avatar.headgearName) || 'Emerald Frog Hat',
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
    <div className="page-enter" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="data-label" style={{ marginBottom: '0.5rem' }}>NOVA CITY</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            marginBottom: '0.25rem',
          }}>
            E-WASTE IMPACT REPORT
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Mission {gameState.emergencyMode ? 'completed in emergency mode' : 'completed'} — {gameState.completedLocations.length} zones investigated
          </p>
        </div>

        {/* Score circle + rank */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '3rem',
          gap: '1.5rem',
        }}>
          {/* Circular meter */}
          <div style={{ position: 'relative', width: '200px', height: '200px' }}>
            <svg viewBox="0 0 200 200" width="200" height="200">
              {/* Background circle */}
              <circle
                cx="100" cy="100" r="85"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="12"
              />
              {/* Score arc */}
              <circle
                cx="100" cy="100" r="85"
                fill="none"
                stroke={rankData.color}
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 85}`}
                strokeDashoffset={`${2 * Math.PI * 85 * (1 - Math.min(animScore / 1500, 1))}`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                style={{ transition: 'stroke-dashoffset 0.1s' }}
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
                fontSize: '2.25rem',
                fontWeight: 900,
                color: rankData.color,
                lineHeight: 1,
              }}>
                {animScore}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                marginTop: '4px',
              }}>
                TOTAL SCORE
              </div>
            </div>
          </div>

          {/* Rank */}
          {showDetails && (
            <div style={{ textAlign: 'center', animation: 'fadeUp 0.5s ease' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{rankData.icon}</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: rankData.color,
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
              }}>
                {rankData.rank}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '380px' }}>
                {rankData.desc}
              </p>
            </div>
          )}
        </div>

        {showDetails && (
          <div style={{ animation: 'fadeUp 0.6s ease' }}>
            {/* Pip's Graduation Diploma Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.18) 0%, rgba(16, 185, 129, 0.1) 100%)',
              border: '2px solid rgba(74, 222, 128, 0.4)',
              borderRadius: '24px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(74, 222, 128, 0.2)',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid #4ade80',
                flexShrink: 0,
              }}>
                <img src="/avatars/frog_avatar.jpg" alt="Pip" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f0fdf4' }}>Pip's Eco-Officer Diploma 🎉</span>
                  <span style={{
                    background: '#22c55e',
                    color: '#07150e',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '100px',
                  }}>
                    CLASS {gameState.studentGrade || '3rd'} GRADUATE
                  </span>
                </div>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.88rem', color: '#bbf7d0', lineHeight: 1.55 }}>
                  "Congratulations {gameState.playerName || 'Cadet'}! You proved that school students can be the best protectors of planet Earth. Remember: always tell your classmates and family never to throw gadgets with batteries in ordinary dustbins!"
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.875rem',
              marginBottom: '2rem',
            }}>
              {[
                { label: 'ECO IMPACT', value: (gameState.ecoImpact >= 0 ? '+' : '') + gameState.ecoImpact, color: ecoColor, icon: '🌿' },
                { label: 'RESOURCE RECOVERY', value: '+' + gameState.resourceRecovery, color: 'var(--accent-blue)', icon: '⚡' },
                { label: 'CITY RISK', value: gameState.cityRisk + '%', color: riskColor, icon: '⚠️' },
                { label: 'DEVICES INSPECTED', value: gameState.inspectedDevices.length, color: 'var(--text-primary)', icon: '🔍' },
                { label: 'DEVICES RECYCLED', value: gameState.devicesRecycled || 0, color: 'var(--accent-amber)', icon: '♻️' },
                { label: 'DEVICES REPAIRED', value: gameState.devicesRepaired || 0, color: 'var(--accent-green)', icon: '🔧' },
                { label: 'WRONG DECISIONS', value: gameState.badDecisions || 0, color: 'var(--accent-red)', icon: '❌' },
                { label: 'ZONES CLEARED', value: `${gameState.completedLocations.length}/5`, color: 'var(--text-primary)', icon: '🗺️' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem' }}>{stat.icon}</span>
                    <span className="data-label">{stat.label}</span>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.375rem',
                    fontWeight: 700,
                    color: stat.color,
                  }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Personalized feedback */}
            {profile && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}>
                <h2 style={{ fontSize: '1.0625rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Trophy size={18} color="var(--accent-amber)" />
                  Personalized Analysis
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(0,214,143,0.06)',
                    border: '1px solid rgba(0,214,143,0.2)',
                    borderRadius: 'var(--radius-lg)',
                  }}>
                    <div className="data-label" style={{ marginBottom: '0.375rem', color: 'var(--accent-green)' }}>STRONGEST SKILL</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      {profile.strongSkill}
                    </p>
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(245,158,11,0.06)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 'var(--radius-lg)',
                  }}>
                    <div className="data-label" style={{ marginBottom: '0.375rem', color: 'var(--accent-amber)' }}>IMPROVEMENT AREA</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      {profile.improvArea}
                    </p>
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(0,180,216,0.06)',
                    border: '1px solid rgba(0,180,216,0.2)',
                    borderRadius: 'var(--radius-lg)',
                  }}>
                    <div className="data-label" style={{ marginBottom: '0.375rem', color: 'var(--accent-blue)' }}>ENVIRONMENTAL PROFILE</div>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-blue)', lineHeight: 1.6 }}>
                      {profile.profile}
                    </p>
                  </div>
                </div>

                {/* Real-world actions */}
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.875rem', color: 'var(--text-secondary)' }}>
                    3 Actions You Can Take Right Now:
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      '1. Repair devices before replacing them — saves money and reduces waste.',
                      '2. Never throw batteries into household garbage — use battery collection points.',
                      '3. Use authorized e-waste collection channels for all electronic devices.',
                    ].map((action, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 'var(--radius-md)',
                      }}>
                        <span style={{ color: 'var(--accent-green)', fontWeight: 600, flexShrink: 0, fontSize: '0.9375rem' }}>→</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save to leaderboard */}
            {!saved && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Save to Local Records</h3>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    placeholder="Your name..."
                    maxLength={30}
                    style={{
                      flex: 1,
                      minWidth: '180px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-card)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.5rem 1rem',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-green)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-card)'}
                  />
                  <button className="btn btn-primary" onClick={saveToLeaderboard}>
                    SAVE RECORD
                  </button>
                </div>
              </div>
            )}

            {saved && (
              <div style={{
                padding: '1rem 1.5rem',
                background: 'rgba(0,214,143,0.08)',
                border: '1px solid rgba(0,214,143,0.2)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1.5rem',
                color: 'var(--accent-green)',
                fontSize: '0.875rem',
              }}>
                ✅ Record saved to Local Mission Records!
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => navigate('leaderboard')}>
                <Trophy size={14} />
                VIEW RECORDS
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('impact')}>
                <BarChart2 size={14} />
                IMPACT DASHBOARD
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('achievements')}>
                <Award size={14} />
                ACHIEVEMENTS
              </button>
              <button className="btn btn-danger" onClick={onReset} style={{ marginLeft: 'auto' }}>
                <RotateCcw size={14} />
                RESTART MISSION
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
