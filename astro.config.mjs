import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const NOINDEX = ['/obrigado/', '/assinatura/'];

export default defineConfig({
  site: 'https://agenteaxon.com.br',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.endsWith(p)),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
