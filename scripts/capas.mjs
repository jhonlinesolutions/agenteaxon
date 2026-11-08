// Copia as capas dos posts (public/blog-img, gravadas pelo n8n) para src/assets/capas,
// onde o Astro consegue otimizá-las. A cópia pública continua existindo para o Facebook/Instagram.
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';

const de = new URL('../public/blog-img/', import.meta.url);
const para = new URL('../src/assets/capas/', import.meta.url);
rmSync(para, { recursive: true, force: true });
mkdirSync(para, { recursive: true });
const arquivos = existsSync(de) ? readdirSync(de).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)) : [];
for (const f of arquivos) copyFileSync(new URL(f, de), new URL(f, para));
console.log(`capas: ${arquivos.length} copiadas`);
