import React, { useState } from 'react';
import {
  Home,
  Map,
  BookOpen,
  Award,
  Trophy,
  Monitor,
  BarChart2,
  RotateCcw,
  Maximize2,
  Minimize2,
  Shield,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { DEFAULT_AVATAR } from '../data/avatars';

const DESKTOP_NAV_ITEMS = [
  { id: 'home', label: 'HOME', icon: Monitor },
  { id: 'avatar_select', label: 'WARDROBE', icon: Sparkles },
  { id: 'map', label: 'QUEST HUBS', icon: Map },
  { id: 'learn', label: 'LEARN', icon: BookOpen },
  { id: 'impact', label: 'IMPACT', icon: BarChart2 },
  { id: 'achievements', label: 'ACHIEVEMENTS', icon: Award },
  { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy },
];

const MOBILE_NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'achievements', label: 'Badges', icon: Award },
  { id: 'leaderboard', label: 'Ranks', icon: Trophy },
];

export default function Navbar({
  currentPage,
  navigate,
  gameState,
  inMission,
  onReset,
  presentationMode,
  onTogglePresentation
}) {
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);

  const isLocationPage = [
    'map',
    'tech_district',
    'residential_block',
    'repair_lab',
    'scrap_yard',
    'recycling_center',
    'final-mystery'
  ].includes(currentPage);

  if (presentationMode) {
    return (
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 'var(--top-nav-height)',
          background: 'rgba(9, 14, 26, 0.98)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.875rem',
            color: 'var(--accent-green)',
            letterSpacing: '0.1em',
          }}
        >
          E-WASTE: THE LAST DEVICE
        </span>
        <button
          className="btn btn-sm btn-secondary"
          onClick={onTogglePresentation}
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          <Minimize2 size={16} />
          <span>EXIT PRESENTATION</span>
        </button>
      </header>
    );
  }

  return (
    <>
      {/* ─── DESKTOP TOP NAVBAR (Hidden on mobile via CSS) ─── */}
      <header
        className="desktop-navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 'var(--top-nav-height)',
          background: 'rgba(6, 21, 14, 0.96)',
          borderBottom: '1px solid rgba(74, 222, 128, 0.2)',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          zIndex: 100,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.1rem',
            }}
            aria-label="Go to home"
          >
            <span
              style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              forest
            </span>
            <span style={{ color: '#4ade80', fontSize: '1.3rem', fontWeight: 900 }}>.</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: '#86efac',
                marginLeft: '0.45rem',
                letterSpacing: '0.1em',
                opacity: 0.85,
              }}
            >
              SANCTUARY
            </span>
          </button>
        </div>

        {/* Desktop Nav Links */}
        {!inMission && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {DESKTOP_NAV_ITEMS.map((item) => {
              const isActive =
                currentPage === item.id || (item.id === 'map' && isLocationPage);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  style={{
                    border: 'none',
                    borderBottom: isActive ? '2px solid #f59e0b' : '2px solid transparent',
                    cursor: 'pointer',
                    padding: '0.4rem 0.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.02em',
                    color: isActive ? '#ffffff' : '#bbf7d0',
                    background: 'transparent',
                    transition: 'all 0.15s ease',
                    borderRadius: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#bbf7d0';
                  }}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Desktop Right Side Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Avatar Profile Chip */}
          <button
            onClick={() => navigate('avatar_select')}
            style={{
              background:
                'linear-gradient(135deg, rgba(16, 44, 30, 0.85) 0%, rgba(9, 24, 17, 0.95) 100%)',
              border: '1.5px solid rgba(74, 222, 128, 0.4)',
              borderRadius: '100px',
              padding: '3px 10px 3px 4px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Open Avatar Wardrobe"
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1.5px solid #4ade80',
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
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: '#f0fdf4',
                maxWidth: '120px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {gameState.playerName?.trim() ? gameState.playerName : 'Eco Cadet'}
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                background: 'rgba(74, 222, 128, 0.2)',
                border: '1px solid rgba(74, 222, 128, 0.35)',
                color: '#86efac',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '100px',
                letterSpacing: '0.04em',
              }}
            >
              CADET
            </span>
          </button>

          {/* Score Badge */}
          {gameState.gameStarted && (
            <div
              className="badge badge-green"
              style={{
                fontFamily: 'var(--font-mono)',
                borderRadius: '100px',
                padding: '0.3rem 0.75rem',
              }}
            >
              {gameState.score} pts
            </div>
          )}

          {/* Presentation mode */}
          <button
            className="btn btn-icon btn-ghost"
            onClick={onTogglePresentation}
            title="Toggle Presentation Mode"
            aria-label="Toggle presentation mode"
          >
            <Maximize2 size={16} />
          </button>

          {/* Admin Control Center */}
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => navigate('admin')}
            title="Admin Control Center (/admin)"
            aria-label="Admin Control Center"
            id="nav-admin-btn"
          >
            <Shield
              size={16}
              color={
                currentPage.startsWith('admin')
                  ? 'var(--accent-green)'
                  : 'var(--text-muted)'
              }
            />
          </button>

          {/* Reset button (if game active) */}
          {gameState.gameStarted && (
            <button
              className="btn btn-icon btn-ghost"
              onClick={onReset}
              title="Reset Mission"
              aria-label="Reset mission"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </header>

      {/* ─── MOBILE FIXED BOTTOM NAVIGATION BAR (Visible on mobile phones) ─── */}
      <nav
        className="mobile-bottom-nav"
        aria-label="Mobile Navigation"
      >
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.id || (item.id === 'map' && isLocationPage);

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
