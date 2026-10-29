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

export const collections = { cases };
