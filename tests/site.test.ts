import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { INDEXABLE_ROUTES, LEGACY_ROUTES, NOINDEX_ROUTES } from './routes';
import { DIST, SITE_URL, allDistFiles, loadPage, pageExists } from './helpers';

describe('rotas legadas', () => {
  it.each(LEGACY_ROUTES)('%s existe', (r) => expect(pageExists(r)).toBe(true));
});

describe('SEO por página indexável', () => {
  it.each(INDEXABLE_ROUTES)('%s tem canonical no apex com barra', (r) => {
    const href = loadPage(r).querySelector('link[rel="canonical"]')?.getAttribute('href');
    expect(href).toBe(`${SITE_URL}${r}`);
  });

  it.each(INDEXABLE_ROUTES)('%s tem description de 50 a 170 caracteres', (r) => {
    const d = loadPage(r).querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
    expect(d.length).toBeGreaterThanOrEqual(50);
    expect(d.length).toBeLessThanOrEqual(170);
  });

  it('títulos são únicos e não vazios', () => {
    const titles = INDEXABLE_ROUTES.map((r) => loadPage(r).querySelector('title')?.text.trim() ?? '');
    expect(titles.every(Boolean)).toBe(true);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('páginas fora do índice', () => {
  it.each(NOINDEX_ROUTES)('%s tem noindex', (r) => {
    expect(loadPage(r).querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex');
  });
});

describe('conteúdo proibido no build', () => {
  const banned = ['<form', '997', '1.497', 'www.agenteaxon', 'elegantcormorant'];
  it.each(banned)('nenhum HTML contém %s', (term) => {
    const files = allDistFiles('.html');
    expect(files.length).toBeGreaterThan(0);
    const hits = files.filter((f) => readFileSync(f, 'utf8').includes(term));
    expect(hits).toEqual([]);
  });
});

describe('sitemap', () => {
  it('lista exatamente as páginas indexáveis', () => {
    expect(existsSync(join(DIST, 'sitemap-index.xml'))).toBe(true);
    const xml = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
    expect(locs).toEqual(INDEXABLE_ROUTES.map((r) => `${SITE_URL}${r}`).sort());
  });
});
