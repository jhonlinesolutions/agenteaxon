import { getImage } from 'astro:assets';
import foto from '../assets/jomar-hanum.jpg';
import rosto from '../assets/jomar-hanum-rosto.jpg';
import { SITE } from '../config/site';

export const AUTOR = { nome: 'Jomar Hanum', foto, rosto };

// Autor dos artigos no schema (Person com foto e empresa).
export async function autorLd() {
  const img = await getImage({ src: foto, width: 400, height: 400, fit: 'cover', position: 'top', format: 'jpg' });
  return {
    '@type': 'Person',
    name: AUTOR.nome,
    image: new URL(img.src, SITE.url).href,
    worksFor: { '@type': 'Organization', name: SITE.company.legalName, url: SITE.company.url },
  };
}
