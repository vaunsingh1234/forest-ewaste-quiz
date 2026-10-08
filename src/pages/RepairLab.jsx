import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { repairLabDevices } from '../data/devices';

const DEVICE_INSPECTION_DATA = {
  'repair-phone': {
    deviceLabel: 'Cracked Screen Phone',
    status: 'Powers on',
    performance: 'High responsiveness',
    physicalCondition: 'Severely cracked front glass',
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
    status: 'Powers on',
    performance: 'Very slow',
    physicalCondition: 'No visible damage',
    clues: {
      storage: 'Mechanical HDD detected. Drive health is poor. Storage performance may be responsible for the slowdown.',
      battery: 'Battery is still functional.',
      display: 'Display is functioning normally.',
      motherboard: 'No critical motherboard failure detected.',
      data: 'Personal files detected. Secure data erasure will be required before recycling or donation.',
    }
  },
  'repair-speaker': {
    deviceLabel: 'Bluetooth Speaker',
    status: 'Does not power on unplugged',
    performance: 'Good audio quality when plugged in',
    physicalCondition: 'Minor scuffs, clean casing',
    clues: {
      storage: 'Internal EEPROM firmware healthy.',
      battery: 'Lithium cell reads 0V — completely exhausted and unable to accept charge.',
      display: 'LED status lights functioning normally.',
      motherboard: 'Audio amplifier and bluetooth receiver circuit fully functional.',
      data: 'Bluetooth paired device logs stored.',
    }
  }
};

export default function RepairLab({ gameState, recordDecision, onComplete, navigate, updateState }) {
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [decisions, setDecisions] = useState({});
  const [activeClues, setActiveClues] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
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
    // Map options:
    // A: 'garbage' (throw away)
    // B: 'replace' (replace entire device)
    // C: 'repair' (upgrade/repair faulty component - correct)
    // D: 'recycle' (send directly for recycling)
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
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedOption(null);
    setLastDecision(null);
    if (currentDeviceIndex < repairLabDevices.length - 1) {
      setCurrentDeviceIndex(prev => prev + 1);
    }
  };

  const currentClues = activeClues[device.id] || {};

  return (
    <div className="page-enter" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('map')} style={{ gap: '0.25rem' }}>
            <ChevronLeft size={14} /> MAP
          </button>
          <div>
            <div className="data-label">LOCATION 03</div>
            <h1 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              🔧 REPAIR LAB
            </h1>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-green">OPERATIONAL</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {Object.keys(decisions).length}/{repairLabDevices.length} assessed
            </span>
          </div>
        </div>

        {/* Progress indicators */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {repairLabDevices.map((d, i) => (
            <button
              key={d.id}
              onClick={() => { if (decisions[d.id] || i <= currentDeviceIndex) setCurrentDeviceIndex(i); }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: `2px solid ${i === currentDeviceIndex ? 'var(--accent-green)' : decisions[d.id] ? 'rgba(0,214,143,0.5)' : 'var(--border-card)'}`,
                background: decisions[d.id] ? 'rgba(0,214,143,0.15)' : i === currentDeviceIndex ? 'rgba(0,214,143,0.08)' : 'transparent',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                cursor: (decisions[d.id] || i <= currentDeviceIndex) ? 'pointer' : 'not-allowed',
                opacity: (decisions[d.id] || i <= currentDeviceIndex) ? 1 : 0.4,
              }}
            >
              {decisions[d.id] ? '✓' : i + 1}
            </button>
          ))}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', alignSelf: 'center', marginLeft: '0.5rem' }}>
            Device {currentDeviceIndex + 1} of {repairLabDevices.length}
          </span>
        </div>

        {!allDone ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Left Column: Device Diagnostic Station */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem', animation: 'float 4s ease-in-out infinite' }}>
                  {currentDeviceIndex === 0 ? '📱' : currentDeviceIndex === 1 ? '💻' : '🔊'}
                </div>
                <div className="data-label" style={{ marginBottom: '0.25rem' }}>DEVICE UNDER TEST</div>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{device.name}</h2>
              </div>

              {/* Initial Device Specifications (NO SPOILERS) */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="data-label">DEVICE</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                    {inspectionInfo.deviceLabel}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="data-label">STATUS</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-blue)' }}>
                    {inspectionInfo.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="data-label">PERFORMANCE</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-amber)' }}>
                    {inspectionInfo.performance}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="data-label">PHYSICAL CONDITION</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                    {inspectionInfo.physicalCondition}
                  </span>
                </div>
              </div>

              {/* Clickable Inspection Buttons */}
              <div>
                <div className="data-label" style={{ marginBottom: '0.75rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Search size={12} /> DIAGNOSTIC INSPECTION (CLICK TO INVESTIGATE)
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[
                    { key: 'storage', label: 'CHECK STORAGE' },
                    { key: 'battery', label: 'CHECK BATTERY' },
                    { key: 'display', label: 'CHECK DISPLAY' },
                    { key: 'motherboard', label: 'CHECK MOTHERBOARD' },
                    { key: 'data', label: 'CHECK DATA' },
                  ].map(item => {
                    const inspected = !!currentClues[item.key];
                    return (
                      <button
                        key={item.key}
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleInspectClue(item.key)}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.5rem 0.75rem',
                          background: inspected ? 'rgba(0, 214, 143, 0.12)' : 'rgba(255,255,255,0.04)',
                          borderColor: inspected ? 'rgba(0, 214, 143, 0.4)' : 'var(--border-subtle)',
                          color: inspected ? 'var(--accent-green)' : 'var(--text-primary)',
                        }}
                      >
                        [{item.label}] {inspected ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>

                {/* Inspection Log Output */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                  {Object.entries(currentClues).map(([key, clueText]) => (
                    <div
                      key={key}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(0,0,0,0.4)',
                        borderLeft: '3px solid var(--accent-green)',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78125rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1.5,
                        animation: 'fadeIn 0.25s ease',
                      }}
                    >
                      <strong style={{ color: 'var(--accent-green)', textTransform: 'uppercase' }}>{key}: </strong>
                      "{clueText}"
                    </div>
                  ))}
                  {Object.keys(currentClues).length === 0 && (
                    <div style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      fontStyle: 'italic',
                      border: '1px dashed var(--border-subtle)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      Click inspection buttons above to uncover device diagnostic clues.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Decision Engine */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!showResult ? (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.75rem',
                }}>
                  <div className="data-label" style={{ marginBottom: '0.5rem', color: 'var(--accent-amber)' }}>ACTION REQUIRED</div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                    What should happen to this device?
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {[
                      { id: 'option-a', label: 'A. Throw it away with household waste' },
                      { id: 'option-b', label: 'B. Replace the entire device' },
                      { id: 'option-c', label: 'C. Upgrade/repair the faulty component' },
                      { id: 'option-d', label: 'D. Send the entire device directly for recycling' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.875rem',
                          padding: '1rem 1.25rem',
                          background: selectedOption === opt.id ? 'rgba(0,214,143,0.08)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${selectedOption === opt.id ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-lg)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: `2px solid ${selectedOption === opt.id ? 'var(--accent-green)' : 'var(--border-card)'}`,
                          background: selectedOption === opt.id ? 'var(--accent-green)' : 'transparent',
                          flexShrink: 0,
                        }} />
                        <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn btn-primary w-full"
                    onClick={() => selectedOption && handleMakeDecision(selectedOption)}
                    disabled={!selectedOption}
                    style={{ opacity: selectedOption ? 1 : 0.5 }}
                  >
                    CONFIRM DISPOSAL DECISION
                  </button>
                </div>
              ) : (
                /* AFTER DECISION — REVEAL STATISTICS & CONSEQUENCE DATA */
                <div className="animate-scaleIn" style={{
                  background: lastDecision?.isRepair ? 'rgba(0,214,143,0.06)' : 'rgba(239,68,68,0.06)',
                  border: `1px solid ${lastDecision?.isRepair ? 'rgba(0,214,143,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.75rem',
                }}>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>
                      {lastDecision?.isRepair ? '✅' : '❌'}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: lastDecision?.isRepair ? 'var(--accent-green)' : 'var(--accent-red)',
                        letterSpacing: '0.08em',
                        marginBottom: '0.25rem',
                      }}>
                        {lastDecision?.isRepair ? 'CORRECT REPAIR DECISION' : 'SUB-OPTIMAL CHOICE'}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-green)' }}>
                        +{lastDecision?.impact.score} pts
                      </div>
                    </div>
                  </div>

                  {/* Now reveal Repairability & Financials AFTER decision */}
                  <div style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div className="data-label" style={{ marginBottom: '0.25rem' }}>REVEALED METRICS</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="data-label">Repairability Index</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 700 }}>{device.repairability}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="data-label">Lifespan Extension</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>{device.expectedLifespanRepair}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="data-label">Component Repair Cost</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{device.repairCost}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="data-label">Full Replacement Cost</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-red)' }}>{device.replacementCost}</span>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                    {lastDecision?.feedback}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {[
                      { label: 'Eco Impact', value: lastDecision?.impact.ecoImpact },
                      { label: 'Recovery', value: lastDecision?.impact.resourceRecovery },
                      { label: 'City Risk', value: lastDecision?.impact.cityRisk, inverted: true },
                    ].map(item => {
                      const isGood = item.inverted ? item.value < 0 : item.value > 0;
                      return (
                        <div key={item.label} style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                          <div className="data-label" style={{ marginBottom: '4px' }}>{item.label}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: isGood ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                            {(item.value >= 0 ? '+' : '') + item.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button className="btn btn-primary w-full" onClick={handleNext}>
                    {currentDeviceIndex < repairLabDevices.length - 1 ? 'NEXT DEVICE ASSIGNMENT' : 'COMPLETE REPAIR LAB'} <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* All devices evaluated screen */
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(0,214,143,0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
              <h2 style={{ marginBottom: '0.5rem', color: 'var(--accent-green)' }}>Repair Lab Evaluation Complete</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                You assessed {repairLabDevices.length} devices through component diagnostics. {totalRepairs} devices were correctly identified for component repair and upgrade — 
                avoiding unnecessary e-waste generation.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Devices Repaired', value: totalRepairs, color: 'var(--accent-green)' },
                  { label: 'Devices Replaced', value: repairLabDevices.length - totalRepairs, color: 'var(--accent-amber)' },
                  { label: 'Zone Bonus', value: '+130 pts', color: 'var(--accent-blue)' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                    <div className="data-label" style={{ marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: item.color }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary w-full" onClick={onComplete}>
                ADVANCE TO SCRAP YARD <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
