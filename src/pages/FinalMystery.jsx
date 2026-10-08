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

    // Check if hazardous items discovered but no safety/recycle strategy selected
    const hasHazardSafety = selectedActions.includes('dispose') || selectedActions.includes('recycle');
    if (hazardsCount > 0 && !hasHazardSafety) {
      return {
        title: 'PLAN NEEDS REVIEW',
        message: 'Your plan allocates resources elsewhere but does not address the hazardous battery and toxic chemical incidents identified during your investigation.',
      };
    }

    // Check reasoning consistency
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

    // Calculate evaluation metrics
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

    const bonusPoints = Math.round(overallImpact * 2.5);

    updateState(prev => ({
      ...prev,
      score: (prev?.score || 0) + bonusPoints + 150,
      ecoImpact: Math.min(100, (prev?.ecoImpact || 0) + Math.round(overallImpact * 0.2)),
      resourceRecovery: Math.min(100, (prev?.resourceRecovery || 0) + Math.round(recoveryScore * 0.2)),
      cityRisk: Math.max(0, (prev?.cityRisk || 50) - Math.round(safetyScore * 0.25)),
    }));

    setEvaluationResult({
      budgetSpent: totalCost,
      problemCoverage,
      safetyCoverage: safetyScore,
      resourceRecovery: recoveryScore,
      lifeExtension: lifeExtensionScore,
      overallImpact,
      strongDecisions,
      weakAreas,
      missedOpportunities,
    });

    setPhase('result');
  };

  return (
    <div className="page-enter" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        
        {/* TOP HEADER */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="data-label" style={{ marginBottom: '0.5rem', color: 'var(--accent-amber)' }}>
            FINAL CHALLENGE — ACTION PLAN
          </div>
          <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            🔍 NOVA CITY E-WASTE ACTION PLAN
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '720px' }}>
            Transform your investigation evidence into a practical, budgeted policy strategy for Nova City.
          </p>
        </div>

        {/* PHASE 1: REVEAL MYSTERY CAUSES */}
        {phase === 'reveal' && (
          <div>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div className="status-dot status-dot-amber" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    CASE FILE — NOVA CITY E-WASTE CRISIS
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                  The investigation has revealed that Nova City's e-waste crisis was caused by <strong style={{ color: 'var(--text-primary)' }}>5 critical behavioral patterns</strong>. 
                  Click each finding to inspect the evidence.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {MYSTERY_CAUSES.map((cause, i) => {
                  const isRevealed = revealedCauses.includes(cause.id);
                  return (
                    <div
                      key={cause.id}
                      onClick={() => handleRevealCause(cause.id)}
                      style={{
                        background: isRevealed ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isRevealed ? 'rgba(239,68,68,0.25)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '1rem 1.25rem',
                        cursor: isRevealed ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', width: '36px', textAlign: 'center' }}>
                        {isRevealed ? cause.icon : '❓'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          color: isRevealed ? 'var(--text-primary)' : 'var(--text-secondary)',
                          marginBottom: isRevealed ? '0.25rem' : 0,
                        }}>
                          {isRevealed ? cause.text : `Finding #${i + 1} — Click to analyze evidence`}
                        </div>
                        {isRevealed && (
                          <div style={{
                            fontSize: '0.8125rem',
                            color: 'var(--accent-red)',
                            animation: 'fadeIn 0.3s ease',
                          }}>
                            ⚠️ Impact: {cause.impact}
                          </div>
                        )}
                      </div>
                      {!isRevealed && (
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          color: 'var(--accent-amber)',
                          letterSpacing: '0.1em',
                        }}>
                          +20 pts
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {allRevealed && (
                <div style={{
                  padding: '1.25rem',
                  background: 'rgba(0,180,216,0.06)',
                  border: '1px solid rgba(0,180,216,0.2)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '1.25rem',
                  animation: 'fadeUp 0.4s ease',
                }}>
                  <h3 style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={18} /> Source Root Causes Identified
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                    Nova City's e-waste crisis requires a balanced strategy combining device life extension, safe hazard containment, and raw material recycling.
                  </p>
                </div>
              )}

              {allRevealed && (
                <button className="btn btn-primary" onClick={() => setPhase('action-plan')}>
                  PROCEED TO ACTION PLAN DESIGN <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* PHASE 2: STRATEGIC ACTION PLAN */}
        {phase === 'action-plan' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>

            {/* SECTION A: FINAL CASE FILE (INVESTIGATION SUMMARY) */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FileText size={18} style={{ color: 'var(--accent-amber)' }} />
                <h2 style={{ fontSize: '1.125rem', margin: 0, fontFamily: 'var(--font-display)' }}>
                  NOVA CITY — FINAL CASE FILE
                </h2>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{inspectedCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Devices Investigated</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-green)' }}>{repairedCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Repairable Devices</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6' }}>{donatedCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Working Devices</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-red)' }}>{hazardsCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Hazardous Items</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{recycledCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>End-of-Life Items</div>
                </div>
              </div>

              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong>Key Discovered Issues:</strong> Widespread premature replacement in Residential zones, damaged battery hazards in Scrap Yard, unrefined rare metal recovery in Recycling Center, and high demand for fixable tech in Repair Lab.
              </div>
            </div>

            {/* SECTION B: CITY PRIORITIES */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Layers size={18} style={{ color: 'var(--accent-blue)' }} />
                <h2 style={{ fontSize: '1.125rem', margin: 0, fontFamily: 'var(--font-display)' }}>
                  NOVA CITY PRIORITIES
                </h2>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Your action plan should target Nova City's 4 core sustainability goals:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {CITY_PRIORITIES.map(p => (
                  <div key={p.id} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.875rem 1rem',
                  }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {p.id}. {p.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {p.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION C: BUDGET & STRATEGIES */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
            }}>
              {/* Budget Bar Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                background: remainingBudget < 0 ? 'rgba(239,68,68,0.1)' : 'rgba(0,214,143,0.06)',
                border: `1px solid ${remainingBudget < 0 ? 'rgba(239,68,68,0.3)' : 'rgba(0,214,143,0.25)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    IMPLEMENTATION BUDGET
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: remainingBudget < 0 ? 'var(--accent-red)' : 'var(--text-primary)', marginTop: '2px' }}>
                    Available: ₹{TOTAL_BUDGET.toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    REMAINING BUDGET
                  </div>
                  <div style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: remainingBudget < 0 ? 'var(--accent-red)' : 'var(--accent-green)',
                    marginTop: '2px',
                  }}>
                    ₹{remainingBudget.toLocaleString()}
                  </div>
                </div>
              </div>

              {remainingBudget < 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.4)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.875rem 1rem',
                  marginBottom: '1.5rem',
                  color: '#fca5a5',
                  fontSize: '0.875rem',
                  animation: 'headShake 0.4s ease-in-out',
                }}>
                  <AlertTriangle size={20} style={{ flexShrink: 0, color: 'var(--accent-red)' }} />
                  <div>
                    <strong>BUDGET EXCEEDED:</strong> The action plan cannot be implemented within the allocated ₹10,000 budget. Deselect a strategy to balance your resources.
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Select Action Strategies (Budget Cap: ₹10,000)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
                {STRATEGIES.map(strategy => {
                  const isSelected = selectedActions.includes(strategy.id);
                  const isOverIfAdded = !isSelected && (totalCost + strategy.cost > TOTAL_BUDGET);

                  return (
                    <div
                      key={strategy.id}
                      onClick={() => toggleAction(strategy.id)}
                      style={{
                        background: isSelected 
                          ? 'rgba(0,214,143,0.06)' 
                          : isOverIfAdded 
                            ? 'rgba(255,255,255,0.015)' 
                            : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${
                          isSelected 
                            ? 'rgba(0,214,143,0.4)' 
                            : isOverIfAdded 
                              ? 'rgba(239,68,68,0.2)' 
                              : 'var(--border-subtle)'
                        }`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.125rem 1.25rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            border: `2px solid ${isSelected ? 'var(--accent-green)' : 'var(--border-card)'}`,
                            background: isSelected ? 'var(--accent-green)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.15s',
                          }}>
                            {isSelected && <span style={{ color: '#000', fontSize: '0.75rem', fontWeight: 800 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: '1.4rem' }}>{strategy.emoji}</span>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                              {strategy.label}
                            </span>
                          </div>
                        </div>

                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: isSelected ? 'var(--accent-green)' : 'var(--accent-amber)',
                          background: 'rgba(255,255,255,0.04)',
                          padding: '0.25rem 0.625rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                        }}>
                          Cost: ₹{strategy.cost.toLocaleString()}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '2.5rem' }}>
                        <div><strong>Effect:</strong> {strategy.effect}</div>
                        <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                          <strong>Best suited for:</strong> {strategy.bestSuited}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION D: REASONING JUSTIFICATION */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <HelpCircle size={18} style={{ color: 'var(--accent-purple)' }} />
                <h2 style={{ fontSize: '1.125rem', margin: 0, fontFamily: 'var(--font-display)' }}>
                  WHY DID YOU CHOOSE THIS PLAN?
                </h2>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Select the core reasoning statements that best match your strategy.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
                {REASONING_OPTIONS.map(reason => {
                  const isChecked = selectedReasoning.includes(reason.id);
                  return (
                    <div
                      key={reason.id}
                      onClick={() => toggleReasoning(reason.id)}
                      style={{
                        background: isChecked ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isChecked ? 'rgba(139,92,246,0.4)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '0.875rem 1.125rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.875rem',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: `2px solid ${isChecked ? 'var(--accent-purple)' : 'var(--border-card)'}`,
                        background: isChecked ? 'var(--accent-purple)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {isChecked && <span style={{ color: '#fff', fontSize: '0.6875rem', fontWeight: 800 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: '0.875rem', color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {reason.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* VALIDATION ERROR DISPLAY */}
              {validationError && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  animation: 'fadeIn 0.3s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
                    <AlertTriangle size={18} /> {validationError.title}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                    {validationError.message}
                  </p>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleSubmitPlan}
                  id="submit-action-plan-btn"
                >
                  SUBMIT ACTION PLAN FOR CITY EVALUATION <ChevronRight size={18} />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* PHASE 3: RESULT / EVALUATION */}
        {phase === 'result' && evaluationResult && (
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            
            {/* OVERALL SCORE CARD */}
            <div style={{
              background: 'rgba(0,214,143,0.05)',
              border: '1px solid rgba(0,214,143,0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div className="badge badge-green" style={{ marginBottom: '0.5rem' }}>PLAN EVALUATED</div>
                  <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    NOVA CITY ACTION PLAN — EVALUATION
                  </h2>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>OVERALL IMPACT SCORE</div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
                    {evaluationResult.overallImpact}%
                  </div>
                </div>
              </div>

              {/* METRICS GRID */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.875rem',
                marginBottom: '1.75rem',
              }}>
                <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.875rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget Used</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '4px' }}>
                    ₹{evaluationResult.budgetSpent.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>out of ₹10,000</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.875rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Problem Coverage</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '4px' }}>
                    {evaluationResult.problemCoverage}%
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.875rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safety Coverage</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-red)', marginTop: '4px' }}>
                    {evaluationResult.safetyCoverage}%
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.875rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resource Recovery</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-purple)', marginTop: '4px' }}>
                    {evaluationResult.resourceRecovery}%
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.875rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Life Extension</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-green)', marginTop: '4px' }}>
                    {evaluationResult.lifeExtension}%
                  </div>
                </div>
              </div>

              {/* DETAILED BREAKDOWN SECTIONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                
                {/* STRONG DECISIONS */}
                {evaluationResult.strongDecisions.length > 0 && (
                  <div style={{ background: 'rgba(0,214,143,0.06)', border: '1px solid rgba(0,214,143,0.25)', borderRadius: 'var(--radius-lg)', padding: '1.125rem 1.25rem' }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--accent-green)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} /> STRONG DECISIONS
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {evaluationResult.strongDecisions.map((sd, idx) => (
                        <li key={idx} style={{ marginBottom: '0.25rem' }}>{sd}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* WEAK AREAS */}
                {evaluationResult.weakAreas.length > 0 && (
                  <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-lg)', padding: '1.125rem 1.25rem' }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={16} /> WEAK AREAS & RISKS
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {evaluationResult.weakAreas.map((wa, idx) => (
                        <li key={idx} style={{ marginBottom: '0.25rem' }}>{wa}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* MISSED OPPORTUNITIES */}
                {evaluationResult.missedOpportunities.length > 0 && (
                  <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 'var(--radius-lg)', padding: '1.125rem 1.25rem' }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={16} /> MISSED OPPORTUNITIES
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {evaluationResult.missedOpportunities.map((mo, idx) => (
                        <li key={idx} style={{ marginBottom: '0.25rem' }}>{mo}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* ACTION BUTTON */}
              <button 
                className="btn btn-primary btn-lg w-full" 
                onClick={onComplete} 
                id="view-impact-report-btn"
                style={{ justifyContent: 'center' }}
              >
                VIEW FINAL ENVIRONMENTAL IMPACT REPORT <ChevronRight size={18} />
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
