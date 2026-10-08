import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react';
import { sortingItems } from '../data/devices';

const BINS = [
  { id: 'reuse', label: 'REUSE', emoji: '🔄', color: 'var(--accent-green)', bg: 'rgba(0,214,143,0.08)', border: 'rgba(0,214,143,0.25)' },
  { id: 'repair', label: 'REPAIR', emoji: '🔧', color: 'var(--accent-blue)', bg: 'rgba(0,180,216,0.08)', border: 'rgba(0,180,216,0.25)' },
  { id: 'recycle', label: 'RECYCLE', emoji: '♻️', color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
  { id: 'special', label: 'SPECIAL HANDLING', emoji: '⚠️', color: 'var(--accent-red)', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
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
  const [dragOver, setDragOver] = useState(null);

  const item = sortingItems[currentItem];

  const comboMessages = [
    { threshold: 3, label: 'ECO COMBO', color: 'var(--accent-green)' },
    { threshold: 5, label: 'RESOURCE SAVER', color: 'var(--accent-blue)' },
    { threshold: 7, label: 'E-WASTE EXPERT', color: 'var(--accent-amber)' },
    { threshold: 10, label: 'RECYCLING MASTER', color: '#f59e0b' },
  ];

  const getCurrentCombo = (count) => {
    return comboMessages.filter(c => count >= c.threshold).pop();
  };

  const handleSort = (binId) => {
    if (sorted[item.id]) return;
    const correct = binId === item.category;
    const newStreak = correct ? streak + 1 : 0;
    const newCorrect = correct ? correctCount + 1 : correctCount;
    const newTotal = totalSorted + 1;

    setSorted(prev => ({ ...prev, [item.id]: { bin: binId, correct } }));
    setStreak(newStreak);
    setCorrectCount(newCorrect);
    setTotalSorted(newTotal);
    setShowResult({ correct, bin: binId });

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
        if (onComplete && newTotal >= sortingItems.length) {
          // Don't auto-complete, show summary first
        }
      }
    }, 1500);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('itemId', item.id);
  };

  const handleDrop = (e, binId) => {
    e.preventDefault();
    setDragOver(null);
    handleSort(binId);
  };

  const accuracy = totalSorted > 0 ? Math.round((correctCount / totalSorted) * 100) : 0;

  return (
    <div className="page-enter" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('map')} style={{ gap: '0.25rem' }}>
            <ChevronLeft size={14} /> MAP
          </button>
          <div>
            <div className="data-label">LOCATION 05</div>
            <h1 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              ♻️ RECYCLING CENTER
            </h1>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className="badge badge-green">OPERATIONAL</span>
            {combo && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: combo.color,
                animation: 'scorePop 0.4s ease',
              }}>
                🔥 {combo.label}
              </span>
            )}
          </div>
        </div>

        {!complete ? (
          <div>
            {/* Stats bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              marginBottom: '1.5rem',
            }}>
              {[
                { label: 'SORTED', value: `${totalSorted}/${sortingItems.length}`, color: 'var(--text-primary)' },
                { label: 'CORRECT', value: correctCount, color: 'var(--accent-green)' },
                { label: 'ACCURACY', value: `${accuracy}%`, color: accuracy >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)' },
                { label: 'STREAK', value: `${streak}x`, color: streak >= 3 ? 'var(--accent-amber)' : 'var(--text-secondary)' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.875rem',
                  textAlign: 'center',
                }}>
                  <div className="data-label" style={{ marginBottom: '4px' }}>{stat.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="progress-track" style={{ height: '8px' }}>
                <div
                  className="progress-fill progress-green"
                  style={{ width: `${(totalSorted / sortingItems.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current item */}
            {currentItem < sortingItems.length && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  border: `2px solid ${showResult ? (showResult.correct ? 'rgba(0,214,143,0.5)' : 'rgba(239,68,68,0.5)') : 'var(--border-card)'}`,
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  textAlign: 'center',
                  maxWidth: '340px',
                  margin: '0 auto',
                  transition: 'border-color 0.3s',
                }}>
                  <div className="data-label" style={{ marginBottom: '0.75rem' }}>INCOMING ITEM — SORT NOW</div>
                  <div
                    draggable
                    onDragStart={handleDragStart}
                    style={{
                      fontSize: '4rem',
                      marginBottom: '1rem',
                      cursor: 'grab',
                      userSelect: 'none',
                      display: 'inline-block',
                      animation: 'float 3s ease-in-out infinite',
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{item.name}</h3>

                  {showResult && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      color: showResult.correct ? 'var(--accent-green)' : 'var(--accent-red)',
                      fontWeight: 600,
                      animation: 'scaleIn 0.3s ease',
                    }}>
                      {showResult.correct ? <CheckCircle size={20} /> : <X size={20} />}
                      {showResult.correct ? '+30 pts' : 'Wrong bin!'}
                    </div>
                  )}

                  {!showResult && (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      Drag to a bin or click a bin below
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Bins */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
            }}>
              {BINS.map(bin => (
                <div
                  key={bin.id}
                  onDragOver={e => { e.preventDefault(); setDragOver(bin.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => handleDrop(e, bin.id)}
                  onClick={() => !showResult && handleSort(bin.id)}
                  style={{
                    background: dragOver === bin.id ? bin.bg : 'var(--bg-card)',
                    border: `2px dashed ${dragOver === bin.id ? bin.color : bin.border}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                  onMouseEnter={e => { if (!showResult) e.currentTarget.style.background = bin.bg; }}
                  onMouseLeave={e => { if (!showResult && dragOver !== bin.id) e.currentTarget.style.background = 'var(--bg-card)'; }}
                  id={`bin-${bin.id}`}
                >
                  <div style={{ fontSize: '2rem' }}>{bin.emoji}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: bin.color,
                    letterSpacing: '0.08em',
                  }}>
                    {bin.label}
                  </div>
                  {/* Show sorted count */}
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {Object.values(sorted).filter(s => s.bin === bin.id).length} items
                  </div>
                </div>
              ))}
            </div>

            {/* Combo guide */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span className="data-label">COMBO SYSTEM:</span>
              {comboMessages.map(c => (
                <span key={c.label} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: streak >= c.threshold ? c.color : 'var(--text-muted)',
                  fontWeight: streak >= c.threshold ? 700 : 400,
                }}>
                  {c.threshold}× = {c.label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* Complete */
          <div style={{ maxWidth: '580px' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(0,214,143,0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>♻️</div>
                <h2 style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }}>Recycling Center Complete!</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  All {sortingItems.length} items sorted. {correctCount} correct.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Items Sorted', value: totalSorted, color: 'var(--text-primary)' },
                  { label: 'Correct', value: correctCount, color: 'var(--accent-green)' },
                  { label: 'Accuracy', value: `${accuracy}%`, color: accuracy >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)' },
                  { label: 'Best Combo', value: getCurrentCombo(Math.max(...Object.values(sorted).reduce((acc, _, i) => [...acc, i+1], [])))?.label || 'None', color: 'var(--accent-amber)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                    <div className="data-label" style={{ marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Achievement badge */}
              {correctCount >= 7 && (
                <div style={{
                  padding: '0.875rem 1.25rem',
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <span style={{ fontSize: '1.5rem' }}>🏆</span>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--accent-amber)', fontSize: '0.875rem' }}>
                      E-WASTE EXPERT
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      7+ correct sorts — excellent environmental knowledge!
                    </div>
                  </div>
                </div>
              )}

              <button className="btn btn-primary w-full" onClick={onComplete}>
                COMPLETE ALL ZONES <ChevronRight size={14} />
              </button>
            </div>

            {/* Sorting key */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem',
            }}>
              <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.875rem', letterSpacing: '0.1em' }}>
                SORTING KEY
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sortingItems.map(si => {
                  const result = sorted[si.id];
                  const bin = BINS.find(b => b.id === si.category);
                  return (
                    <div key={si.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: result ? (result.correct ? 'rgba(0,214,143,0.05)' : 'rgba(239,68,68,0.05)') : 'transparent',
                    }}>
                      <span style={{ fontSize: '1.125rem', width: '28px', textAlign: 'center' }}>{si.icon}</span>
                      <span style={{ fontSize: '0.8125rem', flex: 1 }}>{si.name}</span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: bin?.color,
                        minWidth: '100px',
                        textAlign: 'right',
                      }}>
                        {bin?.label}
                      </span>
                      {result && (
                        result.correct
                          ? <CheckCircle size={14} color="var(--accent-green)" />
                          : <X size={14} color="var(--accent-red)" />
                      )}
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
