import { describe, expect, it } from 'vitest';
import { BLOG_POSTS, BLOG_SLUGS, blogPubDate } from './routes';
import { ldOfType, loadPage, readPage } from './helpers';

describe('posts do blog', () => {
  it('inclui todos os posts da pasta (pelo menos os 10 originais)', () => {
    expect(BLOG_POSTS.length).toBe(BLOG_SLUGS.length);
    expect(BLOG_POSTS.length).toBeGreaterThanOrEqual(10);
  });

  it.each(BLOG_POSTS)('%s tem BlogPosting com datas, autor e publisher', (r) => {
    const [post] = ldOfType(loadPage(r), 'BlogPosting');
    expect(post.datePublished.slice(0, 10)).toBe(blogPubDate(r.split('/')[2]));
    expect(post.dateModified).toBeTruthy();
    expect(post.author).toBeTruthy();
    expect(post.publisher).toBeTruthy();
  });

  it.each(BLOG_POSTS)('%s tem h1 único e CTA com origem do post', (r) => {
    const page = loadPage(r);
    expect(page.querySelectorAll('h1').length).toBe(1);
    expect(readPage(r)).toContain(`data-wa-origem="blog/${r.split('/')[2]}"`);
  });

  it.each(BLOG_POSTS)('%s não tem formulário de newsletter', (r) => {
    expect(readPage(r)).not.toContain('<form');
  });
});

describe('datas exibidas', () => {
  it('post mostra a data de publicação sem voltar um dia pelo fuso', () => {
    expect(loadPage('/blog/como-calcular-roi-agente-ia-whatsapp/').querySelector('article header')!.text).toContain('29 de maio de 2025');
  });

  it('índice mostra a data correta', () => {
    expect(loadPage('/blog/').querySelector(`a[href="/blog/como-calcular-roi-agente-ia-whatsapp/"]`)!.text).toContain('29 de mai');
  });
});

describe('índice do blog', () => {
  it('lista todos os posts', () => {
    const links = new Set(loadPage('/blog/').querySelectorAll('a[href^="/blog/"]').map((a) => a.getAttribute('href')));
    for (const r of BLOG_POSTS) expect(links.has(r)).toBe(true);
  });

  it('tem schema Blog', () => {
    expect(ldOfType(loadPage('/blog/'), 'Blog').length).toBe(1);
  });
});
