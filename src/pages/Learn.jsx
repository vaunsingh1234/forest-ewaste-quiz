import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { learnTopics, realWorldActions } from '../data/educationalContent';
import { GRADE_LEVELS } from '../data/gradeData';
import { playGuideChime, speakGuideText } from '../utils/audio';

const colorMap = {
  green: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(74,222,128,0.3)', text: '#00d68f' },
  blue: { bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)', text: '#00b4d8' },
  red: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
  amber: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
  purple: { bg: 'rgba(192,132,252,0.12)', border: 'rgba(192,132,252,0.3)', text: '#c084fc' },
};

export default function Learn({ navigate }) {
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('grades'); // grades | topics | actions

  return (
    <div className="page-enter learn-page" style={{
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
            JUNIOR ECO-KNOWLEDGE CENTER
          </div>
          <h1 style={{
            fontSize: '1.4rem',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em',
            margin: '0 0 0.35rem',
            color: '#ffffff',
            fontWeight: 800,
          }}>
            LEARN BEFORE YOU PLAY 🌱
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
            Master e-waste principles, toxic material hazards, and circular economy strategies.
          </p>
        </div>

        {/* Responsive Tab Bar (Single Row, No Overflow) */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          marginBottom: '1.25rem',
          padding: '4px',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '16px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>
          {[
            { id: 'grades', label: '🌱 Directives' },
            { id: 'topics', label: '📚 Science' },
            { id: 'actions', label: '🌍 Real Actions' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                playGuideChime('pop');
                setActiveTab(tab.id);
              }}
              style={{
                flex: 1,
                minHeight: '44px',
                padding: '0.45rem 0.5rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                background: activeTab === tab.id ? '#22c55e' : 'transparent',
                color: activeTab === tab.id ? '#071b10' : '#cbd5e1',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: CORE DIRECTIVES (Single Column Cards) */}
        {activeTab === 'grades' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Pip's Field Briefing */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
              border: '1.5px solid rgba(74, 222, 128, 0.35)',
              borderRadius: '20px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #4ade80',
                flexShrink: 0,
              }}>
                <img src="/avatars/frog_avatar.jpg" alt="Pip" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#f0fdf4' }}>
                  Pip's Environmental Field Manual
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#bbf7d0', lineHeight: 1.4, marginTop: '2px' }}>
                  Tap "Listen" on any directive to hear audio guidance!
                </div>
              </div>
            </div>

            {/* Directive Cards (1-Column) */}
            {GRADE_LEVELS.map(g => (
              <div
                key={g.id}
                style={{
                  background: 'rgba(6, 30, 18, 0.85)',
                  border: '1.5px solid rgba(74, 222, 128, 0.25)',
                  borderRadius: '20px',
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{g.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                        {g.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#4ade80', fontFamily: 'var(--font-mono)' }}>
                        Directive: {g.badge}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playGuideChime('hint');
                      speakGuideText(`${g.name}: ${g.description}. ${g.eWasteConcept}. ${g.superRule}`);
                    }}
                    style={{
                      minHeight: '36px',
                      background: 'rgba(74, 222, 128, 0.15)',
                      border: '1px solid rgba(74, 222, 128, 0.4)',
                      borderRadius: '10px',
                      color: '#4ade80',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      flexShrink: 0,
                    }}
                  >
                    <Volume2 size={14} />
                    <span>Listen</span>
                  </button>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#f0fdf4',
                  lineHeight: 1.5,
                }}>
                  {g.eWasteConcept}
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.8125rem',
                  color: '#fef3c7',
                  fontWeight: 600,
                }}>
                  ⚡ {g.superRule}
                </div>
              </div>
            ))}

          </div>
        )}

        {/* TAB 2: SCIENCE TOPICS (Single Column Accordion Cards) */}
        {activeTab === 'topics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {learnTopics.map(topic => {
              const colors = colorMap[topic.color] || colorMap.green;
              const isExpanded = expandedTopic === topic.id;

              return (
                <div
                  key={topic.id}
                  style={{
                    background: 'rgba(6, 30, 18, 0.85)',
                    border: `1.5px solid ${isExpanded ? colors.border : 'rgba(74, 222, 128, 0.2)'}`,
                    borderRadius: '20px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                    style={{
                      width: '100%',
                      minHeight: '64px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: '#ffffff',
                    }}
                  >
                    <div style={{
                      fontSize: '1.6rem',
                      width: '44px',
                      height: '44px',
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {topic.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff' }}>
                        {topic.title}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.3, marginTop: '2px' }}>
                        {topic.summary}
                      </div>
                    </div>

                    <div style={{ color: '#94a3b8', flexShrink: 0 }}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div style={{ padding: '0 1rem 1.25rem', animation: 'fadeDown 0.25s ease' }}>
                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '1rem' }} />

                      {topic.content.map((section, i) => (
                        <div key={i} style={{ marginBottom: '0.85rem' }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: colors.text, margin: '0 0 0.25rem 0' }}>
                            {section.heading}
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                            {section.text}
                          </p>
                        </div>
                      ))}

                      {/* Quick Facts */}
                      <div style={{
                        marginTop: '0.85rem',
                        padding: '0.85rem',
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '14px',
                      }}>
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: colors.text,
                          fontWeight: 800,
                          marginBottom: '0.4rem',
                          letterSpacing: '0.08em',
                        }}>
                          QUICK FACTS
                        </div>
                        {topic.quickFacts.map((fact, i) => (
                          <div key={i} style={{ display: 'flex', gap: '0.4rem', fontSize: '0.8125rem', color: '#f0fdf4', marginBottom: '0.25rem', lineHeight: 1.4 }}>
                            <span style={{ color: colors.text, flexShrink: 0 }}>▸</span>
                            <span>{fact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: REAL WORLD ACTIONS (Single Column Cards) */}
        {activeTab === 'actions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(0, 214, 143, 0.1)',
              border: '1.5px solid #00d68f',
              borderRadius: '20px',
              padding: '1.15rem',
            }}>
              <h2 style={{ fontSize: '1.05rem', margin: '0 0 0.35rem 0', color: '#00d68f', fontWeight: 800 }}>
                🌍 TAKE ACTION IN THE REAL WORLD
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                Knowledge matters most when practiced! Apply these 3 essential habits in your everyday tech usage:
              </p>
            </div>

            {realWorldActions.map((action, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(6, 30, 18, 0.85)',
                  border: '1.5px solid rgba(74, 222, 128, 0.25)',
                  borderRadius: '20px',
                  padding: '1.15rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                }}
              >
                <div style={{ fontSize: '2.25rem', lineHeight: 1, flexShrink: 0 }}>{action.icon}</div>
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.25rem 0' }}>
                    {action.action}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    {action.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sticky Action Button at Bottom: Begin Investigation */}
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
            <span>ENTER NOVA SANCTUARY MAP</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
