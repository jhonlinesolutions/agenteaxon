import { SITE } from '../config/site';

export function waLink(origem: string, mensagem?: string): string {
  const text = mensagem ?? 'Olá! Vim pelo site do Axon e quero um diagnóstico grátis.';
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}
