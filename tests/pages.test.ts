import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ldOfType, loadPage, readPage } from './helpers';

const INTERNAS = [
  '/sobre/',
  '/contato/',
  '/axon-vs-atendente/',
  '/quanto-custa-agente-ia-whatsapp/',
  '/vale-a-pena-automatizar-atendimento-whatsapp/',
  '/privacidade/',
  '/termos/',
];

describe('páginas institucionais', () => {
  it.each(INTERNAS)('%s tem BreadcrumbList', (r) => {
    expect(ldOfType(loadPage(r), 'BreadcrumbList').length).toBe(1);
  });

  it('quanto custa: preço inicial e resposta direta antes do primeiro h2', () => {
    const page = loadPage('/quanto-custa-agente-ia-whatsapp/');
    expect(readPage('/quanto-custa-agente-ia-whatsapp/')).toContain('a partir de R$ 497');
    const html = page.querySelector('main')!.toString();
    const answer = html.indexOf('data-answer');
    expect(answer).toBeGreaterThan(-1);
    expect(answer).toBeLessThan(html.indexOf('<h2'));
  });

  it('vale a pena e axon vs atendente têm resposta direta', () => {
    for (const r of ['/vale-a-pena-automatizar-atendimento-whatsapp/', '/axon-vs-atendente/']) {
      expect(loadPage(r).querySelector('[data-answer]')).not.toBeNull();
    }
  });

  it('assinatura não tem Stripe e oferece WhatsApp', () => {
    const html = readPage('/assinatura/');
    expect(html).not.toContain('buy.stripe.com');
    expect(html).toContain('wa.me/5511963765638');
  });

  it('contato mostra e-mail da JH e WhatsApp', () => {
    const html = readPage('/contato/');
    expect(html).toContain('contato@jhonlinesolutions.com.br');
    expect(html).toContain('(11) 96376-5638');
  });

  it.each(['/privacidade/', '/termos/'])('%s não menciona newsletter nem formulário', (r) => {
    const text = loadPage(r).querySelector('main')!.text.toLowerCase();
    expect(text).not.toContain('newsletter');
    expect(text).not.toContain('formulário');
  });

  it('página 404 existe', () => {
    expect(existsSync(join(DIST, '404.html'))).toBe(true);
  });
});
