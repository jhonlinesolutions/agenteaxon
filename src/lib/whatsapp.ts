import { SITE } from '../config/site';

// O texto diz de onde o lead veio (site ou blog do Axon); a Ana Lúcia usa isso no atendimento.
const MSG_SITE = 'Olá! Vim pelo site do Axon e quero um diagnóstico grátis.';
const MSG_BLOG = 'Olá! Vim pelo blog do Axon e quero um diagnóstico grátis.';

export function waLink(origem: string, mensagem?: string): string {
  const doBlog = /(^|\/)blog(\/|-|$)/.test(origem);
  const text = mensagem ?? (doBlog ? MSG_BLOG : MSG_SITE);
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}
