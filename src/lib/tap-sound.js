let audioContext = null;
let master = null;
let noiseBuffer = null;
let lastTapAt = 0;

function context() {
  if (audioContext) return audioContext;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  audioContext = new AudioCtx();
  const tone = audioContext.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 2800;
  tone.Q.value = 0.45;

  master = audioContext.createGain();
  master.gain.value = 0.72;
  master.connect(tone);
  tone.connect(audioContext.destination);

  const seconds = 0.02;
  const length = Math.floor(audioContext.sampleRate * seconds);
  noiseBuffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  let previous = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    previous = previous * 0.65 + white * 0.35;
    const window = Math.sin((Math.PI * i) / (length - 1));
    data[i] = previous * window;
  }

  return audioContext;
}

function tone(audio, start, frequency, peak, duration) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, start);
  osc.frequency.exponentialRampToValueAtTime(frequency * 0.46, start + duration);

  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + 0.0045);
  gain.gain.exponentialRampToValueAtTime(0.0008, start + duration);

  osc.connect(gain);
  gain.connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/**
 * Soft UI tap: a short warm pitch drop plus a quiet filtered tick.
 * Safe to call on every pointer down; rapid repeats are ignored.
 */
export function playTapSound() {
  const now = performance.now();
  if (now - lastTapAt < 42) return;
  lastTapAt = now;

  const audio = context();
  if (!audio || !master || !noiseBuffer) return;
  if (audio.state === "suspended") void audio.resume();

  const start = audio.currentTime + 0.001;
  const drift = 0.96 + Math.random() * 0.08;

  tone(audio, start, 248 * drift, 0.13, 0.058);
  tone(audio, start, 620 * drift, 0.028, 0.028);

  const noise = audio.createBufferSource();
  noise.buffer = noiseBuffer;
  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1650;
  band.Q.value = 0.85;
  const tick = audio.createGain();
  tick.gain.setValueAtTime(0.055, start);
  tick.gain.exponentialRampToValueAtTime(0.0008, start + 0.016);
  noise.connect(band);
  band.connect(tick);
  tick.connect(master);
  noise.start(start);
  noise.stop(start + 0.02);
}
