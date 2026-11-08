import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, readdirSync } from 'node:fs';

// Data de cada post (updatedDate ou pubDate) para o <lastmod> do sitemap.
const BLOG = new URL('./src/content/blog/', import.meta.url);
const datas = Object.fromEntries(
  readdirSync(BLOG).filter((f) => f.endsWith('.md')).map((f) => {
    const md = readFileSync(new URL(f, BLOG), 'utf8');
    const d = (md.match(/^updatedDate:\s*["']?(\d{4}-\d{2}-\d{2})/m) ?? md.match(/^pubDate:\s*["']?(\d{4}-\d{2}-\d{2})/m))?.[1];
    return [`/blog/${f.replace(/\.md$/, '')}/`, d];
  }).filter(([, d]) => d),
);
const maisRecente = Object.values(datas).sort().at(-1);

const NOINDEX = ['/obrigado/', '/assinatura/'];

export default defineConfig({
  site: 'https://agenteaxon.com.br',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.endsWith(p)),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const d = path === '/blog/' ? maisRecente : datas[path];
        return d ? { ...item, lastmod: d } : item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
