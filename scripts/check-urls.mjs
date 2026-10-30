// Confere as URLs do site num domínio publicado: node scripts/check-urls.mjs https://preview.agenteaxon.pages.dev
import { LEGACY_ROUTES } from '../tests/routes.ts';

const base = process.argv[2];
const st = async (p, redirect = 'manual') => {
  const r = await fetch(base + p, { redirect });
  return `${r.status}${r.headers.get('location') ? ' -> ' + r.headers.get('location') : ''}`;
};
const res = await Promise.all(LEGACY_ROUTES.map(async (p) => [p, await st(p, 'follow')]));
const bad = res.filter(([, s]) => s !== '200');
console.log(`rotas legadas: ${res.length - bad.length}/${res.length} com 200`, bad);
if (bad.length) process.exitCode = 1;
for (const p of ['/sobre', '/sobre/index.html', '/blog/como-calcular-roi-agente-ia-whatsapp', '/nao-existe/', '/sitemap.xml', '/sitemap-index.xml', '/robots.txt', '/llms.txt']) {
  console.log(p, '=>', await st(p));
}
