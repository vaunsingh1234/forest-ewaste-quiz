import React from 'react';
import { BarChart2, Recycle, Wrench, AlertTriangle, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

function SimpleBar({ value, max, color, label }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 800, color }}>{value}</span>
      </div>
      <div className="progress-track" style={{ height: '8px', background: 'rgba(255,255,255,0.08)' }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

function DonutSegment({ value, total, color, label }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: '0.875rem', color: '#cbd5e1', flex: 1 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
        {value} ({Math.round(pct)}%)
      </span>
    </div>
  );
}

export default function ImpactDashboard({ gameState, navigate }) {
  const totalDecisions = gameState?.decisions?.length || 0;
  const repairCount = gameState?.decisions?.filter(d => d.choice === 'repair').length || 0;
  const reuseCount = gameState?.decisions?.filter(d => d.choice === 'reuse').length || 0;
  const recycleCount = gameState?.decisions?.filter(d => d.choice === 'recycle').length || 0;
  const garbageCount = gameState?.decisions?.filter(d => d.choice === 'garbage').length || 0;
  const correctCount = gameState?.decisions?.filter(d => d.correct).length || 0;
  const accuracy = totalDecisions > 0 ? Math.round((correctCount / totalDecisions) * 100) : 0;

  const ecoImpact = gameState?.ecoImpact || 0;
  const resourceRecovery = gameState?.resourceRecovery || 0;
  const cityRisk = gameState?.cityRisk || 50;

  const hasData = totalDecisions > 0 || gameState?.gameStarted;

  return (
    <div className="page-enter impact-dashboard-page" style={{
      minHeight: '100dvh',
      padding: 'calc(var(--safe-top, 0px) + 0.75rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 1.5rem)',
      background: 'radial-gradient(ellipse at top, #11281c 0%, #030d07 85%)',
      color: '#f0fdf4',
      overflowX: 'hidden',
    }}>
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto', padding: '0 0.25rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="data-label" style={{ color: '#00d68f', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
            ANALYTICS & METRICS
          </div>
          <h1 style={{
            fontSize: '1.4rem',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em',
            margin: '0 0 0.35rem',
            color: '#ffffff',
            fontWeight: 800,
          }}>
            IMPACT DASHBOARD
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
            Live systemic indicators tracking Nova City's circular electronics recovery.
          </p>
        </div>

        {!hasData ? (
          <div style={{
            background: 'rgba(6, 30, 18, 0.75)',
            border: '1.5px solid rgba(74, 222, 128, 0.25)',
            borderRadius: '24px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📊</div>
            <h3 style={{ color: '#ffffff', fontSize: '1.15rem', margin: '0 0 0.5rem 0', fontWeight: 800 }}>No telemetry yet</h3>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
              Begin your field investigation on the city map to log device decisions and metrics.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('map')} style={{ width: '100%', minHeight: '48px', fontSize: '0.9375rem', fontWeight: 800 }}>
              ENTER MAP & BEGIN MISSION →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Metrics (2-Column Grid) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.65rem',
            }}>
              {[
                { icon: '📱', label: 'INSPECTED', value: gameState?.inspectedDevices?.length || 0, color: '#00b4d8' },
                { icon: '🔧', label: 'REPAIRED', value: gameState?.devicesRepaired || 0, color: '#00d68f' },
                { icon: '♻️', label: 'RECYCLED', value: gameState?.devicesRecycled || 0, color: '#f59e0b' },
                { icon: '⚠️', label: 'HAZARDS FOUND', value: gameState?.hazardsFound || 0, color: '#ef4444' },
                { icon: '🎯', label: 'ACCURACY', value: accuracy + '%', color: accuracy >= 70 ? '#00d68f' : '#f59e0b' },
                { icon: '🏆', label: 'SCORE', value: gameState?.score || 0, color: '#00d68f' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'rgba(6, 30, 18, 0.75)',
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  borderRadius: '16px',
                  padding: '0.85rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '2px' }}>{stat.icon}</div>
                  <div className="data-label" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>{stat.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Environmental Gauges (Single Column Card) */}
            <div style={{
              background: 'rgba(6, 30, 18, 0.75)',
              border: '1.5px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BarChart2 size={18} color="#00d68f" />
                <span>Environmental Vital Signs</span>
              </h3>

              <SimpleBar
                label="Net Eco Impact"
                value={ecoImpact}
                max={100}
                color={ecoImpact >= 0 ? '#00d68f' : '#ef4444'}
              />
              <SimpleBar
                label="Resource Recovery"
                value={resourceRecovery}
                max={100}
                color="#00b4d8"
              />
              <SimpleBar
                label="City Risk Index"
                value={cityRisk}
                max={100}
                color={cityRisk > 60 ? '#ef4444' : cityRisk > 35 ? '#f59e0b' : '#00d68f'}
              />

              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 0.85rem',
                background: 'rgba(0, 214, 143, 0.08)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 214, 143, 0.25)',
                fontSize: '0.8125rem',
                color: '#cbd5e1',
                lineHeight: 1.5,
              }}>
                {ecoImpact >= 20
                  ? '✅ Superb impact — your decisions prevent heavy metals from polluting ground aquifers.'
                  : ecoImpact >= 0
                  ? '⚠️ Positive recovery trend, but hazardous disposal choices can still be minimized.'
                  : '❌ Elevated environmental damage — prioritize repair and certified recycling.'
                }
              </div>
            </div>

            {/* Decision Distribution (Single Column Card, Chart Resizes to Screen Width) */}
            <div style={{
              background: 'rgba(6, 30, 18, 0.75)',
              border: '1.5px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Recycle size={18} color="#f59e0b" />
                <span>Decision Distribution Breakdown</span>
              </h3>

              {totalDecisions === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>No decisions logged yet.</p>
              ) : (
                <div>
                  {/* Resizable segmented bar */}
                  <div style={{ display: 'flex', height: '20px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                    {[
                      { count: repairCount, color: '#00d68f' },
                      { count: reuseCount, color: '#00b4d8' },
                      { count: recycleCount, color: '#f59e0b' },
                      { count: garbageCount, color: '#ef4444' },
                    ].map((seg, i) => (
                      seg.count > 0 && (
                        <div
                          key={i}
                          style={{
                            width: `${(seg.count / totalDecisions) * 100}%`,
                            background: seg.color,
                            transition: 'width 0.8s ease',
                          }}
                        />
                      )
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <DonutSegment value={repairCount} total={totalDecisions} color="#00d68f" label="Component Repair" />
                    <DonutSegment value={reuseCount} total={totalDecisions} color="#00b4d8" label="Reuse & Donation" />
                    <DonutSegment value={recycleCount} total={totalDecisions} color="#f59e0b" label="Certified Recycling" />
                    <DonutSegment value={garbageCount} total={totalDecisions} color="#ef4444" label="Regular Garbage" />
                  </div>
                </div>
              )}
            </div>

            {/* Zone Clearance Progress (Single Column Card) */}
            <div style={{
              background: 'rgba(6, 30, 18, 0.75)',
              border: '1.5px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={18} color="#00b4d8" />
                <span>District Investigation Progress</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { id: 'tech-district', label: '🏢 Tech District' },
                  { id: 'residential-block', label: '🏘️ Residential Block' },
                  { id: 'repair-lab', label: '🔧 Repair Lab' },
                  { id: 'scrap-yard', label: '⚠️ Scrap Yard' },
                  { id: 'recycling-center', label: '♻️ Recycling Center' },
                ].map(zone => {
                  const completed = gameState?.completedLocations?.includes(zone.id);
                  const unlocked = gameState?.unlockedLocations?.includes(zone.id);
                  return (
                    <div key={zone.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.65rem',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '12px',
                    }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: completed ? '#00d68f' : '#f0fdf4' }}>
                        {zone.label}
                      </span>
                      <span className={`badge ${completed ? 'badge-green' : unlocked ? 'badge-blue' : 'badge-amber'}`} style={{ fontSize: '0.6875rem' }}>
                        {completed ? 'CLEARED' : unlocked ? 'ACTIVE' : 'LOCKED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticky Action Button: Return to Map */}
            <div style={{
              position: 'sticky',
              bottom: 'calc(var(--bottom-nav-total-height, 70px) + 0.5rem)',
              zIndex: 40,
              padding: '0.5rem 0',
            }}>
              <button
                className="btn btn-primary"
                onClick={() => navigate('map')}
                style={{
                  width: '100%',
                  minHeight: '52px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  boxShadow: '0 8px 25px rgba(0, 214, 143, 0.4)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>CONTINUE MISSION ON 3D MAP</span>
                <ArrowRight size={18} />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
