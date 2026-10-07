import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: el workflow define SITE/BASE; en local ambos quedan vacíos.
export default defineConfig({
  site: process.env.SITE,
  base: process.env.BASE || '/',
  integrations: [sitemap()],
});
