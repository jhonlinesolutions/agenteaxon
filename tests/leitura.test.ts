import { describe, expect, it } from 'vitest';
import { progressoLeitura, LEITURA_MINIMA } from '../src/lib/leitura';
import { BLOG_POSTS } from './routes';
import { readPage } from './helpers';

describe('progressoLeitura', () => {
  it('0 antes de o texto chegar ao fim da tela', () => {
    expect(progressoLeitura({ topo: 900, altura: 2000, fimDaTela: 800 })).toBe(0);
  });

  it('proporção do texto que já passou pelo fim da tela', () => {
    expect(progressoLeitura({ topo: 100, altura: 2000, fimDaTela: 1600 })).toBe(0.75);
  });

  it('nunca passa de 1 nem quebra com altura zero', () => {
    expect(progressoLeitura({ topo: -5000, altura: 2000, fimDaTela: 800 })).toBe(1);
    expect(progressoLeitura({ topo: 0, altura: 0, fimDaTela: 800 })).toBe(0);
  });

  it('limite de leitura é 75%', () => expect(LEITURA_MINIMA).toBe(0.75));
});

describe('evento de leitura', () => {
  it.each(BLOG_POSTS)('%s marca o texto do artigo para medir a leitura', (r) => {
    expect(readPage(r)).toContain('data-leitura');
  });

  it('não existe fora dos posts', () => {
    expect(readPage('/')).not.toContain('data-leitura');
    expect(readPage('/blog/')).not.toContain('data-leitura');
  });
});
