import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, HelpCircle, Lightbulb, RefreshCw, X, ChevronUp, ChevronDown, Check, BookOpen, Shield } from 'lucide-react';
import { GRADE_LEVELS, GUIDE_CHARACTERS, FUN_ECO_FACTS } from '../data/gradeData';
import { playGuideChime, speakGuideText, stopGuideSpeech } from '../utils/audio';

// Contextual dialogue bank tailored for students in 1st to 5th standard
const PAGE_GUIDE_PROMPTS = {
  home: {
    mood: 'happy',
    title: 'Cadet Registration Guide',
    text: 'Ribbit! Hi friend! 🐸 Welcome to the E-Waste Detective Squad! Step 1: Type your name above. Step 2: Pick your school class (Class 1 to 5). Then click "CHOOSE AVATAR & START" to gear up!',
    hint: 'E-Waste means old or broken electronics like dead remotes, cracked phones, and toys with batteries. Never toss them in ordinary trash cans!',
  },
  avatar_select: {
    mood: 'idea',
    title: 'Wardrobe & Suit Guide',
    text: 'Look at all these cute eco-suits! 👒 The Emerald Frog Hat gives you bio-sensor vision to spot battery leaks in the grass! Pick your favorite hat and suit, then click "CONFIRM & ENTER BRIEFING"!',
    hint: 'Every headgear gives you a special eco perk! The Frog hat boosts Bio-Sensor Recovery, and the Crown helps find recycled gold!',
  },
  briefing: {
    mood: 'alert',
    title: 'Mission Dispatch',
    text: 'Listen closely, Cadet! 🚨 Nova City has gadgets piling up in alleys and gardens! If rain hits them, chemicals will leak into the trees and rivers. Press "ACCEPT MISSION" when you are ready to explore!',
    hint: 'Take your time reading! Every problem has a smart solution: Repair, Donate, or Recycle!',
  },
  map: {
    mood: 'idea',
    title: 'Quest Map Navigator',
    text: 'Here is Nova City! 🗺️ Click on "Tech District" to begin your first investigation. Once you finish inspecting all devices, the next district will unlock!',
    hint: 'There are 5 locations to investigate. Look at the live city metrics to see how your choices heal Nova City!',
  },
  tech_district: {
    mood: 'inspect',
    title: 'Tech District Field Tips',
    text: 'You found abandoned electronics on the sidewalk! 📱 Click on each device to inspect its battery, screen, and wires. Then choose: Repair, Reuse, Recycle, or Garbage!',
    hint: 'Rule of thumb: Never pick "Regular Garbage" for electronics! If it can still turn on, Repair or Reuse is awesome. If broken, send to authorized Recycling!',
  },
  residential_block: {
    mood: 'inspect',
    title: 'Residential Zone Help',
    text: 'Families in this block need our help! 🏘️ Solve the Recycling Code to sort batteries safely, and wipe old personal data from laptops before donating!',
    hint: 'Batteries contain lithium and heavy metals. They always belong in the Battery Collection Center, never with vegetable peels or plastic cups!',
  },
  repair_lab: {
    mood: 'idea',
    title: 'Neon-Leaf Workshop',
    text: 'Welcome to the Eco-Repair Lab! 🍃 Fixing a gadget instead of buying a new one saves tons of clean air and electricity. Check the parts to see what needs a quick fix!',
    hint: 'Often only the battery or power wire is broken, while the brain chip inside is still 100% fine!',
  },
  scrap_yard: {
    mood: 'alert',
    title: 'Scrap Yard Safety',
    text: 'Careful where you step! 🏗️ Watch out for acid leaks from cracked old screens. Help sort valuable metals like copper and aluminum from harmless scrap!',
    hint: 'Gold and copper wires are super valuable! Professional recyclers can melt and reuse them over and over without losing quality.',
  },
  recycling_center: {
    mood: 'cheer',
    title: 'Circular Core Sanctuary',
    text: 'This is where magic happens! ♻️ The high-tech circular smelter extracts pure metals from circuit boards with zero toxic smoke. Test your recycling knowledge!',
    hint: 'In a Circular Economy, nothing goes to waste. The copper from an old computer becomes a wire in a solar panel!',
  },
  'final-mystery': {
    mood: 'cheer',
    title: 'Final Action Plan',
    text: 'You are on the final step! 🏆 Assemble Nova City\'s School E-Waste Policy. Pick the best choices to protect kids, schools, and nature!',
    hint: 'Schools can set up dedicated E-Waste collection drives so students can bring old batteries from home safely!',
  },
  results: {
    mood: 'cheer',
    title: 'Mission Complete!',
    text: 'WOOHOO! 🎉 High five! You protected Nova City! Look at your Environmental Impact Report card below to see all the trees and water you saved!',
    hint: 'Share what you learned with your teachers and family at home! Tell them never to bin old phones!',
  },
  learn: {
    mood: 'happy',
    title: 'Eco-Library Guide',
    text: 'Welcome to the Junior Eco-Library! 📚 Explore easy lessons about e-waste, toxic elements, and how recycling creates green jobs!',
    hint: 'Quiz yourself or share these fun facts during school science presentations!',
  },
};

export default function ChibiGuideBot({
  currentPage,
  gameState,
  updateState,
  navigate,
  customHint,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechMuted, setSpeechMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('guide'); // 'guide' | 'hint' | 'grade' | 'facts'
  const [customFact, setCustomFact] = useState(FUN_ECO_FACTS[0]);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const lastPageRef = useRef(currentPage);

  const studentGrade = (gameState && gameState.studentGrade) || '3rd';
  const gradeObj = GRADE_LEVELS.find(g => g.id === studentGrade) || GRADE_LEVELS[2];
  const activeChar = GUIDE_CHARACTERS[0]; // Pip the Frog default

  // Determine current prompt based on page
  const pagePrompt = PAGE_GUIDE_PROMPTS[currentPage] || {
    mood: 'happy',
    title: 'Junior Eco-Guide',
    text: 'Keep up the great work! Every step you take teaches kids how to keep electronics out of nature!',
    hint: 'Take your time and read the choices carefully!',
  };

  const currentText = customHint || pagePrompt.text;

  // Typing animation & audio chime when page changes
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    playGuideChime(pagePrompt.mood === 'cheer' ? 'cheer' : 'pop');

    const interval = setInterval(() => {
      index++;
      setDisplayedText(currentText.slice(0, index));
      if (index >= currentText.length) {
        clearInterval(interval);
      }
    }, 18);

    if (lastPageRef.current !== currentPage) {
      lastPageRef.current = currentPage;
      setHasUnreadNotification(true);
    }

    return () => {
      clearInterval(interval);
      stopGuideSpeech();
      setIsSpeaking(false);
    };
  }, [currentPage, currentText]);

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopGuideSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      playGuideChime('hint');
      speakGuideText(currentText, () => setIsSpeaking(false));
    }
  };

  const handleNextFact = () => {
    playGuideChime('pop');
    const random = FUN_ECO_FACTS[Math.floor(Math.random() * FUN_ECO_FACTS.length)];
    setCustomFact(random);
  };

  const handleSelectGrade = (gradeId) => {
    playGuideChime('hint');
    if (updateState) {
      updateState(prev => ({ ...prev, studentGrade: gradeId }));
    }
    setActiveTab('guide');
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'cheer': return '🌟';
      case 'alert': return '⚠️';
      case 'inspect': return '🔍';
      case 'idea': return '💡';
      default: return '🌿';
    }
  };

  return (
    <aside
      className="chibi-guide-container"
      aria-label="Pip the Eco-Guide Assistant"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 1050,
        fontFamily: 'var(--font-main)',
        pointerEvents: 'none',
      }}
    >
      <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem' }}>
        
        {/* EXPANDED GUIDE CARD */}
        {isExpanded ? (
          <div
            className="chibi-dialog-bubble animate-scaleIn"
            style={{
              width: 'min(380px, calc(100vw - 2.5rem))',
              background: 'linear-gradient(145deg, rgba(14, 38, 28, 0.96) 0%, rgba(8, 23, 17, 0.98) 100%)',
              border: '2px solid rgba(74, 222, 128, 0.35)',
              borderRadius: '24px',
              padding: '1.15rem',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(34, 197, 94, 0.25)',
              backdropFilter: 'blur(16px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top decorative vine glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #22c55e 0%, #4ade80 50%, #a3e635 100%)',
              }}
            />

            {/* Header: Mascot info & controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #4ade80',
                    boxShadow: '0 0 12px rgba(74, 222, 128, 0.4)',
                    background: 'radial-gradient(circle, rgba(74, 222, 128, 0.25) 0%, #07150e 80%)',
                    flexShrink: 0,
                    padding: '2px',
                  }}
                >
                  <img
                    src="/avatars/pip_frog_guide.png"
                    alt={activeChar.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      fontSize: '0.75rem',
                      lineHeight: 1,
                    }}
                  >
                    {getMoodEmoji(pagePrompt.mood)}
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f0fdf4', letterSpacing: '0.02em' }}>
                      Pip
                    </span>
                    <span
                      style={{
                        background: 'rgba(74, 222, 128, 0.2)',
                        color: '#4ade80',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '100px',
                        border: '1px solid rgba(74, 222, 128, 0.4)',
                      }}
                    >
                      {gradeObj.standard}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#86efac', fontFamily: 'var(--font-mono)' }}>
                    Junior Eco-Guide Bot 🌱
                  </div>
                </div>
              </div>

              {/* Action buttons: Speak, Minimize */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  onClick={handleToggleSpeak}
                  title={isSpeaking ? "Stop Voice" : "Read Aloud for Kids"}
                  style={{
                    background: isSpeaking ? '#22c55e' : 'rgba(255, 255, 255, 0.08)',
                    color: isSpeaking ? '#07150e' : '#86efac',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: '10px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>

                <button
                  onClick={() => setIsExpanded(false)}
                  title="Minimize Guide"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#94a3b8',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronDown size={15} />
                </button>
              </div>
            </div>

            {/* Quick Navigation Tabs: Guide Speech, Hint, Grade Changer, Facts */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                padding: '3px',
                gap: '3px',
                marginBottom: '0.75rem',
              }}
            >
              {[
                { id: 'guide', label: 'Guide', icon: Sparkles },
                { id: 'hint', label: 'Clue', icon: Lightbulb },
                { id: 'grade', label: 'My Class', icon: BookOpen },
                { id: 'facts', label: 'Eco Fact', icon: HelpCircle },
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playGuideChime('pop');
                      setActiveTab(tab.id);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.3rem 0.2rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: active ? 'rgba(74, 222, 128, 0.25)' : 'transparent',
                      color: active ? '#4ade80' : '#94a3b8',
                      fontSize: '0.72rem',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Icon size={12} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'guide' && (
              <div>
                <div
                  style={{
                    background: 'rgba(7, 21, 14, 0.65)',
                    border: '1px solid rgba(74, 222, 128, 0.2)',
                    borderRadius: '16px',
                    padding: '0.85rem 1rem',
                    fontSize: '0.85rem',
                    lineHeight: 1.55,
                    color: '#f0fdf4',
                    minHeight: '75px',
                    position: 'relative',
                  }}
                >
                  <p style={{ margin: 0 }}>
                    {displayedText}
                    {displayedText.length < currentText.length && (
                      <span className="blinking-cursor" style={{ color: '#4ade80', fontWeight: 900 }}>|</span>
                    )}
                  </p>
                </div>

                {/* Sub-pill banner for Grade 1-5 students */}
                <div
                  style={{
                    marginTop: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.75rem',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    fontSize: '0.72rem',
                    color: '#86efac',
                  }}
                >
                  <span>🎒 {gradeObj.standard} ({gradeObj.name}):</span>
                  <button
                    onClick={() => setActiveTab('grade')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4ade80',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}
                  >
                    Change Class
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'hint' && (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '16px',
                  padding: '0.85rem 1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <Lightbulb size={14} />
                  <span>Pip's Secret Clue:</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#fef3c7', lineHeight: 1.55 }}>
                  {pagePrompt.hint}
                </p>
              </div>
            )}

            {activeTab === 'grade' && (
              <div>
                <div style={{ fontSize: '0.75rem', color: '#86efac', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Select your school class (Primary Standards 1 to 5):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem', maxHeight: '170px', overflowY: 'auto' }}>
                  {GRADE_LEVELS.map(g => {
                    const isCurrent = g.id === studentGrade;
                    return (
                      <button
                        key={g.id}
                        onClick={() => handleSelectGrade(g.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.45rem 0.75rem',
                          borderRadius: '10px',
                          border: isCurrent ? '1.5px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: isCurrent ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                          color: '#f0fdf4',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '0.75rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1rem' }}>{g.icon}</span>
                          <div>
                            <div style={{ fontWeight: 700, color: isCurrent ? '#4ade80' : '#ffffff' }}>
                              {g.standard} — {g.name}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                              {g.ageRange}
                            </div>
                          </div>
                        </div>
                        {isCurrent && <Check size={14} color="#4ade80" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'facts' && (
              <div>
                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '16px',
                    padding: '0.85rem 1rem',
                    marginBottom: '0.65rem',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#e0f2fe', lineHeight: 1.55 }}>
                    {customFact}
                  </p>
                </div>
                <button
                  onClick={handleNextFact}
                  style={{
                    width: '100%',
                    background: 'rgba(74, 222, 128, 0.15)',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: '10px',
                    padding: '0.45rem',
                    color: '#4ade80',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <RefreshCw size={12} />
                  <span>Another Fun Fact!</span>
                </button>
              </div>
            )}
          </div>
        ) : null}

        {/* FLOATING CHIBI AVATAR BUTTON / LAUNCHER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Mini speech teaser pill when collapsed */}
          {!isExpanded && (
            <div
              onClick={() => {
                playGuideChime('pop');
                setIsExpanded(true);
              }}
              style={{
                background: 'rgba(14, 38, 28, 0.95)',
                border: '1.5px solid rgba(74, 222, 128, 0.4)',
                borderRadius: '100px',
                padding: '0.4rem 0.85rem',
                color: '#f0fdf4',
                fontSize: '0.75rem',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                maxWidth: '220px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <span>{getMoodEmoji(pagePrompt.mood)}</span>
              <span>Need help, Cadet? Click Pip!</span>
            </div>
          )}

          <button
            onClick={() => {
              playGuideChime('pop');
              setIsExpanded(!isExpanded);
            }}
            title="Talk to Pip the Chibi Guide"
            style={{
              position: 'relative',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              padding: 0,
              border: '3px solid #4ade80',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(74, 222, 128, 0.45)',
              background: '#07150e',
              cursor: 'pointer',
              overflow: 'visible',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* Chibi avatar photo */}
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              padding: '3px',
              background: 'radial-gradient(circle, rgba(74, 222, 128, 0.3) 0%, #07150e 75%)',
            }}>
              <img
                src="/avatars/pip_frog_guide.png"
                alt="Chibi Guide Bot"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Glowing Spore / Sprout badge */}
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#22c55e',
                color: '#07150e',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 900,
                boxShadow: '0 0 8px #22c55e',
              }}
            >
              🌱
            </div>

            {/* Pulse animation ring */}
            <div
              style={{
                position: 'absolute',
                inset: '-6px',
                borderRadius: '50%',
                border: '2px solid rgba(74, 222, 128, 0.4)',
                animation: 'pulse-dot 2s infinite',
                pointerEvents: 'none',
              }}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
