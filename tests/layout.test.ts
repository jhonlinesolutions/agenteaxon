import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { LEGACY_ROUTES } from './routes';
import { allDistFiles, ldOfType, loadPage, readPage } from './helpers';

const routes = LEGACY_ROUTES;

describe('tracking em todas as páginas', () => {
  it.each(routes)('%s carrega GA4, Ads e Pixel', (r) => {
    const html = readPage(r);
    for (const id of ['G-PMMHJSMB95', 'AW-18148907605', '1031313369581014']) expect(html).toContain(id);
  });
});

describe('rodapé', () => {
  it.each(routes)('%s tem crédito da JH e CNPJ da matriz', (r) => {
    const footer = loadPage(r).querySelector('footer')?.toString() ?? '';
    expect(footer).toContain('href="https://jhonlinesolutions.com.br"');
    expect(footer).toContain('tecnologia que move o seu negócio adiante');
    expect(footer).toContain('48.194.871/0001-10');
  });
});

describe('JSON-LD', () => {
  it.each(routes)('%s tem Organization válido', (r) => {
    expect(ldOfType(loadPage(r), 'Organization').length).toBeGreaterThan(0);
  });
});

describe('robustez de movimento', () => {
  it.each(routes)('%s não esconde conteúdo no HTML estático', (r) => {
    expect(loadPage(r).querySelectorAll('.is-hidden').length).toBe(0);
  });

  it('CSS respeita prefers-reduced-motion e evita rolagem horizontal', () => {
    const css = allDistFiles('.css').map((f) => readFileSync(f, 'utf8')).join('\n');
    expect(css).toContain('prefers-reduced-motion');
    expect(css).toMatch(/overflow-x:\s*clip/);
  });
});

describe('WhatsApp', () => {
  it.each(routes)('%s tem botão flutuante com origem', (r) => {
    const a = loadPage(r).querySelector('[data-wa-float]');
    expect(a?.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/5511963765638\?text=/);
    expect(a?.getAttribute('data-wa-origem')).toBeTruthy();
  });
});
