import React from 'react';
import { Lock, ChevronRight, Sparkles } from 'lucide-react';

export default function UnlockModal({ level, onEnter, onClose }) {
  if (!level) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: 'var(--bg-card)',
        border: '1px solid var(--accent-green)',
        boxShadow: '0 0 40px rgba(0, 214, 143, 0.25)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
        animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}>
        {/* Glow icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(0, 214, 143, 0.12)',
          border: '1px solid rgba(0, 214, 143, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          fontSize: '2rem',
          animation: 'pulse-dot 2s ease-in-out infinite',
        }}>
          {level.icon || '🔓'}
        </div>

        <div className="data-label" style={{
          color: 'var(--accent-green)',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          marginBottom: '0.375rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}>
          <Sparkles size={14} color="var(--accent-green)" />
          NEW AREA UNLOCKED
        </div>

        <h2 style={{
          fontSize: '1.5rem',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem',
          color: 'var(--text-primary)',
        }}>
          {level.name.toUpperCase()}
        </h2>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          marginBottom: '1.75rem',
        }}>
          Your investigation has revealed a new source of e-waste in {level.name}. New devices and evidence await your analysis.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-primary w-full"
            onClick={onEnter}
            style={{
              padding: '0.875rem 1.5rem',
              fontSize: '0.9375rem',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 214, 143, 0.3)',
            }}
          >
            ENTER AREA <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
