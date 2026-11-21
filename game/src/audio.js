// Shade Run — WebAudio: footsteps and alarm blips. All optional; failures are silent.
let ctx = null;
let stepToggle = 0;

function audioContext() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      ctx = null;
    }
  }
  return ctx;
}

export function resumeAudio() {
  const c = audioContext();
  if (c && c.state === 'suspended') c.resume().catch(() => {});
}

function blip(freq, duration, type = 'sine', gainValue = 0.08) {
  const c = audioContext();
  if (!c) return;
  try {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(gainValue, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration);
  } catch {
    // no audio — fine
  }
}

export function playFootstep(sneaking) {
  stepToggle = (stepToggle + 1) % 2;
  blip(sneaking ? 160 : 220, 0.05, 'triangle', sneaking ? 0.02 : 0.05);
}

export function playSuspicionTick() {
  blip(520, 0.08, 'square', 0.04);
}

export function playAlarm() {
  blip(880, 0.3, 'sawtooth', 0.1);
  setTimeout(() => blip(660, 0.4, 'sawtooth', 0.1), 220);
}

export function playWinChime() {
  blip(660, 0.15, 'sine', 0.08);
  setTimeout(() => blip(880, 0.2, 'sine', 0.08), 140);
  setTimeout(() => blip(1100, 0.3, 'sine', 0.08), 300);
}
