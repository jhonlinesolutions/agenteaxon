import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BLOG_POSTS } from './routes';
import { DIST, SITE_URL, allDistFiles, ldOfType, loadPage } from './helpers';

const ARTIGOS = [
  { r: '/axon-vs-atendente/', tipo: 'Article' },
  { r: '/quanto-custa-agente-ia-whatsapp/', tipo: 'Article' },
  { r: '/vale-a-pena-automatizar-atendimento-whatsapp/', tipo: 'Article' },
  ...BLOG_POSTS.map((r) => ({ r, tipo: 'BlogPosting' })),
];

describe('autor dos artigos', () => {
  it.each(ARTIGOS)('$r tem Jomar Hanum como autor (Person com foto) no schema', ({ r, tipo }) => {
    const [ld] = ldOfType(loadPage(r), tipo);
    expect(ld.author['@type']).toBe('Person');
    expect(ld.author.name).toBe('Jomar Hanum');
    expect(ld.author.image.startsWith(`${SITE_URL}/`)).toBe(true);
    expect(existsSync(join(DIST, new URL(ld.author.image).pathname))).toBe(true);
  });

  it.each(ARTIGOS)('$r mostra nome e foto do autor', ({ r }) => {
    const foto = loadPage(r).querySelector('img[data-autor-foto]');
    expect(foto?.getAttribute('alt')).toBe('Jomar Hanum');
    expect(loadPage(r).querySelector('[data-autor]')?.text).toContain('Jomar Hanum');
  });

  it('nenhuma página assina como "Equipe Axon"', () => {
    const hits = allDistFiles('.html').filter((f) => readFileSync(f, 'utf8').includes('Equipe Axon'));
    expect(hits).toEqual([]);
  });
});
