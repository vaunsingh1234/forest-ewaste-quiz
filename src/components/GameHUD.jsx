import React, { useState } from 'react';
import {
  Clock,
  Zap,
  Recycle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Award,
  Smartphone
} from 'lucide-react';

export default function GameHUD({ gameState, timer, emergencyMode }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const ecoColor =
    gameState.ecoImpact >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  const riskColor =
    gameState.cityRisk > 70
      ? 'var(--accent-red)'
      : gameState.cityRisk > 40
      ? 'var(--accent-amber)'
      : 'var(--accent-green)';
  const timeColor =
    timer.timeRemaining < 120
      ? 'var(--accent-red)'
      : timer.timeRemaining < 300
      ? 'var(--accent-amber)'
      : 'var(--accent-green)';

  return (
    <>
      {/* ─── MOBILE COMPACT HUD (Phones: Slim Top Bar) ─── */}
      <div
        className="game-hud-mobile"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          background: 'rgba(6, 21, 14, 0.96)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(74, 222, 128, 0.22)',
          paddingTop: 'max(0.35rem, var(--safe-top))',
          paddingBottom: '0.35rem',
          paddingLeft: '0.75rem',
          paddingRight: '0.75rem',
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.5)',
          flexDirection: 'column',
        }}
      >
        {/* Slim Top Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            minHeight: '38px',
            gap: '0.5rem',
          }}
        >
          {/* Timer & Emergency Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              minWidth: '78px',
            }}
          >
            <Clock size={15} color={timeColor} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: timeColor,
                letterSpacing: '0.02em',
                animation:
                  timer.timeRemaining < 60 ? 'blink 1s step-end infinite' : 'none',
              }}
            >
              {timer.formattedTime}
            </span>
            {emergencyMode && (
              <span
                className="badge badge-red"
                style={{
                  fontSize: '0.55rem',
                  padding: '1px 5px',
                  animation: 'pulse-dot 1s ease-in-out infinite',
                }}
              >
                SOS
              </span>
            )}
          </div>

          {/* Score Badge */}
          <div
            style={{
              background: 'rgba(74, 222, 128, 0.15)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              borderRadius: '100px',
              padding: '2px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--accent-green-bright)',
              }}
            >
              {gameState.score}
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                color: '#86efac',
                fontFamily: 'var(--font-mono)',
              }}
            >
              PTS
            </span>
          </div>

          {/* Quick Metrics Toggle Pill */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '100px',
              padding: '3px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              color: '#f0fdf4',
              minHeight: '34px',
              touchAction: 'manipulation',
            }}
            aria-label="Toggle full mission metrics"
            aria-expanded={mobileDrawerOpen}
          >
            {/* Eco Pill */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: ecoColor,
              }}
            >
              <Recycle size={11} />
              {gameState.ecoImpact >= 0 ? '+' : ''}
              {gameState.ecoImpact}
            </span>

            {/* Risk Pill */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: riskColor,
              }}
            >
              <AlertTriangle size={11} />
              {gameState.cityRisk}%
            </span>

            {/* Zone count */}
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                color: '#86efac',
                opacity: 0.85,
              }}
            >
              {gameState.completedLocations.length}/5
            </span>

            {mobileDrawerOpen ? (
              <ChevronUp size={13} color="#86efac" />
            ) : (
              <ChevronDown size={13} color="#86efac" />
            )}
          </button>
        </div>

        {/* Expandable Mobile Drawer (When Tapped) */}
        {mobileDrawerOpen && (
          <div
            style={{
              paddingTop: '0.5rem',
              paddingBottom: '0.35rem',
              borderTop: '1px solid rgba(74, 222, 128, 0.15)',
              marginTop: '0.35rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              animation: 'fadeDown 0.2s ease',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                ECO
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: ecoColor,
                }}
              >
                {gameState.ecoImpact >= 0 ? '+' : ''}
                {gameState.ecoImpact}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                RECOVERY
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--accent-blue)',
                }}
              >
                {gameState.resourceRecovery >= 0 ? '+' : ''}
                {gameState.resourceRecovery}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                RISK
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: riskColor,
                }}
              >
                {gameState.cityRisk}%
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                DEVICES
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {gameState.inspectedDevices.length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── DESKTOP EXTENDED HUD (Hidden on mobile via CSS) ─── */}
      <div
        className="game-hud-desktop"
        style={{
          position: 'fixed',
          top: 'var(--top-nav-height)',
          left: 0,
          right: 0,
          background: 'rgba(9, 14, 26, 0.97)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.5rem 1.5rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          zIndex: 99,
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Timer & Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Avatar chip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              borderRadius: '100px',
              padding: '2px 8px 2px 3px',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1.5px solid #facc15',
              }}
            >
              <img
                src={
                  (gameState.avatar && gameState.avatar.avatarImg) ||
                  '/avatars/frog_avatar.jpg'
                }
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: '#facc15',
              }}
            >
              {gameState.avatar && gameState.avatar.headgearName
                ? gameState.avatar.headgearName.split(' ')[0]
                : 'Hero'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={15} color={timeColor} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: timeColor,
                minWidth: '60px',
                animation:
                  timer.timeRemaining < 60 ? 'blink 1s step-end infinite' : 'none',
              }}
            >
              {timer.formattedTime}
            </span>
            {emergencyMode && (
              <span
                className="badge badge-red"
                style={{
                  fontSize: '0.625rem',
                  animation: 'pulse-dot 1s ease-in-out infinite',
                }}
              >
                EMERGENCY
              </span>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flex: 1,
            justifyContent: 'center',
          }}
        >
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
            icon={<Recycle size={12} />}
          />

          {/* Resource Recovery */}
          <HUDMetric
            label="RECOVERY"
            value={
              (gameState.resourceRecovery >= 0 ? '+' : '') +
              gameState.resourceRecovery
            }
            color="var(--accent-blue)"
            icon={<Zap size={12} />}
          />

          {/* City Risk */}
          <HUDMetric
            label="CITY RISK"
            value={gameState.cityRisk + '%'}
            color={riskColor}
            icon={<AlertTriangle size={12} />}
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minWidth: '120px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '2px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
              }}
            >
              ZONES: {gameState.completedLocations.length}/5
            </span>
          </div>
          <div className="progress-track" style={{ height: '4px' }}>
            <div
              className="progress-fill progress-green"
              style={{
                width: `${(gameState.completedLocations.length / 5) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function HUDMetric({ label, value, suffix = '', color, icon }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          marginBottom: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          justifyContent: 'center',
        }}
      >
        {icon}
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9375rem',
          fontWeight: 700,
          color,
        }}
      >
        {value}
        {suffix}
      </div>
    </div>
  );
}
