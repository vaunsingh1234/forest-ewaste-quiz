import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      window.localStorage.removeItem('ewaste-game-state');
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0a0f1a',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
        }}>
          <div style={{
            maxWidth: '540px',
            background: '#131b2e',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            boxShadow: '0 0 40px rgba(239,68,68,0.2)',
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              color: '#ef4444',
            }}>
              ⚠️
            </div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
              APPLICATION DIAGNOSTIC ERROR
            </h1>
            <p style={{ color: '#8b9ab8', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              A runtime component exception occurred. Details have been logged to the developer console.
            </p>

            {this.state.error && (
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'left',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#ef4444',
                marginBottom: '1.5rem',
                overflowX: 'auto',
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#00d68f',
                  color: '#050a14',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.25rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                RELOAD APPLICATION
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  padding: '0.75rem 1.25rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                CLEAR STATE & RELOAD
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
