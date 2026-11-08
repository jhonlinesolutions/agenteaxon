import { getCollection } from 'astro:content';

// Posts do mais recente para o mais antigo (empate na data: ordem alfabética do slug).
export async function postsRecentes() {
  return (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id),
  );
}
