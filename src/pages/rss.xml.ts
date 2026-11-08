import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { postsRecentes } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await postsRecentes();
  return rss({
    title: 'Blog Axon',
    description: 'Guias práticos sobre atendimento no WhatsApp, agentes de IA e automação para pequenas e médias empresas.',
    site: context.site!,
    trailingSlash: true,
    customData: '<language>pt-BR</language>',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`,
      author: 'contato@jhonlinesolutions.com.br (Jomar Hanum)',
      categories: p.data.tags,
    })),
  });
}
