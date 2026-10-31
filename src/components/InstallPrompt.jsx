import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, Smartphone, Sparkles, Check } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Allow manual testing via URL param ?pwa_test=android or ?pwa_test=ios
    const urlParams = new URLSearchParams(window.location.search);
    const testMode = urlParams.get('pwa_test');
    if (testMode === 'android') {
      setShowAndroidPrompt(true);
      return;
    }
    if (testMode === 'ios') {
      setShowIOSHint(true);
      return;
    }

    // 1. Check if already running in standalone mode (installed PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Android & Chromium beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user previously dismissed prompt in this session
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        setShowAndroidPrompt(true);
      }
    };

    // 3. App installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowAndroidPrompt(false);
      setShowIOSHint(false);
      setDeferredPrompt(null);
      sessionStorage.removeItem('pwa-prompt-dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // 4. iOS Safari detection
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !window.MSStream;

    // Check if Safari on iOS (not Chrome/Firefox on iOS, which can't install PWAs directly)
    const isSafari =
      isIOS &&
      /Safari/.test(navigator.userAgent) &&
      !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);

    if (isSafari && !isStandalone) {
      const iosDismissed = localStorage.getItem('pwa-ios-hint-dismissed');
      if (!iosDismissed) {
        // Delay slightly for better UX so page loads first
        const timer = setTimeout(() => {
          setShowIOSHint(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle Android / Desktop install click
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowAndroidPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismissAndroid = () => {
    setShowAndroidPrompt(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleDismissIOS = () => {
    setShowIOSHint(false);
    localStorage.setItem('pwa-ios-hint-dismissed', 'true');
  };

  if (isInstalled) return null;

  // Render Android / Chrome Install Prompt
  if (showAndroidPrompt) {
    return (
      <aside
        role="dialog"
        aria-label="Install App"
        style={{
          position: 'fixed',
          bottom: 'calc(var(--bottom-nav-total-height, 70px) + 0.625rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 1.25rem)',
          maxWidth: '400px',
          zIndex: 998,
          background: 'rgba(6, 21, 14, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-accent, rgba(74, 222, 128, 0.45))',
          borderRadius: 'var(--radius-xl, 16px)',
          padding: '0.875rem 1rem',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(34, 197, 94, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          animation: 'pwaSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
            <img
              src="/pwa-192x192.png"
              alt="Last Device Icon"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.04em',
                lineHeight: 1.2,
              }}>
                Install Last Device
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.3,
                marginTop: '2px',
              }}>
                Play offline with fullscreen mode
              </div>
            </div>
          </div>

          <button
            onClick={handleDismissAndroid}
            aria-label="Close install prompt"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              padding: '8px',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleInstallClick}
            className="btn btn-primary"
            style={{
              flex: 1,
              minHeight: '44px',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              padding: '0.5rem 1rem',
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
            }}
          >
            <Download size={16} /> INSTALL APP
          </button>
          <button
            onClick={handleDismissAndroid}
            className="btn btn-ghost"
            style={{
              minHeight: '44px',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              padding: '0.5rem 0.875rem',
            }}
          >
            Later
          </button>
        </div>
      </aside>
    );
  }

  // Render iOS Safari "Add to Home Screen" Hint
  if (showIOSHint) {
    return (
      <aside
        role="dialog"
        aria-label="Add to Home Screen hint"
        style={{
          position: 'fixed',
          bottom: 'calc(var(--bottom-nav-total-height, 70px) + 0.625rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 1.25rem)',
          maxWidth: '400px',
          zIndex: 998,
          background: 'rgba(6, 21, 14, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-accent, rgba(74, 222, 128, 0.45))',
          borderRadius: 'var(--radius-xl, 16px)',
          padding: '0.875rem 1rem',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(34, 197, 94, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
          animation: 'pwaSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
            <img
              src="/apple-touch-icon.png"
              alt="Last Device Icon"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.04em',
                lineHeight: 1.2,
              }}>
                Install on iPhone
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                lineHeight: 1.25,
                marginTop: '2px',
              }}>
                Add to your home screen for offline play
              </div>
            </div>
          </div>

          <button
            onClick={handleDismissIOS}
            aria-label="Dismiss iOS install hint"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              padding: '6px',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step by step instruction */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(74, 222, 128, 0.2)',
          borderRadius: 'var(--radius-md, 8px)',
          padding: '0.625rem 0.75rem',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', lineHeight: 1.4 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: 'var(--accent-blue, #38bdf8)',
              flexShrink: 0,
            }}>
              <Share size={14} />
            </span>
            <span>
              1. Tap the <strong>Share</strong> button in Safari's toolbar
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', lineHeight: 1.4 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'rgba(34, 197, 94, 0.15)',
              color: 'var(--accent-green, #22c55e)',
              flexShrink: 0,
            }}>
              <PlusSquare size={14} />
            </span>
            <span>
              2. Scroll down & select <strong>Add to Home Screen</strong>
            </span>
          </div>
        </div>

        <button
          onClick={handleDismissIOS}
          className="btn btn-secondary btn-sm"
          style={{
            minHeight: '44px',
            width: '100%',
            fontSize: '0.8125rem',
            fontWeight: 600,
          }}
        >
          Got it
        </button>
      </aside>
    );
  }

  return null;
}
