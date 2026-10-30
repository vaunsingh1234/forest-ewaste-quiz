import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, Sparkles, X } from 'lucide-react';

export default function UnlockModal({ level, onEnter, onClose }) {
  if (!level) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 10, 6, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '0 0 calc(var(--safe-bottom, 0px) + 0.5rem)',
      animation: 'fadeIn 0.25s ease',
    }}>
      {/* Backdrop tap to close */}
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose || onEnter} />

      <div style={{
        position: 'relative',
        maxWidth: '520px',
        width: '100%',
        background: '#071f14',
        borderTop: '2px solid #00d68f',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '1.5rem 1.25rem 1.5rem',
        textAlign: 'center',
        boxShadow: '0 -10px 40px rgba(0, 214, 143, 0.25)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}>
        {/* Grab bar */}
        <div style={{ width: '40px', height: '4px', background: '#334155', borderRadius: '2px', margin: '0 auto 1.25rem' }} />

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
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
        )}

        {/* Glow icon */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'rgba(0, 214, 143, 0.15)',
          border: '2px solid #00d68f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '2.25rem',
          boxShadow: '0 0 25px rgba(0, 214, 143, 0.4)',
        }}>
          {level.icon || '🔓'}
        </div>

        <div className="data-label" style={{
          color: '#00d68f',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          marginBottom: '0.35rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
        }}>
          <Sparkles size={14} color="#00d68f" />
          NEW DISTRICT UNLOCKED
        </div>

        <h2 style={{
          fontSize: '1.35rem',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.04em',
          margin: '0 0 0.5rem',
          color: '#ffffff',
          fontWeight: 800,
        }}>
          {level.name.toUpperCase()}
        </h2>

        <p style={{
          color: '#cbd5e1',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          margin: '0 0 1.5rem',
        }}>
          Your investigation has revealed new electronic waste evidence in {level.name}. Examine uninspected devices and secure the sector!
        </p>

        <button
          className="btn btn-primary"
          onClick={onEnter}
          style={{
            width: '100%',
            minHeight: '52px',
            fontSize: '1rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 0 25px rgba(0, 214, 143, 0.35)',
          }}
        >
          ENTER {level.name.toUpperCase()} NOW <ChevronRight size={18} />
        </button>
      </div>
    </div>,
    document.body
  );
}
