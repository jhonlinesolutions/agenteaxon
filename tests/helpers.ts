import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse, type HTMLElement } from 'node-html-parser';

export const DIST = join(process.cwd(), 'dist');
export const SITE_URL = 'https://agenteaxon.com.br';

export const distPath = (route: string) => join(DIST, route, 'index.html');
export const pageExists = (route: string) => existsSync(distPath(route));
export const readPage = (route: string) => readFileSync(distPath(route), 'utf8');
export const loadPage = (route: string): HTMLElement => parse(readPage(route));

export function jsonLd(page: HTMLElement): any[] {
  const out: any[] = [];
  for (const s of page.querySelectorAll('script[type="application/ld+json"]')) {
    const data = JSON.parse(s.text);
    const items = Array.isArray(data) ? data : data['@graph'] ?? [data];
    out.push(...items);
  }
  return out;
}

export const ldOfType = (page: HTMLElement, type: string) =>
  jsonLd(page).filter((n) => [].concat(n['@type']).includes(type as never));

export function allDistFiles(ext: string, dir = DIST): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? allDistFiles(ext, p) : p.endsWith(ext) ? [p] : [];
  });
}
