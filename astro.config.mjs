import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://ranking-atlas.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap({
    filter: (page) => !page.includes('/case-studies'),
  })],
});