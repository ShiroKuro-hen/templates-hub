import { defineConfig } from 'astro/config';

// GitHub Pages project site: the workflow sets SITE/BASE; locally both are empty.
export default defineConfig({
  site: process.env.SITE,
  base: process.env.BASE || '/',
});
