import React, { useState } from 'react';
import { Sparkles, Shield, Zap, Check, ArrowRight, Dices, Award, Heart, Info, RefreshCw } from 'lucide-react';
import { AVATAR_HEADGEAR, AVATAR_OUTFITS, DEFAULT_AVATAR } from '../data/avatars';

export default function AvatarSelect({ gameState, updateAvatar, onProceed, navigate }) {
  const currentAvatar = gameState?.avatar || DEFAULT_AVATAR;
  
  const [selectedHeadgearId, setSelectedHeadgearId] = useState(currentAvatar.headgearId || 'frog');
  const [selectedOutfitId, setSelectedOutfitId] = useState(currentAvatar.outfitId || 'eco_ranger');
  const [playerName, setPlayerName] = useState(gameState?.playerName || 'Officer Nova');
  const [equippedNotice, setEquippedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState('headgear'); // 'headgear' | 'outfit'

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
    setTimeout(() => setEquippedNotice(false), 1800);
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
    setTimeout(() => setEquippedNotice(false), 1800);
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
      onProceed(gameState?.playerName || playerName || 'Eco Cadet', finalAvatar);
    } else {
      navigate('briefing');
    }
  };

  return (
    <div className="page-enter avatar-studio-page" style={{
      minHeight: '100dvh',
      padding: 'calc(var(--safe-top, 0px) + 0.75rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 1.5rem)',
      background: 'radial-gradient(ellipse at top, #133a27 0%, #06150e 85%)',
      color: '#f0fdf4',
      overflowX: 'hidden',
    }}>
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto', padding: '0 0.25rem' }}>
        
        {/* Studio Top Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(74, 222, 128, 0.12)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            borderRadius: '100px',
            padding: '0.2rem 0.75rem',
            marginBottom: '0.4rem',
          }}>
            <Sparkles size={14} color="#4ade80" />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: '#86efac',
              letterSpacing: '0.1em',
              fontWeight: 700,
            }}>
              CHIBI WARDROBE & ECO-PERKS
            </span>
          </div>

          <h1 style={{
            fontSize: '1.4rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            margin: '0 0 0.35rem 0',
            color: '#ffffff',
          }}>
            EQUIP YOUR ECO-SUIT
          </h1>
          <p style={{
            margin: 0,
            color: '#cbd5e1',
            fontSize: '0.875rem',
            lineHeight: 1.5,
          }}>
            Select headgear and field suit before stepping into Nova Sanctuary. Each grants special eco perks!
          </p>
        </div>

        {/* Character Showcase Card (Single-Column) */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(16, 44, 30, 0.95) 0%, rgba(9, 26, 18, 0.98) 100%)',
          border: '1.5px solid rgba(74, 222, 128, 0.35)',
          borderRadius: '24px',
          padding: '1.25rem',
          marginBottom: '1.25rem',
          boxShadow: '0 12px 35px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          position: 'relative',
        }}>
          {/* Avatar Portrait */}
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #4ade80',
            boxShadow: '0 0 25px rgba(74, 222, 128, 0.45)',
            background: 'radial-gradient(circle, rgba(74, 222, 128, 0.25) 0%, #07150e 80%)',
            flexShrink: 0,
            position: 'relative',
          }}>
            <img
              src={selectedHeadgear.avatarImg}
              alt={selectedHeadgear.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Details & Randomize */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-green" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                {selectedHeadgear.rarity.toUpperCase()}
              </span>
              <button
                onClick={handleRandomize}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  borderRadius: '10px',
                  padding: '0.35rem 0.65rem',
                  color: '#4ade80',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                <Dices size={14} />
                <span>SHUFFLE</span>
              </button>
            </div>

            <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', color: '#ffffff', fontWeight: 800 }}>
              {selectedHeadgear.name}
            </h3>

            <div style={{ fontSize: '0.8125rem', color: '#00b4d8', fontFamily: 'var(--font-mono)', marginBottom: '0.35rem' }}>
              Suit: {selectedOutfit.name}
            </div>

            <div style={{
              background: 'rgba(74, 222, 128, 0.12)',
              border: '1px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '8px',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              color: '#86efac',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}>
              <Zap size={12} />
              <span>{selectedHeadgear.bonus}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Headgear vs Eco-Suits */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          marginBottom: '1rem',
          background: 'rgba(0,0,0,0.4)',
          padding: '4px',
          borderRadius: '16px',
        }}>
          <button
            onClick={() => setActiveTab('headgear')}
            style={{
              minHeight: '44px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'headgear' ? '#22c55e' : 'transparent',
              color: activeTab === 'headgear' ? '#071b10' : '#cbd5e1',
              fontWeight: 800,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>👒</span>
            <span>HEADGEAR ({AVATAR_HEADGEAR.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('outfit')}
            style={{
              minHeight: '44px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'outfit' ? '#22c55e' : 'transparent',
              color: activeTab === 'outfit' ? '#071b10' : '#cbd5e1',
              fontWeight: 800,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>👔</span>
            <span>ECO-SUITS ({AVATAR_OUTFITS.length})</span>
          </button>
        </div>

        {/* Tab 1: Headgear Grid */}
        {activeTab === 'headgear' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '0.65rem',
            marginBottom: '1.5rem',
          }}>
            {AVATAR_HEADGEAR.map(gear => {
              const isSelected = selectedHeadgearId === gear.id;
              return (
                <button
                  key={gear.id}
                  onClick={() => handleSelectHeadgear(gear)}
                  style={{
                    background: isSelected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1.5px solid ${isSelected ? '#22c55e' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '16px',
                    padding: '0.75rem 0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                    minHeight: '120px',
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      color: '#071b10',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Check size={13} strokeWidth={3} />
                    </div>
                  )}

                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `1.5px solid ${isSelected ? '#22c55e' : 'rgba(255,255,255,0.2)'}`,
                  }}>
                    <img src={gear.avatarImg} alt={gear.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                    {gear.name}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#86efac', fontFamily: 'var(--font-mono)' }}>
                    {gear.tag}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 2: Outfits List (Single Column Full-Width Cards) */}
        {activeTab === 'outfit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {AVATAR_OUTFITS.map(outfit => {
              const isSelected = selectedOutfitId === outfit.id;
              return (
                <button
                  key={outfit.id}
                  onClick={() => handleSelectOutfit(outfit)}
                  style={{
                    width: '100%',
                    minHeight: '56px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    background: isSelected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1.5px solid ${isSelected ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#ffffff',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#22c55e' : '#64748b'}`,
                      background: isSelected ? '#22c55e' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#052e16' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{outfit.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{outfit.description}</div>
                    </div>
                  </div>

                  <span className="badge badge-green" style={{ fontSize: '0.75rem', padding: '2px 8px', flexShrink: 0 }}>
                    {outfit.bonus}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Sticky Action Button at Bottom */}
        <div style={{
          position: 'sticky',
          bottom: 'calc(var(--bottom-nav-total-height, 70px) + 0.5rem)',
          zIndex: 40,
          padding: '0.5rem 0',
        }}>
          <button
            id="confirm-avatar-btn"
            onClick={handleConfirmAndProceed}
            className="btn btn-primary"
            style={{
              width: '100%',
              minHeight: '52px',
              fontSize: '1rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
              color: '#071b10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 25px rgba(34, 197, 94, 0.45)',
              borderRadius: '16px',
            }}
          >
            <span>CONFIRM SUIT & PROCEED</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
