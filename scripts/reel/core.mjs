// Núcleo dos Reels (1080x1920, MP4 H.264 + AAC, ~12 s): 3 telas (capa com título, resumo, chamada)
// com transição suave e trilha original (scripts/reel/trilhas, geradas por scripts/gerar-trilhas.mjs).
// O texto é desenhado pelo sharp com as fontes da pasta scripts/reel/fontes (não depende das fontes do servidor).
// Mesmo arquivo no site do Axon e no da JH; o que muda fica em scripts/reels.mjs.
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

export const W = 1080, H = 1920;
const AQUI = new URL('.', import.meta.url);
const arquivo = (rel) => decodeURIComponent(new URL(rel, AQUI).pathname).replace(/^\/([A-Za-z]:)/, '$1');

/** Caminho do ffmpeg: variável FFMPEG, pacote ffmpeg-static (se instalado) ou o do sistema. */
export function caminhoFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try {
    const p = createRequire(import.meta.url)('ffmpeg-static');
    if (p && existsSync(p)) return p;
  } catch {}
  return 'ffmpeg';
}

export function temFfmpeg() {
  return spawnSync(caminhoFfmpeg(), ['-version'], { stdio: 'ignore' }).status === 0;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Bloco de texto (PNG com transparência) já quebrado em linhas na largura dada. */
export async function texto(str, { fonte, peso = '', tamanho, cor = '#ffffff', largura = 920, alinhar = 'left', entrelinha = 0 }) {
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${cor}">${esc(str)}</span>`,
      font: `${fonte.familia}${peso ? ' ' + peso : ''} ${tamanho}`,
      fontfile: arquivo(`fontes/${fonte.arquivo}`),
      width: largura, align: alinhar, wrap: 'word', rgba: true, spacing: entrelinha,
    },
  }).png().toBuffer({ resolveWithObject: true });
  return { input: data, w: info.width, h: info.height };
}

export const svg = (corpo) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${corpo}</svg>`);
export const gradiente = (c1, c2, x2 = 0.5, y2 = 1) =>
  svg(`<defs><linearGradient id="g" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>`);

/** Monta uma tela: fundo (Buffer de imagem) + camadas { input, top, left }. */
export async function tela(fundo, camadas) {
  return sharp(fundo).resize(W, H, { fit: 'cover' }).composite(camadas).png().toBuffer();
}

/** Logo redimensionado para a largura dada. */
export async function logo(rel, largura) {
  const { data, info } = await sharp(rel).resize({ width: largura }).png().toBuffer({ resolveWithObject: true });
  return { input: data, w: info.width, h: info.height };
}

const trilhas = ['trilha-1', 'trilha-2', 'trilha-3'].map((t) => arquivo(`trilhas/${t}.m4a`));
const trilhaDe = (slug) => trilhas[[...slug].reduce((s, c) => s + c.charCodeAt(0), 0) % trilhas.length];

/** Junta as telas (PNG) num MP4: cada uma fica `duracoes[i]` s, com 0,5 s de transição e trilha com fade no fim. */
export function montarVideo(slug, telas, duracoes, saida) {
  const dir = mkdtempSync(join(tmpdir(), 'reel-'));
  try {
    telas.forEach((png, i) => writeFileSync(join(dir, `t${i}.png`), png));
    const trans = 0.5, args = ['-y', '-loglevel', 'error'];
    telas.forEach((_, i) => args.push('-loop', '1', '-t', String(duracoes[i]), '-framerate', '30', '-i', join(dir, `t${i}.png`)));
    args.push('-i', trilhaDe(slug));
    const filtros = telas.map((_, i) => `[${i}:v]format=yuv420p,setsar=1[s${i}]`);
    let anterior = 's0', offset = 0;
    for (let i = 1; i < telas.length; i++) {
      offset += duracoes[i - 1] - trans;
      const saidaV = i === telas.length - 1 ? 'v' : `v${i}`;
      filtros.push(`[${anterior}][s${i}]xfade=transition=fade:duration=${trans}:offset=${offset.toFixed(2)}[${saidaV}]`);
      anterior = saidaV;
    }
    const total = duracoes.reduce((s, d) => s + d, 0) - trans * (telas.length - 1);
    filtros.push(`[${telas.length}:a]atrim=0:${total.toFixed(2)},afade=t=out:st=${(total - 1.2).toFixed(2)}:d=1.2[a]`);
    args.push('-filter_complex', filtros.join(';'), '-map', '[v]', '-map', '[a]',
      '-t', total.toFixed(2), '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', saida);
    const r = spawnSync(caminhoFfmpeg(), args, { encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`ffmpeg falhou (${slug}): ${r.stderr}`);
    return total;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Lê o frontmatter (chave: valor, uma por linha) de um .md/.mdx. */
export function frontmatter(caminho) {
  const txt = readFileSync(caminho, 'utf8').replace(/^﻿/, '');
  const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const dados = {};
  if (!m) return dados;
  for (const linha of m[1].split(/\r?\n/)) {
    const kv = linha.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('"')) { try { v = JSON.parse(v); } catch { v = v.slice(1, -1); } }
    else if (v.startsWith("'")) v = v.slice(1, -1).replace(/''/g, "'");
    dados[kv[1]] = v;
  }
  return dados;
}

const pilula = (x, y, w, h, cor) => svg(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${cor}"/>`);
const barra = (x, y, cor) => svg(`<rect x="${x}" y="${y}" width="96" height="8" rx="4" fill="${cor}"/>`);

/**
 * Gera o Reel de um post. `post`: { slug, titulo, resumo, capa (caminho do arquivo) }.
 * `tema`: cores, fontes e textos da marca (ver scripts/reels.mjs). Devolve a duração em segundos.
 * Margens: o Instagram cobre ~250 px no topo e ~380 px embaixo; o texto fica entre 280 e 1540.
 */
export async function gerarReel(post, tema, saida) {
  const M = 80, LARG = W - 2 * M;

  // 1) Capa: foto do post escurecida embaixo, etiqueta e título.
  const tamTitulo = post.titulo.length > 70 ? tema.titulo.tamanho * 0.84 : tema.titulo.tamanho;
  const tit = await texto(post.titulo, { ...tema.titulo, tamanho: Math.round(tamTitulo), cor: '#ffffff', largura: LARG });
  const tag = await texto(tema.etiqueta, { ...tema.etiquetaFonte, cor: tema.etiquetaCor, largura: 800 });
  const topoTit = Math.max(900, 1560 - tit.h);
  const topoBarra = topoTit - 44, topoTag = topoBarra - 36 - (tag.h + 28);
  const escuro = svg(`<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tema.sombra}" stop-opacity="0"/><stop offset="0.3" stop-color="${tema.sombra}" stop-opacity="0.72"/><stop offset="1" stop-color="${tema.sombra}" stop-opacity="0.96"/></linearGradient><linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tema.sombra}" stop-opacity="0.5"/><stop offset="1" stop-color="${tema.sombra}" stop-opacity="0"/></linearGradient></defs><rect y="${Math.max(0, topoTag - 480)}" width="${W}" height="${H}" fill="url(#b)"/><rect width="${W}" height="420" fill="url(#t)"/>`);
  const capa = await sharp(post.capa).resize(W, H, { fit: 'cover' }).png().toBuffer();
  const t1 = await tela(capa, [
    { input: escuro, top: 0, left: 0 },
    { input: pilula(M, topoTag, tag.w + 56, tag.h + 28, tema.etiquetaFundo), top: 0, left: 0 },
    { input: tag.input, top: topoTag + 14, left: M + 28 },
    { input: barra(M, topoBarra, tema.acento), top: 0, left: 0 },
    { input: tit.input, top: topoTit, left: M },
  ]);

  // 2) Resumo: fundo da marca, logo pequeno, "Em resumo" e a descrição do post.
  const rotulo = await texto('EM RESUMO', { ...tema.etiquetaFonte, cor: tema.acento, largura: LARG });
  const tamCorpo = post.resumo.length > 170 ? tema.corpo.tamanho * 0.88 : tema.corpo.tamanho;
  const corpo = await texto(post.resumo, { ...tema.corpo, tamanho: Math.round(tamCorpo), cor: tema.corpoCor, largura: LARG, entrelinha: Math.round(tamCorpo * 0.35) });
  const lg2 = await logo(tema.logoResumo, tema.logoResumoLargura);
  const bloco = rotulo.h + 36 + corpo.h;
  const topoBloco = Math.max(560, Math.round((H - bloco) / 2) + 60);
  const t2 = await tela(gradiente(...tema.fundoResumo), [
    { input: lg2.input, top: 300, left: M },
    { input: barra(M, topoBloco - 40, tema.acento), top: 0, left: 0 },
    { input: rotulo.input, top: topoBloco, left: M },
    { input: corpo.input, top: topoBloco + rotulo.h + 36, left: M },
  ]);

  // 3) Chamada: logo grande, frase, apoio e o site.
  const c = tema.chamada;
  const lg3 = await logo(c.logo, c.logoLargura);
  const frase = await texto(c.frase, { ...tema.titulo, tamanho: c.fraseTamanho, cor: c.corFrase, largura: LARG, alinhar: 'centre' });
  const apoio = await texto(c.apoio, { ...tema.corpo, tamanho: 46, cor: c.corApoio, largura: LARG - 40, alinhar: 'centre', entrelinha: 12 });
  const site = await texto(c.site, { ...tema.etiquetaFonte, tamanho: 50, cor: c.corSite, largura: LARG, alinhar: 'centre' });
  const extra = c.extra ? await texto(c.extra, { ...tema.corpo, tamanho: 40, cor: c.corApoio, largura: LARG, alinhar: 'centre' }) : null;
  const altura = lg3.h + 70 + frase.h + 64 + apoio.h + 80 + site.h + 44 + (extra ? 30 + extra.h : 0);
  let y = Math.max(300, Math.round((H - altura) / 2) - 20);
  const meio = (w) => Math.round((W - w) / 2);
  const camadas3 = [{ input: lg3.input, top: y, left: meio(lg3.w) }];
  y += lg3.h + 70; camadas3.push({ input: frase.input, top: y, left: meio(frase.w) });
  y += frase.h + 64; camadas3.push({ input: apoio.input, top: y, left: meio(apoio.w) });
  y += apoio.h + 80;
  camadas3.push({ input: pilula(meio(site.w + 80), y, site.w + 80, site.h + 44, c.fundoSite), top: 0, left: 0 });
  camadas3.push({ input: site.input, top: y + 22, left: meio(site.w) });
  y += site.h + 44;
  if (extra) camadas3.push({ input: extra.input, top: y + 30, left: meio(extra.w) });
  const t3 = await tela(gradiente(...c.fundo), camadas3);

  return montarVideo(post.slug, [t1, t2, t3], [4.6, 4.6, 4.2], saida);
}
