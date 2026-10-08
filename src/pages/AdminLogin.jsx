import React, { useState } from 'react';
import { Shield, Key, User, ArrowRight, AlertCircle } from 'lucide-react';

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
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        boxShadow: '0 0 50px rgba(0,0,0,0.5)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, var(--accent-green), var(--accent-blue))'
        }} />

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(0,214,143,0.1)',
            border: '1px solid rgba(0,214,143,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <Shield size={28} color="var(--accent-green)" />
          </div>

          <div className="data-label" style={{ color: 'var(--accent-green)', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>
            NOVA CITY
          </div>
          <h1 style={{ fontSize: '1.375rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
            ADMIN CONTROL CENTER
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
            Authorized personnel only
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-red)',
            fontSize: '0.8125rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="data-label" style={{ display: 'block', marginBottom: '0.375rem' }}>
              USERNAME
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter admin username"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                }}
                id="admin-username-input"
              />
            </div>
          </div>

          <div>
            <label className="data-label" style={{ display: 'block', marginBottom: '0.375rem' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                }}
                id="admin-password-input"
              />
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px border-dashed var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.875rem',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Demo credentials for academic project:
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-green)', marginBottom: '0.75rem' }}>
              Username: <strong>admin</strong> | Password: <strong>admin123</strong>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAutofill}
              style={{ width: '100%', fontSize: '0.75rem', justifyContent: 'center' }}
              id="autofill-demo-btn"
            >
              <Key size={12} /> AUTOFILL DEMO CREDENTIALS
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ padding: '0.875rem', justifyContent: 'center', fontSize: '0.9375rem' }}
            id="admin-login-submit-btn"
          >
            LOGIN <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('home')}
            style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}
          >
            ← Return to Nova City Response Center
          </button>
        </div>
      </div>
    </div>
  );
}
