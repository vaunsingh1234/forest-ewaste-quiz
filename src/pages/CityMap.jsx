import React, { useState, useRef } from 'react';
import { 
  Lock, CheckCircle, ChevronRight, MapPin, AlertTriangle, Star, 
  Sparkles, LayoutGrid, Map, Play, Shield, Zap, Compass, Eye, 
  Navigation, Award, RotateCcw, Maximize2, Minimize2, Info
} from 'lucide-react';
import { locations } from '../data/locations';
import { DEFAULT_AVATAR } from '../data/avatars';

const QUEST_METADATA = {
  'tech-district': {
    questTitle: 'Revealing Secrets',
    image: '/quests/revealing_secrets.jpg',
    starReward: '+5',
    stars: 4,
    progressLabel: '6 of 10 inspected',
    progressPct: 60,
  },
  'residential-block': {
    questTitle: 'Search in the Deep Jungle',
    image: '/quests/glowing_orb.jpg',
    starReward: '+6',
    stars: 3,
    progressLabel: '3 of 5 decrypts',
    progressPct: 50,
  },
  'repair-lab': {
    questTitle: 'The Neon-Leaf Workshop',
    image: '/quests/repair_lab.jpg',
    starReward: '+5',
    stars: 5,
    progressLabel: 'Diagnostic complete',
    progressPct: 80,
  },
  'scrap-yard': {
    questTitle: 'Hazardous Scrap Dunes',
    image: '/quests/scrap_yard.jpg',
    starReward: '+7',
    stars: 4,
    progressLabel: '4 of 6 violations',
    progressPct: 65,
  },
  'recycling-center': {
    questTitle: 'The Circular Core Sanctuary',
    image: '/quests/glowing_orb.jpg',
    starReward: '+8',
    stars: 5,
    progressLabel: 'Sorting master',
    progressPct: 100,
  },
};

const MAP_COORDINATES = {
  'tech-district': {
    x: 30.5,
    y: 33.5,
    zone: 1,
    badgeText: 'TECH DISTRICT',
    subtext: 'Cyber Spires & Solar Arrays',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.6)',
  },
  'residential-block': {
    x: 52,
    y: 28,
    zone: 2,
    badgeText: 'RESIDENTIAL BLOCK',
    subtext: 'Vertical Garden Towers',
    color: '#4ade80',
    glow: 'rgba(74, 222, 128, 0.6)',
  },
  'repair-lab': {
    x: 68.5,
    y: 34,
    zone: 3,
    badgeText: 'REPAIR LAB',
    subtext: 'Bio-Workshop & Antenna Domes',
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.6)',
  },
  'scrap-yard': {
    x: 85,
    y: 49,
    zone: 4,
    badgeText: 'SCRAP YARD',
    subtext: 'Heavy Cranes & Metal Dunes',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.6)',
  },
  'recycling-center': {
    x: 61.5,
    y: 68.5,
    zone: 5,
    badgeText: 'RECYCLING CENTER',
    subtext: 'Circular Dome & Crystal Falls',
    color: '#00d68f',
    glow: 'rgba(0, 214, 143, 0.7)',
  },
};

const CONDUIT_PATHS = [
  {
    fromId: 'tech-district',
    toId: 'residential-block',
    d: 'M 30.5 33.5 C 37 38, 45 32, 52 28',
  },
  {
    fromId: 'residential-block',
    toId: 'repair-lab',
    d: 'M 52 28 C 58 31, 63 33, 68.5 34',
  },
  {
    fromId: 'repair-lab',
    toId: 'scrap-yard',
    d: 'M 68.5 34 C 74 38, 79 43, 85 49',
  },
  {
    fromId: 'scrap-yard',
    toId: 'recycling-center',
    d: 'M 85 49 C 78 54, 71 61, 61.5 68.5',
  },
];

export default function CityMap({ gameState, onLocationSelect, navigate, timer }) {
  const [viewMode, setViewMode] = useState('map'); // default 'map' (3D Isometric Map)
  const [selectedLocationId, setSelectedLocationId] = useState(() => {
    const firstUnlockedIncomplete = locations.find(
      l => gameState.unlockedLocations.includes(l.id) && !gameState.completedLocations.includes(l.id)
    );
    return firstUnlockedIncomplete ? firstUnlockedIncomplete.id : 'tech-district';
  });
  const [hoveredLocationId, setHoveredLocationId] = useState(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [notice, setNotice] = useState(null);

  const mapContainerRef = useRef(null);
  const currentAvatar = gameState.avatar || DEFAULT_AVATAR;

  const isUnlocked = (loc) => gameState.unlockedLocations.includes(loc.id);
  const isCompleted = (loc) => gameState.completedLocations.includes(loc.id);

  const activeDistrict = locations.find(l => l.id === selectedLocationId) || locations[0];
  const activeMeta = QUEST_METADATA[activeDistrict.id] || QUEST_METADATA['tech-district'];
  const activeUnlocked = isUnlocked(activeDistrict);
  const activeCompleted = isCompleted(activeDistrict);

  const completedCount = locations.filter(l => isCompleted(l)).length;

  const handleMouseMove = (e) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -(y * 5).toFixed(2),
      y: (x * 6).toFixed(2),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredLocationId(null);
  };

  const handleWaypointClick = (loc) => {
    setSelectedLocationId(loc.id);
    if (isUnlocked(loc)) {
      onLocationSelect(loc.id);
    } else {
      setNotice(`Zone "${loc.name}" is locked. Complete preceding sector first!`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="page-enter city-map-page" style={{
      minHeight: 'calc(100vh - 4rem)',
      padding: '2rem 1.25rem 5rem',
      background: 'radial-gradient(ellipse at top, #133a27 0%, #06150e 85%)',
    }}>
      <div className="container" style={{ maxWidth: isExpanded ? '1440px' : '1240px', transition: 'max-width 0.3s ease' }}>
        
        {/* Top Header & Quick Profile Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(0, 214, 143, 0.1)',
              border: '1px solid rgba(0, 214, 143, 0.28)',
              borderRadius: '100px',
              padding: '0.25rem 0.85rem',
              marginBottom: '0.45rem',
            }}>
              <Sparkles size={13} color="#00d68f" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: '#00d68f',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}>
                MISSION DISPATCH CENTER // 3D SECTOR SCAN
              </span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
              letterSpacing: '0.04em',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
              textShadow: '0 2px 10px rgba(0, 214, 143, 0.2)',
            }}>
              NOVA CITY QUEST HUBS
            </h1>
            <p style={{
              margin: '0.25rem 0 0',
              color: '#94a3b8',
              fontSize: '0.9375rem',
            }}>
              Investigate the 3D isometric diorama. Clear all 5 districts to save the city's power grid!
            </p>
          </div>

          {/* Quick Wardrobe & View Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('avatar_select')}
              style={{
                background: 'linear-gradient(135deg, rgba(17, 28, 54, 0.9) 0%, rgba(10, 17, 34, 0.95) 100%)',
                border: '1.5px solid rgba(250, 204, 21, 0.45)',
                borderRadius: '16px',
                padding: '0.4rem 0.85rem 0.4rem 0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                transition: 'all 0.2s',
              }}
              title="Change Avatar & Wardrobe"
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #facc15',
              }}>
                <img
                  src={currentAvatar.avatarImg || '/avatars/frog_avatar.jpg'}
                  alt="Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.625rem', fontFamily: 'var(--font-mono)', color: '#facc15', fontWeight: 600 }}>
                  WARDROBE
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                  {currentAvatar.headgearName || 'Frog Hat'}
                </div>
              </div>
            </button>

            {/* View Mode Toggle: 3D MAP vs CARDS */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              padding: '3px',
            }}>
              <button
                onClick={() => setViewMode('map')}
                style={{
                  background: viewMode === 'map' ? 'linear-gradient(135deg, #00d68f 0%, #059669 100%)' : 'transparent',
                  color: viewMode === 'map' ? '#06150e' : '#94a3b8',
                  border: 'none',
                  borderRadius: '11px',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  boxShadow: viewMode === 'map' ? '0 0 14px rgba(0, 214, 143, 0.4)' : 'none',
                }}
              >
                <Compass size={14} />
                <span>3D MAP</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  background: viewMode === 'cards' ? 'linear-gradient(135deg, #00d68f 0%, #059669 100%)' : 'transparent',
                  color: viewMode === 'cards' ? '#06150e' : '#94a3b8',
                  border: 'none',
                  borderRadius: '11px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  boxShadow: viewMode === 'cards' ? '0 0 14px rgba(0, 214, 143, 0.4)' : 'none',
                }}
              >
                <LayoutGrid size={14} />
                <span>CARDS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Temporary Notice Toast */}
        {notice && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.65rem 1rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            color: '#fca5a5',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease',
          }}>
            <AlertTriangle size={16} color="#ef4444" />
            <span>{notice}</span>
          </div>
        )}

        {/* =========================================================================
            PRIMARY VIEW: 3D ISOMETRIC ADVENTURE MAP (Matching Photo 2 in Game Theme)
            ========================================================================= */}
        {viewMode === 'map' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isExpanded ? '1fr' : 'minmax(0, 1fr) 350px',
            gap: '1.5rem',
            alignItems: 'start',
          }}>
            
            {/* 3D Isometric Map Stage Container */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(14, 38, 28, 0.95) 0%, rgba(6, 21, 14, 0.98) 100%)',
                border: '1.5px solid rgba(74, 222, 128, 0.35)',
                borderRadius: '26px',
                padding: '1rem',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(0, 214, 143, 0.15)',
                overflow: 'hidden',
              }}
            >
              {/* Tactical Top Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.4rem 0.75rem 0.85rem',
                borderBottom: '1px solid rgba(74, 222, 128, 0.15)',
                marginBottom: '0.85rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: '#00d68f',
                    boxShadow: '0 0 10px #00d68f',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: '#86efac',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                  }}>
                    ISOMETRIC DIORAMA SCAN // 5 ACTIVE SECTORS
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: '#64748b',
                  }}>
                    CLICK TO DEPLOY • HOVER TO INSPECT
                  </span>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    title={isExpanded ? "Collapse View" : "Expand 3D View"}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '0.25rem 0.5rem',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    <span>{isExpanded ? 'NORMAL' : 'EXPAND'}</span>
                  </button>
                </div>
              </div>

              {/* The 3D Diorama Stage Viewport */}
              <div
                ref={mapContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: '#04100b',
                  perspective: '1200px',
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
                  cursor: 'crosshair',
                }}
              >
                {/* 3D Parallax Canvas Wrapper */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`,
                  transition: 'transform 0.18s ease-out',
                  transformStyle: 'preserve-3d',
                }}>
                  {/* High-res 3D Isometric Map Artwork */}
                  <img
                    src="/assets/nova_3d_isometric_map.jpg"
                    alt="Nova City 3D Isometric Map"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: 'contrast(106%) saturate(110%) brightness(96%)',
                    }}
                  />

                  {/* Atmospheric Cyber-Forest Gradient Vignette */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(4, 16, 11, 0.5) 85%, rgba(4, 16, 11, 0.85) 100%)',
                    pointerEvents: 'none',
                  }} />

                  {/* Tactical Scanline & Holographic Grid Overlay */}
                  <div 
                    className="tactical-scan-overlay" 
                    style={{ position: 'absolute', inset: 0, opacity: 0.3 }} 
                  />

                  {/* SVG Animated Energy Conduits Connecting Bridges */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 2,
                    }}
                  >
                    <defs>
                      <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="0.8" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {CONDUIT_PATHS.map((path, idx) => {
                      const fromLoc = locations.find(l => l.id === path.fromId);
                      const toLoc = locations.find(l => l.id === path.toId);
                      const fromCompleted = fromLoc && isCompleted(fromLoc);
                      const toUnlocked = toLoc && isUnlocked(toLoc);

                      const isLit = fromCompleted || toUnlocked;
                      const isCompleteLink = fromCompleted && toLoc && isCompleted(toLoc);

                      return (
                        <g key={`conduit-${idx}`}>
                          {/* Ambient shadow line behind path */}
                          <path
                            d={path.d}
                            fill="none"
                            stroke="rgba(0, 0, 0, 0.5)"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />

                          {/* Base conduit track */}
                          <path
                            d={path.d}
                            fill="none"
                            stroke={isLit ? 'rgba(74, 222, 128, 0.35)' : 'rgba(255, 255, 255, 0.12)'}
                            strokeWidth={isLit ? '1.4' : '0.8'}
                            strokeDasharray={isLit ? 'none' : '2 2'}
                            strokeLinecap="round"
                          />

                          {/* Pulsing electric stream along the bridge */}
                          {isLit && (
                            <path
                              d={path.d}
                              fill="none"
                              stroke={isCompleteLink ? '#22c55e' : '#38bdf8'}
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              className={isCompleteLink ? 'isometric-conduit-active' : 'isometric-conduit-fast'}
                              filter="url(#neon-glow)"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* 3D Waypoint Beacons on the Diorama Landmarks */}
                  {locations.map((loc) => {
                    const coord = MAP_COORDINATES[loc.id] || { x: 50, y: 50, zone: 1, color: '#38bdf8' };
                    const meta = QUEST_METADATA[loc.id] || QUEST_METADATA['tech-district'];
                    const unlocked = isUnlocked(loc);
                    const completed = isCompleted(loc);
                    const isSelected = selectedLocationId === loc.id;
                    const isHovered = hoveredLocationId === loc.id;
                    const showTooltip = isHovered || (isSelected && !hoveredLocationId);

                    return (
                      <div
                        key={loc.id}
                        style={{
                          position: 'absolute',
                          left: `${coord.x}%`,
                          top: `${coord.y}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: showTooltip ? 30 : isSelected ? 20 : 10,
                          cursor: unlocked ? 'pointer' : 'not-allowed',
                        }}
                        onClick={() => handleWaypointClick(loc)}
                        onMouseEnter={() => setHoveredLocationId(loc.id)}
                        onMouseLeave={() => setHoveredLocationId(null)}
                      >
                        {/* 1. Ground Shadow & Isometric Pulse Ring */}
                        <div style={{
                          position: 'absolute',
                          left: '50%',
                          top: '18px',
                          transform: 'translateX(-50%) rotateX(60deg)',
                          width: '42px',
                          height: '22px',
                          borderRadius: '50%',
                          background: completed
                            ? 'radial-gradient(circle, rgba(0, 214, 143, 0.45) 0%, transparent 70%)'
                            : unlocked
                            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(0, 0, 0, 0.4) 0%, transparent 70%)',
                          pointerEvents: 'none',
                        }}>
                          {unlocked && (
                            <div
                              className="waypoint-ground-ripple"
                              style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                border: completed ? '2px solid #00d68f' : '2px solid #38bdf8',
                              }}
                            />
                          )}
                        </div>

                        {/* 2. Vertical Light Pillar Beam */}
                        <div style={{
                          position: 'absolute',
                          left: '50%',
                          bottom: '16px',
                          transform: 'translateX(-50%)',
                          width: '3px',
                          height: '36px',
                          background: completed
                            ? 'linear-gradient(to top, rgba(0, 214, 143, 0.8), transparent)'
                            : unlocked
                            ? 'linear-gradient(to top, rgba(56, 189, 248, 0.8), transparent)'
                            : 'linear-gradient(to top, rgba(255, 255, 255, 0.15), transparent)',
                          boxShadow: unlocked ? (completed ? '0 0 10px #00d68f' : '0 0 10px #38bdf8') : 'none',
                          pointerEvents: 'none',
                        }} />

                        {/* 3. Floating 3D Waypoint Pin */}
                        <div
                          className={unlocked ? 'waypoint-float' : ''}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            transform: isHovered ? 'scale(1.15) translateY(-6px)' : isSelected ? 'scale(1.08)' : 'scale(1)',
                          }}
                        >
                          {/* Waypoint Diamond / Badge */}
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '14px',
                            background: completed
                              ? 'linear-gradient(135deg, #059669 0%, #00d68f 100%)'
                              : unlocked
                              ? 'linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)'
                              : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                            border: completed
                              ? '2px solid #facc15'
                              : unlocked
                              ? '2px solid #38bdf8'
                              : '1.5px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: completed
                              ? '0 0 20px rgba(0, 214, 143, 0.6), 0 8px 16px rgba(0,0,0,0.5)'
                              : unlocked
                              ? '0 0 22px rgba(56, 189, 248, 0.65), 0 8px 16px rgba(0,0,0,0.5)'
                              : '0 4px 10px rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}>
                            {completed ? (
                              <CheckCircle size={22} color="#ffffff" strokeWidth={2.6} />
                            ) : unlocked ? (
                              <span style={{ fontSize: '1.25rem' }}>{loc.icon}</span>
                            ) : (
                              <Lock size={18} color="#94a3b8" />
                            )}

                            {/* Zone Number Chip on Pin */}
                            <div style={{
                              position: 'absolute',
                              top: '-8px',
                              right: '-8px',
                              background: completed ? '#facc15' : unlocked ? '#38bdf8' : '#475569',
                              color: completed ? '#090e1a' : '#090e1a',
                              fontWeight: 900,
                              fontSize: '0.625rem',
                              fontFamily: 'var(--font-mono)',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1.5px solid #06150e',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                            }}>
                              {coord.zone}
                            </div>
                          </div>

                          {/* Waypoint Label Pill */}
                          <div style={{
                            marginTop: '6px',
                            background: 'rgba(6, 21, 14, 0.88)',
                            backdropFilter: 'blur(8px)',
                            border: isSelected
                              ? `1px solid ${coord.color}`
                              : '1px solid rgba(255, 255, 255, 0.18)',
                            borderRadius: '100px',
                            padding: '0.2rem 0.55rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            whiteSpace: 'nowrap',
                          }}>
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              color: completed ? '#00d68f' : unlocked ? '#ffffff' : '#94a3b8',
                              letterSpacing: '0.04em',
                            }}>
                              {loc.shortName}
                            </span>
                            {completed && (
                              <Star size={10} color="#facc15" fill="#facc15" />
                            )}
                          </div>
                        </div>

                        {/* 4. Interactive Floating Holographic Dossier Tooltip */}
                        {showTooltip && (
                          <div
                            style={{
                              position: 'absolute',
                              ...(coord.y < 35
                                ? { top: 'calc(100% + 14px)' }
                                : { bottom: 'calc(100% + 14px)' }),
                              ...(coord.x > 75
                                ? { right: '-20px' }
                                : coord.x < 35
                                ? { left: '-20px' }
                                : { left: '50%', transform: 'translateX(-50%)' }),
                              width: '260px',
                              background: 'linear-gradient(145deg, rgba(14, 38, 28, 0.98) 0%, rgba(6, 21, 14, 0.98) 100%)',
                              border: `1.5px solid ${completed ? '#00d68f' : unlocked ? '#38bdf8' : 'rgba(255,255,255,0.2)'}`,
                              borderRadius: '18px',
                              padding: '0.9rem',
                              boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 25px rgba(0, 214, 143, 0.25)',
                              backdropFilter: 'blur(16px)',
                              pointerEvents: 'auto',
                              zIndex: 100,
                              animation: 'fadeIn 0.2s ease',
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                              <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.65rem',
                                color: completed ? '#00d68f' : unlocked ? '#38bdf8' : '#94a3b8',
                                fontWeight: 700,
                              }}>
                                ZONE {coord.zone} • {loc.status}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Star size={12} color="#facc15" fill="#facc15" />
                                <span style={{ fontSize: '0.7rem', color: '#facc15', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                                  {meta.starReward}
                                </span>
                              </div>
                            </div>

                            <div style={{
                              fontSize: '0.95rem',
                              fontWeight: 800,
                              color: '#ffffff',
                              marginBottom: '0.2rem',
                            }}>
                              {loc.name}
                            </div>

                            <p style={{
                              fontSize: '0.75rem',
                              color: '#94a3b8',
                              margin: '0 0 0.65rem',
                              lineHeight: 1.35,
                            }}>
                              {loc.description}
                            </p>

                            {/* Action CTA */}
                            {unlocked ? (
                              <button
                                onClick={() => onLocationSelect(loc.id)}
                                style={{
                                  width: '100%',
                                  background: completed
                                    ? 'rgba(0, 214, 143, 0.2)'
                                    : 'linear-gradient(135deg, #00d68f 0%, #0284c7 100%)',
                                  border: completed ? '1px solid rgba(0, 214, 143, 0.5)' : 'none',
                                  color: completed ? '#00d68f' : '#06150e',
                                  fontWeight: 800,
                                  fontSize: '0.75rem',
                                  fontFamily: 'var(--font-mono)',
                                  borderRadius: '10px',
                                  padding: '0.45rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.4rem',
                                  boxShadow: completed ? 'none' : '0 4px 15px rgba(0, 214, 143, 0.4)',
                                }}
                              >
                                <Play size={12} fill={completed ? 'none' : 'currentColor'} />
                                <span>{completed ? 'REPLAY MISSION' : 'ENTER DISTRICT →'}</span>
                              </button>
                            ) : (
                              <div style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                                padding: '0.35rem 0.5rem',
                                color: '#94a3b8',
                                fontSize: '0.7rem',
                                fontFamily: 'var(--font-mono)',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.35rem',
                              }}>
                                <Lock size={11} />
                                <span>Locked: Complete previous zone</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Diorama Footer Info Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid rgba(74, 222, 128, 0.15)',
                marginTop: '0.85rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d68f' }} />
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                      Completed ({completedCount})
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                      Available ({locations.filter(l => isUnlocked(l) && !isCompleted(l)).length})
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#475569' }} />
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                      Locked ({locations.filter(l => !isUnlocked(l)).length})
                    </span>
                  </div>
                </div>

                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: '#86efac',
                  fontWeight: 600,
                }}>
                  SECTOR CLEARANCE: {Math.round((completedCount / locations.length) * 100)}%
                </div>
              </div>
            </div>

            {/* Tactical Right Sidebar: Sector Dossier & District Selector */}
            {!isExpanded && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}>
                {/* Active Sector Dossier Card */}
                <div style={{
                  background: 'linear-gradient(180deg, rgba(14, 38, 28, 0.95) 0%, rgba(6, 21, 14, 0.98) 100%)',
                  border: '1.5px solid rgba(74, 222, 128, 0.35)',
                  borderRadius: '24px',
                  padding: '1.25rem',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.65rem',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: '#00d68f',
                      letterSpacing: '0.1em',
                      fontWeight: 700,
                    }}>
                      SELECTED SECTOR DOSSIER
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      color: activeUnlocked ? '#38bdf8' : '#94a3b8',
                      background: 'rgba(255,255,255,0.06)',
                      padding: '2px 8px',
                      borderRadius: '100px',
                    }}>
                      ZONE {locations.findIndex(l => l.id === activeDistrict.id) + 1} OF 5
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(0, 214, 143, 0.15)',
                      border: '1px solid rgba(0, 214, 143, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      flexShrink: 0,
                    }}>
                      {activeDistrict.icon}
                    </div>
                    <div>
                      <h2 style={{
                        margin: 0,
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: '#ffffff',
                      }}>
                        {activeDistrict.name}
                      </h2>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#86efac',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {activeMeta.questTitle}
                      </div>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.8125rem',
                    color: '#94a3b8',
                    lineHeight: 1.45,
                    margin: '0 0 1rem',
                  }}>
                    {activeDistrict.missionBrief}
                  </p>

                  {/* Hazard Warning Callout */}
                  {activeDistrict.hazardWarning && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '12px',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem',
                    }}>
                      <AlertTriangle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>
                        {activeDistrict.hazardWarning}
                      </span>
                    </div>
                  )}

                  {/* Investigation Target Badges */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.5rem',
                    marginBottom: '1.25rem',
                  }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '10px',
                      padding: '0.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}>
                      <div style={{ fontSize: '0.625rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>TARGET DEVICES</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>
                        {activeDistrict.deviceCount > 0 ? `${activeDistrict.deviceCount} Devices` : 'Safety Violations'}
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '10px',
                      padding: '0.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}>
                      <div style={{ fontSize: '0.625rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>REWARD</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#facc15' }}>
                        +{activeDistrict.completionReward} XP
                      </div>
                    </div>
                  </div>

                  {/* Deploy Action Button */}
                  {activeUnlocked ? (
                    <button
                      onClick={() => onLocationSelect(activeDistrict.id)}
                      style={{
                        width: '100%',
                        background: activeCompleted
                          ? 'rgba(0, 214, 143, 0.15)'
                          : 'linear-gradient(135deg, #00d68f 0%, #0284c7 100%)',
                        border: activeCompleted ? '1.5px solid rgba(0, 214, 143, 0.5)' : 'none',
                        color: activeCompleted ? '#00d68f' : '#06150e',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-mono)',
                        borderRadius: '14px',
                        padding: '0.8rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        boxShadow: activeCompleted ? 'none' : '0 6px 20px rgba(0, 214, 143, 0.45)',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <Play size={16} fill={activeCompleted ? 'none' : 'currentColor'} />
                      <span>{activeCompleted ? 'REPLAY SECTOR' : 'ENTER MISSION DEPLOYMENT'}</span>
                    </button>
                  ) : (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '0.8rem 1rem',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}>
                      <Lock size={14} />
                      <span>Unlock by completing prior district</span>
                    </div>
                  )}
                </div>

                {/* 5-Zone Quick Jump List */}
                <div style={{
                  background: 'linear-gradient(180deg, rgba(14, 38, 28, 0.95) 0%, rgba(6, 21, 14, 0.98) 100%)',
                  border: '1.5px solid rgba(74, 222, 128, 0.25)',
                  borderRadius: '24px',
                  padding: '1.25rem',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: '#86efac',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                  }}>
                    INVESTIGATION CIRCUIT
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {locations.map((loc, idx) => {
                      const unlocked = isUnlocked(loc);
                      const completed = isCompleted(loc);
                      const isSelected = selectedLocationId === loc.id;

                      return (
                        <button
                          key={loc.id}
                          onClick={() => {
                            setSelectedLocationId(loc.id);
                            if (unlocked) {
                              // If already selected, enter
                              if (selectedLocationId === loc.id) {
                                onLocationSelect(loc.id);
                              }
                            }
                          }}
                          style={{
                            background: isSelected
                              ? 'rgba(0, 214, 143, 0.18)'
                              : completed
                              ? 'rgba(0, 214, 143, 0.06)'
                              : unlocked
                              ? 'rgba(56, 189, 248, 0.06)'
                              : 'rgba(255, 255, 255, 0.02)',
                            border: isSelected
                              ? '1.5px solid #00d68f'
                              : completed
                              ? '1px solid rgba(0, 214, 143, 0.3)'
                              : unlocked
                              ? '1px solid rgba(56, 189, 248, 0.2)'
                              : '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            padding: '0.65rem 0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: unlocked ? 'pointer' : 'not-allowed',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontSize: '1.1rem' }}>{loc.icon}</span>
                            <div>
                              <div style={{
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: unlocked ? '#ffffff' : '#64748b',
                              }}>
                                {loc.name}
                              </div>
                              <div style={{
                                fontSize: '0.65rem',
                                color: completed ? '#00d68f' : unlocked ? '#38bdf8' : '#475569',
                                fontFamily: 'var(--font-mono)',
                              }}>
                                Zone {idx + 1} • {completed ? 'Cleared' : unlocked ? 'Active' : 'Locked'}
                              </div>
                            </div>
                          </div>

                          {completed ? (
                            <CheckCircle size={15} color="#00d68f" />
                          ) : unlocked ? (
                            <ChevronRight size={15} color="#38bdf8" />
                          ) : (
                            <Lock size={13} color="#64748b" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SECONDARY VIEW: CARDS MODE (Traditional Quest Cards Grid)
            ========================================================================= */}
        {viewMode === 'cards' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}>
            {locations.map((loc) => {
              const unlocked = isUnlocked(loc);
              const completed = isCompleted(loc);
              const meta = QUEST_METADATA[loc.id] || {
                questTitle: loc.name,
                image: '/quests/revealing_secrets.jpg',
                starReward: '+5',
                stars: 4,
                progressLabel: '3 of 5 done',
                progressPct: 60,
              };

              return (
                <div
                  key={loc.id}
                  onClick={() => unlocked && onLocationSelect(loc.id)}
                  style={{
                    background: 'linear-gradient(180deg, #133827 0%, #0a1f16 100%)',
                    border: completed
                      ? '2px solid #22c55e'
                      : unlocked
                      ? '1.5px solid rgba(74, 222, 128, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: unlocked ? 'pointer' : 'not-allowed',
                    opacity: unlocked ? 1 : 0.65,
                    boxShadow: unlocked
                      ? '0 12px 30px rgba(0,0,0,0.4), 0 0 20px rgba(74, 222, 128, 0.15)'
                      : '0 6px 15px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => unlocked && (e.currentTarget.style.transform = 'translateY(-4px)')}
                  onMouseLeave={(e) => unlocked && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {/* Top Artwork Area */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1.5',
                    overflow: 'hidden',
                    background: '#07150e',
                  }}>
                    <img
                      src={meta.image}
                      alt={loc.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: unlocked ? 'none' : 'grayscale(70%)',
                        transition: 'transform 0.4s ease',
                      }}
                    />

                    {/* Gradient Overlay for card contrast */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, #133827 0%, transparent 60%)',
                    }} />

                    {/* Star Reward Pill in Top-Right */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(250, 204, 21, 0.5)',
                      borderRadius: '100px',
                      padding: '0.25rem 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                    }}>
                      <Star size={14} color="#facc15" fill="#facc15" />
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#facc15',
                      }}>
                        {meta.starReward}
                      </span>
                    </div>

                    {/* Status Pill in Top-Left */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                    }}>
                      {completed ? (
                        <span style={{
                          background: 'rgba(0, 214, 143, 0.9)',
                          color: '#090e1a',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '100px',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}>
                          <CheckCircle size={12} />
                          COMPLETED
                        </span>
                      ) : unlocked ? (
                        <span style={{
                          background: 'rgba(56, 189, 248, 0.25)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(56, 189, 248, 0.5)',
                          color: '#38bdf8',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '100px',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                        }}>
                          ZONE {loc.id === 'tech-district' ? '1' : loc.id === 'residential-block' ? '2' : loc.id === 'repair-lab' ? '3' : loc.id === 'scrap-yard' ? '4' : '5'}
                        </span>
                      ) : (
                        <span style={{
                          background: 'rgba(15, 23, 42, 0.85)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#94a3b8',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '100px',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}>
                          <Lock size={11} />
                          LOCKED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Details Area */}
                  <div style={{
                    padding: '1.25rem 1.25rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    flex: 1,
                  }}>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: '#00d68f',
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                        marginBottom: '0.2rem',
                      }}>
                        {loc.name.toUpperCase()}
                      </div>
                      <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: 0,
                      }}>
                        {meta.questTitle}
                      </h2>
                    </div>

                    <p style={{
                      fontSize: '0.8125rem',
                      color: '#94a3b8',
                      margin: 0,
                      lineHeight: 1.45,
                      flex: 1,
                    }}>
                      {loc.description}
                    </p>

                    {/* Progress Segment or Stars */}
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.4rem',
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: '#e2e8f0',
                          fontWeight: 600,
                        }}>
                          {meta.progressLabel}
                        </span>

                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[1, 2, 3, 4, 5].map((starIdx) => (
                            <Star
                              key={starIdx}
                              size={13}
                              color={starIdx <= meta.stars ? '#facc15' : 'rgba(255,255,255,0.15)'}
                              fill={starIdx <= meta.stars ? '#facc15' : 'none'}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Segmented cyan progress bar */}
                      <div style={{
                        display: 'flex',
                        gap: '4px',
                        height: '8px',
                      }}>
                        {[...Array(10)].map((_, segIdx) => {
                          const isActive = segIdx < Math.round((meta.progressPct / 100) * 10);
                          return (
                            <div
                              key={segIdx}
                              style={{
                                flex: 1,
                                borderRadius: '3px',
                                background: isActive
                                  ? 'linear-gradient(90deg, #38bdf8 0%, #00d68f 100%)'
                                  : 'rgba(255, 255, 255, 0.08)',
                                boxShadow: isActive ? '0 0 6px rgba(56, 189, 248, 0.4)' : 'none',
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Card Action Button */}
                    <div style={{ marginTop: '0.5rem' }}>
                      {unlocked ? (
                        <button
                          className="btn"
                          style={{
                            width: '100%',
                            background: completed
                              ? 'rgba(0, 214, 143, 0.15)'
                              : 'linear-gradient(135deg, #00d68f 0%, #00b4d8 100%)',
                            border: completed ? '1px solid rgba(0, 214, 143, 0.4)' : 'none',
                            color: completed ? '#00d68f' : '#090e1a',
                            fontWeight: 700,
                            borderRadius: '14px',
                            padding: '0.65rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                          }}
                        >
                          <Play size={14} fill={completed ? 'none' : 'currentColor'} />
                          <span>{completed ? 'REPLAY MISSION' : 'ENTER MISSION'}</span>
                        </button>
                      ) : (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '14px',
                          padding: '0.65rem 1rem',
                          textAlign: 'center',
                          color: '#64748b',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                        }}>
                          <Lock size={13} />
                          <span>Complete previous zone to unlock</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
