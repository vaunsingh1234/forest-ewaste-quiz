import React, { useState } from 'react';
import { Sparkles, Shield, Zap, Check, ArrowRight, Dices, Award, Heart, Info, RefreshCw, Compass } from 'lucide-react';
import { AVATAR_HEADGEAR, AVATAR_OUTFITS, DEFAULT_AVATAR } from '../data/avatars';

export default function AvatarSelect({ gameState, updateAvatar, onProceed, navigate }) {
  const currentAvatar = gameState.avatar || DEFAULT_AVATAR;
  
  const [selectedHeadgearId, setSelectedHeadgearId] = useState(currentAvatar.headgearId || 'frog');
  const [selectedOutfitId, setSelectedOutfitId] = useState(currentAvatar.outfitId || 'eco_ranger');
  const [playerName, setPlayerName] = useState(gameState.playerName || 'Officer Nova');
  const [equippedNotice, setEquippedNotice] = useState(false);

  const selectedHeadgear = AVATAR_HEADGEAR.find(h => h.id === selectedHeadgearId) || AVATAR_HEADGEAR[0];
  const selectedOutfit = AVATAR_OUTFITS.find(o => o.id === selectedOutfitId) || AVATAR_OUTFITS[0];

  const handleSelectHeadgear = (headgear) => {
    setSelectedHeadgearId(headgear.id);
    const newAvatar = {
      headgearId: headgear.id,
      headgearName: headgear.name,
      icon: headgear.icon,
      avatarImg: headgear.avatarImg,
      outfitId: selectedOutfit.id,
      outfitName: selectedOutfit.name,
      rarity: headgear.rarity,
      bonus: headgear.bonus,
      tag: headgear.tag,
    };
    updateAvatar(newAvatar);
    setEquippedNotice(true);
    setTimeout(() => setEquippedNotice(false), 2000);
  };

  const handleSelectOutfit = (outfit) => {
    setSelectedOutfitId(outfit.id);
    updateAvatar({
      outfitId: outfit.id,
      outfitName: outfit.name,
    });
  };

  const handleRandomize = () => {
    const randomHead = AVATAR_HEADGEAR[Math.floor(Math.random() * AVATAR_HEADGEAR.length)];
    const randomOutfit = AVATAR_OUTFITS[Math.floor(Math.random() * AVATAR_OUTFITS.length)];
    setSelectedHeadgearId(randomHead.id);
    setSelectedOutfitId(randomOutfit.id);
    updateAvatar({
      headgearId: randomHead.id,
      headgearName: randomHead.name,
      icon: randomHead.icon,
      avatarImg: randomHead.avatarImg,
      outfitId: randomOutfit.id,
      outfitName: randomOutfit.name,
      rarity: randomHead.rarity,
      bonus: randomHead.bonus,
      tag: randomHead.tag,
    });
    setEquippedNotice(true);
    setTimeout(() => setEquippedNotice(false), 2000);
  };

  const handleConfirmAndProceed = () => {
    const finalAvatar = {
      headgearId: selectedHeadgear.id,
      headgearName: selectedHeadgear.name,
      icon: selectedHeadgear.icon,
      avatarImg: selectedHeadgear.avatarImg,
      outfitId: selectedOutfit.id,
      outfitName: selectedOutfit.name,
      rarity: selectedHeadgear.rarity,
      bonus: selectedHeadgear.bonus,
      tag: selectedHeadgear.tag,
    };
    updateAvatar(finalAvatar);
    if (onProceed) {
      onProceed(gameState.playerName || playerName || 'Eco Cadet', finalAvatar);
    } else {
      navigate('briefing');
    }
  };

  return (
    <div className="page-enter avatar-studio-page" style={{
      minHeight: 'calc(100vh - 4rem)',
      padding: '1.5rem 1rem 4rem',
      background: 'radial-gradient(ellipse at top, #133a27 0%, #06150e 85%)',
    }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Studio Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(74, 222, 128, 0.12)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              borderRadius: '100px',
              padding: '0.25rem 0.85rem',
              marginBottom: '0.5rem',
            }}>
              <Sparkles size={13} color="#4ade80" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: '#86efac',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}>
                CHIBI WARDROBE & ECO-PERKS
              </span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              letterSpacing: '0.04em',
              fontWeight: 800,
              color: '#f0fdf4',
              margin: 0,
            }}>
              EQUIP YOUR CHIBI ECO-SUIT
            </h1>
            <p style={{
              margin: '0.25rem 0 0',
              color: '#bbf7d0',
              fontSize: '0.9375rem',
            }}>
              Select your cute chibi headgear before exploring Nova Sanctuary. Each piece grants special eco perks!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleRandomize}
              className="btn btn-secondary"
              style={{
                borderRadius: '14px',
                padding: '0.6rem 1rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(74, 222, 128, 0.25)',
                color: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Dices size={16} color="#4ade80" />
              <span>RANDOMIZE</span>
            </button>

            <button
              id="confirm-avatar-btn"
              onClick={handleConfirmAndProceed}
              className="btn btn-primary"
              style={{
                borderRadius: '14px',
                padding: '0.6rem 1.4rem',
                background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                color: '#071b10',
                fontWeight: 800,
                letterSpacing: '0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
              }}
            >
              <span>CONFIRM & ENTER BRIEFING</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Main Stage: Left Grid & Right 3D Avatar Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 420px) 1fr',
          gap: '2rem',
          alignItems: 'stretch',
        }} className="avatar-grid-layout">
          
          {/* Left Column: Gear Inventory Grid */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(16, 44, 30, 0.95) 0%, rgba(9, 26, 18, 0.98) 100%)',
            border: '1.5px solid rgba(74, 222, 128, 0.25)',
            borderRadius: '26px',
            padding: '1.5rem',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: '#4ade80',
                  letterSpacing: '0.12em',
                  fontWeight: 600,
                }}>
                  WARDROBE COLLECTION
                </div>
                <div style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#f8fafc',
                }}>
                  Choose Headgear
                </div>
              </div>
              <div style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                borderRadius: '100px',
                padding: '0.2rem 0.65rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
              }}>
                {AVATAR_HEADGEAR.length} ITEMS
              </div>
            </div>

            {/* Inventory Grid: 2 columns, exactly like reference image */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
            }}>
              {AVATAR_HEADGEAR.map((item) => {
                const isSelected = selectedHeadgearId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectHeadgear(item)}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: '20px',
                      background: isSelected
                        ? 'linear-gradient(145deg, #182d54 0%, #0d1b33 100%)'
                        : 'linear-gradient(145deg, rgba(21, 35, 62, 0.7) 0%, rgba(13, 21, 39, 0.7) 100%)',
                      border: isSelected
                        ? '2.5px solid #facc15'
                        : '1.5px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected
                        ? '0 0 20px rgba(250, 204, 21, 0.35), inset 0 0 15px rgba(250, 204, 21, 0.1)'
                        : '0 4px 15px rgba(0,0,0,0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    }}
                    title={item.name}
                  >
                    {/* Selected Checkmark Badge (matching reference) */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#facc15',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                        zIndex: 2,
                      }}>
                        <Check size={14} color="#090e1a" strokeWidth={3} />
                      </div>
                    )}

                    {/* Headgear item icon */}
                    <div style={{
                      width: '72%',
                      height: '72%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      filter: isSelected ? 'drop-shadow(0 4px 12px rgba(250, 204, 21, 0.3))' : 'none',
                    }}>
                      <img
                        src={item.icon}
                        alt={item.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>

                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: isSelected ? '#facc15' : '#94a3b8',
                      fontWeight: 600,
                      marginTop: '0.25rem',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '90%',
                    }}>
                      {item.name.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3D Character Podium Stage */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            {/* Pedestal Stage Banner */}
            <div style={{
              flex: 1,
              minHeight: '440px',
              position: 'relative',
              borderRadius: '26px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 16px 50px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#091024',
            }}>
              {/* Character Background Image */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${selectedHeadgear.avatarImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'opacity 0.3s ease',
              }} />

              {/* Gradient Vignette Overlays for Depth */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, transparent 40%, rgba(8, 13, 26, 0.85) 95%)',
                pointerEvents: 'none',
              }} />

              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '160px',
                background: 'linear-gradient(to top, rgba(9, 14, 26, 0.95), transparent)',
                pointerEvents: 'none',
              }} />

              {/* Top Status Chips */}
              <div style={{
                position: 'relative',
                zIndex: 3,
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{
                  background: 'rgba(9, 14, 26, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '100px',
                  padding: '0.35rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#00d68f',
                    boxShadow: '0 0 10px #00d68f',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: '#e2e8f0',
                    fontWeight: 600,
                  }}>
                    SANCTUARY PEDESTAL
                  </span>
                </div>

                {equippedNotice && (
                  <div style={{
                    background: 'rgba(250, 204, 21, 0.95)',
                    color: '#090e1a',
                    borderRadius: '100px',
                    padding: '0.35rem 0.9rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: '0 0 15px rgba(250, 204, 21, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    animation: 'bounce 0.5s ease',
                  }}>
                    <Check size={14} />
                    <span>EQUIPPED!</span>
                  </div>
                )}
              </div>

              {/* Bottom Character Info Bar */}
              <div style={{
                position: 'relative',
                zIndex: 3,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: '#00d68f',
                      letterSpacing: '0.12em',
                      fontWeight: 600,
                      marginBottom: '0.2rem',
                    }}>
                      LEVEL 1 • ECO INVESTIGATOR
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                    }}>
                      {gameState.playerName || playerName || 'Eco Cadet'}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                  }}>
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding: '0.4rem 0.75rem',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '0.625rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>SELECTED GEAR</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8' }}>{selectedHeadgear.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
