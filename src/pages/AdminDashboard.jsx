import React, { useState } from 'react';
import {
  Shield, LogOut, Database, HelpCircle, Map, User, CheckCircle2,
  AlertTriangle, Filter, Eye, Sparkles, ChevronRight, FileText,
  TrendingUp, TrendingDown, Minus, BarChart2
} from 'lucide-react';
import { devices, repairLabDevices } from '../data/devices';
import { questions, finalActionPlanStrategies } from '../data/questions';
import { LEVELS } from '../data/locations';

// ─── Helpers ────────────────────────────────────────────
const sign = (n) => (n > 0 ? '+' : '') + n;
const ptColor = (n) => n > 0 ? 'var(--accent-green)' : n < 0 ? 'var(--accent-red)' : 'var(--text-muted)';

// Build aggregate stats from question data
function buildStats() {
  let totalOpts = 0, positiveOpts = 0, negativeOpts = 0, maxScore = 0, minScore = 0;
  questions.forEach(q => {
    q.options.forEach(o => {
      totalOpts++;
      if (o.points > 0) { positiveOpts++; maxScore += o.points; }
      if (o.points < 0) { negativeOpts++; minScore += o.points; }
    });
  });
  return { totalOpts, positiveOpts, negativeOpts, maxScore, minScore };
}

// ─── Sub-components ─────────────────────────────────────
function OptionRow({ opt, isCorrect, isBest }) {
  const hasPts = typeof opt.points === 'number';
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.625rem',
      padding: '0.875rem 1rem',
      background: isCorrect ? 'rgba(0,214,143,0.07)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${isCorrect ? 'rgba(0,214,143,0.4)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        {/* Key badge */}
        <div style={{
          flexShrink: 0,
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: isCorrect ? 'var(--accent-green)' : 'rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '0.8125rem',
          color: isCorrect ? '#000' : 'var(--text-secondary)',
        }}>
          {opt.key}
        </div>

        {/* Option text */}
        <div style={{ flex: 1, fontSize: '0.875rem', color: isCorrect ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.5 }}>
          {opt.text}
          {isCorrect && (
            <span style={{
              marginLeft: '0.5rem',
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              background: 'rgba(0,214,143,0.2)',
              color: 'var(--accent-green)',
              padding: '2px 8px',
              borderRadius: '100px',
              letterSpacing: '0.08em',
              fontWeight: 700,
            }}>
              ✓ CORRECT
            </span>
          )}
        </div>
      </div>

      {/* Scoring row */}
      {hasPts && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.9375rem',
            color: ptColor(opt.points),
          }}>
            {sign(opt.points)} pts
          </span>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            display: 'flex',
            gap: '0.625rem',
            flexWrap: 'wrap',
          }}>
            <span style={{ color: ptColor(opt.ecoImpact) }}>Eco {sign(opt.ecoImpact)}</span>
            <span style={{ color: ptColor(opt.recoveryImpact) }}>Recovery {sign(opt.recoveryImpact)}</span>
            <span style={{ color: ptColor(-opt.cityRisk) }}>Risk {sign(opt.cityRisk)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ q, idx }) {
  const bestOpt = q.options.reduce((best, o) => (o.points > best.points ? o : best), q.options[0]);
  const isWeighted = q.scoringType === 'weighted-choice';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-card)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem 1rem',
      marginBottom: '1rem',
    }}>
      {/* Card header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>{q.level}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ID: {q.id}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            padding: '2px 8px',
            borderRadius: '100px',
            background: isWeighted ? 'rgba(139,92,246,0.12)' : 'rgba(0,180,216,0.12)',
            color: isWeighted ? 'var(--accent-purple)' : 'var(--accent-blue)',
            border: isWeighted ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(0,180,216,0.3)',
          }}>
            {isWeighted ? 'WEIGHTED CHOICE' : 'SINGLE CORRECT'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          <span className="badge badge-green" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            Best: +{bestOpt.points} pts
          </span>
          <span className="badge badge-amber" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            CORRECT: {q.correctAnswer}
          </span>
        </div>
      </div>

      {/* Question text */}
      <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.875rem', lineHeight: 1.55, fontWeight: 600 }}>
        Q{idx + 1}. {q.question}
      </h3>

      {/* Options with per-option scoring */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.875rem' }}>
        {q.options.map(opt => (
          <OptionRow
            key={opt.key}
            opt={opt}
            isCorrect={opt.key === q.correctAnswer}
            isBest={opt.key === bestOpt.key}
          />
        ))}
      </div>

      {/* Explanation & Impact Banner */}
      <div style={{
        padding: '0.875rem 1rem',
        background: 'rgba(0,0,0,0.35)',
        borderLeft: '3px solid var(--accent-green)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.875rem',
        lineHeight: 1.6,
      }}>
        <div style={{ fontWeight: 700, color: 'var(--accent-green)', marginBottom: '0.375rem', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          EXPLANATION (CORRECT ANSWER: OPTION {q.correctAnswer})
        </div>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          {q.explanation}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--accent-green)' }}>Eco: {sign(q.ecoImpact)}</span>
          <span style={{ color: 'var(--accent-blue)' }}>Recovery: {sign(q.recoveryImpact)}</span>
          <span style={{ color: 'var(--accent-amber)' }}>Risk: {sign(q.cityRisk)}</span>
          <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>Award: +{q.points} pts</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────
export default function AdminDashboard({ gameState, onLogout, navigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [levelFilter, setLevelFilter] = useState('ALL');

  const allDevices = [...devices, ...repairLabDevices];
  const stats = buildStats();

  // Level-wise question counts (dynamic)
  const FILTERS = [
    { key: 'ALL', label: 'ALL' },
    { key: 'tech-district', label: 'TECH DISTRICT' },
    { key: 'residential-block', label: 'RESIDENTIAL BLOCK' },
    { key: 'repair-lab', label: 'REPAIR LAB' },
    { key: 'scrap-yard', label: 'SCRAP YARD' },
    { key: 'recycling-center', label: 'RECYCLING CENTER' },
  ];
  const levelCounts = {};
  FILTERS.forEach(f => {
    levelCounts[f.key] = f.key === 'ALL'
      ? questions.length
      : questions.filter(q => q.levelId === f.key).length;
  });

  const filteredQuestions = levelFilter === 'ALL'
    ? questions
    : questions.filter(q => q.levelId === levelFilter);

  const handleLogoutClick = () => {
    window.localStorage.removeItem('ewaste-admin-auth');
    onLogout();
    navigate('admin');
  };

  const TABS = [
    { id: 'overview', label: 'OVERVIEW', icon: <Shield size={14} /> },
    { id: 'questions', label: 'QUESTION BANK', icon: <HelpCircle size={14} /> },
    { id: 'answerkey', label: 'ANSWER KEY', icon: <CheckCircle2 size={14} /> },
    { id: 'finalplan', label: 'ACTION PLAN', icon: <BarChart2 size={14} /> },
    { id: 'devices', label: 'DEVICE DB', icon: <Database size={14} /> },
    { id: 'progression', label: 'PROGRESSION', icon: <Map size={14} /> },
    { id: 'session', label: 'PLAYER SESSION', icon: <User size={14} /> },
  ];

  return (
    <div className="page-enter" style={{
      padding: '1rem 0 calc(var(--bottom-nav-total-height, 70px) + 2rem)',
      minHeight: '100dvh',
    }}>
      <div className="container">

        {/* ── Top Header ── */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', flexShrink: 0,
              background: 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={22} color="var(--accent-green)" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="data-label" style={{ color: 'var(--accent-green)', letterSpacing: '0.08em', fontSize: '0.6875rem' }}>
                NOVA CITY E-WASTE RESPONSE SYSTEM
              </div>
              <h1 style={{ fontSize: '1.1875rem', fontFamily: 'var(--font-display)', letterSpacing: '0.04em', margin: 0, lineHeight: 1.25 }}>
                ADMIN CONTROL CENTER
              </h1>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Authorized personnel only</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
              <CheckCircle2 size={13} /> AUTHENTICATED
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleLogoutClick}
              id="admin-logout-btn"
              style={{ minHeight: '44px', gap: '0.375rem', padding: '0 1rem' }}
            >
              <LogOut size={14} /> LOGOUT
            </button>
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}>
          {[
            { label: 'TOTAL ZONES', val: LEVELS.length, color: 'var(--accent-blue)', icon: <Map size={13} /> },
            { label: 'QUESTIONS', val: questions.length, color: 'var(--accent-green)', icon: <HelpCircle size={13} /> },
            { label: 'DEVICES', val: allDevices.length, color: 'var(--accent-amber)', icon: <Database size={13} /> },
            { label: 'PLAYER SCORE', val: `${gameState?.score || 0} pts`, color: 'var(--accent-green)', icon: <Sparkles size={13} /> },
            { label: 'ZONES DONE', val: `${gameState?.completedLocations?.length || 0}/${LEVELS.length}`, color: 'var(--accent-blue)', icon: <CheckCircle2 size={13} /> },
            { label: 'BADGES', val: gameState?.achievements?.length || 0, color: '#f59e0b', icon: <Eye size={13} /> },
          ].map((c, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '0.875rem 1rem' }}>
              <div className="data-label" style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem' }}>{c.icon} {c.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: c.color }}>{c.val}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs (horizontal scrollable with 44px tap targets) ── */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'} btn-sm`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                gap: '0.375rem',
                whiteSpace: 'nowrap',
                minHeight: '44px',
                padding: '0 0.875rem',
                fontSize: '0.8125rem',
                flexShrink: 0,
              }}
              id={`admin-tab-${tab.id}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════ */}
        {/* TAB: OVERVIEW */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-xl)', padding: '1.25rem 1rem' }}>
              <div className="data-label" style={{ marginBottom: '0.5rem', color: 'var(--accent-green)' }}>SYSTEM STATUS</div>
              <h2 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Nova City E-Waste Response Engine</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Full transparency into question banks, master answer key with per-option scoring, device specifications, progression tracking, and player session telemetry.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { title: 'Central Device Store', desc: 'Single Source of Truth (src/data/devices.js)', color: 'var(--accent-amber)' },
                  { title: 'Central Question Bank', desc: `${questions.length} questions with full per-option scoring (src/data/questions.js)`, color: 'var(--accent-green)' },
                  { title: 'Admin-Only Scoring', desc: 'Correct answers + points hidden from players until post-answer reveal', color: 'var(--accent-blue)' },
                ].map(c => (
                  <div key={c.title} style={{ padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div className="data-label" style={{ marginBottom: '4px', color: c.color }}>{c.title}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* TAB: QUESTION BANK (full per-option scoring)  */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === 'questions' && (
          <div>
            {/* Level filter - horizontal scrollable */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              overflowX: 'auto',
              paddingBottom: '0.375rem',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
            }}>
              <span className="data-label" style={{ flexShrink: 0, marginRight: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                <Filter size={12} /> LEVEL:
              </span>
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  className={`btn ${levelFilter === f.key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setLevelFilter(f.key)}
                  style={{
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    minHeight: '40px',
                    padding: '0 0.75rem',
                  }}
                >
                  {f.label} ({levelCounts[f.key]})
                </button>
              ))}
            </div>

            {filteredQuestions.map((q, idx) => (
              <QuestionCard key={q.id} q={q} idx={idx} />
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* TAB: ANSWER KEY — Level-wise with full stats  */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === 'answerkey' && (
          <div>
            {/* Summary Banner */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(0,214,143,0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem 1rem',
              marginBottom: '1rem',
            }}>
              <div className="data-label" style={{ color: 'var(--accent-green)', marginBottom: '0.75rem' }}>
                MASTER ANSWER KEY — STATISTICAL SUMMARY
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {[
                  { label: 'Total Questions', val: questions.length, color: 'var(--accent-blue)' },
                  { label: 'Total Options', val: stats.totalOpts, color: 'var(--text-primary)' },
                  { label: 'Positive Options', val: stats.positiveOpts, color: 'var(--accent-green)' },
                  { label: 'Negative Options', val: stats.negativeOpts, color: 'var(--accent-red)' },
                  { label: 'Max Possible', val: `+${stats.maxScore} pts`, color: 'var(--accent-green)' },
                  { label: 'Min Possible', val: `${stats.minScore} pts`, color: 'var(--accent-red)' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div className="data-label" style={{ fontSize: '0.6875rem', marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: s.color, fontSize: '1rem' }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Level filter */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              overflowX: 'auto',
              paddingBottom: '0.375rem',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
            }}>
              <span className="data-label" style={{ flexShrink: 0, marginRight: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                <Filter size={12} /> LEVEL:
              </span>
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  className={`btn ${levelFilter === f.key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setLevelFilter(f.key)}
                  style={{
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    minHeight: '40px',
                    padding: '0 0.75rem',
                  }}
                >
                  {f.label} ({levelCounts[f.key]})
                </button>
              ))}
            </div>

            {/* Level group header (when filtered) */}
            {levelFilter !== 'ALL' && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(0,180,216,0.07)',
                border: '1px solid rgba(0,180,216,0.25)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8125rem' }}>
                  {FILTERS.find(f => f.key === levelFilter)?.label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {levelCounts[levelFilter]} question{levelCounts[levelFilter] !== 1 ? 's' : ''}
                </div>
              </div>
            )}

            {filteredQuestions.map((q, idx) => (
              <QuestionCard key={q.id} q={q} idx={idx} />
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* TAB: FINAL ACTION PLAN SCORING               */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === 'finalplan' && (
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-xl)', padding: '1.25rem 1rem', marginBottom: '1rem' }}>
              <div className="data-label" style={{ color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>FINAL ACTION PLAN — ADMIN SCORING VIEW</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                These values are used in the final Nova City E-Waste Action Plan challenge.
                Budget: <strong style={{ color: 'var(--text-primary)' }}>₹10,000 cap.</strong> Selecting all 5 costs ₹{finalActionPlanStrategies.reduce((s, x) => s + x.cost, 0).toLocaleString()} — <span style={{ color: 'var(--accent-red)' }}>exceeds budget by ₹{(finalActionPlanStrategies.reduce((s, x) => s + x.cost, 0) - 10000).toLocaleString()}</span>, so players must choose strategically.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {finalActionPlanStrategies.map((s) => (
                <div key={s.id} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.25rem 1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '1.75rem' }}>{s.emoji}</div>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{s.label}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{s.effect}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--accent-amber)' }}>
                      Cost: ₹{s.cost.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {[
                      { label: 'Eco Impact', val: `+${s.eco}`, color: 'var(--accent-green)' },
                      { label: 'Recovery', val: `+${s.recovery}`, color: 'var(--accent-blue)' },
                      { label: 'Risk Reduction', val: `-${s.riskReduction}`, color: 'var(--accent-green)' },
                      { label: 'Bonus Score', val: `+${s.bonusScore} pts`, color: 'var(--accent-amber)' },
                    ].map(m => (
                      <div key={m.label} style={{ padding: '0.625rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                        <div className="data-label" style={{ marginBottom: '2px', fontSize: '0.6875rem' }}>{m.label}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', color: m.color }}>{m.val}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Best suited for:</strong> {s.bestSuited}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* TAB: DEVICE DATABASE                         */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === 'devices' && (
          <div>
            <div className="data-label" style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }}>
              CENTRAL DEVICE DATABASE — ALL SCORING REVEALED
            </div>
            {allDevices.map((dev, idx) => {
              const decisionKeys = dev.decisions ? Object.keys(dev.decisions) : [];
              const bestKey = decisionKeys.length
                ? decisionKeys.reduce((best, k) => dev.decisions[k].score > dev.decisions[best].score ? k : best, decisionKeys[0])
                : null;

              return (
                <div key={dev.id + idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-xl)', padding: '1.25rem 1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '1.75rem' }}>{dev.emoji || '📱'}</div>
                    <div style={{ flex: 1, minWidth: '140px' }}>
                      <h3 style={{ fontSize: '1rem', margin: '0 0 0.25rem 0' }}>{dev.name}</h3>
                      <span className="badge badge-blue" style={{ fontSize: '0.6875rem' }}>{dev.location || 'Repair Lab'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                      <span className={`badge badge-${dev.hazardColor || 'amber'}`} style={{ fontSize: '0.6875rem' }}>Hazard: {dev.hazardLevel || 'MEDIUM'}</span>
                      <span className="badge badge-green" style={{ fontSize: '0.6875rem' }}>Recovery: {dev.recoveryValue || 'HIGH'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.875rem' }}>
                    {[
                      { label: 'Age', val: dev.age || 'N/A' },
                      { label: 'Condition', val: dev.condition },
                      { label: 'Battery', val: dev.battery || 'Functional' },
                      { label: 'Data Status', val: dev.data || 'N/A' },
                    ].map(f => (
                      <div key={f.label} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                        <div className="data-label" style={{ fontSize: '0.625rem', marginBottom: '2px' }}>{f.label}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{f.val}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,214,143,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '0.875rem' }}>
                    <div className="data-label" style={{ color: 'var(--accent-green)', marginBottom: '0.25rem', fontSize: '0.6875rem' }}>🔍 ADDITIONAL CLUE</div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                      "{dev.additionalClue || 'Standard diagnostic inspection complete.'}"
                    </p>
                  </div>

                  {/* Per-decision scoring */}
                  {decisionKeys.length > 0 && (
                    <div>
                      <div className="data-label" style={{ marginBottom: '0.5rem', color: 'var(--accent-amber)', fontSize: '0.6875rem' }}>DECISION SCORING BREAKDOWN</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {decisionKeys.map(k => {
                          const d = dev.decisions[k];
                          const isBest = k === bestKey;
                          return (
                            <div key={k} style={{
                              padding: '0.75rem',
                              background: isBest ? 'rgba(0,214,143,0.07)' : d.correct ? 'rgba(0,180,216,0.05)' : 'rgba(239,68,68,0.05)',
                              border: `1px solid ${isBest ? 'rgba(0,214,143,0.35)' : d.correct ? 'rgba(0,180,216,0.25)' : 'rgba(239,68,68,0.2)'}`,
                              borderRadius: 'var(--radius-md)',
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', color: isBest ? 'var(--accent-green)' : d.correct ? 'var(--accent-blue)' : 'var(--accent-red)' }}>
                                  {k} {isBest ? '★ BEST' : d.correct ? '✓ OK' : '✗ POOR'}
                                </span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', color: ptColor(d.score) }}>
                                  +{d.score} pts
                                </span>
                              </div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                                <span style={{ color: ptColor(d.ecoImpact) }}>Eco {sign(d.ecoImpact)}</span>
                                <span style={{ color: ptColor(d.resourceRecovery) }}>Recovery {sign(d.resourceRecovery)}</span>
                                <span style={{ color: ptColor(-d.cityRisk) }}>Risk {sign(d.cityRisk)}</span>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{d.feedback}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* TAB: GAME PROGRESSION                        */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === 'progression' && (
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-xl)', padding: '1.25rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.0625rem', margin: 0 }}>District Progression</h2>
                <span className="badge badge-green" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                  ZONES: {gameState?.completedLocations?.length || 0}/{LEVELS.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {LEVELS.map(level => {
                  const isUnlocked = gameState?.unlockedLocations?.includes(level.id);
                  const isCompleted = gameState?.completedLocations?.includes(level.id);
                  const levelQCount = questions.filter(q => q.levelId === level.id).length;

                  return (
                    <div key={level.id} style={{
                      padding: '1rem',
                      background: isCompleted ? 'rgba(0,214,143,0.05)' : isUnlocked ? 'rgba(0,180,216,0.05)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isCompleted ? 'rgba(0,214,143,0.3)' : isUnlocked ? 'rgba(0,180,216,0.3)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ fontSize: '1.5rem' }}>{isCompleted ? '✅' : isUnlocked ? '🔓' : '🔒'}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{level.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {level.id}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Questions: {levelQCount}</span>
                        {isCompleted
                          ? <span className="badge badge-green">COMPLETED</span>
                          : isUnlocked
                            ? <span className="badge badge-blue">IN PROGRESS</span>
                            : <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>LOCKED</span>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* TAB: PLAYER SESSION                          */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === 'session' && (
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-xl)', padding: '1.25rem 1rem' }}>
              <div className="data-label" style={{ color: 'var(--accent-blue)', marginBottom: '0.375rem' }}>LOCAL SESSION TELEMETRY</div>
              <h2 style={{ fontSize: '1.0625rem', marginBottom: '1rem' }}>Current Session (localStorage)</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                  { label: 'Cadet Name', val: gameState?.playerName || 'Officer Unknown' },
                  { label: 'Total Score', val: `${gameState?.score || 0} pts` },
                  { label: 'Eco Impact', val: sign(gameState?.ecoImpact || 0) },
                  { label: 'Recovery', val: sign(gameState?.resourceRecovery || 0) },
                  { label: 'City Risk', val: `${gameState?.cityRisk || 50}%` },
                  { label: 'Time Left', val: (() => { const t = gameState?.timeRemaining || 900; return `${Math.floor(t/60)}m ${t%60}s`; })() },
                  { label: 'Inspected', val: gameState?.inspectedDevices?.length || 0 },
                  { label: 'Decisions', val: gameState?.decisions?.length || 0 },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                    <div className="data-label" style={{ marginBottom: '2px', fontSize: '0.6875rem' }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Completed Levels */}
              <div className="data-label" style={{ marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>COMPLETED DISTRICTS</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {LEVELS.map(l => {
                  const done = gameState?.completedLocations?.includes(l.id);
                  const unlocked = gameState?.unlockedLocations?.includes(l.id);
                  return (
                    <span key={l.id} className={`badge ${done ? 'badge-green' : unlocked ? 'badge-blue' : ''}`}
                      style={{ fontSize: '0.75rem', ...((!done && !unlocked) ? { background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' } : {}) }}>
                      {done ? '✅' : unlocked ? '🔓' : '🔒'} {l.name}
                    </span>
                  );
                })}
              </div>

              {/* Achievements */}
              <div className="data-label" style={{ marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>ACHIEVEMENTS UNLOCKED</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {gameState?.achievements?.length > 0
                  ? gameState.achievements.map(a => <span key={a} className="badge badge-amber" style={{ fontSize: '0.75rem' }}>🏆 {a}</span>)
                  : <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>No achievements yet</span>}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
