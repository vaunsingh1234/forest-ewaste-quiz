import React from 'react';
import { Award, Lock } from 'lucide-react';
import { achievements, rarityColors } from '../data/achievements';

export default function AchievementsPage({ gameState, navigate }) {
  const unlockedIds = gameState.achievements || [];

  const grouped = {
    Unlocked: achievements.filter(a => unlockedIds.includes(a.id)),
    Locked: achievements.filter(a => !unlockedIds.includes(a.id) && !a.secret),
    Secret: achievements.filter(a => !unlockedIds.includes(a.id) && a.secret),
  };

  const totalPoints = grouped.Unlocked.reduce((acc, a) => acc + a.points, 0);

  return (
    <div className="page-enter" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="data-label" style={{ marginBottom: '0.5rem' }}>NOVA CITY</div>
          <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            ACHIEVEMENTS
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge-green">
              {grouped.Unlocked.length}/{achievements.length - achievements.filter(a => a.secret).length} Unlocked
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {totalPoints} achievement points earned
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span className="data-label">COMPLETION</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-green)' }}>
              {Math.round((grouped.Unlocked.length / (achievements.length - achievements.filter(a=>a.secret).length)) * 100)}%
            </span>
          </div>
          <div className="progress-track" style={{ height: '8px' }}>
            <div
              className="progress-fill progress-green"
              style={{ width: `${(grouped.Unlocked.length / (achievements.length - achievements.filter(a=>a.secret).length)) * 100}%` }}
            />
          </div>
        </div>

        {/* Unlocked section */}
        {grouped.Unlocked.length > 0 && (
          <Section title="UNLOCKED" count={grouped.Unlocked.length}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {grouped.Unlocked.map(a => <AchievementCard key={a.id} achievement={a} unlocked />)}
            </div>
          </Section>
        )}

        {/* Locked section */}
        {grouped.Locked.length > 0 && (
          <Section title="LOCKED" count={grouped.Locked.length}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {grouped.Locked.map(a => <AchievementCard key={a.id} achievement={a} unlocked={false} />)}
            </div>
          </Section>
        )}

        {/* Secret section */}
        {grouped.Secret.length > 0 && (
          <Section title="SECRET" count={grouped.Secret.length}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {grouped.Secret.map(a => <SecretCard key={a.id} />)}
            </div>
          </Section>
        )}

        {grouped.Unlocked.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏅</div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>No achievements yet</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Complete the investigation to earn achievements.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('home')}>
              START MISSION
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.15em',
          color: 'var(--text-muted)',
        }}>
          {title}
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}

function AchievementCard({ achievement, unlocked }) {
  const color = rarityColors[achievement.rarity] || 'var(--text-muted)';

  return (
    <div style={{
      background: unlocked ? 'var(--bg-card)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${unlocked ? color + '40' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.25rem',
      opacity: unlocked ? 1 : 0.5,
      display: 'flex',
      gap: '0.875rem',
      alignItems: 'flex-start',
    }}>
      <div style={{
        fontSize: '1.5rem',
        width: '40px',
        height: '40px',
        background: unlocked ? `${color}15` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${unlocked ? color + '30' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {unlocked ? achievement.icon : <Lock size={16} color="var(--text-muted)" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{achievement.name}</span>
          <span style={{
            fontSize: '0.5625rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em',
            color,
            background: `${color}15`,
            border: `1px solid ${color}25`,
            padding: '1px 6px',
            borderRadius: '100px',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}>
            {achievement.rarity}
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
          {achievement.description}
        </p>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-green)' }}>
          +{achievement.points} pts
        </div>
      </div>
    </div>
  );
}

function SecretCard() {
  return (
    <div style={{
      background: 'rgba(0,214,143,0.03)',
      border: '1px dashed rgba(0,214,143,0.15)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.25rem',
      display: 'flex',
      gap: '0.875rem',
      alignItems: 'center',
    }}>
      <div style={{
        fontSize: '1.25rem',
        width: '40px',
        height: '40px',
        background: 'rgba(0,214,143,0.05)',
        border: '1px solid rgba(0,214,143,0.1)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        ❓
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Secret Achievement</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Hidden in the game world. Explore carefully to find it.
        </p>
      </div>
    </div>
  );
}
