import { describe, expect, it } from 'vitest';
import { waLink } from '../src/lib/whatsapp';

describe('waLink', () => {
  it('aponta para o número do Axon com mensagem pré-preenchida', () => {
    expect(waLink('home-hero').startsWith('https://wa.me/5511963765638?text=')).toBe(true);
  });

  it('mensagem padrão cita a origem e o diagnóstico, com acento legível', () => {
    const text = decodeURIComponent(new URL(waLink('home-hero')).searchParams.get('text') ?? '');
    expect(text).toContain('home-hero');
    expect(text).toContain('diagnóstico');
  });

  it('mensagem personalizada com "?" e "&" não quebra a URL', () => {
    const url = new URL(waLink('preços', 'Quanto custa? Clínica & estética'));
    expect(url.searchParams.get('text')).toBe('Quanto custa? Clínica & estética');
  });
});
