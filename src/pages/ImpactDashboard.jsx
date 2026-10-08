import React from 'react';
import { BarChart2, Recycle, Wrench, AlertTriangle, Zap } from 'lucide-react';

function SimpleBar({ value, max, color, label }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color }}>{value}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

function DonutSegment({ value, total, color, label }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', flex: 1 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color }}>
        {value} ({Math.round(pct)}%)
      </span>
    </div>
  );
}

export default function ImpactDashboard({ gameState, navigate }) {
  const totalDecisions = gameState.decisions?.length || 0;
  const repairCount = gameState.decisions?.filter(d => d.choice === 'repair').length || 0;
  const reuseCount = gameState.decisions?.filter(d => d.choice === 'reuse').length || 0;
  const recycleCount = gameState.decisions?.filter(d => d.choice === 'recycle').length || 0;
  const garbageCount = gameState.decisions?.filter(d => d.choice === 'garbage').length || 0;
  const correctCount = gameState.decisions?.filter(d => d.correct).length || 0;
  const accuracy = totalDecisions > 0 ? Math.round((correctCount / totalDecisions) * 100) : 0;

  const ecoImpact = gameState.ecoImpact || 0;
  const resourceRecovery = gameState.resourceRecovery || 0;
  const cityRisk = gameState.cityRisk || 50;

  const hasData = totalDecisions > 0 || gameState.gameStarted;

  return (
    <div className="page-enter" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="data-label" style={{ marginBottom: '0.5rem' }}>ANALYTICS</div>
          <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            IMPACT DASHBOARD
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Live metrics from your investigation of Nova City.
          </p>
        </div>

        {!hasData ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>No data yet</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Start the investigation to generate impact data.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('home')}>
              BEGIN MISSION
            </button>
          </div>
        ) : (
          <div>
            {/* Top metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.875rem',
              marginBottom: '2rem',
            }}>
              {[
                { icon: '📱', label: 'Devices Inspected', value: gameState.inspectedDevices?.length || 0, color: 'var(--accent-blue)' },
                { icon: '🔧', label: 'Repaired', value: gameState.devicesRepaired || 0, color: 'var(--accent-green)' },
                { icon: '♻️', label: 'Recycled', value: gameState.devicesRecycled || 0, color: 'var(--accent-amber)' },
                { icon: '⚠️', label: 'Hazards Found', value: gameState.hazardsFound || 0, color: 'var(--accent-red)' },
                { icon: '🎯', label: 'Accuracy', value: accuracy + '%', color: accuracy >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)' },
                { icon: '🏆', label: 'Score', value: gameState.score || 0, color: 'var(--accent-green)' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div className="data-label" style={{ marginBottom: '0.375rem' }}>{stat.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.375rem', fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Environmental metrics */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart2 size={16} color="var(--accent-green)" />
                  Environmental Metrics
                </h3>

                <SimpleBar
                  label="Eco Impact"
                  value={ecoImpact}
                  max={100}
                  color={ecoImpact >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}
                />
                <SimpleBar
                  label="Resource Recovery"
                  value={resourceRecovery}
                  max={100}
                  color="var(--accent-blue)"
                />
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>City Risk</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: cityRisk > 60 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                      {cityRisk}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${cityRisk}%`,
                        background: cityRisk > 60 ? 'var(--accent-red)' : cityRisk > 35 ? 'var(--accent-amber)' : 'var(--accent-green)',
                        transition: 'width 1s ease',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1rem', padding: '0.875rem', background: 'rgba(0,214,143,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,214,143,0.15)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {ecoImpact >= 20
                      ? '✅ Excellent environmental impact — your decisions are making Nova City cleaner.'
                      : ecoImpact >= 0
                      ? '⚠️ Positive but limited impact. More careful decisions can improve results.'
                      : '❌ Negative environmental impact — review your disposal decisions.'
                    }
                  </p>
                </div>
              </div>

              {/* Decision distribution */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Recycle size={16} color="var(--accent-amber)" />
                  Decision Distribution
                </h3>

                {totalDecisions === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No decisions made yet.</p>
                ) : (
                  <div>
                    {/* Visual distribution */}
                    <div style={{ display: 'flex', height: '24px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                      {[
                        { count: repairCount, color: 'var(--accent-green)' },
                        { count: reuseCount, color: 'var(--accent-blue)' },
                        { count: recycleCount, color: 'var(--accent-amber)' },
                        { count: garbageCount, color: 'var(--accent-red)' },
                      ].map((seg, i) => (
                        seg.count > 0 && (
                          <div
                            key={i}
                            style={{
                              width: `${(seg.count / totalDecisions) * 100}%`,
                              background: seg.color,
                              transition: 'width 1s ease',
                            }}
                          />
                        )
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      <DonutSegment value={repairCount} total={totalDecisions} color="var(--accent-green)" label="Repair" />
                      <DonutSegment value={reuseCount} total={totalDecisions} color="var(--accent-blue)" label="Reuse/Donate" />
                      <DonutSegment value={recycleCount} total={totalDecisions} color="var(--accent-amber)" label="Recycle" />
                      <DonutSegment value={garbageCount} total={totalDecisions} color="var(--accent-red)" label="Regular Garbage" />
                    </div>

                    <div style={{ marginTop: '1rem', padding: '0.625rem 0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Total decisions</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalDecisions}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Correct decisions</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-green)' }}>{correctCount} ({accuracy}%)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Location progress */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={16} color="var(--accent-blue)" />
                  Zone Progress
                </h3>

                {[
                  { id: 'tech-district', label: '🏢 Tech District' },
                  { id: 'residential-block', label: '🏘️ Residential Block' },
                  { id: 'repair-lab', label: '🔧 Repair Lab' },
                  { id: 'scrap-yard', label: '⚠️ Scrap Yard' },
                  { id: 'recycling-center', label: '♻️ Recycling Center' },
                ].map(zone => {
                  const completed = gameState.completedLocations?.includes(zone.id);
                  const unlocked = gameState.unlockedLocations?.includes(zone.id);
                  return (
                    <div key={zone.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}>
                      <span style={{ fontSize: '0.9375rem' }}>{zone.label.split(' ')[0]}</span>
                      <span style={{ fontSize: '0.8125rem', flex: 1, color: completed ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {zone.label.split(' ').slice(1).join(' ')}
                      </span>
                      <span className={`badge ${completed ? 'badge-green' : unlocked ? 'badge-blue' : 'badge-amber'}`} style={{ fontSize: '0.5625rem' }}>
                        {completed ? 'DONE' : unlocked ? 'ACTIVE' : 'LOCKED'}
                      </span>
                    </div>
                  );
                })}

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span className="data-label">OVERALL PROGRESS</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-green)' }}>
                      {gameState.completedLocations?.length || 0}/5
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill progress-green"
                      style={{ width: `${((gameState.completedLocations?.length || 0) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Puzzles completed */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={16} color="var(--accent-red)" />
                  Puzzles & Challenges
                </h3>

                {[
                  { id: 'circuit-puzzle', label: '⚡ The Broken Circuit', location: 'Tech District' },
                  { id: 'recycling-code', label: '🔣 The Recycling Code', location: 'Residential Block' },
                  { id: 'data-wipe', label: '🛡️ Data Security Wipe', location: 'Residential Block' },
                  { id: 'scrap-yard', label: '⚠️ Hazard Identification', location: 'Scrap Yard' },
                ].map(puzzle => {
                  const solved = gameState.completedPuzzles?.includes(puzzle.id);
                  return (
                    <div key={puzzle.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 0',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}>
                      <span style={{ fontSize: '0.875rem', flex: 1 }}>{puzzle.label}</span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{puzzle.location}</span>
                      <span className={`badge ${solved ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.5625rem' }}>
                        {solved ? 'SOLVED' : 'PENDING'}
                      </span>
                    </div>
                  );
                })}

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span className="data-label">PUZZLE COMPLETION</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-green)' }}>
                      {gameState.completedPuzzles?.length || 0}/4
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill progress-blue"
                      style={{ width: `${((gameState.completedPuzzles?.length || 0) / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            {!gameState.gameCompleted && (
              <div style={{
                padding: '1.25rem 1.5rem',
                background: 'rgba(0,214,143,0.05)',
                border: '1px solid rgba(0,214,143,0.2)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
              }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Mission in progress — continue to improve your impact metrics.
                </p>
                <button className="btn btn-primary" onClick={() => navigate('map')}>
                  CONTINUE MISSION
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
