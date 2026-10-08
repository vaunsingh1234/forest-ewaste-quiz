// Web Audio API Synthesizer for friendly, kid-safe sound effects
// Does not depend on external mp3 files, works instantly in any modern browser.

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playGuideChime(type = 'hint') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.12, now);
    masterGain.connect(ctx.destination);

    if (type === 'cheer') {
      // Happy ascending arpeggio: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        noteGain.gain.setValueAtTime(0, now + idx * 0.08);
        noteGain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } else if (type === 'hint') {
      // Soft gentle magical chime (two harmonic bells)
      [659.25, 987.77].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        noteGain.gain.setValueAtTime(0, now + idx * 0.1);
        noteGain.gain.linearRampToValueAtTime(0.18, now + idx * 0.1 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.42);
      });
    } else if (type === 'pop') {
      // Bubbly friendly pop
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      noteGain.gain.setValueAtTime(0.18, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'encourage') {
      // Soft warm supportive chime
      [440, 554.37, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        noteGain.gain.setValueAtTime(0, now + idx * 0.1);
        noteGain.gain.linearRampToValueAtTime(0.15, now + idx * 0.1 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.38);
      });
    }
  } catch (e) {
    // Audio context may be restricted by autoplay policy; silent fail is safe
  }
}

// Kid-Friendly Text-to-Speech using standard SpeechSynthesis
export function speakGuideText(text, onEnd) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel(); // Stop prior speech
    // Clean text of emojis for clean speech
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // Slightly slower, clear for young students
    utterance.pitch = 1.15; // Friendly, warm, slightly higher pitch for chibi mascot

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    // Try finding an English voice
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Google')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error', e);
  }
}

export function stopGuideSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
