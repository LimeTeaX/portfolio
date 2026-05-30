import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const caseStudies = defineCollection({
  loader: glob({ 
    pattern: "**/*.{md,mdx}", 
    base: "./src/content/case-studies" 
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    techStack: z.array(z.string()),
    constraint: z.string(),
    timeline: z.string(),
    teamSize: z.string(),
    published: z.boolean().default(true),
  }),
});

const notes = defineCollection({
  loader: glob({ 
    pattern: "**/*.{md,mdx}", 
    base: "./src/content/notes" 
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    readingTime: z.number().default(3),
    published: z.boolean().default(true),
  }),
});

export const collections = {
  caseStudies,
  notes,
};