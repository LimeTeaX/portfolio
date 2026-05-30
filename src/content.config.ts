// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Collection untuk case studies
const caseStudies = defineCollection({
  loader: glob({ 
    pattern: "**/*.md", 
    base: "./src/content/case-studies" 
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    techStack: z.array(z.string()),
    constraint: z.string(),
    timeline: z.string(),
    teamSize: z.enum(["solo", "small", "medium", "large"]),
    published: z.boolean().default(true),
  }),
});

// Collection untuk notes
const notes = defineCollection({
  loader: glob({ 
    pattern: "**/*.md", 
    base: "./src/content/notes" 
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    published: z.boolean().default(true),
  }),
});

export const collections = {
  caseStudies,
  notes,
};