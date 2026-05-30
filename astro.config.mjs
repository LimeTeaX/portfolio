import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [mdx(), react()],
  base: '/',
  build: {
    assets: '_astro',
  },
  trailingSlash: 'ignore',
});