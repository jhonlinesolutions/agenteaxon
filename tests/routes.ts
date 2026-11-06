import { readFileSync, readdirSync } from 'node:fs';

// Posts lidos da pasta: o n8n publica posts novos automaticamente e os testes acompanham.
const BLOG_DIR = new URL('../src/content/blog/', import.meta.url);
export const BLOG_SLUGS = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')).sort();
export const blogPubDate = (slug: string) => readFileSync(new URL(`${slug}.md`, BLOG_DIR), 'utf8').match(/^pubDate:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1];

export const NOINDEX_ROUTES = ['/obrigado/', '/assinatura/'];

export const INDEXABLE_ROUTES = [
  '/',
  '/sobre/',
  '/contato/',
  '/axon-vs-atendente/',
  '/quanto-custa-agente-ia-whatsapp/',
  '/vale-a-pena-automatizar-atendimento-whatsapp/',
  '/scripts-whatsapp/',
  '/scripts-whatsapp-saude/',
  '/scripts-whatsapp-veicular/',
  '/privacidade/',
  '/termos/',
  '/blog/',
  ...BLOG_SLUGS.map((s) => `/blog/${s}/`),
];

export const LEGACY_ROUTES = [...INDEXABLE_ROUTES, ...NOINDEX_ROUTES];

export const BLOG_POSTS = INDEXABLE_ROUTES.filter((r) => r.startsWith('/blog/') && r !== '/blog/');
