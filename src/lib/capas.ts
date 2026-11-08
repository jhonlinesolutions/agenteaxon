import type { CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';

// Capas copiadas de public/blog-img por scripts/capas.mjs antes do build.
const capas = import.meta.glob<{ default: ImageMetadata }>('../assets/capas/*.{jpg,jpeg,png,webp}', { eager: true });

export function capaDoPost(post: CollectionEntry<'blog'>) {
  const og = post.data.ogImage;
  if (!og?.startsWith('/blog-img/')) return undefined;
  const nome = og.slice('/blog-img/'.length);
  const img = Object.entries(capas).find(([k]) => k.endsWith(`/${nome}`))?.[1].default;
  if (!img) return undefined;
  return { img, alt: post.data.coverAlt ?? post.data.title };
}

// Versão 1200x630 para Open Graph e schema.
export async function ogDaCapa(img: ImageMetadata) {
  const r = await getImage({ src: img, width: 1200, height: 630, fit: 'cover', format: 'jpg', quality: 82 });
  return r.src;
}
