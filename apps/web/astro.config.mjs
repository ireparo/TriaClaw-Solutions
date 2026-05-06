import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import solid from '@astrojs/solid-js';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://triaclaw.com',
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } }),
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'ca'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    solid(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES', ca: 'ca-ES' },
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
