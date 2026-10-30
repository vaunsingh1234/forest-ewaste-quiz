import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Search, CheckCircle, AlertCircle, X, Shield, Wrench } from 'lucide-react';
import { repairLabDevices } from '../data/devices';

const DEVICE_INSPECTION_DATA = {
  'repair-phone': {
    deviceLabel: 'Cracked Screen Phone',
    status: 'Powers on normally',
    performance: 'High responsiveness',
    physicalCondition: 'Front protective glass cracked',
    clues: {
      storage: 'Flash memory healthy. System OS operates smoothly.',
      battery: 'Battery health is 92%. Retains full operational charge.',
      display: 'Front glass cracked. Touch digitizer and AMOLED panel are undamaged.',
      motherboard: 'Mainboard circuitry intact. No water or voltage damage.',
      data: 'User data stored. Secure wipe required before secondary transfer.',
    }
  },
  'repair-laptop': {
    deviceLabel: 'Slow Old Laptop',
    status: 'Powers on normally',
    performance: 'Extremely sluggish booting',
    physicalCondition: 'No exterior physical damage',
    clues: {
      storage: 'Spinning HDD detected with failing read sectors. Upgrading to a fast SATA/NVMe SSD will restore full performance.',
      battery: 'Battery holds 85% charge — still functional.',
      display: 'Full HD display panel is functioning normally.',
      motherboard: 'No critical motherboard failure detected.',
      data: 'Personal files detected. Secure data erasure required before redistribution.',
    }
  },
  'repair-speaker': {
    deviceLabel: 'Bluetooth Speaker',
    status: 'Does not power on unplugged',
    performance: 'Crystal-clear audio when plugged into USB',
    physicalCondition: 'Minor scuffs, casing clean',
    clues: {
      storage: 'Internal EEPROM firmware healthy.',
      battery: 'Internal 18650 lithium cell reads 0V — completely exhausted and unable to accept charge. Replacing the cell restores portability.',
      display: 'LED status lights functioning normally.',
      motherboard: 'Audio amplifier and bluetooth receiver circuit fully functional.',
      data: 'Paired device logs stored.',
    }
  }
};

export default function RepairLab({ gameState, recordDecision, onComplete, navigate, updateState }) {
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [decisions, setDecisions] = useState({});
  const [activeClues, setActiveClues] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [lastDecision, setLastDecision] = useState(null);

  const device = repairLabDevices[currentDeviceIndex];
  const inspectionInfo = DEVICE_INSPECTION_DATA[device.id] || DEVICE_INSPECTION_DATA['repair-laptop'];
  const allDone = repairLabDevices.every(d => decisions[d.id]);
  const totalRepairs = Object.values(decisions).filter(d => d === 'repair' || d === 'option-c').length;

  const handleInspectClue = (key) => {
    setActiveClues(prev => ({
      ...prev,
      [device.id]: {
        ...(prev[device.id] || {}),
        [key]: inspectionInfo.clues[key]
      }
    }));
  };

  const handleMakeDecision = (choiceKey) => {
    let internalChoice = 'replace';
    if (choiceKey === 'option-c') internalChoice = 'repair';
    else if (choiceKey === 'option-a') internalChoice = 'garbage';
    else if (choiceKey === 'option-d') internalChoice = 'recycle';

    const isRepair = internalChoice === 'repair';
    const impact = isRepair ? device.ecoRepair : device.ecoReplace;
    const feedback = isRepair ? device.repairFeedback : device.replaceFeedback;

    recordDecision(
      device.id,
      internalChoice,
      isRepair,
      impact.score,
      impact.ecoImpact,
      impact.resourceRecovery,
      impact.cityRisk
    );

    setDecisions(prev => ({ ...prev, [device.id]: internalChoice }));
    setLastDecision({ choice: internalChoice, choiceKey, impact, feedback, isRepair });
    setShowResultSheet(true);
  };

  const handleNextDevice = () => {
    setShowResultSheet(false);
    setSelectedOption(null);
    setLastDecision(null);
    if (currentDeviceIndex < repairLabDevices.length - 1) {
      setCurrentDeviceIndex(prev => prev + 1);
    }
  };

  const currentClues = activeClues[device?.id] || {};

  return (
    <div className="page-enter repair-lab-page" style={{
      minHeight: '100dvh',
      padding: 'calc(var(--safe-top, 0px) + 0.75rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 1.5rem)',
      background: 'radial-gradient(ellipse at top, #092026 0%, #020c0f 85%)',
      color: '#f0fdf4',
      overflowX: 'hidden',
    }}>
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto', padding: '0 0.25rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              className="btn btn-ghost"
              onClick={() => navigate('map')}
              style={{ minHeight: '44px', minWidth: '44px', padding: '0.4rem 0.75rem', gap: '0.25rem', fontSize: '0.875rem' }}
            >
              <ChevronLeft size={16} /> MAP
            </button>
            <div>
              <div className="data-label" style={{ color: '#00b4d8', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                LOCATION 03
              </div>
              <h1 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', margin: 0, fontWeight: 800 }}>
                🔧 REPAIR LAB
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-green" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>OPERATIONAL</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#94a3b8' }}>
              {Object.keys(decisions).length}/{repairLabDevices.length} evaluated
            </span>
          </div>
        </div>

        {/* Progress Step Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          marginBottom: '1.25rem',
          background: 'rgba(6, 25, 30, 0.65)',
          padding: '0.65rem 1rem',
          borderRadius: '16px',
          border: '1px solid rgba(0, 180, 216, 0.2)',
        }}>
          {repairLabDevices.map((d, i) => {
            const isDone = !!decisions[d.id];
            const isCurrent = i === currentDeviceIndex;
            return (
              <button
                key={d.id}
                onClick={() => { if (isDone || i <= currentDeviceIndex) setCurrentDeviceIndex(i); }}
                style={{
                  minWidth: '44px',
                  minHeight: '44px',
                  borderRadius: '50%',
                  border: `2px solid ${isCurrent ? '#00b4d8' : isDone ? '#00d68f' : 'rgba(255,255,255,0.15)'}`,
                  background: isDone ? 'rgba(0, 214, 143, 0.2)' : isCurrent ? 'rgba(0, 180, 216, 0.2)' : 'transparent',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  cursor: (isDone || i <= currentDeviceIndex) ? 'pointer' : 'not-allowed',
                  opacity: (isDone || i <= currentDeviceIndex) ? 1 : 0.4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isDone ? '✓' : i + 1}
              </button>
            );
          })}
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>CURRENT SPECIMEN</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#00b4d8' }}>Device {currentDeviceIndex + 1} of {repairLabDevices.length}</div>
          </div>
        </div>

        {!allDone ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Device Diagnostic Station (1-Column) */}
            <div style={{
              background: 'rgba(6, 25, 30, 0.75)',
              border: '1.5px solid rgba(0, 180, 216, 0.3)',
              borderRadius: '20px',
              padding: '1.25rem',
              backdropFilter: 'blur(10px)',
            }}>
              
              {/* Device Visual Header */}
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '0.25rem', animation: 'float 4s ease-in-out infinite' }}>
                  {currentDeviceIndex === 0 ? '📱' : currentDeviceIndex === 1 ? '💻' : '🔊'}
                </div>
                <div className="data-label" style={{ color: '#00b4d8', fontSize: '0.75rem' }}>BENCH DIAGNOSTIC UNIT</div>
                <h2 style={{ fontSize: '1.25rem', margin: '0.25rem 0', color: '#ffffff', fontWeight: 800 }}>
                  {device.name}
                </h2>
              </div>

              {/* Initial Device Specifications */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                marginBottom: '1.25rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="data-label" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>DEVICE</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0fdf4' }}>{inspectionInfo.deviceLabel}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="data-label" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>STATUS</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#00b4d8' }}>{inspectionInfo.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="data-label" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PERFORMANCE</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f59e0b' }}>{inspectionInfo.performance}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="data-label" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>CONDITION</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0fdf4' }}>{inspectionInfo.physicalCondition}</span>
                </div>
              </div>

              {/* Clickable Inspection Buttons (>= 44px tap target) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div className="data-label" style={{ color: '#00d68f', fontSize: '0.75rem', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Search size={14} /> TAP COMPONENT TO RUN DIAGNOSTIC SCAN:
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[
                    { key: 'storage', label: 'STORAGE' },
                    { key: 'battery', label: 'BATTERY' },
                    { key: 'display', label: 'DISPLAY' },
                    { key: 'motherboard', label: 'BOARD' },
                    { key: 'data', label: 'USER DATA' },
                  ].map(item => {
                    const inspected = !!currentClues[item.key];
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleInspectClue(item.key)}
                        style={{
                          minHeight: '44px',
                          padding: '0.5rem 0.85rem',
                          borderRadius: '12px',
                          border: `1.5px solid ${inspected ? '#00d68f' : 'rgba(0, 180, 216, 0.3)'}`,
                          background: inspected ? 'rgba(0, 214, 143, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          color: inspected ? '#00d68f' : '#ffffff',
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span>{inspected ? '✓' : '🔍'}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Inspection Log Output */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  maxHeight: '220px',
                  overflowY: 'auto',
                }}>
                  {Object.entries(currentClues).map(([key, clueText]) => (
                    <div
                      key={key}
                      style={{
                        padding: '0.75rem 0.85rem',
                        background: 'rgba(0,0,0,0.5)',
                        borderLeft: '3px solid #00d68f',
                        borderRadius: '10px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.875rem',
                        color: '#f0fdf4',
                        lineHeight: 1.5,
                      }}
                    >
                      <strong style={{ color: '#00d68f', textTransform: 'uppercase' }}>{key}: </strong>
                      "{clueText}"
                    </div>
                  ))}
                  {Object.keys(currentClues).length === 0 && (
                    <div style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      color: '#94a3b8',
                      fontStyle: 'italic',
                      border: '1.5px dashed rgba(255, 255, 255, 0.15)',
                      borderRadius: '14px',
                    }}>
                      Tap any component button above to inspect hardware health.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Decision Engine (Large full-width buttons >= 54px) */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.25rem',
              }}>
                <div className="data-label" style={{ color: '#f59e0b', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                  DISPOSAL / RECOVERY DECISION
                </div>
                <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: '#ffffff', fontWeight: 700 }}>
                  What should happen to this device?
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {[
                    { id: 'option-a', label: 'A. Throw away with household trash' },
                    { id: 'option-b', label: 'B. Replace the entire device' },
                    { id: 'option-c', label: 'C. Upgrade / repair the faulty component' },
                    { id: 'option-d', label: 'D. Send entire device directly for recycling' },
                  ].map(opt => {
                    const isSelected = selectedOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        style={{
                          width: '100%',
                          minHeight: '54px',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          background: isSelected ? 'rgba(0, 180, 216, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          border: `1.5px solid ${isSelected ? '#00b4d8' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '14px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          color: '#ffffff',
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? '#00b4d8' : '#64748b'}`,
                          background: isSelected ? '#00b4d8' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#020c0f' }} />}
                        </div>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => selectedOption && handleMakeDecision(selectedOption)}
                  disabled={!selectedOption}
                  style={{
                    width: '100%',
                    minHeight: '52px',
                    fontSize: '1rem',
                    fontWeight: 800,
                    opacity: selectedOption ? 1 : 0.5,
                  }}
                >
                  CONFIRM DECISION & ANALYZE IMPACT →
                </button>
              </div>

            </div>

          </div>
        ) : (
          /* All Devices Evaluated Screen */
          <div style={{
            background: 'rgba(6, 25, 30, 0.75)',
            border: '1.5px solid #00d68f',
            borderRadius: '20px',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🏆</div>
            <h2 style={{ color: '#00d68f', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800 }}>
              Repair Lab Assessment Complete!
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
              You systematically audited all {repairLabDevices.length} devices. {totalRepairs} devices were correctly prioritized for targeted modular component repair rather than premature discarding.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '0.85rem 0.5rem' }}>
                <div className="data-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>REPAIRED</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: '#00d68f' }}>
                  {totalRepairs}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '0.85rem 0.5rem' }}>
                <div className="data-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>REPLACED</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
                  {repairLabDevices.length - totalRepairs}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '0.85rem 0.5rem' }}>
                <div className="data-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>ZONE BONUS</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: '#00b4d8' }}>
                  +130 pts
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={onComplete}
              style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
            >
              ADVANCE TO SCRAP YARD <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>

      {/* Slide-Up Mobile Bottom Sheet for Decision Feedback & Revealed Metrics */}
      {showResultSheet && lastDecision && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{ flex: 1 }} onClick={handleNextDevice} />

          <div style={{
            background: '#071d22',
            borderTop: `2px solid ${lastDecision.isRepair ? '#00d68f' : '#ef4444'}`,
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '1.25rem 1rem calc(var(--safe-bottom, 0px) + 1.25rem)',
            maxHeight: '88dvh',
            overflowY: 'auto',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
          }}>
            <div style={{ width: '40px', height: '4px', background: '#334155', borderRadius: '2px', margin: '0 auto 1rem' }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '1.8rem' }}>{lastDecision.isRepair ? '✅' : '⚠️'}</span>
                <div>
                  <h3 style={{
                    fontSize: '1.15rem',
                    margin: 0,
                    fontWeight: 800,
                    color: lastDecision.isRepair ? '#00d68f' : '#ef4444',
                  }}>
                    {lastDecision.isRepair ? 'Optimal Repair Choice!' : 'Sub-Optimal Choice'}
                  </h3>
                  <div style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)', color: '#00d68f', fontWeight: 700 }}>
                    +{lastDecision.impact.score} pts earned
                  </div>
                </div>
              </div>
              <button
                onClick={handleNextDevice}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Revealed Hardware & Financial Metrics */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              <div className="data-label" style={{ color: '#00b4d8', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                REVEALED HARDWARE & FINANCIAL METRICS
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="data-label" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Repairability Index</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#00d68f', fontWeight: 800, fontSize: '0.9375rem' }}>
                  {device.repairability}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="data-label" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Lifespan Extension</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#00b4d8', fontWeight: 700, fontSize: '0.9375rem' }}>
                  {device.expectedLifespanRepair}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="data-label" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Component Repair Cost</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#f0fdf4', fontWeight: 700, fontSize: '0.9375rem' }}>
                  {device.repairCost}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="data-label" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Full Replacement Cost</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#ef4444', fontWeight: 700, fontSize: '0.9375rem' }}>
                  {device.replacementCost}
                </span>
              </div>
            </div>

            {/* Explanation Feedback */}
            <div style={{
              background: lastDecision.isRepair ? 'rgba(0, 214, 143, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1.5px solid ${lastDecision.isRepair ? 'rgba(0, 214, 143, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1rem',
            }}>
              <p style={{ color: '#f0fdf4', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                {lastDecision.feedback}
              </p>
            </div>

            {/* 3 Metric Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Eco Impact', value: lastDecision.impact.ecoImpact },
                { label: 'Recovery', value: lastDecision.impact.resourceRecovery },
                { label: 'City Risk', value: lastDecision.impact.cityRisk, inverted: true },
              ].map(item => {
                const isGood = item.inverted ? item.value < 0 : item.value > 0;
                return (
                  <div key={item.label} style={{ textAlign: 'center', padding: '0.6rem 0.3rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }}>
                    <div className="data-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9375rem', color: isGood ? '#00d68f' : '#ef4444' }}>
                      {(item.value >= 0 ? '+' : '') + item.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <button
              className="btn btn-primary"
              onClick={handleNextDevice}
              style={{ width: '100%', minHeight: '52px', fontSize: '1rem', fontWeight: 800 }}
            >
              {currentDeviceIndex < repairLabDevices.length - 1 ? 'NEXT DEVICE ASSIGNMENT →' : 'COMPLETE REPAIR LAB →'}
            </button>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
