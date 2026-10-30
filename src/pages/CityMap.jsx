import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Lock, CheckCircle, ChevronRight, MapPin, AlertTriangle, Star, 
  Sparkles, LayoutGrid, Map, Play, Shield, Zap, Compass, Eye, 
  Navigation, Award, RotateCcw, Maximize2, Minimize2, Info, X,
  ZoomIn, ZoomOut, Move
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
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'cards'
  const [selectedLocationId, setSelectedLocationId] = useState(() => {
    const firstUnlockedIncomplete = locations.find(
      l => gameState?.unlockedLocations?.includes(l.id) && !gameState?.completedLocations?.includes(l.id)
    );
    return firstUnlockedIncomplete ? firstUnlockedIncomplete.id : 'tech-district';
  });

  // Mobile Bottom Sheet state
  const [bottomSheetLoc, setBottomSheetLoc] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const inspectParam = urlParams.get('inspect');
      if (inspectParam) {
        return locations.find(l => l.id === inspectParam) || null;
      }
    } catch (e) {}
    return null;
  });

  // Pan & Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [notice, setNotice] = useState(null);

  const mapContainerRef = useRef(null);
  const touchStateRef = useRef({
    touching: false,
    startX: 0,
    startY: 0,
    panStart: { x: 0, y: 0 },
    initialDist: 0,
    initialZoom: 1,
    moved: false,
    lastTapTime: 0,
  });

  const currentAvatar = gameState?.avatar || DEFAULT_AVATAR;

  const isUnlocked = useCallback((loc) => {
    return Boolean(gameState?.unlockedLocations?.includes(loc.id));
  }, [gameState?.unlockedLocations]);

  const isCompleted = useCallback((loc) => {
    return Boolean(gameState?.completedLocations?.includes(loc.id));
  }, [gameState?.completedLocations]);

  const activeDistrict = locations.find(l => l.id === selectedLocationId) || locations[0];
  const activeMeta = QUEST_METADATA[activeDistrict.id] || QUEST_METADATA['tech-district'];
  const activeUnlocked = isUnlocked(activeDistrict);
  const activeCompleted = isCompleted(activeDistrict);

  const completedCount = locations.filter(l => isCompleted(l)).length;

  // Clamping helper so map never flies out of bounds
  const clampPan = (newX, newY, currentZoom) => {
    if (!mapContainerRef.current || currentZoom <= 1) {
      return { x: 0, y: 0 };
    }
    const rect = mapContainerRef.current.getBoundingClientRect();
    const maxX = ((currentZoom - 1) * rect.width) / 2;
    const maxY = ((currentZoom - 1) * rect.height) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    };
  };

  // Touch event handlers for touch-panning and pinch-zooming
  const handleTouchStart = (e) => {
    const now = Date.now();
    const isDoubleTap = now - touchStateRef.current.lastTapTime < 300;
    touchStateRef.current.lastTapTime = now;

    if (isDoubleTap && e.touches.length === 1) {
      // Double tap to toggle zoom between 1x and 1.8x
      if (zoom > 1.1) {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      } else {
        const rect = mapContainerRef.current?.getBoundingClientRect();
        if (rect) {
          const tapX = e.touches[0].clientX - rect.left - rect.width / 2;
          const tapY = e.touches[0].clientY - rect.top - rect.height / 2;
          setZoom(1.8);
          setPan(clampPan(-tapX * 0.8, -tapY * 0.8, 1.8));
        }
      }
      return;
    }

    if (e.touches.length === 1) {
      touchStateRef.current = {
        ...touchStateRef.current,
        touching: true,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        panStart: { ...pan },
        initialDist: 0,
        initialZoom: zoom,
        moved: false,
      };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStateRef.current = {
        ...touchStateRef.current,
        touching: true,
        startX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        startY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        panStart: { ...pan },
        initialDist: dist,
        initialZoom: zoom,
        moved: true,
      };
    }
  };

  const handleTouchMove = (e) => {
    const ts = touchStateRef.current;
    if (!ts.touching) return;

    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - ts.startX;
      const dy = e.touches[0].clientY - ts.startY;
      if (Math.hypot(dx, dy) > 8) {
        ts.moved = true;
      }
      if (zoom > 1) {
        const clamped = clampPan(ts.panStart.x + dx, ts.panStart.y + dy, zoom);
        setPan(clamped);
      }
    } else if (e.touches.length === 2) {
      ts.moved = true;
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (ts.initialDist > 0) {
        const factor = currentDist / ts.initialDist;
        const newZoom = Math.max(1.0, Math.min(2.5, Math.round(ts.initialZoom * factor * 100) / 100));
        setZoom(newZoom);
        setPan(prev => clampPan(prev.x, prev.y, newZoom));
      }
    }
  };

  const handleTouchEnd = () => {
    touchStateRef.current.touching = false;
    if (zoom <= 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  // Zoom button controls
  const handleZoomIn = () => {
    setZoom(prev => {
      const next = Math.min(2.5, Math.round((prev + 0.35) * 100) / 100);
      setPan(current => clampPan(current.x, current.y, next));
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const next = Math.max(1.0, Math.round((prev - 0.35) * 100) / 100);
      if (next === 1.0) {
        setPan({ x: 0, y: 0 });
      } else {
        setPan(current => clampPan(current.x, current.y, next));
      }
      return next;
    });
  };

  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Waypoint Marker Tap Handler -> Opens Mobile Bottom Sheet!
  const handleMarkerTap = (loc, e) => {
    if (e) {
      e.stopPropagation();
    }
    // Prevent accidental click when finishing a pan gesture
    if (touchStateRef.current.moved) {
      return;
    }
    setSelectedLocationId(loc.id);
    setBottomSheetLoc(loc);
  };

  return (
    <div className="page-enter city-map-page" style={{
      minHeight: '100dvh',
      padding: 'calc(var(--safe-top, 0px) + 0.75rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 1.25rem)',
      background: 'radial-gradient(ellipse at top, #113524 0%, #05140d 85%)',
    }}>
      <div className="container" style={{ maxWidth: isExpanded ? '1440px' : '1240px', padding: '0 0.25rem' }}>
        
        {/* Top Header & Mode Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(0, 214, 143, 0.12)',
              border: '1px solid rgba(0, 214, 143, 0.3)',
              borderRadius: '100px',
              padding: '0.2rem 0.65rem',
              marginBottom: '0.35rem',
            }}>
              <Sparkles size={12} color="#00d68f" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: '#86efac',
                letterSpacing: '0.08em',
                fontWeight: 700,
              }}>
                SECTOR SCAN • 5 HUBS
              </span>
            </div>
            
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 4.5vw, 2.2rem)',
              letterSpacing: '0.02em',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.15,
            }}>
              NOVA CITY QUEST HUBS
            </h1>
          </div>

          {/* Quick Wardrobe & View Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('avatar_select')}
              style={{
                background: 'linear-gradient(135deg, rgba(17, 28, 54, 0.9) 0%, rgba(10, 17, 34, 0.95) 100%)',
                border: '1.5px solid rgba(250, 204, 21, 0.45)',
                borderRadius: '14px',
                padding: '0.35rem 0.65rem 0.35rem 0.45rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minHeight: '44px',
                cursor: 'pointer',
              }}
              title="Change Avatar & Wardrobe"
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1.5px solid #facc15',
                flexShrink: 0,
              }}>
                <img
                  src={currentAvatar.avatarImg || '/avatars/frog_avatar.jpg'}
                  alt="Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: '#facc15', fontWeight: 700 }}>
                  WARDROBE
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap' }}>
                  {currentAvatar.headgearName || 'Frog Hat'}
                </div>
              </div>
            </button>

            {/* View Mode Toggle: 3D MAP vs CARDS */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.06)',
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
                  padding: '0.45rem 0.75rem',
                  minHeight: '38px',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Compass size={14} />
                <span>MAP</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  background: viewMode === 'cards' ? 'linear-gradient(135deg, #00d68f 0%, #059669 100%)' : 'transparent',
                  color: viewMode === 'cards' ? '#06150e' : '#94a3b8',
                  border: 'none',
                  borderRadius: '11px',
                  padding: '0.45rem 0.75rem',
                  minHeight: '38px',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
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
            marginBottom: '0.75rem',
            padding: '0.65rem 1rem',
            background: 'rgba(239, 68, 68, 0.18)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            color: '#fca5a5',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <AlertTriangle size={16} color="#ef4444" />
            <span>{notice}</span>
          </div>
        )}

        {/* =========================================================================
            PRIMARY VIEW: PANNABLE & PINCH-ZOOMABLE 3D ISOMETRIC ADVENTURE MAP
            ========================================================================= */}
        {viewMode === 'map' && (
          <div className="city-map-layout">
            
            {/* Map Card Container */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(14, 38, 28, 0.96) 0%, rgba(6, 21, 14, 0.98) 100%)',
                border: '1.5px solid rgba(74, 222, 128, 0.35)',
                borderRadius: '22px',
                padding: '0.75rem',
                position: 'relative',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0, 214, 143, 0.15)',
                overflow: 'hidden',
              }}
            >
              {/* Tactical Top Bar & Touch Instructions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.2rem 0.5rem 0.65rem',
                borderBottom: '1px solid rgba(74, 222, 128, 0.15)',
                marginBottom: '0.65rem',
                flexWrap: 'wrap',
                gap: '0.4rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#00d68f',
                    boxShadow: '0 0 8px #00d68f',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: '#86efac',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                  }}>
                    TAP MARKER TO INSPECT & ENTER
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: '#94a3b8',
                  }}>
                    Pinch / Drag to zoom
                  </span>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    title={isExpanded ? "Collapse View" : "Expand 3D View"}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '0.25rem 0.5rem',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.6875rem',
                      fontFamily: 'var(--font-mono)',
                      minHeight: '36px',
                    }}
                  >
                    {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    <span>{isExpanded ? 'NORM' : 'EXPAND'}</span>
                  </button>
                </div>
              </div>

              {/* THE PANNABLE / PINCH-ZOOMABLE STAGE VIEWPORT */}
              <div
                ref={mapContainerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3', // Optimal height for mobile portrait
                  minHeight: '290px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#04100b',
                  boxShadow: 'inset 0 0 35px rgba(0,0,0,0.85)',
                  touchAction: 'none', // Prevents page scrolling while panning map
                  userSelect: 'none',
                }}
              >
                {/* Transformed Map Artwork Layer with Pan and Zoom */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: touchStateRef.current.touching ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform',
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
                      pointerEvents: 'none',
                    }}
                    draggable={false}
                  />

                  {/* Atmospheric Vignette */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(4, 16, 11, 0.4) 80%, rgba(4, 16, 11, 0.8) 100%)',
                    pointerEvents: 'none',
                  }} />

                  {/* Animated Energy Conduits Connecting Waypoints */}
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
                          <path
                            d={path.d}
                            fill="none"
                            stroke="rgba(0, 0, 0, 0.55)"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                          />
                          <path
                            d={path.d}
                            fill="none"
                            stroke={isLit ? 'rgba(74, 222, 128, 0.4)' : 'rgba(255, 255, 255, 0.12)'}
                            strokeWidth={isLit ? '1.5' : '0.9'}
                            strokeDasharray={isLit ? 'none' : '2 2'}
                            strokeLinecap="round"
                          />
                          {isLit && (
                            <path
                              d={path.d}
                              fill="none"
                              stroke={isCompleteLink ? '#22c55e' : '#38bdf8'}
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              className={isCompleteLink ? 'isometric-conduit-active' : 'isometric-conduit-fast'}
                              filter="url(#neon-glow)"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* 5 LARGE TAPPABLE WAYPOINT MARKERS (>=44px Tap Target) */}
                  {locations.map((loc) => {
                    const coord = MAP_COORDINATES[loc.id] || { x: 50, y: 50, zone: 1, color: '#38bdf8' };
                    const unlocked = isUnlocked(loc);
                    const completed = isCompleted(loc);
                    const isSelected = selectedLocationId === loc.id;

                    return (
                      <div
                        key={loc.id}
                        style={{
                          position: 'absolute',
                          left: `${coord.x}%`,
                          top: `${coord.y}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: isSelected ? 30 : 20,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '10px', // Expands tap target area
                        }}
                        onClick={(e) => handleMarkerTap(loc, e)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select ${loc.name}, Zone ${coord.zone}`}
                      >
                        {/* Ground Pulse Ring */}
                        <div style={{
                          position: 'absolute',
                          left: '50%',
                          top: '28px',
                          transform: 'translateX(-50%) rotateX(60deg)',
                          width: '46px',
                          height: '24px',
                          borderRadius: '50%',
                          background: completed
                            ? 'radial-gradient(circle, rgba(0, 214, 143, 0.6) 0%, transparent 70%)'
                            : unlocked
                            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.6) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(0, 0, 0, 0.5) 0%, transparent 70%)',
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

                        {/* Vertical Light Beam */}
                        <div style={{
                          position: 'absolute',
                          left: '50%',
                          bottom: '22px',
                          transform: 'translateX(-50%)',
                          width: '3px',
                          height: '32px',
                          background: completed
                            ? 'linear-gradient(to top, rgba(0, 214, 143, 0.8), transparent)'
                            : unlocked
                            ? 'linear-gradient(to top, rgba(56, 189, 248, 0.8), transparent)'
                            : 'linear-gradient(to top, rgba(255, 255, 255, 0.15), transparent)',
                          boxShadow: unlocked ? (completed ? '0 0 10px #00d68f' : '0 0 10px #38bdf8') : 'none',
                          pointerEvents: 'none',
                        }} />

                        {/* Large 48px Tappable Waypoint Badge */}
                        <div
                          className={unlocked ? 'waypoint-float' : ''}
                          style={{
                            width: '48px',
                            height: '48px',
                            minWidth: '48px',
                            minHeight: '48px',
                            borderRadius: '16px',
                            background: completed
                              ? 'linear-gradient(135deg, #059669 0%, #00d68f 100%)'
                              : unlocked
                              ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
                              : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                            border: isSelected
                              ? '3px solid #facc15'
                              : completed
                              ? '2.5px solid #00d68f'
                              : unlocked
                              ? '2px solid #38bdf8'
                              : '1.5px solid rgba(255, 255, 255, 0.25)',
                            boxShadow: isSelected
                              ? '0 0 24px rgba(250, 204, 21, 0.8), 0 8px 20px rgba(0,0,0,0.6)'
                              : completed
                              ? '0 0 20px rgba(0, 214, 143, 0.65), 0 8px 18px rgba(0,0,0,0.5)'
                              : unlocked
                              ? '0 0 20px rgba(56, 189, 248, 0.65), 0 8px 18px rgba(0,0,0,0.5)'
                              : '0 4px 12px rgba(0,0,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            transition: 'transform 0.15s ease',
                            transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                          }}
                        >
                          {completed ? (
                            <CheckCircle size={24} color="#ffffff" strokeWidth={2.8} />
                          ) : unlocked ? (
                            <span style={{ fontSize: '1.35rem', lineHeight: 1 }}>{loc.icon}</span>
                          ) : (
                            <Lock size={20} color="#94a3b8" />
                          )}

                          {/* Zone Number Chip */}
                          <div style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: completed ? '#facc15' : unlocked ? '#38bdf8' : '#475569',
                            color: '#090e1a',
                            fontWeight: 900,
                            fontSize: '0.65rem',
                            fontFamily: 'var(--font-mono)',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1.5px solid #06150e',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                          }}>
                            {coord.zone}
                          </div>
                        </div>

                        {/* Waypoint Label Pill */}
                        <div style={{
                          marginTop: '6px',
                          background: 'rgba(6, 21, 14, 0.92)',
                          backdropFilter: 'blur(8px)',
                          border: isSelected
                            ? '1.5px solid #facc15'
                            : '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '100px',
                          padding: '0.2rem 0.55rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none',
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
                    );
                  })}
                </div>

                {/* Tactile On-Screen Zoom & Pan Controls (Top-Right Floating Pill) */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(6, 21, 14, 0.88)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(74, 222, 128, 0.35)',
                  borderRadius: '100px',
                  padding: '3px',
                  zIndex: 40,
                  boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
                }}>
                  <button
                    onClick={handleZoomIn}
                    title="Zoom in"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4ade80',
                      cursor: 'pointer',
                    }}
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={16} />
                  </button>

                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: '#e2e8f0',
                    fontWeight: 700,
                    padding: '0 6px',
                    minWidth: '38px',
                    textAlign: 'center',
                  }}>
                    {Math.round(zoom * 100)}%
                  </span>

                  <button
                    onClick={handleZoomOut}
                    title="Zoom out"
                    disabled={zoom <= 1.0}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: zoom <= 1.0 ? '#475569' : '#4ade80',
                      cursor: zoom <= 1.0 ? 'default' : 'pointer',
                    }}
                    aria-label="Zoom out"
                  >
                    <ZoomOut size={16} />
                  </button>

                  {zoom > 1.0 && (
                    <button
                      onClick={handleResetView}
                      title="Reset view"
                      style={{
                        background: 'rgba(74, 222, 128, 0.15)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#4ade80',
                        cursor: 'pointer',
                        marginLeft: '2px',
                      }}
                      aria-label="Reset zoom and pan"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>

                {/* Bottom Left Quick Status Pill */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(6, 21, 14, 0.88)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(74, 222, 128, 0.25)',
                  borderRadius: '100px',
                  padding: '4px 10px',
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#86efac',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  zIndex: 35,
                  pointerEvents: 'none',
                }}>
                  <Move size={12} />
                  <span>Pan & Zoom Active</span>
                </div>
              </div>

              {/* Map Footer Clearance Progress Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.65rem',
                borderTop: '1px solid rgba(74, 222, 128, 0.15)',
                marginTop: '0.65rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d68f' }} />
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                      Cleared ({completedCount})
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                      Unlocked ({locations.filter(l => isUnlocked(l) && !isCompleted(l)).length})
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#475569' }} />
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                      Locked ({locations.filter(l => !isUnlocked(l)).length})
                    </span>
                  </div>
                </div>

                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: '#86efac',
                  fontWeight: 700,
                }}>
                  CLEARANCE: {Math.round((completedCount / locations.length) * 100)}%
                </div>
              </div>
            </div>

            {/* Tactical Circuit List (Shown beneath map on mobile, or in sidebar on desktop) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {/* Investigation Circuit 5-Zone Cards */}
              <div style={{
                background: 'linear-gradient(180deg, rgba(14, 38, 28, 0.95) 0%, rgba(6, 21, 14, 0.98) 100%)',
                border: '1.5px solid rgba(74, 222, 128, 0.25)',
                borderRadius: '22px',
                padding: '1rem',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: '#86efac',
                  letterSpacing: '0.08em',
                  fontWeight: 700,
                  marginBottom: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span>INVESTIGATION CIRCUIT</span>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>TAP TO INSPECT</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {locations.map((loc, idx) => {
                    const unlocked = isUnlocked(loc);
                    const completed = isCompleted(loc);
                    const isSelected = selectedLocationId === loc.id;

                    return (
                      <button
                        key={loc.id}
                        onClick={() => {
                          setSelectedLocationId(loc.id);
                          setBottomSheetLoc(loc);
                        }}
                        style={{
                          background: isSelected
                            ? 'rgba(0, 214, 143, 0.2)'
                            : completed
                            ? 'rgba(0, 214, 143, 0.08)'
                            : unlocked
                            ? 'rgba(56, 189, 248, 0.08)'
                            : 'rgba(255, 255, 255, 0.03)',
                          border: isSelected
                            ? '1.5px solid #00d68f'
                            : completed
                            ? '1px solid rgba(0, 214, 143, 0.35)'
                            : unlocked
                            ? '1px solid rgba(56, 189, 248, 0.25)'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '14px',
                          padding: '0.65rem 0.85rem',
                          minHeight: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                          width: '100%',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{loc.icon}</span>
                          <div>
                            <div style={{
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: unlocked ? '#ffffff' : '#94a3b8',
                            }}>
                              {loc.name}
                            </div>
                            <div style={{
                              fontSize: '0.6875rem',
                              color: completed ? '#00d68f' : unlocked ? '#38bdf8' : '#64748b',
                              fontFamily: 'var(--font-mono)',
                            }}>
                              Zone {idx + 1} • {completed ? 'Cleared' : unlocked ? 'Unlocked' : 'Locked'}
                            </div>
                          </div>
                        </div>

                        {completed ? (
                          <CheckCircle size={18} color="#00d68f" />
                        ) : unlocked ? (
                          <ChevronRight size={18} color="#38bdf8" />
                        ) : (
                          <Lock size={15} color="#64748b" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECONDARY VIEW: CARDS MODE
            ========================================================================= */}
        {viewMode === 'cards' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.25rem',
          }}>
            {locations.map((loc) => {
              const unlocked = isUnlocked(loc);
              const completed = isCompleted(loc);
              const meta = QUEST_METADATA[loc.id] || {
                questTitle: loc.name,
                image: '/quests/revealing_secrets.jpg',
                starReward: '+5',
                stars: 4,
                progressLabel: 'Inspection',
                progressPct: 60,
              };

              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocationId(loc.id);
                    setBottomSheetLoc(loc);
                  }}
                  style={{
                    background: 'linear-gradient(180deg, #133827 0%, #0a1f16 100%)',
                    border: completed
                      ? '2px solid #22c55e'
                      : unlocked
                      ? '1.5px solid rgba(74, 222, 128, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    opacity: unlocked ? 1 : 0.7,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1.6',
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
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      borderRadius: '100px',
                      padding: '0.25rem 0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}>
                      <Star size={13} color="#facc15" fill="#facc15" />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#facc15', fontWeight: 700 }}>
                        {meta.starReward}
                      </span>
                    </div>

                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      <span style={{
                        background: completed ? 'rgba(0, 214, 143, 0.9)' : unlocked ? 'rgba(56, 189, 248, 0.3)' : 'rgba(15, 23, 42, 0.85)',
                        color: completed ? '#090e1a' : unlocked ? '#38bdf8' : '#94a3b8',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '100px',
                        fontSize: '0.6875rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        border: '1px solid rgba(255,255,255,0.15)',
                      }}>
                        {completed ? 'CLEARED' : unlocked ? 'UNLOCKED' : 'LOCKED'}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <div style={{ fontSize: '0.6875rem', color: '#00d68f', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {loc.name.toUpperCase()}
                    </div>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      {meta.questTitle}
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.4, flex: 1 }}>
                      {loc.description}
                    </p>

                    <button
                      className="btn"
                      style={{
                        width: '100%',
                        minHeight: '44px',
                        background: unlocked
                          ? completed
                            ? 'rgba(0, 214, 143, 0.2)'
                            : 'linear-gradient(135deg, #00d68f 0%, #00b4d8 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        color: completed ? '#00d68f' : unlocked ? '#090e1a' : '#64748b',
                        fontWeight: 700,
                        borderRadius: '12px',
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      {completed ? <CheckCircle size={15} /> : unlocked ? <Play size={15} /> : <Lock size={15} />}
                      <span>{completed ? 'INSPECT / REPLAY' : unlocked ? 'INSPECT & ENTER' : 'LOCKED'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* =========================================================================
          MOBILE BOTTOM SHEET MODAL (TRIGGERED BY TAPPING ANY WAYPOINT MARKER)
          ========================================================================= */}
      {bottomSheetLoc && typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          {/* Dark blurred backdrop */}
          <div
            onClick={() => setBottomSheetLoc(null)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              animation: 'fadeIn 0.2s ease',
            }}
          />

          {/* Slide-Up Drawer */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: '80dvh',
              overflowY: 'auto',
              background: 'linear-gradient(180deg, #0e2a1e 0%, #06150e 100%)',
              borderTop: '2.5px solid rgba(74, 222, 128, 0.55)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '0.75rem 1rem calc(var(--safe-bottom, 0px) + 1rem)',
              boxShadow: '0 -12px 40px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 214, 143, 0.25)',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              zIndex: 10000,
            }}
          >
            {/* Grab Handle */}
            <div style={{
              width: '38px',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255, 255, 255, 0.3)',
              margin: '0 auto 0.65rem',
            }} />

            {/* Header: Zone Status Pill & Close Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: isCompleted(bottomSheetLoc)
                    ? 'rgba(0, 214, 143, 0.25)'
                    : isUnlocked(bottomSheetLoc)
                    ? 'rgba(56, 189, 248, 0.25)'
                    : 'rgba(255, 255, 255, 0.08)',
                  color: isCompleted(bottomSheetLoc)
                    ? '#00d68f'
                    : isUnlocked(bottomSheetLoc)
                    ? '#38bdf8'
                    : '#94a3b8',
                  border: isCompleted(bottomSheetLoc)
                    ? '1.5px solid rgba(0, 214, 143, 0.5)'
                    : isUnlocked(bottomSheetLoc)
                    ? '1.5px solid rgba(56, 189, 248, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '100px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  {isCompleted(bottomSheetLoc) ? (
                    <>
                      <CheckCircle size={12} />
                      ZONE {locations.findIndex(l => l.id === bottomSheetLoc.id) + 1} • COMPLETED
                    </>
                  ) : isUnlocked(bottomSheetLoc) ? (
                    <>
                      <Sparkles size={12} />
                      ZONE {locations.findIndex(l => l.id === bottomSheetLoc.id) + 1} • UNLOCKED
                    </>
                  ) : (
                    <>
                      <Lock size={12} />
                      ZONE {locations.findIndex(l => l.id === bottomSheetLoc.id) + 1} • LOCKED
                    </>
                  )}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Star size={12} color="#facc15" fill="#facc15" />
                  <span style={{ fontSize: '0.75rem', color: '#facc15', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {(QUEST_METADATA[bottomSheetLoc.id] || {}).starReward || '+5'} Stars
                  </span>
                </div>
              </div>

              <button
                onClick={() => setBottomSheetLoc(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                aria-label="Close bottom sheet"
              >
                <X size={18} />
              </button>
            </div>

            {/* District Icon & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'rgba(0, 214, 143, 0.15)',
                border: '1.5px solid rgba(0, 214, 143, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.45rem',
                flexShrink: 0,
              }}>
                {bottomSheetLoc.icon}
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}>
                  {bottomSheetLoc.name}
                </h2>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#86efac',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}>
                  {(QUEST_METADATA[bottomSheetLoc.id] || {}).questTitle || bottomSheetLoc.shortName}
                </div>
              </div>
            </div>

            {/* Mission Brief Description */}
            <p style={{
              fontSize: '0.82rem',
              color: '#cbd5e1',
              lineHeight: 1.45,
              margin: '0 0 0.65rem',
            }}>
              {bottomSheetLoc.missionBrief || bottomSheetLoc.description}
            </p>

            {/* Hazard Warning Callout */}
            {bottomSheetLoc.hazardWarning && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                padding: '0.45rem 0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                marginBottom: '0.65rem',
              }}>
                <AlertTriangle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.75rem', color: '#fca5a5', lineHeight: 1.35 }}>
                  {bottomSheetLoc.hazardWarning}
                </span>
              </div>
            )}

            {/* Target Devices & Rewards grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.45rem',
              marginBottom: '0.85rem',
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '10px',
                padding: '0.45rem 0.65rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <div style={{ fontSize: '0.625rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>TARGET DEVICES</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38bdf8' }}>
                  {bottomSheetLoc.deviceCount > 0 ? `${bottomSheetLoc.deviceCount} Devices` : 'Safety Violations'}
                </div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '10px',
                padding: '0.45rem 0.65rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <div style={{ fontSize: '0.625rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>CLEARANCE REWARD</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#facc15' }}>
                  +{bottomSheetLoc.completionReward || 200} XP
                </div>
              </div>
            </div>

            {/* ACTION: THE "GO" BUTTON */}
            {isUnlocked(bottomSheetLoc) ? (
              <button
                onClick={() => {
                  const locId = bottomSheetLoc.id;
                  setBottomSheetLoc(null);
                  onLocationSelect(locId);
                }}
                id="bottomsheet-go-btn"
                style={{
                  width: '100%',
                  minHeight: '52px',
                  background: isCompleted(bottomSheetLoc)
                    ? 'rgba(0, 214, 143, 0.25)'
                    : 'linear-gradient(135deg, #00d68f 0%, #0284c7 100%)',
                  border: isCompleted(bottomSheetLoc) ? '1.5px solid #00d68f' : 'none',
                  color: isCompleted(bottomSheetLoc) ? '#00d68f' : '#04150d',
                  fontWeight: 800,
                  fontSize: '1rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                  borderRadius: '16px',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  boxShadow: isCompleted(bottomSheetLoc) ? 'none' : '0 8px 25px rgba(0, 214, 143, 0.45)',
                }}
              >
                <Play size={18} fill={isCompleted(bottomSheetLoc) ? 'none' : 'currentColor'} />
                <span>{isCompleted(bottomSheetLoc) ? 'REPLAY DISTRICT MISSION' : 'GO • ENTER DISTRICT'}</span>
              </button>
            ) : (
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '0.85rem 1rem',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}>
                <Lock size={16} />
                <span>Locked: Complete previous zone to unlock</span>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
