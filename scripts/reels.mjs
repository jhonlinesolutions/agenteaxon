// Gera os Reels (public/reel/<slug>.mp4) dos posts mais recentes do blog, antes do build.
// O n8n ([CONTEUDO] Postagem diária) publica esse MP4 no Instagram/Facebook nos dias de Reel.
// Precisa do ffmpeg (no GitHub Actions vem do sistema; localmente, defina FFMPEG). Sem ffmpeg, só avisa e segue.
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { frontmatter, gerarReel, temFfmpeg } from './reel/core.mjs';

const RAIZ = process.env.REEL_RAIZ || process.cwd();
const POSTS = join(RAIZ, 'src/content/blog');
const SAIDA = process.env.REEL_SAIDA || join(RAIZ, 'public/reel');
const QUANTOS = 3; // só os mais recentes: o n8n usa o do post do dia

const serif = { familia: 'Instrument Serif', arquivo: 'InstrumentSerif-Regular.ttf' };
const sans = { familia: 'Inter Tight', arquivo: 'InterTight.ttf' };

const TEMA = {
  titulo: { fonte: serif, tamanho: 104 },
  corpo: { fonte: sans, peso: 'Medium', tamanho: 58 },
  corpoCor: '#ffffff',
  etiquetaFonte: { fonte: sans, peso: 'Bold', tamanho: 30 },
  etiqueta: 'BLOG DO AXON', etiquetaCor: '#ffffff', etiquetaFundo: '#5b2bd6',
  acento: '#3fe0f5', sombra: '#14112a',
  fundoResumo: ['#5b2bd6', '#1f0f5c', 0.6, 1],
  logoResumo: join(RAIZ, 'public/axon-logo.webp'), logoResumoLargura: 150,
  chamada: {
    fundo: ['#2a1470', '#14112a', 0.4, 1],
    logo: join(RAIZ, 'public/axon-logo.webp'), logoLargura: 300,
    frase: 'Seu WhatsApp atendendo 24 horas por dia com IA', fraseTamanho: 104, corFrase: '#ffffff',
    apoio: 'Teste grátis por 15 dias. Implantação em até 48 horas.', corApoio: '#d9d2f5',
    site: 'agenteaxon.com.br', corSite: '#14112a', fundoSite: '#3fe0f5',
    extra: 'WhatsApp (11) 96376-5638',
  },
};

if (!temFfmpeg()) {
  console.warn('reels: ffmpeg não encontrado, Reels não gerados');
  process.exit(0);
}

const posts = (existsSync(POSTS) ? readdirSync(POSTS) : [])
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => {
    const d = frontmatter(join(POSTS, f));
    const capa = d.ogImage ? join(RAIZ, 'public', d.ogImage.replace(/^\//, '')) : '';
    return { slug: f.replace(/\.mdx?$/, ''), titulo: d.title, resumo: d.description, data: String(d.pubDate || ''), capa, rascunho: d.draft === 'true' };
  })
  .filter((p) => !p.rascunho && p.titulo && p.resumo && p.capa && existsSync(p.capa))
  .sort((a, b) => b.data.localeCompare(a.data))
  .slice(0, QUANTOS);

rmSync(SAIDA, { recursive: true, force: true });
mkdirSync(SAIDA, { recursive: true });
for (const p of posts) {
  const t0 = Date.now();
  const dur = await gerarReel(p, TEMA, join(SAIDA, `${p.slug}.mp4`));
  console.log(`reels: ${p.slug}.mp4 (${dur.toFixed(1)} s de vídeo, ${((Date.now() - t0) / 1000).toFixed(1)} s para gerar)`);
}
