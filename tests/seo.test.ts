import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { INDEXABLE_ROUTES } from './routes';
import { DIST, SITE_URL, loadPage } from './helpers';

const read = (f: string) => readFileSync(join(DIST, f), 'utf8');

describe('arquivos de SEO/GEO', () => {
  it('robots.txt aponta para o sitemap no apex', () => {
    expect(read('robots.txt')).toContain(`Sitemap: ${SITE_URL}/sitemap-index.xml`);
  });

  it('llms.txt resume o Axon com preço, WhatsApp e páginas-chave', () => {
    const txt = read('llms.txt');
    for (const s of ['R$ 497', 'wa.me/5511963765638', `${SITE_URL}/`, '/quanto-custa-agente-ia-whatsapp/', '/vale-a-pena-automatizar-atendimento-whatsapp/', '/axon-vs-atendente/']) {
      expect(txt).toContain(s);
    }
  });

  it('_redirects leva o sitemap antigo ao novo', () => {
    expect(read('_redirects')).toMatch(/^\/sitemap\.xml\s+\/sitemap-index\.xml\s+301$/m);
  });
});

describe('Open Graph', () => {
  it.each(INDEXABLE_ROUTES)('%s tem og:image absoluto que existe no build', (r) => {
    const src = loadPage(r).querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '';
    expect(src.startsWith(`${SITE_URL}/`)).toBe(true);
    expect(existsSync(join(DIST, new URL(src).pathname))).toBe(true);
  });
});

describe('URLs quebradas do site antigo (Search Console)', () => {
  const regras = () => read('_redirects');
  it.each(['blog', 'contato', 'sobre', 'privacidade', 'termos'])('%s.html em qualquer nível vai para /%s/', (p) => {
    const linhas = regras().split(/\r?\n/).map((l) => l.trim().split(/\s+/).join(' '));
    for (const de of [`/${p}.html`, `/:p/${p}.html`, `/blog/:p/${p}.html`]) expect(linhas).toContain(`${de} /${p}/ 301`);
  });

  it('robots.txt tira /cdn-cgi/ do rastreamento', () => {
    expect(read('robots.txt')).toMatch(/^Disallow: \/cdn-cgi\/$/m);
  });
});
