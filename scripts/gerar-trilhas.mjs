// Compõe as trilhas dos Reels (originais, geradas por código: sem direitos de terceiros).
// Uso: node scripts/gerar-trilhas.mjs <axon|jh> [pasta-de-saída]  (precisa do ffmpeg no PATH ou em FFMPEG)
// Saída: scripts/reel/trilhas/trilha-<n>.m4a (ou a pasta indicada), ~15 s cada. Usadas por scripts/reels.mjs.
//   axon: 112 BPM, eletrônico leve (arpejo em semicolcheias, bumbo em todos os tempos, pad "pulsando").
//   jh:    84 BPM, corporativo calmo (arpejo de piano em colcheias, bateria suave).
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const PRESETS = {
  axon: {
    bpm: 112, arpPasso: 1 / 4, arpOitava: 24, arpTimbre: 'pluck', bateria: 'eletronica', pulso: true,
    padGanho: 0.03, arpGanho: 0.17, padrao: [0, 1, 2, 3, 2, 1, 2, 3, 0, 2, 1, 3, 2, 3, 1, 2],
    trilhas: [
      [[45, 48, 52, 55], [41, 45, 48, 52], [48, 52, 55, 59], [43, 47, 50, 55]], // Am7 Fmaj7 Cmaj7 G
      [[40, 43, 47, 50], [48, 52, 55, 59], [43, 47, 50, 55], [50, 54, 57, 62]], // Em7 Cmaj7 G D
      [[50, 53, 57, 60], [46, 50, 53, 57], [41, 45, 48, 53], [48, 52, 55, 60]], // Dm7 Bbmaj7 F C
    ],
  },
  jh: {
    bpm: 84, arpPasso: 1 / 2, arpOitava: 12, arpTimbre: 'piano', bateria: 'suave', pulso: false,
    padGanho: 0.032, arpGanho: 0.2, padrao: [0, 2, 1, 3, 2, 1, 3, 2],
    trilhas: [
      [[48, 52, 55, 60], [43, 47, 50, 55], [45, 48, 52, 57], [41, 45, 48, 53]], // C G Am F
      [[50, 54, 57, 62], [45, 49, 52, 57], [47, 50, 54, 59], [43, 47, 50, 55]], // D A Bm G
      [[41, 45, 48, 53], [50, 53, 57, 60], [46, 50, 53, 58], [48, 52, 55, 60]], // F Dm7 Bb C
    ],
  },
};

const marca = process.argv[2];
const P = PRESETS[marca];
if (!P) throw new Error('Uso: node scripts/gerar-trilhas.mjs <axon|jh> [pasta]');
const out = process.argv[3] || join(process.cwd(), 'scripts/reel/trilhas');
mkdirSync(out, { recursive: true });

const SR = 44100, DUR = 15.5, BEAT = 60 / P.bpm, BAR = BEAT * 4;
const N = Math.floor(SR * DUR);
const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const nota = (n) => 440 * 2 ** ((n - 69) / 12); // MIDI -> Hz

let semente = marca === 'axon' ? 11 : 23;
const ruido = () => { semente = (semente * 1103515245 + 12345) & 0x7fffffff; return semente / 0x3fffffff - 1; };

function render(acordes) {
  const L = new Float32Array(N), R = new Float32Array(N);
  const add = (buf, i, v) => { if (i >= 0 && i < N) buf[i] += v; };
  const acordeEm = (t) => acordes[Math.floor(t / BAR) % acordes.length];

  // Pad: notas do acorde, levemente desafinadas entre os canais. No Axon, "pulsa" a cada tempo.
  for (let i = 0; i < N; i++) {
    const t = i / SR, ac = acordeEm(t), tb = t % BAR;
    let env = Math.min(1, tb / 0.35) * (0.75 + 0.25 * Math.cos((tb / BAR) * Math.PI));
    if (P.pulso) env *= 0.35 + 0.65 * Math.min(1, (t % BEAT) / (BEAT * 0.6));
    let l = 0, r = 0;
    for (const n of ac) {
      const f = nota(n + 12);
      l += Math.sin(2 * Math.PI * f * 1.002 * t) + 0.25 * Math.sin(4 * Math.PI * f * t);
      r += Math.sin(2 * Math.PI * f * 0.998 * t) + 0.25 * Math.sin(4 * Math.PI * f * t);
    }
    L[i] += P.padGanho * env * l; R[i] += P.padGanho * env * r;
  }

  // Arpejo: corda dedilhada (Karplus-Strong) no Axon, piano (harmônicos com decaimento) na JH.
  const passo = BEAT * P.arpPasso;
  for (let k = 0; k * passo < DUR - 0.2; k++) {
    const t0 = k * passo, ac = acordeEm(t0), n = ac[P.padrao[k % P.padrao.length]] + P.arpOitava;
    const i0 = Math.floor(t0 * SR), pan = k % 2 ? 0.7 : 1;
    const g = P.arpGanho * (k % 4 === 0 ? 1 : 0.78);
    if (P.arpTimbre === 'pluck') {
      const per = Math.round(SR / nota(n)), linha = Float32Array.from({ length: per }, () => ruido() * 0.5);
      const len = Math.floor(SR * 0.6);
      let p = 0, prev = 0;
      for (let j = 0; j < len; j++) {
        const v = linha[p]; const novo = 0.992 * (0.65 * v + 0.35 * prev); prev = v; linha[p] = novo; p = (p + 1) % per;
        add(L, i0 + j, g * v * pan); add(R, i0 + j, g * v * (1.7 - pan));
      }
    } else {
      const f = nota(n), len = Math.floor(SR * 1.6);
      for (let j = 0; j < len; j++) {
        const tt = j / SR, at = Math.min(1, tt / 0.004);
        const v = at * (Math.sin(2 * Math.PI * f * tt) * Math.exp(-tt * 2.2)
          + 0.45 * Math.sin(4 * Math.PI * f * tt) * Math.exp(-tt * 4)
          + 0.2 * Math.sin(6 * Math.PI * f * tt) * Math.exp(-tt * 7)
          + 0.08 * Math.sin(8 * Math.PI * f * tt) * Math.exp(-tt * 10));
        add(L, i0 + j, 0.55 * g * v * pan); add(R, i0 + j, 0.55 * g * v * (1.7 - pan));
      }
    }
  }

  // Baixo: fundamental. Axon em colcheias, JH em semínimas longas.
  const passoBaixo = P.bateria === 'eletronica' ? BEAT / 2 : BEAT;
  for (let k = 0; k * passoBaixo < DUR; k++) {
    const t0 = k * passoBaixo, f = nota(acordeEm(t0)[0] - 12), i0 = Math.floor(t0 * SR);
    const dec = P.bateria === 'eletronica' ? 6 : 2.6, gb = P.bateria === 'eletronica' && k % 2 === 0 ? 0.08 : 0.15;
    for (let j = 0; j < SR * passoBaixo; j++) {
      const tt = j / SR, v = gb * Math.sin(2 * Math.PI * f * tt) * Math.exp(-tt * dec) * Math.min(1, tt / 0.01);
      add(L, i0 + j, v); add(R, i0 + j, v);
    }
  }

  // Bateria.
  const bumbo = (i0, g) => {
    let fase = 0;
    for (let j = 0; j < SR * 0.35; j++) {
      const tt = j / SR, f = 48 + 80 * Math.exp(-tt * 32); fase += (2 * Math.PI * f) / SR;
      const v = g * Math.sin(fase) * Math.exp(-tt * 9); add(L, i0 + j, v); add(R, i0 + j, v);
    }
  };
  const palma = (i0, g, dec) => {
    let lp = 0;
    for (let j = 0; j < SR * 0.2; j++) {
      const tt = j / SR, x = ruido(); lp += 0.35 * (x - lp);
      const v = g * (x - lp) * Math.exp(-tt * dec); add(L, i0 + j, v); add(R, i0 + j, v);
    }
  };
  const chimbal = (i0, g, dec) => {
    let prev = 0;
    for (let j = 0; j < SR * 0.06; j++) {
      const x = ruido(), hp = x - prev; prev = x;
      const v = g * hp * Math.exp(-(j / SR) * dec); add(L, i0 + j, v * 0.8); add(R, i0 + j, v);
    }
  };
  for (let k = 0; k * BEAT < DUR; k++) {
    const t0 = k * BEAT, i0 = Math.floor(t0 * SR), tempo = k % 4, entrou = t0 >= BAR;
    if (P.bateria === 'eletronica') {
      bumbo(i0, 0.4);
      if (entrou && (tempo === 1 || tempo === 3)) palma(i0, 0.13, 20);
      if (entrou) for (const s of [0.5, 0.25, 0.75]) chimbal(Math.floor((t0 + BEAT * s) * SR), s === 0.5 ? 0.04 : 0.018, 90);
    } else {
      if (tempo === 0) bumbo(i0, 0.3);
      if (tempo === 2) bumbo(i0, 0.18);
      if (entrou && tempo === 2) palma(i0, 0.06, 30);
      if (entrou) chimbal(Math.floor((t0 + BEAT / 2) * SR), 0.022, 60);
    }
  }

  // Reverb simples (ecos com realimentação) e masterização.
  const mixRev = P.arpTimbre === 'piano' ? 0.15 : 0.1;
  for (const [buf, atrasos] of [[L, [0.031, 0.047, 0.061]], [R, [0.037, 0.053, 0.067]]]) {
    const seco = Float32Array.from(buf);
    for (const a of atrasos) {
      const d = Math.floor(a * SR), eco = new Float32Array(N);
      for (let i = d; i < N; i++) eco[i] = seco[i - d] + 0.55 * eco[i - d];
      for (let i = 0; i < N; i++) buf[i] += mixRev * eco[i];
    }
  }
  let pico = 0;
  for (let i = 0; i < N; i++) pico = Math.max(pico, Math.abs(L[i]), Math.abs(R[i]));
  const ganho = 0.85 / pico, fadeIn = SR * 0.15, fadeOut = SR * 1.8;
  const pcm = Buffer.alloc(N * 4);
  for (let i = 0; i < N; i++) {
    const f = Math.min(1, i / fadeIn, (N - i) / fadeOut);
    const s = (x) => Math.max(-1, Math.min(1, Math.tanh(x * ganho * 1.1) * f));
    pcm.writeInt16LE(Math.round(s(L[i]) * 32767), i * 4);
    pcm.writeInt16LE(Math.round(s(R[i]) * 32767), i * 4 + 2);
  }
  return pcm;
}

function wav(pcm) {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

P.trilhas.forEach((acordes, idx) => {
  const nome = `trilha-${idx + 1}`, tmp = join(out, `${nome}.wav`);
  writeFileSync(tmp, wav(render(acordes)));
  const r = spawnSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', tmp, '-c:a', 'aac', '-b:a', '128k', join(out, `${nome}.m4a`)], { encoding: 'utf8' });
  rmSync(tmp);
  if (r.status !== 0) throw new Error(r.stderr);
  console.log('ok', marca, nome);
});
