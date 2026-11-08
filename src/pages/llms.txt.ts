import base from '../data/llms-base.txt?raw';
import { SITE } from '../config/site';
import { postsRecentes } from '../lib/posts';

// llms.txt: resumo fixo do Axon + lista atualizada dos artigos do blog.
export async function GET() {
  const posts = await postsRecentes();
  const lista = posts.map((p) => `- [${p.data.title}](${SITE.url}/blog/${p.id}/): ${p.data.description}`).join('\n');
  const texto = `${base.trimEnd()}\n\n## Artigos do blog\n\n${lista}\n`;
  return new Response(texto, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
