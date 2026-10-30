import React, { useState } from 'react';
import { 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  ShieldAlert, 
  Sparkles, 
  FileText, 
  HelpCircle,
  RefreshCw,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

const MYSTERY_CAUSES = [
  { id: 'fast-replace', text: 'Residents replaced devices too quickly', impact: 'High e-waste generation rate', icon: '📱' },
  { id: 'normal-garbage', text: 'Electronics thrown into regular garbage', impact: 'Toxic contamination of landfills', icon: '🗑️' },
  { id: 'no-repair', text: 'Repair options were ignored', impact: 'Unnecessary resource depletion', icon: '🔧' },
  { id: 'no-data-erase', text: 'Personal data not erased before disposal', impact: 'Data security breaches', icon: '🛡️' },
  { id: 'informal-recycle', text: 'Unauthorized disposal channels used', impact: 'Health and environmental damage', icon: '⚠️' },
];

const CITY_PRIORITIES = [
  { id: 1, title: 'Reduce unnecessary device replacement', desc: 'Prevent functioning or fixable electronics from entering the waste stream.' },
  { id: 2, title: 'Protect citizens from hazardous e-waste', desc: 'Safely handle toxic components like damaged lithium batteries and heavy metals.' },
  { id: 3, title: 'Recover valuable materials', desc: 'Extract precious metals and rare elements from end-of-life electronics.' },
  { id: 4, title: 'Keep usable devices in circulation', desc: 'Redirect working or refurbish-able equipment to communities and organizations.' },
];

const STRATEGIES = [
  {
    id: 'repair',
    label: 'REPAIR PROGRAM',
    emoji: '🔧',
    cost: 3500,
    effect: 'Extends usable device life by restoring damaged components.',
    bestSuited: 'Repairable devices with minor mechanical or hardware faults.',
    category: 'life-extension',
    safetyImpact: 'Medium',
    recoveryImpact: 'Medium',
  },
  {
    id: 'reuse',
    label: 'REUSE PROGRAM',
    emoji: '🔄',
    cost: 2000,
    effect: 'Keeps functional electronics in circulation without heavy processing.',
    bestSuited: 'Working devices that owner no longer needs.',
    category: 'life-extension',
    safetyImpact: 'Low',
    recoveryImpact: 'Low',
  },
  {
    id: 'donate',
    label: 'DONATION NETWORK',
    emoji: '🤝',
    cost: 1500,
    effect: 'Transfers usable devices to schools, non-profits, and underfunded institutions.',
    bestSuited: 'Functional devices that still have useful remaining service life.',
    category: 'social-life',
    safetyImpact: 'Low',
    recoveryImpact: 'Low',
  },
  {
    id: 'recycle',
    label: 'AUTHORIZED RECYCLING',
    emoji: '♻️',
    cost: 4000,
    effect: 'Enables controlled recovery of precious metals and raw elements in certified centers.',
    bestSuited: 'End-of-life, obsolete, or non-repairable electronic hardware.',
    category: 'recovery',
    safetyImpact: 'High',
    recoveryImpact: 'Very High',
  },
  {
    id: 'dispose',
    label: 'RESPONSIBLE DISPOSAL',
    emoji: '🏭',
    cost: 2500,
    effect: 'Handles items requiring specialized hazardous chemical and battery treatment.',
    bestSuited: 'Severely corrupted, dangerous, or hazardous chemical waste.',
    category: 'safety',
    safetyImpact: 'Very High',
    recoveryImpact: 'Low',
  },
];

const REASONING_OPTIONS = [
  {
    id: 'extend-life',
    text: 'Prioritize extending the life of devices that are still usable.',
    requiredTypes: ['repair', 'reuse', 'donate'],
  },
  {
    id: 'replace-old',
    text: 'Focus entirely on replacing old electronics with brand new ones.',
    isAntiPattern: true,
  },
  {
    id: 'safe-hazards',
    text: 'Prioritize safe handling of toxic components and hazardous materials.',
    requiredTypes: ['dispose', 'recycle'],
  },
  {
    id: 'recover-materials',
    text: 'Recover valuable raw materials from devices that can no longer be reused.',
    requiredTypes: ['recycle'],
  },
];

const TOTAL_BUDGET = 10000;

export default function FinalMystery({ gameState, updateState, onComplete }) {
  const [phase, setPhase] = useState('reveal'); // 'reveal' | 'action-plan' | 'result'
  const [selectedActions, setSelectedActions] = useState([]);
  const [selectedReasoning, setSelectedReasoning] = useState([]);
  const [revealedCauses, setRevealedCauses] = useState([]);
  const [validationError, setValidationError] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Stats derived from game state
  const inspectedCount = gameState?.inspectedDevices?.length || 6;
  const repairedCount = gameState?.devicesRepaired || 3;
  const donatedCount = gameState?.devicesDonated || 2;
  const hazardsCount = gameState?.hazardsFound || 4;
  const recycledCount = gameState?.devicesRecycled || 3;

  const handleRevealCause = (id) => {
    if (!revealedCauses.includes(id)) {
      setRevealedCauses(prev => [...prev, id]);
      updateState(prev => ({ ...prev, score: (prev?.score || 0) + 20 }));
    }
  };

  const allRevealed = revealedCauses.length >= MYSTERY_CAUSES.length;

  const totalCost = selectedActions.reduce((sum, id) => {
    const s = STRATEGIES.find(item => item.id === id);
    return sum + (s ? s.cost : 0);
  }, 0);

  const remainingBudget = TOTAL_BUDGET - totalCost;

  const toggleAction = (id) => {
    setValidationError(null);
    setSelectedActions(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleReasoning = (id) => {
    setValidationError(null);
    setSelectedReasoning(prev => {
      if (prev.includes(id)) {
        return prev.filter(r => r !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const validatePlan = () => {
    if (totalCost > TOTAL_BUDGET) {
      return {
        title: 'BUDGET EXCEEDED',
        message: `Your action plan costs ₹${totalCost.toLocaleString()}, which exceeds Nova City's ₹10,000 budget by ₹${(totalCost - TOTAL_BUDGET).toLocaleString()}. Please adjust your selection.`,
      };
    }

    if (selectedActions.length < 2) {
      return {
        title: 'INSUFFICIENT STRATEGIES',
        message: 'A Nova City action plan requires at least 2 distinct strategies to address the complex e-waste issues discovered.',
      };
    }

    if (selectedReasoning.length === 0) {
      return {
        title: 'JUSTIFICATION REQUIRED',
        message: 'Please select at least one reasoning statement explaining why you chose this plan.',
      };
    }

    if (selectedReasoning.includes('replace-old')) {
      return {
        title: 'PLAN NEEDS REVIEW',
        message: 'Focusing on replacing old electronics contradicts Nova City\'s sustainability objectives and increases overall e-waste generation.',
      };
    }

    const hasHazardSafety = selectedActions.includes('dispose') || selectedActions.includes('recycle');
    if (hazardsCount > 0 && !hasHazardSafety) {
      return {
        title: 'PLAN NEEDS REVIEW',
        message: 'Your plan allocates resources elsewhere but does not address the hazardous battery and toxic chemical incidents identified during your investigation.',
      };
    }

    if (selectedReasoning.includes('safe-hazards') && !hasHazardSafety) {
      return {
        title: 'PLAN NEEDS REVIEW',
        message: 'You specified "safe handling of hazardous devices" as your reasoning, but your selected strategies do not include Responsible Disposal or Authorized Recycling.',
      };
    }

    if (selectedReasoning.includes('extend-life') && !selectedActions.includes('repair') && !selectedActions.includes('reuse') && !selectedActions.includes('donate')) {
      return {
        title: 'PLAN NEEDS REVIEW',
        message: 'You indicated an intent to extend device life, but selected no Repair, Reuse, or Donation programs.',
      };
    }

    if (selectedReasoning.includes('recover-materials') && !selectedActions.includes('recycle')) {
      return {
        title: 'PLAN NEEDS REVIEW',
        message: 'You selected material recovery as a primary reason, but did not include Authorized Recycling in your plan.',
      };
    }

    return null;
  };

  const handleSubmitPlan = () => {
    const error = validatePlan();
    if (error) {
      setValidationError(error);
      return;
    }

    const hasRepair = selectedActions.includes('repair');
    const hasReuse = selectedActions.includes('reuse');
    const hasDonate = selectedActions.includes('donate');
    const hasRecycle = selectedActions.includes('recycle');
    const hasDispose = selectedActions.includes('dispose');

    let safetyScore = 50;
    if (hasDispose) safetyScore += 30;
    if (hasRecycle) safetyScore += 20;
    safetyScore = Math.min(100, safetyScore + (hazardsCount > 2 ? 5 : 0));

    let recoveryScore = 40;
    if (hasRecycle) recoveryScore += 45;
    if (hasRepair) recoveryScore += 15;
    recoveryScore = Math.min(100, recoveryScore);

    let lifeExtensionScore = 40;
    if (hasRepair) lifeExtensionScore += 30;
    if (hasReuse) lifeExtensionScore += 15;
    if (hasDonate) lifeExtensionScore += 15;
    lifeExtensionScore = Math.min(100, lifeExtensionScore + (repairedCount > 0 ? 5 : 0));

    let problemCoverage = Math.round((safetyScore + recoveryScore + lifeExtensionScore) / 3);
    let overallImpact = Math.round((problemCoverage * 0.4) + (safetyScore * 0.25) + (recoveryScore * 0.2) + (lifeExtensionScore * 0.15));

    const strongDecisions = [];
    const weakAreas = [];
    const missedOpportunities = [];

    if (hasRepair) {
      strongDecisions.push('Repair Program will directly fix repairable devices identified during your investigation.');
    }
    if (hasDispose) {
      strongDecisions.push('Responsible Disposal protects Nova City citizens from toxic chemical & battery hazards.');
    }
    if (hasRecycle) {
      strongDecisions.push('Authorized Recycling secures high rates of precious metal and copper recovery.');
    }
    if (hasReuse || hasDonate) {
      strongDecisions.push('Reuse and Donation networks keep functional devices circulating in schools and institutions.');
    }

    if (!hasDispose) {
      weakAreas.push('Without Dedicated Responsible Disposal, hazardous items may leak into municipal landfills.');
    }
    if (!hasRepair) {
      weakAreas.push('Skipping Repair means fixable electronics are prematurely scrapped or discarded.');
    }
    if (totalCost < 6000) {
      weakAreas.push('Underutilization of allocated city budget leaves critical e-waste sectors unaddressed.');
    }

    if (!hasRecycle && TOTAL_BUDGET - totalCost >= 4000) {
      missedOpportunities.push('You had remaining budget to fund Authorized Recycling for raw material recovery.');
    }
    if (!hasDonate && TOTAL_BUDGET - totalCost >= 1500) {
      missedOpportunities.push('A Donation Network could have been added with leftover funds to assist low-income communities.');
    }
    if (!hasReuse && TOTAL_BUDGET - totalCost >= 2000) {
      missedOpportunities.push('Reuse Program could have been funded with available capital.');
    }

    setEvaluationResult({
      overallImpact,
      problemCoverage,
      safetyCoverage: safetyScore,
      resourceRecovery: recoveryScore,
      lifeExtension: lifeExtensionScore,
      budgetSpent: totalCost,
      strongDecisions,
      weakAreas,
      missedOpportunities,
    });

    updateState(prev => ({
      ...prev,
      score: (prev?.score || 0) + (overallImpact >= 75 ? 200 : 100),
      finalPlanScore: overallImpact,
    }));

    setPhase('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-enter final-mystery-page" style={{
      minHeight: '100dvh',
      padding: 'calc(var(--safe-top, 0px) + 0.75rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 1.5rem)',
      background: 'radial-gradient(ellipse at top, #14281f 0%, #041009 85%)',
      color: '#f0fdf4',
      overflowX: 'hidden',
    }}>
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto', padding: '0 0.25rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="data-label" style={{ color: '#00d68f', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
            FINAL STAGE // SYSTEM SYNTHESIS
          </div>
          <h1 style={{
            fontSize: '1.4rem',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em',
            margin: '0 0 0.35rem',
            color: '#ffffff',
            fontWeight: 800,
          }}>
            THE FINAL MYSTERY
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
            {phase === 'reveal' && 'Connect investigation evidence across all 5 districts to diagnose Nova City\'s core crisis.'}
            {phase === 'action-plan' && 'Formulate a comprehensive action plan within the city budget of ₹10,000.'}
            {phase === 'result' && 'Review your action plan evaluation and systemic environmental impact!'}
          </p>
        </div>

        {/* PHASE 1: REVEAL MYSTERY CAUSES (Single Column) */}
        {phase === 'reveal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'rgba(6, 30, 18, 0.75)',
              border: '1.5px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div className="status-dot status-dot-amber" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#86efac', fontWeight: 600 }}>
                  CASE FILE — 5 BEHAVIORAL PATTERNS
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                Tap each finding below to uncover critical root causes documented by your investigation:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                {MYSTERY_CAUSES.map((cause, i) => {
                  const isRevealed = revealedCauses.includes(cause.id);
                  return (
                    <button
                      key={cause.id}
                      onClick={() => handleRevealCause(cause.id)}
                      style={{
                        width: '100%',
                        minHeight: '56px',
                        padding: '0.85rem 1rem',
                        background: isRevealed ? 'rgba(0, 214, 143, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                        border: `1.5px solid ${isRevealed ? '#00d68f' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '16px',
                        cursor: isRevealed ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        textAlign: 'left',
                        color: '#ffffff',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: '1.75rem', lineHeight: 1, flexShrink: 0 }}>
                        {isRevealed ? cause.icon : '❓'}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#ffffff' }}>
                          {isRevealed ? cause.text : `Finding #${i + 1} — Tap to analyze evidence`}
                        </div>
                        {isRevealed && (
                          <div style={{ fontSize: '0.8125rem', color: '#fca5a5', marginTop: '2px' }}>
                            ⚠️ {cause.impact}
                          </div>
                        )}
                      </div>
                      {!isRevealed && (
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: '#f59e0b',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}>
                          +20 pts
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {allRevealed && (
                <button
                  className="btn btn-primary"
                  onClick={() => setPhase('action-plan')}
                  style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
                >
                  PROCEED TO ACTION PLAN DESIGN <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* PHASE 2: STRATEGIC ACTION PLAN (Single Column Cards + Sticky Budget/Action Bar) */}
        {phase === 'action-plan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Case File Metrics (Single Column) */}
            <div style={{
              background: 'rgba(6, 30, 18, 0.75)',
              border: '1.5px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <FileText size={18} color="#f59e0b" />
                <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800 }}>
                  NOVA CITY INVESTIGATION AUDIT
                </h2>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.45rem',
                marginBottom: '0.75rem',
              }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#00b4d8' }}>{inspectedCount}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Inspected</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#00d68f' }}>{repairedCount}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Repairable</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ef4444' }}>{hazardsCount}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Hazards</div>
                </div>
              </div>
            </div>

            {/* City Priorities Cards */}
            <div style={{
              background: 'rgba(6, 30, 18, 0.75)',
              border: '1.5px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Layers size={18} color="#00b4d8" />
                <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800 }}>
                  NOVA CITY SUSTAINABILITY PRIORITIES
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {CITY_PRIORITIES.map(p => (
                  <div key={p.id} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '0.65rem 0.85rem',
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f0fdf4' }}>
                      {p.id}. {p.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>
                      {p.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy Selection Cards */}
            <div style={{
              background: 'rgba(6, 30, 18, 0.75)',
              border: '1.5px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <div className="data-label" style={{ color: '#00d68f', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                ACTION STRATEGIES (SELECT 2 OR MORE)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {STRATEGIES.map(strategy => {
                  const isSelected = selectedActions.includes(strategy.id);
                  const isOverIfAdded = !isSelected && (totalCost + strategy.cost > TOTAL_BUDGET);

                  return (
                    <button
                      key={strategy.id}
                      onClick={() => toggleAction(strategy.id)}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        background: isSelected ? 'rgba(0, 214, 143, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: `1.5px solid ${isSelected ? '#00d68f' : isOverIfAdded ? 'rgba(239,68,68,0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        color: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.45rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '6px',
                            border: `2px solid ${isSelected ? '#00d68f' : '#64748b'}`,
                            background: isSelected ? '#00d68f' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {isSelected && <span style={{ color: '#071b10', fontSize: '0.75rem', fontWeight: 900 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{strategy.emoji}</span>
                          <span style={{ fontSize: '0.9375rem', fontWeight: 800 }}>{strategy.label}</span>
                        </div>

                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8125rem',
                          fontWeight: 800,
                          color: isSelected ? '#00d68f' : '#f59e0b',
                        }}>
                          ₹{strategy.cost.toLocaleString()}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: 1.4, paddingLeft: '2.2rem' }}>
                        {strategy.effect}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Reasoning Selection */}
              <div className="data-label" style={{ color: '#c084fc', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                JUSTIFICATION (WHY THIS PLAN?)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {REASONING_OPTIONS.map(reason => {
                  const isChecked = selectedReasoning.includes(reason.id);
                  return (
                    <button
                      key={reason.id}
                      onClick={() => toggleReasoning(reason.id)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.85rem',
                        background: isChecked ? 'rgba(192, 132, 252, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1.5px solid ${isChecked ? '#c084fc' : 'rgba(255, 255, 255, 0.08)'}`,
                        borderRadius: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        textAlign: 'left',
                        color: '#ffffff',
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '5px',
                        border: `2px solid ${isChecked ? '#c084fc' : '#64748b'}`,
                        background: isChecked ? '#c084fc' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {isChecked && <span style={{ color: '#000', fontSize: '0.7rem', fontWeight: 900 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>{reason.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Validation Error Banner */}
              {validationError && (
                <div style={{
                  marginTop: '1rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1.5px solid #ef4444',
                  borderRadius: '14px',
                  padding: '0.85rem 1rem',
                }}>
                  <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.875rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={16} /> {validationError.title}
                  </div>
                  <p style={{ color: '#fca5a5', fontSize: '0.8125rem', lineHeight: 1.5, margin: 0 }}>
                    {validationError.message}
                  </p>
                </div>
              )}
            </div>

            {/* Sticky Bottom Bar for Budget Status & Submit Action */}
            <div style={{
              position: 'sticky',
              bottom: 'calc(var(--bottom-nav-total-height, 70px) + 0.5rem)',
              zIndex: 40,
              background: 'rgba(4, 20, 12, 0.95)',
              border: `1.5px solid ${remainingBudget < 0 ? '#ef4444' : '#00d68f'}`,
              borderRadius: '20px',
              padding: '0.75rem 1rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                  BUDGET: ₹{totalCost.toLocaleString()} / ₹{TOTAL_BUDGET.toLocaleString()}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  color: remainingBudget < 0 ? '#ef4444' : '#00d68f',
                }}>
                  {remainingBudget < 0 ? `Exceeded ₹${Math.abs(remainingBudget)}` : `Left: ₹${remainingBudget}`}
                </span>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSubmitPlan}
                id="submit-action-plan-btn"
                style={{
                  width: '100%',
                  minHeight: '52px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  opacity: remainingBudget < 0 ? 0.6 : 1,
                }}
              >
                SUBMIT ACTION PLAN FOR EVALUATION →
              </button>
            </div>

          </div>
        )}

        {/* PHASE 3: EVALUATION RESULT (Single Column Cards) */}
        {phase === 'result' && evaluationResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Overall Score Card */}
            <div style={{
              background: 'rgba(6, 30, 18, 0.85)',
              border: '2px solid #00d68f',
              borderRadius: '24px',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
              <div className="badge badge-green" style={{ marginBottom: '0.5rem' }}>EVALUATION COMPLETE</div>
              <h2 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0', fontWeight: 800 }}>
                ACTION PLAN IMPACT RATING
              </h2>
              <div style={{
                fontSize: '3rem',
                fontWeight: 900,
                color: '#00d68f',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1,
                margin: '0.5rem 0',
              }}>
                {evaluationResult.overallImpact}%
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                SYSTEMIC SUSTAINABILITY SCORE
              </div>
            </div>

            {/* Metrics Breakdown (Single Column Grid) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
            }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Problem Coverage</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00b4d8' }}>{evaluationResult.problemCoverage}%</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Safety Coverage</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>{evaluationResult.safetyCoverage}%</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Resource Recovery</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c084fc' }}>{evaluationResult.resourceRecovery}%</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Life Extension</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00d68f' }}>{evaluationResult.lifeExtension}%</div>
              </div>
            </div>

            {/* Qualitative Feedback Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {evaluationResult.strongDecisions.length > 0 && (
                <div style={{ background: 'rgba(0, 214, 143, 0.08)', border: '1.5px solid rgba(0, 214, 143, 0.3)', borderRadius: '16px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#00d68f', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} /> STRONG DECISIONS
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    {evaluationResult.strongDecisions.map((sd, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>{sd}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluationResult.weakAreas.length > 0 && (
                <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1.5px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={16} /> RISKS & WEAK AREAS
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    {evaluationResult.weakAreas.map((wa, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>{wa}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Advance CTA Button */}
            <div style={{
              position: 'sticky',
              bottom: 'calc(var(--bottom-nav-total-height, 70px) + 0.5rem)',
              zIndex: 40,
              padding: '0.5rem 0',
            }}>
              <button
                className="btn btn-primary"
                onClick={onComplete}
                id="view-impact-report-btn"
                style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
              >
                VIEW FINAL IMPACT REPORT <ChevronRight size={18} />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
