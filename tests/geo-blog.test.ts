import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { BLOG_POSTS, BLOG_SLUGS } from './routes';
import { DIST, SITE_URL, ldOfType, loadPage, readPage } from './helpers';
import { faqDoMarkdown } from '../src/lib/faq';

const BLOG_DIR = join(process.cwd(), 'src/content/blog');
const front = (slug: string) => readFileSync(join(BLOG_DIR, `${slug}.md`), 'utf8');
const COM_CAPA = BLOG_SLUGS.filter((s) => /^ogImage:\s*"?\/blog-img\//m.test(front(s)));
const distFile = (url: string) => join(DIST, new URL(url, SITE_URL).pathname);

describe('capa dos posts', () => {
  it('existem posts com capa para testar', () => expect(COM_CAPA.length).toBeGreaterThan(0));

  it.each(COM_CAPA)('%s mostra a capa otimizada no topo, com alt', (slug) => {
    const img = loadPage(`/blog/${slug}/`).querySelector('article img[data-capa]');
    expect(img).toBeTruthy();
    expect(img!.getAttribute('src')).toMatch(/\.webp$/);
    expect(img!.getAttribute('srcset')).toBeTruthy();
    expect((img!.getAttribute('alt') ?? '').length).toBeGreaterThan(5);
    expect(img!.getAttribute('loading')).toBe('eager');
  });

  it.each(COM_CAPA)('%s usa og:image 1200x630 de verdade', async (slug) => {
    const page = loadPage(`/blog/${slug}/`);
    const src = page.querySelector('meta[property="og:image"]')!.getAttribute('content')!;
    const meta = await sharp(distFile(src)).metadata();
    expect([meta.width, meta.height]).toEqual([1200, 630]);
    expect(page.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')).toBeTruthy();
    const [ld] = ldOfType(page, 'BlogPosting');
    expect([].concat(ld.image)).toContain(src);
  });
});

describe('og:image declara o tamanho real', () => {
  it.each(BLOG_POSTS)('%s', async (r) => {
    const page = loadPage(r);
    const src = page.querySelector('meta[property="og:image"]')!.getAttribute('content')!;
    const meta = await sharp(distFile(src)).metadata();
    expect(page.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe(String(meta.width));
    expect(page.querySelector('meta[property="og:image:height"]')?.getAttribute('content')).toBe(String(meta.height));
  });
});

describe('perguntas frequentes no markdown', () => {
  const md = `Intro.\n\n## Como funciona\n\nTexto.\n\n## Perguntas frequentes\n\n### O Axon entende áudio?\n\nSim, ele **transcreve** o áudio e responde.\n\n### Precisa de técnico?\n\nNão. Veja [o guia](/blog/x/).\n\n## Conclusão\n\nFim.`;

  it('extrai perguntas e respostas em texto puro', () => {
    expect(faqDoMarkdown(md)).toEqual([
      { q: 'O Axon entende áudio?', a: 'Sim, ele transcreve o áudio e responde.' },
      { q: 'Precisa de técnico?', a: 'Não. Veja o guia.' },
    ]);
  });

  it('devolve lista vazia sem a seção', () => {
    expect(faqDoMarkdown('## Outro\n\n### Pergunta?\n\nResposta.')).toEqual([]);
  });

  it.each(BLOG_SLUGS.filter((s) => faqDoMarkdown(front(s)).length > 0))('%s com FAQ gera FAQPage', (slug) => {
    const [faq] = ldOfType(loadPage(`/blog/${slug}/`), 'FAQPage');
    expect(faq.mainEntity.length).toBe(faqDoMarkdown(front(slug)).length);
  });
});

describe('títulos dos posts', () => {
  it.each(BLOG_POSTS)('%s não passa de 70 caracteres por causa do sufixo', (r) => {
    const t = loadPage(r).querySelector('title')!.text;
    if (t.endsWith(' | Blog Axon')) expect(t.length).toBeLessThanOrEqual(65);
  });
});

describe('sitemap com lastmod', () => {
  const xml = () => readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
  it.each(BLOG_SLUGS)('%s tem lastmod igual à data do post', (slug) => {
    const f = front(slug);
    const data = (f.match(/^updatedDate:\s*"?(\d{4}-\d{2}-\d{2})/m) ?? f.match(/^pubDate:\s*"?(\d{4}-\d{2}-\d{2})/m))![1];
    const bloco = xml().split('<url>').find((u) => u.includes(`<loc>${SITE_URL}/blog/${slug}/</loc>`))!;
    expect(bloco).toContain(`<lastmod>${data}`);
  });

  it('/blog/ tem lastmod do post mais recente', () => {
    const bloco = xml().split('<url>').find((u) => u.includes(`<loc>${SITE_URL}/blog/</loc>`))!;
    expect(bloco).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}/);
  });
});

describe('feed RSS', () => {
  it('rss.xml lista todos os posts com link absoluto', () => {
    const rss = readFileSync(join(DIST, 'rss.xml'), 'utf8');
    for (const s of BLOG_SLUGS) expect(rss).toContain(`<link>${SITE_URL}/blog/${s}/</link>`);
  });

  it('páginas anunciam o feed', () => {
    expect(loadPage('/').querySelector('link[rel="alternate"][type="application/rss+xml"]')?.getAttribute('href')).toBe(`${SITE_URL}/rss.xml`);
  });
});

describe('llms.txt', () => {
  it('lista todos os posts do blog', () => {
    const txt = readFileSync(join(DIST, 'llms.txt'), 'utf8');
    for (const s of BLOG_SLUGS) expect(txt).toContain(`${SITE_URL}/blog/${s}/`);
  });
});

describe('home', () => {
  it('linka os 3 posts mais recentes', () => {
    const recentes = [...BLOG_SLUGS]
      .map((s) => ({ s, d: front(s).match(/^pubDate:\s*"?(\d{4}-\d{2}-\d{2})/m)![1] }))
      .sort((a, b) => b.d.localeCompare(a.d))
      .slice(0, 3);
    const html = readPage('/');
    const sec = loadPage('/').querySelector('[data-ultimos-artigos]');
    expect(sec).toBeTruthy();
    for (const { s } of recentes) expect(html).toContain(`href="/blog/${s}/"`);
  });
});

it('capas originais continuam públicas (usadas pelo Facebook/Instagram)', () => {
  for (const s of COM_CAPA) {
    const path = front(s).match(/^ogImage:\s*"?([^"\n]+)/m)![1];
    expect(existsSync(join(DIST, path))).toBe(true);
  }
});
