import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.{md,json}', base: './src/content/cases' }),
  schema: z.object({
    nome: z.string(),
    segmento: z.string(),
    depoimento: z.string(),
    autor: z.string().optional(),
    resultado: z.string().optional(),
    logo: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    ogImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { cases, blog };
