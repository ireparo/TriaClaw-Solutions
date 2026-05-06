import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    pillars: z.array(z.enum(['centralita', 'agents', 'crm'])),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    summary: z.string(),
    anonymous: z.boolean().default(false),
    order: z.number().default(99),
    publishedAt: z.string(),
  }),
});

export const collections = { cases };
