import React from 'react';
import { Clock, Zap, Recycle, AlertTriangle } from 'lucide-react';

export default function GameHUD({ gameState, timer, emergencyMode }) {
  const ecoColor = gameState.ecoImpact >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  const riskColor = gameState.cityRisk > 70 ? 'var(--accent-red)' : gameState.cityRisk > 40 ? 'var(--accent-amber)' : 'var(--accent-green)';
  const timeColor = timer.timeRemaining < 120 ? 'var(--accent-red)' : timer.timeRemaining < 300 ? 'var(--accent-amber)' : 'var(--accent-green)';

  return (
    <div style={{
      position: 'fixed',
      top: '3.5rem',
      left: 0,
      right: 0,
      background: 'rgba(9,14,26,0.97)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.5rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      zIndex: 99,
      backdropFilter: 'blur(8px)',
      flexWrap: 'wrap',
    }}>
      {/* Timer & Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Avatar chip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(250, 204, 21, 0.3)',
          borderRadius: '100px',
          padding: '2px 8px 2px 3px',
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1.5px solid #facc15',
          }}>
            <img
              src={(gameState.avatar && gameState.avatar.avatarImg) || '/avatars/frog_avatar.jpg'}
              alt="Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <span style={{
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: '#facc15',
          }}>
            {(gameState.avatar && gameState.avatar.headgearName) ? gameState.avatar.headgearName.split(' ')[0] : 'Hero'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={14} color={timeColor} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.125rem',
            fontWeight: 700,
            color: timeColor,
            minWidth: '60px',
            animation: timer.timeRemaining < 60 ? 'blink 1s step-end infinite' : 'none',
          }}>
            {timer.formattedTime}
          </span>
          {emergencyMode && (
            <span className="badge badge-red" style={{ fontSize: '0.625rem', animation: 'pulse-dot 1s ease-in-out infinite' }}>
              EMERGENCY
            </span>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Score */}
        <HUDMetric
          label="SCORE"
          value={gameState.score}
          suffix=" pts"
          color="var(--accent-green)"
        />

        {/* Eco Impact */}
        <HUDMetric
          label="ECO IMPACT"
          value={(gameState.ecoImpact >= 0 ? '+' : '') + gameState.ecoImpact}
          color={ecoColor}
          icon={<Recycle size={11} />}
        />

        {/* Resource Recovery */}
        <HUDMetric
          label="RECOVERY"
          value={(gameState.resourceRecovery >= 0 ? '+' : '') + gameState.resourceRecovery}
          color="var(--accent-blue)"
          icon={<Zap size={11} />}
        />

        {/* City Risk */}
        <HUDMetric
          label="CITY RISK"
          value={gameState.cityRisk + '%'}
          color={riskColor}
          icon={<AlertTriangle size={11} />}
        />

        {/* Devices */}
        <HUDMetric
          label="DEVICES"
          value={gameState.inspectedDevices.length}
          color="var(--text-secondary)"
          suffix=" found"
        />
      </div>

      {/* Progress bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            ZONES: {gameState.completedLocations.length}/5
          </span>
        </div>
        <div className="progress-track" style={{ height: '4px' }}>
          <div
            className="progress-fill progress-green"
            style={{ width: `${(gameState.completedLocations.length / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function HUDMetric({ label, value, suffix = '', color, icon }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.625rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
        marginBottom: '2px',
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        justifyContent: 'center',
      }}>
        {icon}
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9375rem',
        fontWeight: 700,
        color,
      }}>
        {value}{suffix}
      </div>
    </div>
  );
}
