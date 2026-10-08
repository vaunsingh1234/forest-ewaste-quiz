import React, { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  { text: 'CONNECTING TO NOVA CITY...', delay: 0 },
  { text: 'E-WASTE RESPONSE SYSTEM ONLINE', delay: 700 },
  { text: 'CITY NETWORK CONNECTED', delay: 1200 },
  { text: 'WASTE MONITORING ACTIVE', delay: 1700 },
  { text: 'INITIALIZING MISSION INTERFACE...', delay: 2000 },
];

export default function LoadingScreen() {
  const [messages, setMessages] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    LOADING_MESSAGES.forEach(({ text, delay }) => {
      setTimeout(() => {
        setMessages(prev => [...prev, text]);
      }, delay);
    });

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 4, 100));
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      gap: '2rem',
    }}>
      {/* City SVG illustration */}
      <div style={{ marginBottom: '1rem' }}>
        <svg width="280" height="120" viewBox="0 0 280 120" fill="none">
          {/* City skyline */}
          <rect x="10" y="60" width="30" height="60" fill="rgba(0,180,216,0.15)" stroke="rgba(0,180,216,0.3)" strokeWidth="1"/>
          <rect x="15" y="40" width="20" height="20" fill="rgba(0,180,216,0.1)" stroke="rgba(0,180,216,0.2)" strokeWidth="1"/>
          <rect x="50" y="30" width="40" height="90" fill="rgba(0,214,143,0.12)" stroke="rgba(0,214,143,0.25)" strokeWidth="1"/>
          <rect x="55" y="10" width="10" height="20" fill="rgba(0,214,143,0.08)" stroke="rgba(0,214,143,0.2)" strokeWidth="1"/>
          <rect x="100" y="50" width="25" height="70" fill="rgba(0,180,216,0.1)" stroke="rgba(0,180,216,0.2)" strokeWidth="1"/>
          <rect x="135" y="20" width="50" height="100" fill="rgba(0,214,143,0.15)" stroke="rgba(0,214,143,0.3)" strokeWidth="1"/>
          <rect x="145" y="5" width="8" height="15" fill="rgba(0,214,143,0.3)" stroke="rgba(0,214,143,0.5)" strokeWidth="1"/>
          {/* Antenna blink */}
          <circle cx="149" cy="5" r="3" fill="var(--accent-green)" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.5s" repeatCount="indefinite"/>
          </circle>
          <rect x="195" y="45" width="35" height="75" fill="rgba(0,180,216,0.1)" stroke="rgba(0,180,216,0.2)" strokeWidth="1"/>
          <rect x="240" y="55" width="30" height="65" fill="rgba(0,214,143,0.1)" stroke="rgba(0,214,143,0.2)" strokeWidth="1"/>
          {/* Ground */}
          <line x1="0" y1="120" x2="280" y2="120" stroke="rgba(0,214,143,0.2)" strokeWidth="1"/>
          {/* Windows */}
          {[60,72,84,96].map(y => [56,62,68,74,80].map(x =>
            <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="rgba(0,214,143,0.3)" rx="0.5"/>
          ))}
          {[30,42,54,66].map(y => [137,147,157,167,177].map(x =>
            <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="rgba(0,214,143,0.25)" rx="0.5"/>
          ))}
        </svg>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          fontWeight: 900,
          color: 'var(--accent-green)',
          letterSpacing: '0.2em',
          marginBottom: '0.25rem',
        }}>E-WASTE</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          letterSpacing: '0.3em',
        }}>THE LAST DEVICE</div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '300px' }}>
        <div className="progress-track">
          <div className="progress-fill progress-green" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Terminal messages */}
      <div style={{
        width: '320px',
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        minHeight: '120px',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: i === messages.length - 1 ? 'var(--accent-green)' : 'var(--text-secondary)',
            marginBottom: '0.375rem',
            animation: 'fadeIn 0.3s ease',
          }}>
            <span style={{ color: 'var(--text-muted)' }}>&gt; </span>
            {msg}
            {i === messages.length - 1 && (
              <span className="typewriter-cursor" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
