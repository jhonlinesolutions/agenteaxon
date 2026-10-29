import { describe, expect, it } from 'vitest';
import { loadPage, readPage } from './helpers';

const PAGINAS = ['/scripts-whatsapp/', '/scripts-whatsapp-saude/', '/scripts-whatsapp-veicular/'];

describe('páginas de scripts', () => {
  it.each(PAGINAS)('%s mostra os 30 scripts abertos', (r) => {
    expect(loadPage(r).querySelectorAll('[data-script]').length).toBeGreaterThanOrEqual(30);
  });

  it.each(PAGINAS)('%s não pede e-mail', (r) => {
    const page = loadPage(r);
    expect(page.querySelector('input')).toBeNull();
    expect(page.querySelector('main')!.text.toLowerCase()).not.toContain('seu e-mail');
  });

  it.each(PAGINAS)('%s tem CTA de WhatsApp com origem própria', (r) => {
    const origem = r.replaceAll('/', '');
    expect(readPage(r)).toContain(`data-wa-origem="${origem}"`);
  });

  it('cada script tem texto copiável', () => {
    const first = loadPage('/scripts-whatsapp-veicular/').querySelector('[data-script]')!;
    expect(first.querySelector('[data-script-text]')!.text).toContain('[Nome da Associação]');
  });
});
