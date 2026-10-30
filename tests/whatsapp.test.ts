import { describe, expect, it } from 'vitest';
import { waLink } from '../src/lib/whatsapp';

describe('waLink', () => {
  it('aponta para o número do Axon com mensagem pré-preenchida', () => {
    expect(waLink('home-hero').startsWith('https://wa.me/5511963765638?text=')).toBe(true);
  });

  it('mensagem padrão é limpa: sem o código de origem, com acento legível', () => {
    const text = new URL(waLink('home-final')).searchParams.get('text') ?? '';
    expect(text).toBe('Olá! Vim pelo site do Axon e quero um diagnóstico grátis.');
    expect(text).not.toContain('home-final');
  });

  it('mensagem personalizada com "?" e "&" não quebra a URL', () => {
    const url = new URL(waLink('preços', 'Quanto custa? Clínica & estética'));
    expect(url.searchParams.get('text')).toBe('Quanto custa? Clínica & estética');
  });
});
