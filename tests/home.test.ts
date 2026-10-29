import { describe, expect, it } from 'vitest';
import { ldOfType, loadPage, readPage } from './helpers';

const home = () => loadPage('/');

describe('home', () => {
  it('headline aprovada no h1', () => {
    expect(home().querySelector('h1')?.text.replace(/\s+/g, ' ').trim()).toBe('Nenhum cliente sem resposta no seu WhatsApp.');
  });

  it('comunica preço inicial e teste de 15 dias', () => {
    const html = readPage('/');
    expect(html).toContain('a partir de R$ 497');
    expect(html).toContain('15 dias');
  });

  it('tem FAQPage', () => {
    expect(ldOfType(home(), 'FAQPage').length).toBe(1);
  });

  it('Service com preço mínimo de 497 BRL', () => {
    const [service] = ldOfType(home(), 'Service');
    const spec = service.offers.priceSpecification;
    expect(spec.minPrice).toBe(497);
    expect(spec.priceCurrency).toBe('BRL');
  });

  it('seção de cases fica oculta com menos de 3 cases', () => {
    expect(home().querySelector('[data-section="cases"]')).toBeNull();
  });

  it('conversa do Hero é legível sem animação (balões no HTML)', () => {
    const bubbles = home().querySelectorAll('[data-chat-bubble]');
    expect(bubbles.length).toBeGreaterThanOrEqual(4);
    expect(bubbles[0].text).toMatch(/\S/);
  });

  it('nenhum jargão técnico', () => {
    const text = home().querySelector('main')?.text ?? '';
    for (const term of ['LLM', 'RAG', 'system prompt', 'System prompt']) expect(text).not.toContain(term);
  });

  it('vídeo usa facade (sem iframe no HTML inicial)', () => {
    expect(home().querySelector('iframe')).toBeNull();
    expect(home().querySelector('[data-video="eitwil64aTw"]')).not.toBeNull();
  });
});
