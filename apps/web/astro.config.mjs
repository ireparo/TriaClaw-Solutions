import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://triaclaw.com',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'ca'],
    routing: { prefixDefaultLocale: false }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
