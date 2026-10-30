import React, { useState } from 'react';
import { Shield, Key, User, ArrowRight, AlertCircle, ChevronLeft } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, navigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAutofill = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      window.localStorage.setItem('ewaste-admin-auth', 'true');
      onLoginSuccess();
      navigate('admin_dashboard');
    } else {
      setError('Invalid username or password. Use demo credentials (admin / admin123).');
    }
  };

  return (
    <div className="page-enter" style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'calc(var(--safe-top, 0px) + 1rem) 0.75rem calc(var(--bottom-nav-total-height, 70px) + 1rem)',
      background: 'radial-gradient(ellipse at top, #11281c 0%, #030d07 85%)',
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: 'rgba(6, 30, 18, 0.85)',
        border: '1.5px solid rgba(74, 222, 128, 0.25)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        borderRadius: '24px',
        padding: '1.75rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #00d68f, #00b4d8)'
        }} />

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(0,214,143,0.12)',
            border: '1.5px solid #00d68f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
          }}>
            <Shield size={28} color="#00d68f" />
          </div>

          <div className="data-label" style={{ color: '#00d68f', letterSpacing: '0.12em', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            NOVA SANCTUARY
          </div>
          <h1 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', margin: '0 0 0.25rem 0', color: '#ffffff', fontWeight: 800 }}>
            ADMIN CONTROL CENTER
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
            Faculty & authorized researchers only
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            color: '#fca5a5',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="data-label" style={{ display: 'block', marginBottom: '0.35rem', color: '#86efac' }}>
              USERNAME
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter admin username"
                style={{
                  width: '100%',
                  minHeight: '48px',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1.5px solid rgba(255,255,255,0.12)',
                  borderRadius: '14px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1rem', // Prevents iOS Safari auto-zoom
                }}
                id="admin-username-input"
              />
            </div>
          </div>

          <div>
            <label className="data-label" style={{ display: 'block', marginBottom: '0.35rem', color: '#86efac' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  minHeight: '48px',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1.5px solid rgba(255,255,255,0.12)',
                  borderRadius: '14px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1rem', // Prevents iOS Safari auto-zoom
                }}
                id="admin-password-input"
              />
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1.5px dashed rgba(74,222,128,0.25)',
            borderRadius: '14px',
            padding: '0.85rem',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: '0 0 0.4rem 0' }}>
              Academic demo access:
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#00d68f', marginBottom: '0.65rem' }}>
              User: <strong>admin</strong> | Pass: <strong>admin123</strong>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAutofill}
              style={{ width: '100%', minHeight: '44px', fontSize: '0.8125rem', fontWeight: 700, justifyContent: 'center' }}
              id="autofill-demo-btn"
            >
              <Key size={14} /> AUTOFILL DEMO LOGIN
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', minHeight: '52px', justifyContent: 'center', fontSize: '1rem', fontWeight: 800 }}
            id="admin-login-submit-btn"
          >
            AUTHORIZE LOGIN <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            className="btn btn-ghost"
            onClick={() => navigate('home')}
            style={{ color: '#94a3b8', fontSize: '0.8125rem', minHeight: '44px' }}
          >
            ← Return to Nova Sanctuary Home
          </button>
        </div>
      </div>
    </div>
  );
}
