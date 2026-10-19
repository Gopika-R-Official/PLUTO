const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), "public", "audio");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function writeWav(filename, generator, durationSec = 6, sampleRate = 22050) {
  const numSamples = Math.floor(durationSec * sampleRate);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // audio format 1 = PCM
  buffer.writeUInt16LE(1, 22);  // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32);  // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, generator(t, durationSec)));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log("Generated audio file:", filePath, buffer.length, "bytes");
}

// Track 1: Ambient chime & synth chords (Fmaj7 warm harmonics)
writeWav("track-1.wav", (t, dur) => {
  const env = Math.sin((t / dur) * Math.PI); // fade in/out envelope
  const note1 = Math.sin(2 * Math.PI * 174.61 * t); // F3
  const note2 = Math.sin(2 * Math.PI * 220.00 * t) * 0.7; // A3
  const note3 = Math.sin(2 * Math.PI * 261.63 * t) * 0.6; // C4
  const note4 = Math.sin(2 * Math.PI * 329.63 * t) * 0.5; // E4
  const pulse = Math.sin(2 * Math.PI * 2 * t) * 0.2 + 0.8;
  return (note1 + note2 + note3 + note4) * 0.25 * env * pulse;
}, 8);

// Track 2: Acoustic harp / pluck pattern
writeWav("track-2.wav", (t, dur) => {
  const env = Math.sin((t / dur) * Math.PI);
  const drone = Math.sin(2 * Math.PI * 146.83 * t) * 0.3; // D3
  const pluckPhase = (t % 0.5) / 0.5;
  const pluckEnv = Math.exp(-pluckPhase * 6);
  const freqs = [293.66, 369.99, 440.00, 587.33];
  const freq = freqs[Math.floor((t * 2) % 4)];
  const pluck = Math.sin(2 * Math.PI * freq * t) * pluckEnv * 0.5;
  return (drone + pluck) * 0.4 * env;
}, 8);

// Track 4: Rain texture & soft electric piano
writeWav("track-4.wav", (t, dur) => {
  const env = Math.sin((t / dur) * Math.PI);
  const noise = (Math.random() * 2 - 1) * 0.08;
  const chord = (Math.sin(2 * Math.PI * 220 * t) + Math.sin(2 * Math.PI * 277.18 * t) + Math.sin(2 * Math.PI * 329.63 * t)) * 0.2;
  return (chord + noise) * 0.35 * env;
}, 8);
