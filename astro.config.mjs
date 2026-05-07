import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ranking-atlas.com',
  trailingSlash: 'never',
  integrations: [sitemap()],
});
