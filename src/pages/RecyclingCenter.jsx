import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, X, Sparkles, Flame } from 'lucide-react';
import { sortingItems } from '../data/devices';

const BINS = [
  { id: 'reuse', label: 'REUSE', emoji: '🔄', color: '#00d68f', bg: 'rgba(0, 214, 143, 0.15)', border: '#00d68f' },
  { id: 'repair', label: 'REPAIR', emoji: '🔧', color: '#00b4d8', bg: 'rgba(0, 180, 216, 0.15)', border: '#00b4d8' },
  { id: 'recycle', label: 'RECYCLE', emoji: '♻️', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b' },
  { id: 'special', label: 'SPECIAL', emoji: '⚠️', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444' },
];

export default function RecyclingCenter({ gameState, updateState, onComplete, navigate }) {
  const [sorted, setSorted] = useState({});
  const [currentItem, setCurrentItem] = useState(0);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalSorted, setTotalSorted] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [complete, setComplete] = useState(false);
  const [cardSelected, setCardSelected] = useState(false);

  // Pointer drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredBinId, setHoveredBinId] = useState(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const item = sortingItems[currentItem];

  const comboMessages = [
    { threshold: 3, label: 'ECO COMBO', color: '#00d68f' },
    { threshold: 5, label: 'RESOURCE SAVER', color: '#00b4d8' },
    { threshold: 7, label: 'E-WASTE EXPERT', color: '#f59e0b' },
    { threshold: 10, label: 'RECYCLING MASTER', color: '#ec4899' },
  ];

  const getCurrentCombo = (count) => {
    return comboMessages.filter(c => count >= c.threshold).pop();
  };

  const handleSort = (binId) => {
    if (!item || sorted[item.id] || showResult) return;
    const correct = binId === item.category;
    const newStreak = correct ? streak + 1 : 0;
    const newCorrect = correct ? correctCount + 1 : correctCount;
    const newTotal = totalSorted + 1;

    setSorted(prev => ({ ...prev, [item.id]: { bin: binId, correct } }));
    setStreak(newStreak);
    setCorrectCount(newCorrect);
    setTotalSorted(newTotal);
    setShowResult({ correct, bin: binId });
    setCardSelected(false);

    const currentCombo = getCurrentCombo(newStreak);
    if (currentCombo) setCombo(currentCombo);

    updateState(prev => ({
      ...prev,
      score: prev.score + (correct ? 30 : 0),
      recyclingScore: newCorrect,
    }));

    setTimeout(() => {
      setShowResult(null);
      if (currentItem < sortingItems.length - 1) {
        setCurrentItem(prev => prev + 1);
      } else {
        setComplete(true);
      }
    }, 1300);
  };

  // Touch & Pointer Drag and Drop Handlers
  const handlePointerDown = (e) => {
    if (showResult || !item) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    setIsDragging(true);
    setCardSelected(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });

    // Detect if hovering over any bin
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const binEl = element?.closest('[data-bin-id]');
    const foundBinId = binEl ? binEl.getAttribute('data-bin-id') : null;
    setHoveredBinId(foundBinId);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const binEl = element?.closest('[data-bin-id]');
    const targetBinId = binEl ? binEl.getAttribute('data-bin-id') : null;
    
    setHoveredBinId(null);
    setDragOffset({ x: 0, y: 0 });

    if (targetBinId) {
      handleSort(targetBinId);
    }
  };

  const accuracy = totalSorted > 0 ? Math.round((correctCount / totalSorted) * 100) : 0;

  return (
    <div className="page-enter recycling-center-page" style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      padding: 'calc(var(--safe-top, 0px) + 0.75rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 1.25rem)',
      background: 'radial-gradient(ellipse at top, #11281c 0%, #030e07 85%)',
      color: '#f0fdf4',
      overflowX: 'hidden',
    }}>
      <div className="container" style={{
        maxWidth: '640px',
        margin: '0 auto',
        padding: '0 0.25rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              className="btn btn-ghost"
              onClick={() => navigate('map')}
              style={{ minHeight: '44px', minWidth: '44px', padding: '0.4rem 0.75rem', gap: '0.25rem', fontSize: '0.875rem' }}
            >
              <ChevronLeft size={16} /> MAP
            </button>
            <div>
              <div className="data-label" style={{ color: '#00d68f', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                LOCATION 05 — FINAL ZONE
              </div>
              <h1 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', margin: 0, fontWeight: 800 }}>
                ♻️ RECYCLING CENTER
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-green" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>SORTING ACTIVE</span>
            {combo && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: combo.color,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                animation: 'scorePop 0.4s ease',
              }}>
                <Flame size={14} /> {combo.label}
              </span>
            )}
          </div>
        </div>

        {!complete ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}>
            
            {/* Compact Top Metrics Bar (>= 14px text) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.4rem',
              background: 'rgba(6, 30, 18, 0.75)',
              border: '1px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '16px',
              padding: '0.65rem 0.5rem',
              textAlign: 'center',
            }}>
              <div>
                <div className="data-label" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ITEM</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 800, color: '#f0fdf4' }}>
                  {totalSorted + 1}/{sortingItems.length}
                </div>
              </div>
              <div>
                <div className="data-label" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>CORRECT</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 800, color: '#00d68f' }}>
                  {correctCount}
                </div>
              </div>
              <div>
                <div className="data-label" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ACCURACY</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 800, color: accuracy >= 70 ? '#00d68f' : '#f59e0b' }}>
                  {accuracy}%
                </div>
              </div>
              <div>
                <div className="data-label" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>STREAK</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 800, color: streak >= 3 ? '#f59e0b' : '#94a3b8' }}>
                  {streak}x
                </div>
              </div>
            </div>

            {/* Progress track */}
            <div className="progress-track" style={{ height: '6px', background: 'rgba(255,255,255,0.1)', margin: '0' }}>
              <div
                className="progress-fill progress-green"
                style={{ width: `${(totalSorted / sortingItems.length) * 100}%`, transition: 'width 0.4s ease' }}
              />
            </div>

            {/* Active Item Card: Centered Above Bins */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem 0',
              minHeight: '200px',
            }}>
              {item && (
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onClick={() => setCardSelected(true)}
                  style={{
                    width: '100%',
                    maxWidth: '340px',
                    background: 'rgba(7, 35, 20, 0.9)',
                    border: `2px solid ${
                      showResult
                        ? (showResult.correct ? '#00d68f' : '#ef4444')
                        : (cardSelected || isDragging ? '#00d68f' : 'rgba(74, 222, 128, 0.35)')
                    }`,
                    borderRadius: '24px',
                    padding: '1.25rem 1rem',
                    textAlign: 'center',
                    touchAction: 'none',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) ${isDragging ? 'scale(1.05)' : 'scale(1)'}`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease, border-color 0.2s ease',
                    boxShadow: isDragging
                      ? '0 16px 36px rgba(0,0,0,0.7), 0 0 20px rgba(0,214,143,0.4)'
                      : '0 8px 24px rgba(0,0,0,0.5)',
                    zIndex: isDragging ? 50 : 2,
                  }}
                >
                  <div className="data-label" style={{ color: '#4ade80', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                    INCOMING E-WASTE ITEM
                  </div>

                  <div style={{
                    fontSize: '4.5rem',
                    lineHeight: 1,
                    margin: '0.4rem 0',
                    animation: isDragging ? 'none' : 'float 3.5s ease-in-out infinite',
                    pointerEvents: 'none',
                  }}>
                    {item.icon}
                  </div>

                  <h3 style={{ fontSize: '1.15rem', margin: '0 0 0.35rem 0', fontWeight: 800, color: '#ffffff' }}>
                    {item.name}
                  </h3>

                  {showResult ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      color: showResult.correct ? '#00d68f' : '#ef4444',
                      fontWeight: 800,
                      fontSize: '1rem',
                      animation: 'scaleIn 0.3s ease',
                      marginTop: '0.4rem',
                    }}>
                      {showResult.correct ? <CheckCircle size={22} /> : <X size={22} />}
                      <span>{showResult.correct ? '+30 PTS ALLOCATED!' : 'INCORRECT RECEPTACLE!'}</span>
                    </div>
                  ) : (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.4rem 0.75rem',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      color: cardSelected ? '#00d68f' : '#cbd5e1',
                      fontWeight: cardSelected ? 700 : 500,
                    }}>
                      {cardSelected ? '👇 Tap a destination bin below!' : 'Drag or tap any bin below to sort'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pinned Bins Docked at Bottom (2x2 Grid, >= 64px tap height) */}
            <div style={{
              background: 'rgba(4, 20, 12, 0.85)',
              border: '1.5px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '20px',
              padding: '0.75rem',
              backdropFilter: 'blur(10px)',
            }}>
              <div className="data-label" style={{
                color: '#94a3b8',
                fontSize: '0.75rem',
                textAlign: 'center',
                marginBottom: '0.5rem',
                letterSpacing: '0.08em',
              }}>
                DISPOSAL DESTINATION BINS (TAP OR DROP)
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.65rem',
              }}>
                {BINS.map(bin => {
                  const isHovered = hoveredBinId === bin.id;
                  const binCount = Object.values(sorted).filter(s => s.bin === bin.id).length;

                  return (
                    <div
                      key={bin.id}
                      data-bin-id={bin.id}
                      onClick={() => !showResult && handleSort(bin.id)}
                      style={{
                        minHeight: '68px',
                        background: isHovered ? bin.bg : 'rgba(255, 255, 255, 0.04)',
                        border: `2px ${isHovered ? 'solid' : 'dashed'} ${isHovered ? bin.color : bin.border}`,
                        borderRadius: '16px',
                        padding: '0.6rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        cursor: showResult ? 'default' : 'pointer',
                        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{bin.emoji}</span>
                        <div>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 800,
                            color: bin.color,
                            letterSpacing: '0.05em',
                            fontFamily: 'var(--font-mono)',
                          }}>
                            {bin.label}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                            {binCount} sorted
                          </div>
                        </div>
                      </div>

                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)',
                        border: `1px solid ${bin.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: bin.color,
                      }}>
                        ↓
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          /* Recycling Center Complete Summary */
          <div style={{
            background: 'rgba(6, 30, 18, 0.85)',
            border: '1.5px solid #00d68f',
            borderRadius: '24px',
            padding: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>🎉</div>
            <div>
              <h2 style={{ color: '#00d68f', margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: 800 }}>
                Recycling Center Complete!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                All {sortingItems.length} electronic components evaluated. You achieved {correctCount} accurate destination sorts, saving valuable copper, cobalt, and gold while blocking chemical hazards!
              </p>
            </div>

            {/* Performance Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '0.85rem' }}>
                <div className="data-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>ACCURACY</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: accuracy >= 70 ? '#00d68f' : '#f59e0b' }}>
                  {accuracy}%
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '0.85rem' }}>
                <div className="data-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>MAX STREAK</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
                  {streak}x
                </div>
              </div>
            </div>

            {/* Expert Badge if >= 7 correct */}
            {correctCount >= 7 && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1.5px solid #f59e0b',
                borderRadius: '16px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textAlign: 'left',
              }}>
                <span style={{ fontSize: '2rem' }}>🏆</span>
                <div>
                  <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.9375rem' }}>E-WASTE EXPERT BADGE</div>
                  <div style={{ fontSize: '0.8125rem', color: '#cbd5e1' }}>
                    7+ correct sorts — highest honors in circular electronics management!
                  </div>
                </div>
              </div>
            )}

            {/* Next Step CTA */}
            <button
              className="btn btn-primary"
              onClick={onComplete}
              style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
            >
              COMPLETE ALL ZONES & VIEW DEBRIEF <ChevronRight size={16} />
            </button>

            {/* Sorting Reference Codex Table (>= 14px text) */}
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '1rem',
              textAlign: 'left',
            }}>
              <div className="data-label" style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.65rem' }}>
                E-WASTE SORTING AUDIT LOG
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {sortingItems.map(si => {
                  const res = sorted[si.id];
                  const bin = BINS.find(b => b.id === si.category);

                  return (
                    <div
                      key={si.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '10px',
                        background: res
                          ? (res.correct ? 'rgba(0, 214, 143, 0.08)' : 'rgba(239, 68, 68, 0.08)')
                          : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${
                          res
                            ? (res.correct ? 'rgba(0, 214, 143, 0.2)' : 'rgba(239, 68, 68, 0.2)')
                            : 'transparent'
                        }`,
                        fontSize: '0.875rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{si.icon}</span>
                        <span style={{ fontWeight: 600, color: '#f0fdf4' }}>{si.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: bin?.color,
                        }}>
                          {bin?.label}
                        </span>
                        {res && (
                          res.correct
                            ? <CheckCircle size={16} color="#00d68f" />
                            : <X size={16} color="#ef4444" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
