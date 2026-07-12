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
      // Landings estáticas de public/demos: fuera del build de Astro,
      // hay que listarlas a mano para que entren en el sitemap.
      customPages: [
        'https://triaclaw.com/demos/',
        'https://triaclaw.com/demos/talleres-sat.html',
        'https://triaclaw.com/demos/inmobiliaria.html',
        'https://triaclaw.com/demos/asesoria.html',
        'https://triaclaw.com/demos/energia.html',
        'https://triaclaw.com/demos/clinica-dental.html',
        'https://triaclaw.com/demos/restaurante.html',
        'https://triaclaw.com/demos/estetica.html',
        'https://triaclaw.com/demos/oficios.html',
        'https://triaclaw.com/demos/ecommerce.html',
      ],
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
