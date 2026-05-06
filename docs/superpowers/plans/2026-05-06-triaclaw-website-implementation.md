# TriaClaw Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the TriaClaw marketing website (`triaclaw.com`) — Astro 5 static site with three pillar pages (Centralita, Agents, CRM), case studies, pricing, partners, contact form, ES/CA i18n, deployed to Vercel.

**Architecture:** Monorepo (pnpm workspaces) with `apps/web` as the only app in v1, leaving room for `apps/app` (Next.js) later. Astro 5 generates static HTML with one SSR endpoint (`/api/contact`). Solid handles the few interactive islands (form, accordion, lang persistence). Tailwind 4 owns styling via CSS-first tokens.

**Tech Stack:** Astro 5 · Tailwind 4 · Solid (`@astrojs/solid-js`) · TypeScript · Geist fonts (`geist` package) · Resend (transactional email) · Cloudflare Turnstile (anti-spam) · Vitest (unit tests) · Vercel (hosting) · Nominalia (DNS).

**Spec:** [`docs/superpowers/specs/2026-05-06-triaclaw-website-design.md`](../specs/2026-05-06-triaclaw-website-design.md)

---

## Task list overview

**Sprint A — Foundation** (Tasks 1–7)
**Sprint B — Layout & UI primitives** (Tasks 8–11)
**Sprint C — Home sections** (Tasks 12–19)
**Sprint D — Pillar pages** (Tasks 20–22)
**Sprint E — Content collections & secondary pages** (Tasks 23–29)
**Sprint F — Forms & integrations** (Tasks 30–33)
**Sprint G — SEO & polish** (Tasks 34–37)
**Sprint H — Català translation** (Tasks 38–40)
**Sprint I — Deploy & DNS** (Tasks 41–44)

---

## Sprint A — Foundation

### Task 1: Monorepo skeleton

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `.nvmrc`
- Modify: `.gitignore` (already exists)

- [ ] **Step 1: Create `.nvmrc`**

```
20
```

- [ ] **Step 2: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
```

- [ ] **Step 3: Create root `package.json`**

```json
{
  "name": "triaclaw-solutions",
  "private": true,
  "version": "0.0.0",
  "engines": { "node": ">=20" },
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "preview": "pnpm --filter web preview",
    "test": "pnpm --filter web test",
    "lint": "pnpm --filter web lint",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "prettier": "^3.3.3",
    "prettier-plugin-astro": "^0.14.1"
  }
}
```

- [ ] **Step 4: Append Node-related ignores to `.gitignore`** (verify already present from brainstorm; if missing, add)

```
node_modules/
.pnpm-store/
```

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml .nvmrc .gitignore
git commit -m "chore: bootstrap pnpm monorepo skeleton"
```

---

### Task 2: Scaffold Astro app

**Files:**
- Create: `apps/web/` (entire Astro project tree)

- [ ] **Step 1: Run Astro creator non-interactively**

```bash
cd C:/Users/Edgar/TriaClaw-Solutions
pnpm create astro@latest apps/web --template minimal --typescript strict --no-install --no-git --skip-houston --yes
```

Expected: `apps/web/` populated with `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `public/favicon.svg`.

- [ ] **Step 2: Install workspace deps from root**

```bash
cd C:/Users/Edgar/TriaClaw-Solutions
pnpm install
```

Expected: lockfile created at root, `apps/web/node_modules` symlinks resolved.

- [ ] **Step 3: Sanity check dev server**

```bash
pnpm dev
```

Expected: server starts on `http://localhost:4321`, default Astro page renders. Stop with Ctrl+C.

- [ ] **Step 4: Replace `apps/web/package.json` scripts**

```json
{
  "name": "web",
  "type": "module",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "astro check"
  }
}
```

(Keep the `dependencies`/`devDependencies` keys produced by the creator — only the `scripts` block is replaced.)

- [ ] **Step 5: Commit**

```bash
git add apps/web pnpm-lock.yaml
git commit -m "feat(web): scaffold astro app"
```

---

### Task 3: Install Tailwind 4 and configure CSS-first tokens

**Files:**
- Create: `apps/web/src/styles/global.css`
- Modify: `apps/web/astro.config.mjs`
- Modify: `apps/web/package.json` (deps)

- [ ] **Step 1: Add Tailwind 4 + Vite plugin**

```bash
pnpm --filter web add -D tailwindcss@^4 @tailwindcss/vite@^4
```

- [ ] **Step 2: Replace `apps/web/astro.config.mjs`**

```js
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
```

- [ ] **Step 3: Create `apps/web/src/styles/global.css` with brand tokens**

```css
@import "tailwindcss";

@theme {
  --color-navy: #0F2A5C;
  --color-navy-2: #1E40AF;
  --color-cyan-brand: #22D3EE;
  --color-teal-brand: #14B8A6;
  --color-whatsapp: #25D366;
  --color-bg: #F8FAFC;
  --color-ink: #0F172A;
  --color-muted: #475569;
  --color-line: #E2E8F0;

  --font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "Geist Mono", ui-monospace, "SFMono-Regular", monospace;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --shadow-sm: 0 1px 2px rgba(15, 42, 92, 0.06);
  --shadow-md: 0 4px 12px rgba(15, 42, 92, 0.08);
  --shadow-lg: 0 12px 32px rgba(15, 42, 92, 0.14);
}

@layer base {
  html { font-family: var(--font-sans); color: var(--color-ink); -webkit-font-smoothing: antialiased; }
  body { background: #fff; }
  *:focus-visible { outline: 2px solid var(--color-cyan-brand); outline-offset: 2px; }
}

.gradient-brand { background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-2) 50%, var(--color-cyan-brand) 100%); }
```

- [ ] **Step 4: Import `global.css` from a base layout (placeholder — proper layout in Task 8)**

Edit `apps/web/src/pages/index.astro` to import the stylesheet so the build picks it up:

```astro
---
import '../styles/global.css';
---
<!doctype html>
<html lang="es">
<head><meta charset="utf-8"/><title>TriaClaw</title></head>
<body class="bg-bg text-ink"><h1 class="text-navy text-4xl">Hola</h1></body>
</html>
```

- [ ] **Step 5: Run dev and verify Tailwind is active**

```bash
pnpm dev
```

Open `http://localhost:4321`. Expected: "Hola" renders in navy color and large size.

- [ ] **Step 6: Commit**

```bash
git add apps/web
git commit -m "feat(web): tailwind 4 with brand tokens"
```

---

### Task 4: Add Solid integration and Geist fonts

**Files:**
- Modify: `apps/web/astro.config.mjs`
- Modify: `apps/web/package.json` (deps)
- Modify: `apps/web/src/styles/global.css`

- [ ] **Step 1: Install Solid integration + Geist + Vercel adapter**

```bash
pnpm --filter web add @astrojs/solid-js solid-js geist @astrojs/vercel @astrojs/sitemap
pnpm --filter web add -D @astrojs/check typescript
```

- [ ] **Step 2: Update `apps/web/astro.config.mjs`**

```js
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
    routing: { prefixDefaultLocale: false }
  },
  integrations: [solid(), sitemap()],
  vite: { plugins: [tailwindcss()] }
});
```

- [ ] **Step 3: Add Geist `@font-face` import to `global.css`**

Insert near the top, after `@import "tailwindcss";`:

```css
@import "geist/font/sans.css";
@import "geist/font/mono.css";
```

- [ ] **Step 4: Build to confirm no integration errors**

```bash
pnpm --filter web build
```

Expected: build succeeds, output in `apps/web/dist/`.

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "feat(web): solid + geist + vercel adapter + sitemap"
```

---

### Task 5: i18n dictionaries and helper

**Files:**
- Create: `apps/web/src/i18n/es.json`
- Create: `apps/web/src/i18n/ca.json`
- Create: `apps/web/src/i18n/index.ts`
- Create: `apps/web/src/i18n/index.test.ts`

- [ ] **Step 1: Create `apps/web/src/i18n/es.json` with initial keys**

```json
{
  "nav": {
    "centralita": "Centralita",
    "agents": "Agents",
    "crm": "CRM",
    "pricing": "Precios",
    "cases": "Casos",
    "partners": "Partners",
    "contact": "Contacto"
  },
  "hero": {
    "eyebrow": "Pymes · Autònoms · Integradors",
    "title": "Tria el teu agent.",
    "subtitle": "Centralita, bots i CRM que parlen entre ells.",
    "lead": "Una sola plataforma para que tu pyme no pierda ni una llamada, ni un WhatsApp, ni un lead. Lleida-made, integrado de fábrica, listo en días.",
    "cta_whatsapp": "Habla por WhatsApp",
    "cta_demo": "Pedir demo",
    "meta": ["Sin permanencia", "Setup en 7 días", "RGPD-compliant"]
  },
  "footer": {
    "tagline": "Una marca de iReparo.",
    "city": "Lleida · Catalunya",
    "rights": "© 2026 TriaClaw"
  }
}
```

- [ ] **Step 2: Create `apps/web/src/i18n/ca.json` (mirror, català)**

```json
{
  "nav": {
    "centralita": "Centraleta",
    "agents": "Agents",
    "crm": "CRM",
    "pricing": "Preus",
    "cases": "Casos",
    "partners": "Partners",
    "contact": "Contacte"
  },
  "hero": {
    "eyebrow": "Pimes · Autònoms · Integradors",
    "title": "Tria el teu agent.",
    "subtitle": "Centraleta, bots i CRM que parlen entre ells.",
    "lead": "Una sola plataforma perquè la teva pime no perdi cap trucada, ni cap WhatsApp, ni cap lead. Feta a Lleida, integrada de fàbrica, llesta en dies.",
    "cta_whatsapp": "Parla per WhatsApp",
    "cta_demo": "Demanar demo",
    "meta": ["Sense permanència", "Posada en marxa en 7 dies", "RGPD-compliant"]
  },
  "footer": {
    "tagline": "Una marca d'iReparo.",
    "city": "Lleida · Catalunya",
    "rights": "© 2026 TriaClaw"
  }
}
```

- [ ] **Step 3: Write failing test `apps/web/src/i18n/index.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { t, getLocaleFromUrl } from './index';

describe('i18n helpers', () => {
  it('returns ES nav.centralita when locale is es', () => {
    expect(t('es', 'nav.centralita')).toBe('Centralita');
  });

  it('returns CA nav.centralita when locale is ca', () => {
    expect(t('ca', 'nav.centralita')).toBe('Centraleta');
  });

  it('returns key path verbatim when missing', () => {
    expect(t('es', 'does.not.exist')).toBe('does.not.exist');
  });

  it('detects locale from URL prefix', () => {
    expect(getLocaleFromUrl(new URL('https://triaclaw.com/ca/sobre'))).toBe('ca');
    expect(getLocaleFromUrl(new URL('https://triaclaw.com/sobre'))).toBe('es');
    expect(getLocaleFromUrl(new URL('https://triaclaw.com/'))).toBe('es');
  });
});
```

- [ ] **Step 4: Install Vitest**

```bash
pnpm --filter web add -D vitest
```

- [ ] **Step 5: Run test → expect failure (module not found)**

```bash
pnpm --filter web test
```

Expected: `Cannot find module './index'`.

- [ ] **Step 6: Implement `apps/web/src/i18n/index.ts`**

```ts
import es from './es.json';
import ca from './ca.json';

export type Locale = 'es' | 'ca';
export const locales: Locale[] = ['es', 'ca'];
export const defaultLocale: Locale = 'es';

const dictionaries: Record<Locale, unknown> = { es, ca };

export function t(locale: Locale, key: string): string {
  const parts = key.split('.');
  let cur: unknown = dictionaries[locale];
  for (const p of parts) {
    if (typeof cur !== 'object' || cur === null || !(p in cur)) return key;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : key;
}

export function getLocaleFromUrl(url: URL): Locale {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return seg === 'ca' ? 'ca' : 'es';
}

export function localizedHref(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === 'es' ? clean : `/ca${clean === '/' ? '' : clean}`;
}
```

- [ ] **Step 7: Run test → expect pass**

```bash
pnpm --filter web test
```

Expected: 4 tests pass.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/i18n apps/web/package.json pnpm-lock.yaml
git commit -m "feat(web): i18n helpers with es+ca dictionaries"
```

---

### Task 6: Environment variables and Vercel config

**Files:**
- Create: `apps/web/.env.example`
- Create: `apps/web/src/env.d.ts`
- Create: `vercel.json`

- [ ] **Step 1: Create `apps/web/.env.example`**

```
RESEND_API_KEY=
CONTACT_EMAIL_TO=hola@triaclaw.com
TURNSTILE_SECRET=
PUBLIC_TURNSTILE_SITE_KEY=
PUBLIC_WHATSAPP_NUMBER=34665954108
PUBLIC_CALENDLY_URL=
PUBLIC_SITE_URL=https://triaclaw.com
```

- [ ] **Step 2: Create `apps/web/src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly RESEND_API_KEY: string;
  readonly CONTACT_EMAIL_TO: string;
  readonly TURNSTILE_SECRET: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
  readonly PUBLIC_WHATSAPP_NUMBER: string;
  readonly PUBLIC_CALENDLY_URL: string;
  readonly PUBLIC_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 3: Create root `vercel.json`**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "git": { "deploymentEnabled": { "main": true } },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/.env.example apps/web/src/env.d.ts vercel.json
git commit -m "chore(web): env scaffold and vercel headers"
```

---

### Task 7: Prettier and editor config

**Files:**
- Create: `.prettierrc.json`
- Create: `.editorconfig`

- [ ] **Step 1: Create `.prettierrc.json`**

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    { "files": "*.astro", "options": { "parser": "astro" } }
  ]
}
```

- [ ] **Step 2: Create `.editorconfig`**

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 3: Run Prettier on the repo**

```bash
pnpm format
```

Expected: files reformatted in place. Some Astro files may already be conformant.

- [ ] **Step 4: Commit**

```bash
git add .prettierrc.json .editorconfig
git commit -m "chore: prettier and editorconfig"
```

---

## Sprint B — Layout & UI primitives

### Task 8: Base layout, Container, Header, Footer

**Files:**
- Create: `apps/web/src/layouts/Base.astro`
- Create: `apps/web/src/components/layout/Container.astro`
- Create: `apps/web/src/components/layout/Header.astro`
- Create: `apps/web/src/components/layout/Footer.astro`
- Modify: `apps/web/src/pages/index.astro`

- [ ] **Step 1: Create `Container.astro`**

```astro
---
interface Props { class?: string }
const { class: className = '' } = Astro.props;
---
<div class={`mx-auto max-w-[1200px] px-8 ${className}`}><slot /></div>
```

- [ ] **Step 2: Create `Header.astro`**

```astro
---
import Container from './Container.astro';
import { getLocaleFromUrl, t, localizedHref, type Locale } from '../../i18n';
const locale: Locale = getLocaleFromUrl(Astro.url);
const wa = `https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER}`;
---
<header class="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-line">
  <Container class="flex items-center justify-between py-4">
    <a href={localizedHref(locale, '/')} class="flex items-center gap-2.5 font-extrabold text-navy text-lg">
      <span class="relative w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white">🤖</span>
      TriaClaw <span class="font-medium text-[11px] text-muted uppercase tracking-wider">Solutions</span>
    </a>
    <nav class="hidden md:flex gap-7 text-sm text-muted font-medium">
      <a href={localizedHref(locale, '/centralita')} class="hover:text-navy">{t(locale, 'nav.centralita')}</a>
      <a href={localizedHref(locale, '/agents')} class="hover:text-navy">{t(locale, 'nav.agents')}</a>
      <a href={localizedHref(locale, '/crm')} class="hover:text-navy">{t(locale, 'nav.crm')}</a>
      <span class="opacity-30">·</span>
      <a href={localizedHref(locale, '/precios')} class="hover:text-navy">{t(locale, 'nav.pricing')}</a>
      <a href={localizedHref(locale, '/casos')} class="hover:text-navy">{t(locale, 'nav.cases')}</a>
      <span class="opacity-30">·</span>
      <a href={localizedHref(locale, '/partners')} class="hover:text-navy">{t(locale, 'nav.partners')}</a>
      <a href={localizedHref(locale, '/contacto')} class="hover:text-navy">{t(locale, 'nav.contact')}</a>
    </nav>
    <div class="flex items-center gap-3">
      <div class="flex border border-line rounded-md overflow-hidden text-xs font-semibold">
        <a href="/" class={`px-2.5 py-1.5 ${locale === 'es' ? 'bg-navy text-white' : 'text-muted'}`}>ES</a>
        <a href="/ca/" class={`px-2.5 py-1.5 ${locale === 'ca' ? 'bg-navy text-white' : 'text-muted'}`}>CA</a>
      </div>
      <a href={wa} class="inline-flex items-center gap-1.5 bg-cyan-brand text-navy font-semibold px-4 py-2 rounded-lg text-sm">💬 WhatsApp</a>
    </div>
  </Container>
</header>
```

- [ ] **Step 3: Create `Footer.astro`**

```astro
---
import Container from './Container.astro';
import { getLocaleFromUrl, t, localizedHref, type Locale } from '../../i18n';
const locale: Locale = getLocaleFromUrl(Astro.url);
---
<footer class="bg-[#0a1530] text-white/70 pt-16 pb-8 text-sm">
  <Container>
    <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-8 mb-12">
      <div>
        <div class="flex items-center gap-2 text-white font-extrabold mb-3">
          <span class="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center text-white text-sm">🤖</span>
          TriaClaw
        </div>
        <p class="text-white/55 leading-relaxed text-[13px]">{t(locale, 'footer.tagline')}<br/>{t(locale, 'footer.city')}</p>
      </div>
      <div><h4 class="text-white text-[13px] font-bold uppercase tracking-wider mb-3.5">Producto</h4><ul class="space-y-1"><li><a href={localizedHref(locale, '/centralita')} class="hover:text-white">Centralita</a></li><li><a href={localizedHref(locale, '/agents')} class="hover:text-white">Agents</a></li><li><a href={localizedHref(locale, '/crm')} class="hover:text-white">CRM</a></li><li><a href={localizedHref(locale, '/precios')} class="hover:text-white">Precios</a></li></ul></div>
      <div><h4 class="text-white text-[13px] font-bold uppercase tracking-wider mb-3.5">Empresa</h4><ul class="space-y-1"><li><a href={localizedHref(locale, '/sobre')} class="hover:text-white">Sobre nosotros</a></li><li><a href={localizedHref(locale, '/casos')} class="hover:text-white">Casos</a></li><li><a href={localizedHref(locale, '/partners')} class="hover:text-white">Partners</a></li></ul></div>
      <div><h4 class="text-white text-[13px] font-bold uppercase tracking-wider mb-3.5">Legal</h4><ul class="space-y-1"><li><a href={localizedHref(locale, '/legal/aviso')} class="hover:text-white">Aviso legal</a></li><li><a href={localizedHref(locale, '/legal/privacidad')} class="hover:text-white">Privacidad</a></li><li><a href={localizedHref(locale, '/legal/cookies')} class="hover:text-white">Cookies</a></li></ul></div>
      <div><h4 class="text-white text-[13px] font-bold uppercase tracking-wider mb-3.5">Contacto</h4><ul class="space-y-1"><li><a href={`https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER}`} class="hover:text-white">WhatsApp</a></li><li><a href="mailto:hola@triaclaw.com" class="hover:text-white">hola@triaclaw.com</a></li></ul></div>
    </div>
    <div class="pt-6 border-t border-white/10 flex justify-between text-xs text-white/50"><div>{t(locale, 'footer.rights')} · iReparo</div><div>Made in Lleida</div></div>
  </Container>
</footer>
```

- [ ] **Step 4: Create `Base.astro`**

```astro
---
import '../styles/global.css';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import { getLocaleFromUrl, type Locale } from '../i18n';

interface Props { title: string; description?: string; ogImage?: string }
const { title, description = 'Centralita, bots y CRM integrados de fábrica.', ogImage = '/og-default.png' } = Astro.props;
const locale: Locale = getLocaleFromUrl(Astro.url);
const canonical = new URL(Astro.url.pathname, import.meta.env.PUBLIC_SITE_URL).toString();
---
<!doctype html>
<html lang={locale}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(ogImage, import.meta.env.PUBLIC_SITE_URL).toString()} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
<body class="bg-white text-ink">
  <Header />
  <main><slot /></main>
  <Footer />
</body>
</html>
```

- [ ] **Step 5: Update `apps/web/src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="TriaClaw · Centralita, bots i CRM que parlen entre ells">
  <section class="py-24 text-center">
    <h1 class="text-5xl font-extrabold text-navy">Tria el teu agent.</h1>
    <p class="text-muted mt-4">Home placeholder — sections come in Sprint C.</p>
  </section>
</Base>
```

- [ ] **Step 6: Run dev and verify Header + Footer render**

```bash
pnpm dev
```

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/layouts apps/web/src/components/layout apps/web/src/pages/index.astro
git commit -m "feat(web): base layout with header and footer"
```

---

### Task 9: Button component

**Files:**
- Create: `apps/web/src/components/ui/Button.astro`

- [ ] **Step 1: Create `Button.astro`**

```astro
---
type Variant = 'navy' | 'cyan' | 'outline' | 'ghost' | 'whatsapp';
interface Props {
  href?: string;
  variant?: Variant;
  type?: 'button' | 'submit';
  class?: string;
  ariaLabel?: string;
}
const { href, variant = 'navy', type = 'button', class: cls = '', ariaLabel } = Astro.props;
const base = 'inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold text-sm transition shadow-sm hover:-translate-y-px hover:shadow-md';
const variants: Record<Variant, string> = {
  navy: 'bg-navy text-white',
  cyan: 'bg-cyan-brand text-navy',
  outline: 'bg-transparent text-navy border border-navy',
  ghost: 'bg-transparent text-navy underline-offset-4 hover:underline',
  whatsapp: 'bg-whatsapp text-white',
};
const className = `${base} ${variants[variant]} ${cls}`;
---
{href ? (
  <a href={href} class={className} aria-label={ariaLabel}><slot /></a>
) : (
  <button type={type} class={className} aria-label={ariaLabel}><slot /></button>
)}
```

- [ ] **Step 2: Smoke test with 5 variants in `index.astro`, verify visually, then revert**

```bash
pnpm dev
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/ui/Button.astro
git commit -m "feat(web): button component with 5 variants"
```

---

### Task 10: Card, Input, FAQ accordion

**Files:**
- Create: `apps/web/src/components/ui/Card.astro`
- Create: `apps/web/src/components/ui/Input.astro`
- Create: `apps/web/src/components/ui/Faq.tsx`

- [ ] **Step 1: Create `Card.astro`**

```astro
---
type Tone = 'default' | 'navy' | 'cyan' | 'teal';
interface Props { tone?: Tone; class?: string }
const { tone = 'default', class: cls = '' } = Astro.props;
const tops: Record<Tone, string> = {
  default: '',
  navy: 'before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-navy',
  cyan: 'before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-cyan-brand',
  teal: 'before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-teal-brand',
};
---
<div class={`relative bg-white border border-line rounded-2xl p-7 transition hover:-translate-y-1 hover:shadow-lg ${tops[tone]} ${cls}`}>
  <slot />
</div>
```

- [ ] **Step 2: Create `Input.astro`**

```astro
---
interface Props {
  type?: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
}
const { type = 'text', name, label, placeholder = '', required = false, textarea = false, rows = 4 } = Astro.props;
---
<label class="block">
  <span class="block text-[13px] font-semibold text-navy mb-1.5">{label}{required && <span class="text-cyan-brand">*</span>}</span>
  {textarea ? (
    <textarea name={name} placeholder={placeholder} required={required} rows={rows} class="w-full bg-white border border-line rounded-lg px-3.5 py-2.5 text-sm focus:border-cyan-brand outline-none"></textarea>
  ) : (
    <input type={type} name={name} placeholder={placeholder} required={required} class="w-full bg-white border border-line rounded-lg px-3.5 py-2.5 text-sm focus:border-cyan-brand outline-none" />
  )}
</label>
```

- [ ] **Step 3: Create `Faq.tsx` (Solid)**

```tsx
import { createSignal, For, Show } from 'solid-js';

interface QA { q: string; a: string }
interface Props { items: QA[] }

export default function Faq(props: Props) {
  const [open, setOpen] = createSignal<number | null>(0);
  return (
    <div class="border border-line rounded-2xl bg-white max-w-[640px]">
      <For each={props.items}>{(item, i) => {
        const isOpen = () => open() === i();
        return (
          <div class={i() === 0 ? '' : 'border-t border-line'}>
            <button
              type="button"
              class="w-full flex items-center justify-between px-6 py-5 text-left"
              aria-expanded={isOpen()}
              onClick={() => setOpen(isOpen() ? null : i())}
            >
              <span class="font-semibold text-navy text-[14px]">{item.q}</span>
              <span class="text-muted text-lg">{isOpen() ? '−' : '+'}</span>
            </button>
            <Show when={isOpen()}>
              <div class="px-6 pb-5 text-[13.5px] text-muted leading-relaxed">{item.a}</div>
            </Show>
          </div>
        );
      }}</For>
    </div>
  );
}
```

- [ ] **Step 4: Build to verify TS+Solid compile**

```bash
pnpm --filter web build
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/ui
git commit -m "feat(web): card, input, faq primitives"
```

---

### Task 11: PricingCard and Testimonial

**Files:**
- Create: `apps/web/src/components/ui/PricingCard.astro`
- Create: `apps/web/src/components/ui/Testimonial.astro`

- [ ] **Step 1: Create `PricingCard.astro`**

```astro
---
type Variant = 'default' | 'highlighted' | 'dark';
interface Props {
  pillarLabel: string;
  planName: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  variant?: Variant;
}
const { pillarLabel, planName, price, priceSuffix = '/mes', features, ctaText, ctaHref, variant = 'default' } = Astro.props;
const wrap = {
  default: 'bg-white border border-line',
  highlighted: 'bg-white border-2 border-cyan-brand shadow-lg',
  dark: 'bg-navy text-white',
}[variant];
---
<div class={`relative rounded-2xl p-7 ${wrap}`}>
  {variant === 'highlighted' && <span class="absolute -top-3 right-5 bg-cyan-brand text-navy px-2.5 py-1 rounded text-[10px] font-bold tracking-wider">RECOMENDADO</span>}
  <span class={`inline-block px-2.5 py-1 rounded text-[10px] tracking-wider ${variant === 'dark' ? 'bg-cyan-brand text-navy' : 'bg-navy text-white'}`}>{pillarLabel}</span>
  <h3 class={`mt-3.5 text-lg font-bold ${variant === 'dark' ? 'text-white' : 'text-navy'}`}>{planName}</h3>
  <div class={`text-3xl font-extrabold mt-1 ${variant === 'dark' ? 'text-white' : 'text-navy'}`}>{price}<span class={`text-[13px] font-normal ${variant === 'dark' ? 'text-white/60' : 'text-muted'}`}>{priceSuffix}</span></div>
  <ul class={`text-[13px] mt-3.5 mb-4 leading-7 list-disc pl-5 ${variant === 'dark' ? 'text-white/75' : 'text-muted'}`}>
    {features.map((f) => <li>{f}</li>)}
  </ul>
  <a href={ctaHref} class={`block text-center w-full font-semibold text-[13px] rounded-lg py-2.5 ${variant === 'highlighted' ? 'bg-cyan-brand text-navy' : variant === 'dark' ? 'bg-transparent border border-white text-white' : 'bg-navy text-white'}`}>{ctaText}</a>
</div>
```

- [ ] **Step 2: Create `Testimonial.astro`**

```astro
---
interface Props {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}
const { quote, name, role, avatar } = Astro.props;
---
<div class="bg-white border border-line rounded-2xl p-7">
  <div class="text-3xl text-cyan-brand leading-none mb-2">"</div>
  <p class="text-[14.5px] text-ink leading-relaxed mb-4">{quote}</p>
  <div class="flex items-center gap-3">
    {avatar ? (
      <img src={avatar} alt={name} class="w-10 h-10 rounded-full object-cover" />
    ) : (
      <div class="w-10 h-10 rounded-full gradient-brand"></div>
    )}
    <div>
      <div class="font-semibold text-sm text-navy">{name}</div>
      <div class="text-xs text-muted">{role}</div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Build to verify**

```bash
pnpm --filter web build
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/ui
git commit -m "feat(web): pricing card and testimonial primitives"
```

---

## Sprint C — Home sections

### Task 12: Hero section

**Files:**
- Create: `apps/web/src/components/sections/Hero.astro`

- [ ] **Step 1: Create `Hero.astro`**

```astro
---
import Container from '../layout/Container.astro';
import Button from '../ui/Button.astro';
import { getLocaleFromUrl, t, type Locale } from '../../i18n';
const locale: Locale = getLocaleFromUrl(Astro.url);
const wa = `https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER}`;
const meta = t(locale, 'hero.meta');
const metaArr: string[] = Array.isArray(meta) ? (meta as unknown as string[]) : [];
---
<section class="relative gradient-brand text-white overflow-hidden py-24 md:py-28">
  <div class="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
  <Container class="relative grid md:grid-cols-[1.4fr_1fr] gap-16 items-center">
    <div>
      <div class="text-[11px] tracking-[2px] text-cyan-brand uppercase mb-4 font-semibold">{t(locale, 'hero.eyebrow')}</div>
      <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-5">
        {t(locale, 'hero.title')}<br/>
        <span class="font-light text-cyan-100">{t(locale, 'hero.subtitle')}</span>
      </h1>
      <p class="text-lg text-white/85 max-w-xl mb-8 leading-relaxed">{t(locale, 'hero.lead')}</p>
      <div class="flex gap-3 flex-wrap">
        <Button variant="cyan" href={wa}>💬 {t(locale, 'hero.cta_whatsapp')}</Button>
        <a href="#contacto" class="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold text-sm bg-transparent text-white border border-white/50 hover:bg-white/10">{t(locale, 'hero.cta_demo')} →</a>
      </div>
      <div class="mt-9 flex gap-7 text-[13px] text-white/70 flex-wrap">
        {metaArr.map((m) => <div><span class="text-cyan-brand font-bold">✓</span> {m}</div>)}
      </div>
    </div>
    <div class="relative w-72 h-72 mx-auto hidden md:block">
      <div class="absolute inset-[-20px] rounded-full border-2 border-cyan-brand/20 animate-ping"></div>
      <svg viewBox="0 0 200 200" class="relative z-10 w-full h-full drop-shadow-[0_20px_40px_rgba(34,211,238,0.4)]">
        <defs>
          <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#0F2A5C"/>
            <stop offset="1" stop-color="#22D3EE"/>
          </linearGradient>
        </defs>
        <line x1="100" y1="20" x2="100" y2="40" stroke="#22D3EE" stroke-width="3"/>
        <circle cx="100" cy="18" r="6" fill="#22D3EE"/>
        <path d="M55 50 h90 a25 25 0 0 1 25 25 v40 a25 25 0 0 1 -25 25 h-25 l-15 18 v-18 h-50 a25 25 0 0 1 -25 -25 v-40 a25 25 0 0 1 25 -25 z" fill="url(#g1)"/>
        <rect x="65" y="65" width="80" height="50" rx="14" fill="#0a1530"/>
        <circle cx="88" cy="90" r="6" fill="#fff"/>
        <circle cx="122" cy="90" r="6" fill="#fff"/>
      </svg>
    </div>
  </Container>
</section>
```

- [ ] **Step 2: Build to verify**

```bash
pnpm --filter web build
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/sections/Hero.astro
git commit -m "feat(web): hero section"
```

---

### Task 13: LogoBar section

**Files:**
- Create: `apps/web/src/components/sections/LogoBar.astro`

- [ ] **Step 1: Create `LogoBar.astro`**

```astro
---
import Container from '../layout/Container.astro';
const logos = [
  { name: 'iReparo', italic: false },
  { name: 'Falcon Cat', italic: true },
  { name: 'Ilercasa', italic: false },
  { name: 'Comercializadora energía', italic: false, dim: true },
];
---
<div class="py-9 bg-[#fafbfd] border-y border-line">
  <Container>
    <p class="text-[11px] tracking-[2px] text-muted uppercase font-semibold text-center mb-4.5">Pymes que ya nos usan</p>
    <div class="flex justify-center items-center gap-16 flex-wrap opacity-55">
      {logos.map((l) => (
        <div class={`text-navy font-bold text-[17px] tracking-tight ${l.italic ? 'italic' : ''} ${l.dim ? 'opacity-70' : ''}`}>{l.name}</div>
      ))}
    </div>
  </Container>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/sections/LogoBar.astro
git commit -m "feat(web): logo bar section"
```

---

### Task 14: Pillars section

**Files:**
- Create: `apps/web/src/components/sections/Pillars.astro`

- [ ] **Step 1: Create `Pillars.astro`**

```astro
---
import Container from '../layout/Container.astro';
import { getLocaleFromUrl, localizedHref, type Locale } from '../../i18n';
const locale: Locale = getLocaleFromUrl(Astro.url);
const pillars = [
  {
    tone: 'navy', icon: '📞', title: 'Centralita',
    desc: 'PBX virtual con IVR, transferencias, panel de supervisión y grabación. SIP estándar, sin atarte al hardware.',
    bullets: ['Multi-extensión y multi-sede', 'Grabación y panel supervisor', 'Conexión SIP con cualquier teléfono'],
    href: '/centralita', cta: 'Ver Centralita →', accent: 'text-navy',
  },
  {
    tone: 'cyan', icon: '🤖', title: 'Agents & Bots',
    desc: 'Bots de WhatsApp y agentes IA conversacionales. Cualifican, agendan y transfieren cuando hace falta humano.',
    bullets: ['WhatsApp Business + IA con contexto', 'Plantillas: envíos, atención, ventas', 'Integración nativa con tu CRM'],
    href: '/agents', cta: 'Ver Agents →', accent: 'text-cyan-brand',
  },
  {
    tone: 'teal', icon: '📋', title: 'CRM & Gestión',
    desc: 'CRMs verticales hechos a medida del sector: SAT, energía, inmobiliaria, gestión de proyectos.',
    bullets: ['Verticales listos: SAT, energía, inmo', 'Integrado con centralita y bots', 'Custom para tu flujo concreto'],
    href: '/crm', cta: 'Ver CRM →', accent: 'text-teal-brand',
  },
];
---
<section class="py-24">
  <Container>
    <div class="text-center mb-12">
      <span class="inline-block px-3.5 py-1.5 bg-navy/8 text-navy rounded-full text-xs font-semibold tracking-wide mb-3">Tres productos · una plataforma</span>
      <h2 class="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-3">Tria el teu pilar</h2>
      <p class="text-lg text-muted max-w-2xl mx-auto leading-relaxed">Empieza por uno. Combina los tres y rebaja un 15%. Los datos viajan entre ellos sin que tengas que tocar nada.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-5">
      {pillars.map((p) => (
        <div class={`relative bg-white border border-line rounded-2xl p-7 transition hover:-translate-y-1 hover:shadow-lg before:absolute before:top-0 before:left-0 before:right-0 before:h-1 ${p.tone === 'navy' ? 'before:bg-navy' : p.tone === 'cyan' ? 'before:bg-cyan-brand' : 'before:bg-teal-brand'}`}>
          <div class={`w-13 h-13 rounded-xl flex items-center justify-center text-2xl mb-4 ${p.tone === 'navy' ? 'bg-navy/10 text-navy' : p.tone === 'cyan' ? 'bg-cyan-brand/12 text-cyan-brand' : 'bg-teal-brand/12 text-teal-brand'}`}>{p.icon}</div>
          <h3 class="text-xl font-bold text-navy tracking-tight mb-2">{p.title}</h3>
          <p class="text-[14.5px] text-muted leading-relaxed mb-4">{p.desc}</p>
          <ul class="text-[13.5px] text-muted mb-5 space-y-1">
            {p.bullets.map((b) => <li class={`pl-5 relative before:absolute before:left-0 before:top-2.5 before:w-3 before:h-0.5 ${p.tone === 'navy' ? 'before:bg-navy' : p.tone === 'cyan' ? 'before:bg-cyan-brand' : 'before:bg-teal-brand'}`}>{b}</li>)}
          </ul>
          <a href={localizedHref(locale, p.href)} class={`font-semibold text-sm ${p.accent}`}>{p.cta}</a>
        </div>
      ))}
    </div>
  </Container>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/sections/Pillars.astro
git commit -m "feat(web): pillars section"
```

---

### Task 15: ConnectedFlow section

**Files:**
- Create: `apps/web/src/components/sections/ConnectedFlow.astro`

- [ ] **Step 1: Create `ConnectedFlow.astro`**

```astro
---
import Container from '../layout/Container.astro';
const nodes = [
  { icon: '📞', label: 'Llamada entrante' },
  { icon: '🤖', label: 'Bot pre-cualifica' },
  { icon: '📋', label: 'Lead en CRM' },
  { icon: '✅', label: 'Humano cierra' },
];
---
<section class="bg-navy text-white relative overflow-hidden py-24">
  <div class="absolute inset-0" style="background:radial-gradient(600px 300px at 50% 0%, rgba(34,211,238,.18), transparent 70%)"></div>
  <Container class="relative z-10 text-center">
    <span class="inline-block px-3.5 py-1.5 bg-cyan-brand/12 text-cyan-brand rounded-full text-xs font-semibold tracking-wide mb-3">La tesis</span>
    <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Tres productos que hablan entre ellos</h2>
    <p class="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-12">Llamada → ficha CRM. WhatsApp → ticket. Bot agenda → calendario centralita. Sin Zapier, sin pegar APIs, sin que se te enfríe un lead.</p>
    <div class="flex items-center justify-center gap-4 flex-wrap">
      {nodes.map((n, i) => (
        <>
          <div class="px-6 py-4 bg-cyan-brand/8 border border-cyan-brand/35 rounded-2xl text-[14.5px] backdrop-blur flex items-center gap-2.5"><span class="text-xl">{n.icon}</span> {n.label}</div>
          {i < nodes.length - 1 && <span class="text-2xl text-cyan-brand/60">→</span>}
        </>
      ))}
    </div>
  </Container>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/sections/ConnectedFlow.astro
git commit -m "feat(web): connected flow section"
```

---

### Task 16: FeaturedCase section

**Files:**
- Create: `apps/web/src/components/sections/FeaturedCase.astro`

- [ ] **Step 1: Create `FeaturedCase.astro`**

```astro
---
import Container from '../layout/Container.astro';
import { getLocaleFromUrl, localizedHref, type Locale } from '../../i18n';
const locale: Locale = getLocaleFromUrl(Astro.url);
---
<section class="bg-[#fafbfd] py-24">
  <Container class="grid md:grid-cols-2 gap-16 items-center">
    <div>
      <span class="text-[11px] tracking-[2px] text-cyan-brand uppercase font-semibold mb-3 block">Caso destacado · iReparo</span>
      <p class="text-3xl md:text-4xl font-bold text-navy tracking-tight leading-tight mb-5 before:content-['\201C'] before:block before:text-6xl before:text-cyan-brand before:leading-none before:mb-3">Antes perdíamos 1 de cada 4 llamadas. Ahora cero. Y los WhatsApps de envíos se contestan solos.</p>
      <p class="text-base text-muted leading-relaxed mb-7">Centralita virtual + bot WhatsApp para envíos + CRM SAT integrados. Cada llamada se convierte en ficha. Cada WhatsApp en ticket. Cada lead se atiende. El equipo deja de hacer de centralita y se concentra en reparar.</p>
      <div class="flex gap-9 mb-7">
        <div><div class="text-3xl md:text-4xl font-extrabold text-navy tracking-tight">−78%</div><div class="text-xs text-muted mt-1.5">llamadas perdidas</div></div>
        <div><div class="text-3xl md:text-4xl font-extrabold text-navy tracking-tight">+34%</div><div class="text-xs text-muted mt-1.5">leads cualificados</div></div>
        <div><div class="text-3xl md:text-4xl font-extrabold text-navy tracking-tight">3 h/día</div><div class="text-xs text-muted mt-1.5">menos admin</div></div>
      </div>
      <a href={localizedHref(locale, '/casos/ireparo')} class="text-navy font-semibold text-sm">Leer caso completo →</a>
    </div>
    <div class="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 relative overflow-hidden shadow-lg">
      <div class="absolute inset-6 bg-white rounded-xl p-5 shadow-md flex flex-col gap-2.5">
        <div class="flex justify-between items-center mb-1"><strong class="text-[13px] text-navy">SAT iReparo</strong><span class="text-[10px] bg-cyan-brand text-navy px-2 py-0.5 rounded-full font-bold">LIVE</span></div>
        <div class="h-2 rounded bg-navy w-3/5"></div>
        <div class="h-2 rounded bg-line w-4/5"></div>
        <div class="h-2 rounded bg-cyan-brand w-2/5"></div>
        <div class="grid grid-cols-3 gap-2 mt-1.5">
          <div class="h-10 rounded bg-slate-100"></div>
          <div class="h-10 rounded gradient-brand"></div>
          <div class="h-10 rounded bg-slate-100"></div>
        </div>
        <div class="h-2 rounded bg-line w-4/5 mt-1.5"></div>
        <div class="h-2 rounded bg-line w-1/2"></div>
      </div>
    </div>
  </Container>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/sections/FeaturedCase.astro
git commit -m "feat(web): featured case section"
```

---

### Task 17: PricingTeaser section

**Files:**
- Create: `apps/web/src/components/sections/PricingTeaser.astro`

- [ ] **Step 1: Create `PricingTeaser.astro`**

```astro
---
import Container from '../layout/Container.astro';
import Button from '../ui/Button.astro';
import { getLocaleFromUrl, localizedHref, type Locale } from '../../i18n';
const locale: Locale = getLocaleFromUrl(Astro.url);
const chips = [
  { icon: '📞', name: 'Centralita', price: '29 €/mes' },
  { icon: '🤖', name: 'Agents', price: '49 €/mes' },
  { icon: '📋', name: 'CRM', price: '39 €/usuario/mes' },
];
---
<section class="py-24">
  <Container class="text-center">
    <span class="inline-block px-3.5 py-1.5 bg-navy/8 text-navy rounded-full text-xs font-semibold tracking-wide mb-3">Pricing</span>
    <h2 class="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-3">Sin sorpresas. Sin permanencia.</h2>
    <p class="text-lg text-muted max-w-2xl mx-auto mb-10">Empieza por uno. Combina dos y rebaja un 15%. Cancela cuando quieras.</p>
    <div class="flex justify-center gap-3 flex-wrap mb-6">
      {chips.map((c) => (
        <div class="px-5 py-3.5 border border-line rounded-xl bg-white text-[14.5px]">{c.icon} <strong class="text-navy font-bold">{c.name}</strong> · desde {c.price}</div>
      ))}
    </div>
    <Button variant="navy" href={localizedHref(locale, '/precios')}>Ver tabla completa →</Button>
    <p class="text-[13.5px] text-muted mt-4">Setup incluido en planes Pro. IVA no incluido.</p>
  </Container>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/sections/PricingTeaser.astro
git commit -m "feat(web): pricing teaser section"
```

---

### Task 18: Testimonials and CTAFinal sections

**Files:**
- Create: `apps/web/src/components/sections/Testimonials.astro`
- Create: `apps/web/src/components/sections/CTAFinal.astro`
- Create: `apps/web/src/components/sections/WhatsAppFloat.astro`

- [ ] **Step 1: Create `Testimonials.astro`**

```astro
---
import Container from '../layout/Container.astro';
import Testimonial from '../ui/Testimonial.astro';
const items = [
  { quote: 'Antes el técnico paraba lo que hacía cada vez que sonaba el teléfono. Ahora la centralita filtra y los leads llegan al CRM por sí solos.', name: 'Edgar (placeholder)', role: 'Fundador · iReparo' },
  { quote: 'Pasamos de tener tareas dispersas en mil hojas Excel a tener un CRM que entiende cómo trabajamos. Y se conecta con WhatsApp.', name: 'Cliente Falcon (placeholder)', role: 'Director · Falcon Cat' },
  { quote: 'Lo que más me gusta: no tengo cinco proveedores. Centralita, bot y CRM, una sola persona que lo arregla todo si algo va mal.', name: 'Cliente Ilercasa (placeholder)', role: 'Asesoría' },
];
---
<section class="bg-[#fafbfd] py-24">
  <Container class="text-center">
    <span class="inline-block px-3.5 py-1.5 bg-navy/8 text-navy rounded-full text-xs font-semibold tracking-wide mb-3">Confían</span>
    <h2 class="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-3">Pymes que han dejado de perder leads</h2>
    <p class="text-lg text-muted max-w-2xl mx-auto mb-12">Sin testimonios inventados. Estos son clientes con los que trabajamos hoy.</p>
    <div class="grid md:grid-cols-3 gap-4 text-left">
      {items.map((t) => <Testimonial quote={t.quote} name={t.name} role={t.role} />)}
    </div>
  </Container>
</section>
```

- [ ] **Step 2: Create `CTAFinal.astro`**

```astro
---
import Container from '../layout/Container.astro';
import Button from '../ui/Button.astro';
import { getLocaleFromUrl, t, type Locale } from '../../i18n';
const locale: Locale = getLocaleFromUrl(Astro.url);
const wa = `https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER}`;
---
<section class="gradient-brand text-white text-center py-20">
  <Container>
    <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">¿Listo para que tu pyme<br/>conteste sola?</h2>
    <p class="text-lg text-white/85 mb-8">15 minutos por WhatsApp. Sin compromiso. Te enseñamos los tres pilares en 1 demo.</p>
    <div class="flex gap-3 justify-center flex-wrap">
      <Button variant="cyan" href={wa}>💬 {t(locale, 'hero.cta_whatsapp')}</Button>
      <a href="#contacto" class="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold text-sm bg-transparent text-white border border-white/50 hover:bg-white/10">{t(locale, 'hero.cta_demo')} →</a>
    </div>
  </Container>
</section>
```

- [ ] **Step 3: Create `WhatsAppFloat.astro`**

```astro
---
const wa = `https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER}`;
---
<a
  href={wa}
  class="fixed right-6 bottom-6 bg-whatsapp text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-[0_12px_30px_rgba(37,211,102,0.4)] z-50 hover:scale-105 transition"
  aria-label="Hablar por WhatsApp"
>
  💬
</a>
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/sections
git commit -m "feat(web): testimonials, cta final, whatsapp float"
```

---

### Task 19: Wire all sections in home

**Files:**
- Modify: `apps/web/src/pages/index.astro`

- [ ] **Step 1: Replace `apps/web/src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/sections/Hero.astro';
import LogoBar from '../components/sections/LogoBar.astro';
import Pillars from '../components/sections/Pillars.astro';
import ConnectedFlow from '../components/sections/ConnectedFlow.astro';
import FeaturedCase from '../components/sections/FeaturedCase.astro';
import PricingTeaser from '../components/sections/PricingTeaser.astro';
import Testimonials from '../components/sections/Testimonials.astro';
import CTAFinal from '../components/sections/CTAFinal.astro';
import WhatsAppFloat from '../components/sections/WhatsAppFloat.astro';
---
<Base title="TriaClaw · Tria el teu agent" description="Centralita, bots y CRM integrados de fábrica. Una sola plataforma para que tu pyme no pierda ni una llamada, ni un WhatsApp, ni un lead.">
  <Hero />
  <LogoBar />
  <Pillars />
  <ConnectedFlow />
  <FeaturedCase />
  <PricingTeaser />
  <Testimonials />
  <CTAFinal />
  <WhatsAppFloat />
</Base>
```

- [ ] **Step 2: Run dev and visually verify the full home**

```bash
pnpm dev
```

Compare against the hi-fi mockup from brainstorming (`.superpowers/brainstorm/.../home-hi-fi.html`). Adjust anything that drifts noticeably.

- [ ] **Step 3: Run build and confirm no errors**

```bash
pnpm --filter web build
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/pages/index.astro
git commit -m "feat(web): wire home sections"
```

---

## Sprint D — Pillar pages

### Task 20: Pillar page template + Centralita

**Files:**
- Create: `apps/web/src/components/sections/PillarHero.astro`
- Create: `apps/web/src/components/sections/PillarFeatures.astro`
- Create: `apps/web/src/components/sections/PillarPlans.astro`
- Create: `apps/web/src/pages/centralita.astro`

- [ ] **Step 1: Create `PillarHero.astro`**

```astro
---
type Tone = 'navy' | 'cyan' | 'teal';
interface Props {
  tone: Tone;
  eyebrow: string;
  title: string;
  subtitle: string;
  lead: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary: { text: string; href: string };
}
const { tone, eyebrow, title, subtitle, lead, ctaPrimary, ctaSecondary } = Astro.props;
const bg = tone === 'navy' ? 'bg-navy' : tone === 'cyan' ? 'bg-gradient-to-br from-navy via-navy-2 to-cyan-brand' : 'bg-gradient-to-br from-navy to-teal-brand';
---
<section class={`${bg} text-white py-20`}>
  <div class="mx-auto max-w-[1200px] px-8">
    <div class="text-[11px] tracking-[2px] text-cyan-brand uppercase mb-4 font-semibold">{eyebrow}</div>
    <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-4 max-w-3xl">{title}</h1>
    <p class="text-xl text-white/85 max-w-2xl mb-3">{subtitle}</p>
    <p class="text-base text-white/70 max-w-2xl mb-8">{lead}</p>
    <div class="flex gap-3 flex-wrap">
      <a href={ctaPrimary.href} class="inline-flex items-center gap-2 bg-cyan-brand text-navy font-semibold px-5 py-3 rounded-lg text-sm">{ctaPrimary.text}</a>
      <a href={ctaSecondary.href} class="inline-flex items-center gap-2 bg-transparent text-white border border-white/50 font-semibold px-5 py-3 rounded-lg text-sm hover:bg-white/10">{ctaSecondary.text}</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create `PillarFeatures.astro`**

```astro
---
interface Feature { icon: string; title: string; desc: string }
interface Props { title: string; features: Feature[] }
const { title, features } = Astro.props;
---
<section class="py-24">
  <div class="mx-auto max-w-[1200px] px-8">
    <h2 class="text-3xl md:text-4xl font-extrabold text-navy tracking-tight mb-10 text-center">{title}</h2>
    <div class="grid md:grid-cols-3 gap-5">
      {features.map((f) => (
        <div class="bg-white border border-line rounded-2xl p-6">
          <div class="text-3xl mb-3">{f.icon}</div>
          <h3 class="text-lg font-bold text-navy mb-2">{f.title}</h3>
          <p class="text-[14px] text-muted leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Create `PillarPlans.astro`**

```astro
---
import PricingCard from '../ui/PricingCard.astro';
interface Plan {
  pillarLabel: string;
  planName: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  variant?: 'default' | 'highlighted' | 'dark';
}
interface Props { title: string; plans: Plan[] }
const { title, plans } = Astro.props;
---
<section class="bg-[#fafbfd] py-24">
  <div class="mx-auto max-w-[1200px] px-8">
    <h2 class="text-3xl md:text-4xl font-extrabold text-navy tracking-tight mb-10 text-center">{title}</h2>
    <div class="grid md:grid-cols-3 gap-5">
      {plans.map((p) => <PricingCard {...p} />)}
    </div>
    <p class="text-[13px] text-muted text-center mt-6">Setup incluido en planes Pro. IVA no incluido. Combina 2+ pilares y rebaja un 15%.</p>
  </div>
</section>
```

- [ ] **Step 4: Create `apps/web/src/pages/centralita.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import PillarHero from '../components/sections/PillarHero.astro';
import PillarFeatures from '../components/sections/PillarFeatures.astro';
import PillarPlans from '../components/sections/PillarPlans.astro';
import CTAFinal from '../components/sections/CTAFinal.astro';
import WhatsAppFloat from '../components/sections/WhatsAppFloat.astro';

const wa = `https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER}`;

const features = [
  { icon: '🌐', title: 'IVR multinivel', desc: 'Filtra llamadas por opción del menú. Configurable en minutos desde el panel.' },
  { icon: '🔁', title: 'Transferencias inteligentes', desc: 'Cruza a la extensión correcta según horario, departamento o disponibilidad.' },
  { icon: '🎙️', title: 'Grabación y panel', desc: 'Graba llamadas con consentimiento RGPD. Panel supervisor en tiempo real.' },
  { icon: '🔌', title: 'SIP estándar', desc: 'Funciona con teléfonos SIP, softphones y números fijos/portados.' },
  { icon: '📞', title: 'Multi-sede', desc: 'Una centralita, varias oficinas. Plan de marcación común y reglas por sede.' },
  { icon: '🔗', title: 'Integrada con CRM', desc: 'Cada llamada genera ficha en el CRM TriaClaw. Click-to-call desde el CRM.' },
];

const plans = [
  { pillarLabel: 'CENTRALITA', planName: 'Inicio', price: '29 €', features: ['1 número', 'IVR básico (3 niveles)', '2 extensiones', 'Buzón de voz'], ctaText: 'Empezar', ctaHref: wa, variant: 'default' as const },
  { pillarLabel: 'CENTRALITA', planName: 'Pro', price: '89 €', features: ['Multi-extensión', 'Grabación de llamadas', 'Panel supervisor', 'Multi-sede'], ctaText: 'Empezar', ctaHref: wa, variant: 'highlighted' as const },
  { pillarLabel: 'CENTRALITA', planName: 'Custom', price: 'Hablamos', priceSuffix: '', features: ['Multi-sede grande', 'Integraciones a medida', 'SLA dedicado'], ctaText: 'Contactar', ctaHref: wa, variant: 'dark' as const },
];
---
<Base title="Centralita virtual · TriaClaw" description="PBX virtual con IVR, transferencias, panel y grabación. SIP estándar, integrada con tu CRM.">
  <PillarHero
    tone="navy"
    eyebrow="Pilar 1 · Centralita"
    title="Una centralita que te pasa lo que importa."
    subtitle="PBX virtual con IVR, panel supervisor y grabación. Integrada con tu CRM TriaClaw."
    lead="Despídete de teléfonos sonando sin parar y de "¿quién contesta?". Tu equipo solo recibe lo que tiene que recibir."
    ctaPrimary={{ text: '💬 Habla por WhatsApp', href: wa }}
    ctaSecondary={{ text: 'Ver planes', href: '#planes' }}
  />
  <PillarFeatures title="Lo que incluye" features={features} />
  <div id="planes"></div>
  <PillarPlans title="Planes Centralita" plans={plans} />
  <CTAFinal />
  <WhatsAppFloat />
</Base>
```

- [ ] **Step 5: Build to verify no errors**

```bash
pnpm --filter web build
```

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/sections/Pillar*.astro apps/web/src/pages/centralita.astro
git commit -m "feat(web): pillar templates and centralita page"
```

---

### Task 21: Agents page

**Files:**
- Create: `apps/web/src/pages/agents.astro`

- [ ] **Step 1: Create `apps/web/src/pages/agents.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import PillarHero from '../components/sections/PillarHero.astro';
import PillarFeatures from '../components/sections/PillarFeatures.astro';
import PillarPlans from '../components/sections/PillarPlans.astro';
import CTAFinal from '../components/sections/CTAFinal.astro';
import WhatsAppFloat from '../components/sections/WhatsAppFloat.astro';

const wa = `https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER}`;

const features = [
  { icon: '💬', title: 'WhatsApp Business', desc: 'Bots con número WhatsApp Business oficial. Plantillas y respuestas rápidas.' },
  { icon: '🧠', title: 'IA con contexto', desc: 'Conectados a tu CRM y catálogo. Saben quién es el cliente y qué pidió antes.' },
  { icon: '📅', title: 'Agendan citas', desc: 'Toman cita en el calendario de tu centralita o herramienta externa.' },
  { icon: '🚦', title: 'Cualifican leads', desc: 'Hacen las preguntas correctas y solo pasan a humano lo cualificado.' },
  { icon: '📦', title: 'Plantillas listas', desc: 'Envíos, atención al cliente, ventas, soporte SAT. Listas para producción.' },
  { icon: '🔁', title: 'Integradas con CRM', desc: 'Cada conversación termina en una ficha o ticket en tu CRM.' },
];

const plans = [
  { pillarLabel: 'AGENTS', planName: 'Inicio', price: '49 €', features: ['1 bot WhatsApp', 'Plantillas estándar', 'Hasta 500 conv/mes', 'Soporte email'], ctaText: 'Empezar', ctaHref: wa, variant: 'default' as const },
  { pillarLabel: 'AGENTS', planName: 'Pro', price: '149 €', features: ['Agente IA con contexto', 'Integración CRM nativa', 'Hasta 5.000 conv/mes', 'Plantillas custom'], ctaText: 'Empezar', ctaHref: wa, variant: 'highlighted' as const },
  { pillarLabel: 'AGENTS', planName: 'Custom', price: 'Hablamos', priceSuffix: '', features: ['Multi-canal', 'Integraciones a medida', 'Volúmenes altos'], ctaText: 'Contactar', ctaHref: wa, variant: 'dark' as const },
];
---
<Base title="Agents & Bots · TriaClaw" description="Bots de WhatsApp y agentes IA conversacionales. Cualifican, agendan y transfieren cuando hace falta humano.">
  <PillarHero
    tone="cyan"
    eyebrow="Pilar 2 · Agents & Bots"
    title="Bots que entienden a tus clientes."
    subtitle="WhatsApp Business + IA con contexto. Cualifican, agendan, transfieren."
    lead="Que el bot atienda lo repetitivo. Que tu equipo solo vea lo que necesita un humano."
    ctaPrimary={{ text: '💬 Habla por WhatsApp', href: wa }}
    ctaSecondary={{ text: 'Ver planes', href: '#planes' }}
  />
  <PillarFeatures title="Lo que pueden hacer" features={features} />
  <div id="planes"></div>
  <PillarPlans title="Planes Agents & Bots" plans={plans} />
  <CTAFinal />
  <WhatsAppFloat />
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/pages/agents.astro
git commit -m "feat(web): agents page"
```

---

### Task 22: CRM page

**Files:**
- Create: `apps/web/src/pages/crm.astro`

- [ ] **Step 1: Create `apps/web/src/pages/crm.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import PillarHero from '../components/sections/PillarHero.astro';
import PillarFeatures from '../components/sections/PillarFeatures.astro';
import PillarPlans from '../components/sections/PillarPlans.astro';
import CTAFinal from '../components/sections/CTAFinal.astro';
import WhatsAppFloat from '../components/sections/WhatsAppFloat.astro';

const wa = `https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER}`;

const features = [
  { icon: '🔧', title: 'Vertical SAT', desc: 'Para talleres y servicios técnicos. Tickets, presupuestos, garantía, partes.' },
  { icon: '⚡', title: 'Vertical Energía', desc: 'Para comercializadoras de luz/gas. Contratos, comisiones, agentes, comparador.' },
  { icon: '🏠', title: 'Vertical Inmobiliaria', desc: 'Para inmobiliarias y asesorías. Inmuebles, leads, visitas, contratos.' },
  { icon: '📋', title: 'Vertical Proyectos', desc: 'Para gestoras y agencias. Tareas, hitos, equipos, facturación por proyecto.' },
  { icon: '🔌', title: 'Integrado de fábrica', desc: 'Conectado a tu centralita y bots TriaClaw. Cero pegamento.' },
  { icon: '🎯', title: 'Custom para tu flujo', desc: 'Si tu vertical no encaja, lo construimos. Pricing a medida.' },
];

const plans = [
  { pillarLabel: 'CRM', planName: 'Vertical estándar', price: '39 €', priceSuffix: '/usuario/mes', features: ['Vertical preconfigurado', 'Hasta 10 usuarios', 'Centralita + Agents incluidos', 'Soporte email'], ctaText: 'Empezar', ctaHref: wa, variant: 'default' as const },
  { pillarLabel: 'CRM', planName: 'Vertical Pro', price: '79 €', priceSuffix: '/usuario/mes', features: ['Vertical preconfigurado', 'Usuarios ilimitados', 'Custom fields y flows', 'Soporte prioritario'], ctaText: 'Empezar', ctaHref: wa, variant: 'highlighted' as const },
  { pillarLabel: 'CRM', planName: 'Custom', price: 'Hablamos', priceSuffix: '', features: ['Vertical a medida', 'Integraciones específicas', 'SLA dedicado'], ctaText: 'Contactar', ctaHref: wa, variant: 'dark' as const },
];
---
<Base title="CRM & Gestión · TriaClaw" description="CRMs verticales hechos a medida del sector: SAT, energía, inmobiliaria, gestión de proyectos.">
  <PillarHero
    tone="teal"
    eyebrow="Pilar 3 · CRM & Gestión"
    title="Un CRM que entiende tu sector."
    subtitle="Verticales listos: SAT, energía, inmobiliaria, gestión de proyectos."
    lead="Olvida los CRMs genéricos que te obligan a trabajar al revés. Aquí vienes, lo abres y ya sabe cómo trabajas."
    ctaPrimary={{ text: '💬 Habla por WhatsApp', href: wa }}
    ctaSecondary={{ text: 'Ver planes', href: '#planes' }}
  />
  <PillarFeatures title="Verticales disponibles" features={features} />
  <div id="planes"></div>
  <PillarPlans title="Planes CRM" plans={plans} />
  <CTAFinal />
  <WhatsAppFloat />
</Base>
```

- [ ] **Step 2: Build and commit**

```bash
pnpm --filter web build
git add apps/web/src/pages/crm.astro
git commit -m "feat(web): crm page"
```

---

## Sprint E — Content collections & secondary pages

### Task 23: Content Collections schema

**Files:**
- Create: `apps/web/src/content.config.ts`
- Create: `apps/web/src/content/cases/ireparo.md`
- Create: `apps/web/src/content/cases/falcon-cat.md`
- Create: `apps/web/src/content/cases/ilercasa.md`
- Create: `apps/web/src/content/cases/comercializadora-energia.md`

- [ ] **Step 1: Create `apps/web/src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    pillars: z.array(z.enum(['centralita', 'agents', 'crm'])),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    summary: z.string(),
    anonymous: z.boolean().default(false),
    order: z.number().default(99),
    publishedAt: z.string(),
  }),
});

export const collections = { cases };
```

- [ ] **Step 2: Create `apps/web/src/content/cases/ireparo.md`**

```markdown
---
title: "Cero llamadas perdidas"
client: "iReparo"
pillars: ["centralita", "agents", "crm"]
metrics:
  - value: "−78%"
    label: "llamadas perdidas"
  - value: "+34%"
    label: "leads cualificados"
  - value: "3 h/día"
    label: "menos admin"
summary: "Centralita virtual + bot WhatsApp para envíos + CRM SAT integrados."
anonymous: false
order: 1
publishedAt: "2026-04-01"
---

iReparo es un taller especializado en reparación de móviles y dispositivos en Lleida. Antes
de TriaClaw, perdían en torno a un 25% de las llamadas entrantes durante picos de trabajo,
y los WhatsApps de envíos se contestaban a destiempo o se quedaban sin contestar.

Implantamos los tres pilares:

- **Centralita virtual** con IVR que filtra por motivo (presupuesto / estado de reparación / envíos / otro)
  y enruta a la extensión correcta según horario.
- **Bot WhatsApp** que atiende los envíos: pide datos, confirma dirección, agenda recogida.
- **CRM SAT** que recibe cada llamada y cada conversación de WhatsApp como ficha o ticket.

El equipo dejó de hacer de centralita y volvió a centrarse en reparar.
```

- [ ] **Step 3: Create `apps/web/src/content/cases/falcon-cat.md`**

```markdown
---
title: "De Excel a un CRM que entiende su flujo"
client: "Falcon Cat"
pillars: ["crm"]
summary: "CRM vertical de gestión de proyectos hecho a su flujo real."
anonymous: false
order: 2
publishedAt: "2026-04-15"
---

Falcon Cat gestiona proyectos para clientes recurrentes. Tenían tareas, hitos, presupuestos
y partes repartidos en hojas de cálculo y carpetas compartidas.

Construimos un CRM vertical sobre el stack TriaClaw que modela proyectos como entidad central,
con vistas filtradas por equipo, hitos visuales, y conexión con su correo y WhatsApp para
que cada interacción quede en la ficha del proyecto.
```

- [ ] **Step 4: Create `apps/web/src/content/cases/ilercasa.md`**

```markdown
---
title: "Atención y gestión inmobiliaria sin fricción"
client: "Ilercasa Asesoria"
pillars: ["centralita", "agents", "crm"]
summary: "Centralita + bot + CRM inmobiliario integrados con la web pública."
anonymous: false
order: 3
publishedAt: "2026-04-22"
---

Ilercasa combina asesoría e inmobiliaria. Cada lead que llega por la web, por una llamada
o por WhatsApp tiene que terminar en una ficha de inmueble o de cliente.

Conectamos la web pública (alta de inmuebles, formulario de contacto) al CRM TriaClaw,
con la centralita para llamadas y bot WhatsApp para preguntas frecuentes. Los datos viajan
sin que nadie copie y pegue.
```

- [ ] **Step 5: Create `apps/web/src/content/cases/comercializadora-energia.md`**

```markdown
---
title: "Comisiones y contratos sin Excel"
client: "Comercializadora de energía"
pillars: ["crm"]
summary: "CRM Energía vertical para una comercializadora de luz y gas."
anonymous: true
order: 4
publishedAt: "2026-05-02"
---

Una comercializadora de energía con red de agentes externos necesitaba un CRM que entendiera
contratos por tarifa, comisiones por agente y ciclos de cobro propios del sector.

Desplegamos el CRM Energía de TriaClaw, con flujos de alta de contrato, panel de comisiones
por agente y comparador interno entre tarifas. Los agentes acceden desde su móvil; el equipo
de gestión, desde el panel web.
```

- [ ] **Step 6: Build to verify schema validates**

```bash
pnpm --filter web build
```

Expected: `astro:content` validates all 4 cases. No errors.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/content.config.ts apps/web/src/content/cases
git commit -m "feat(web): content collection for cases with 4 entries"
```

---

### Task 24: /casos index and detail

**Files:**
- Create: `apps/web/src/pages/casos/index.astro`
- Create: `apps/web/src/pages/casos/[slug].astro`

- [ ] **Step 1: Create `apps/web/src/pages/casos/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection } from 'astro:content';
import WhatsAppFloat from '../../components/sections/WhatsAppFloat.astro';
import CTAFinal from '../../components/sections/CTAFinal.astro';

const cases = (await getCollection('cases')).sort((a, b) => a.data.order - b.data.order);
---
<Base title="Casos · TriaClaw" description="Pymes que dejaron de perder leads con TriaClaw.">
  <section class="py-20">
    <div class="mx-auto max-w-[1200px] px-8">
      <div class="text-center mb-12">
        <span class="inline-block px-3.5 py-1.5 bg-navy/8 text-navy rounded-full text-xs font-semibold tracking-wide mb-3">Casos</span>
        <h1 class="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-3">Pymes que dejaron de perder leads</h1>
        <p class="text-lg text-muted max-w-2xl mx-auto">Sin testimonios inventados. Estos son clientes con los que trabajamos hoy.</p>
      </div>
      <div class="grid md:grid-cols-2 gap-5">
        {cases.map((c) => (
          <a href={`/casos/${c.id}`} class="block bg-white border border-line rounded-2xl p-7 hover:-translate-y-1 hover:shadow-lg transition">
            <div class="flex gap-2 mb-3">
              {c.data.pillars.map((p) => <span class="text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 bg-navy/8 text-navy rounded">{p}</span>)}
            </div>
            <div class="text-[12px] text-muted font-semibold mb-1">{c.data.client}</div>
            <h2 class="text-xl font-bold text-navy mb-2">{c.data.title}</h2>
            <p class="text-[14px] text-muted leading-relaxed">{c.data.summary}</p>
          </a>
        ))}
      </div>
    </div>
  </section>
  <CTAFinal />
  <WhatsAppFloat />
</Base>
```

- [ ] **Step 2: Create `apps/web/src/pages/casos/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection, render } from 'astro:content';
import WhatsAppFloat from '../../components/sections/WhatsAppFloat.astro';
import CTAFinal from '../../components/sections/CTAFinal.astro';

export async function getStaticPaths() {
  const cases = await getCollection('cases');
  return cases.map((c) => ({ params: { slug: c.id }, props: { c } }));
}

const { c } = Astro.props;
const { Content } = await render(c);
---
<Base title={`${c.data.title} · ${c.data.client} · TriaClaw`} description={c.data.summary}>
  <article class="py-16">
    <div class="mx-auto max-w-3xl px-8">
      <a href="/casos" class="text-cyan-brand text-sm font-semibold mb-6 inline-block">← Todos los casos</a>
      <div class="text-[12px] text-muted font-semibold mb-2">{c.data.client}</div>
      <h1 class="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-4">{c.data.title}</h1>
      <p class="text-lg text-muted mb-8">{c.data.summary}</p>
      {c.data.metrics && (
        <div class="flex gap-9 mb-10 flex-wrap">
          {c.data.metrics.map((m) => (
            <div><div class="text-3xl font-extrabold text-navy">{m.value}</div><div class="text-xs text-muted mt-1">{m.label}</div></div>
          ))}
        </div>
      )}
      <div class="prose prose-slate max-w-none [&_p]:text-base [&_p]:text-ink [&_p]:leading-relaxed [&_p]:mb-4 [&_strong]:text-navy">
        <Content />
      </div>
    </div>
  </article>
  <CTAFinal />
  <WhatsAppFloat />
</Base>
```

- [ ] **Step 3: Build to verify all 4 detail pages generate**

```bash
pnpm --filter web build
```

Expected: 4 case pages in `dist/casos/`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/pages/casos
git commit -m "feat(web): cases index and detail pages"
```

---

### Task 25: /precios

**Files:**
- Create: `apps/web/src/pages/precios.astro`

- [ ] **Step 1: Create `apps/web/src/pages/precios.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import PricingCard from '../components/ui/PricingCard.astro';
import CTAFinal from '../components/sections/CTAFinal.astro';
import WhatsAppFloat from '../components/sections/WhatsAppFloat.astro';

const wa = `https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER}`;

const groups = [
  {
    label: 'Centralita',
    plans: [
      { pillarLabel: 'CENTRALITA', planName: 'Inicio', price: '29 €', features: ['1 número', 'IVR básico', '2 extensiones', 'Buzón de voz'], ctaText: 'Empezar', ctaHref: wa, variant: 'default' as const },
      { pillarLabel: 'CENTRALITA', planName: 'Pro', price: '89 €', features: ['Multi-extensión', 'Grabación', 'Panel supervisor', 'Multi-sede'], ctaText: 'Empezar', ctaHref: wa, variant: 'highlighted' as const },
      { pillarLabel: 'CENTRALITA', planName: 'Custom', price: 'Hablamos', priceSuffix: '', features: ['Multi-sede grande', 'Integraciones', 'SLA dedicado'], ctaText: 'Contactar', ctaHref: wa, variant: 'dark' as const },
    ],
  },
  {
    label: 'Agents & Bots',
    plans: [
      { pillarLabel: 'AGENTS', planName: 'Inicio', price: '49 €', features: ['1 bot WhatsApp', 'Plantillas estándar', '500 conv/mes'], ctaText: 'Empezar', ctaHref: wa, variant: 'default' as const },
      { pillarLabel: 'AGENTS', planName: 'Pro', price: '149 €', features: ['IA con contexto', 'Integración CRM', '5.000 conv/mes'], ctaText: 'Empezar', ctaHref: wa, variant: 'highlighted' as const },
      { pillarLabel: 'AGENTS', planName: 'Custom', price: 'Hablamos', priceSuffix: '', features: ['Multi-canal', 'Integraciones', 'Volúmenes altos'], ctaText: 'Contactar', ctaHref: wa, variant: 'dark' as const },
    ],
  },
  {
    label: 'CRM & Gestión',
    plans: [
      { pillarLabel: 'CRM', planName: 'Vertical', price: '39 €', priceSuffix: '/usuario/mes', features: ['Vertical preconfigurado', '10 usuarios máx', 'Centralita + Agents incluidos'], ctaText: 'Empezar', ctaHref: wa, variant: 'default' as const },
      { pillarLabel: 'CRM', planName: 'Pro', price: '79 €', priceSuffix: '/usuario/mes', features: ['Custom fields', 'Usuarios ilimitados', 'Soporte prioritario'], ctaText: 'Empezar', ctaHref: wa, variant: 'highlighted' as const },
      { pillarLabel: 'CRM', planName: 'Custom', price: 'Hablamos', priceSuffix: '', features: ['Vertical a medida', 'SLA dedicado'], ctaText: 'Contactar', ctaHref: wa, variant: 'dark' as const },
    ],
  },
];
---
<Base title="Precios · TriaClaw" description="Pricing claro de los tres pilares. Sin permanencia. Combina dos y rebaja un 15%.">
  <section class="bg-navy text-white py-20 text-center">
    <div class="mx-auto max-w-[1200px] px-8">
      <h1 class="text-5xl font-extrabold tracking-tight mb-3">Precios sin sorpresas</h1>
      <p class="text-lg text-white/80">Empieza por uno. Combina dos pilares y rebaja un 15%. Cancela cuando quieras.</p>
    </div>
  </section>
  {groups.map((g) => (
    <section class="py-16 even:bg-[#fafbfd]">
      <div class="mx-auto max-w-[1200px] px-8">
        <h2 class="text-3xl font-extrabold text-navy tracking-tight mb-8 text-center">{g.label}</h2>
        <div class="grid md:grid-cols-3 gap-5">
          {g.plans.map((p) => <PricingCard {...p} />)}
        </div>
      </div>
    </section>
  ))}
  <section class="py-12 text-center">
    <p class="text-[14px] text-muted">Setup incluido en planes Pro. IVA no incluido. Bonificación 2+ pilares: −15%.</p>
  </section>
  <CTAFinal />
  <WhatsAppFloat />
</Base>
```

- [ ] **Step 2: Build and commit**

```bash
pnpm --filter web build
git add apps/web/src/pages/precios.astro
git commit -m "feat(web): unified pricing page"
```

---

### Task 26: /sobre

**Files:**
- Create: `apps/web/src/pages/sobre.astro`

- [ ] **Step 1: Create `apps/web/src/pages/sobre.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import CTAFinal from '../components/sections/CTAFinal.astro';
import WhatsAppFloat from '../components/sections/WhatsAppFloat.astro';
---
<Base title="Sobre TriaClaw" description="Una marca de iReparo. Centralita, bots y CRM hechos en Lleida para pymes y autónomos.">
  <section class="py-20 bg-navy text-white">
    <div class="mx-auto max-w-3xl px-8">
      <span class="inline-block px-3.5 py-1.5 bg-cyan-brand/12 text-cyan-brand rounded-full text-xs font-semibold tracking-wide mb-3">Sobre TriaClaw</span>
      <h1 class="text-5xl font-extrabold tracking-tight mb-5">Hecho en Lleida, probado en pymes reales.</h1>
      <p class="text-lg text-white/80 leading-relaxed">TriaClaw nace de la experiencia construyendo software para pymes locales: talleres, asesorías, inmobiliarias, comercializadoras de energía. Lo que aprendimos haciéndolo a medida lo empaquetamos en tres pilares integrados de fábrica.</p>
    </div>
  </section>
  <section class="py-16">
    <div class="mx-auto max-w-3xl px-8 space-y-8 text-base text-ink leading-relaxed">
      <div>
        <h2 class="text-2xl font-bold text-navy mb-3">¿Por qué iReparo?</h2>
        <p>iReparo lleva años atendiendo a clientes por teléfono, WhatsApp y mostrador. Esa fricción del día a día (llamadas perdidas, WhatsApps sin contestar, leads que se enfrían) es lo que TriaClaw resuelve para otras pymes con problemas parecidos.</p>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-navy mb-3">Cómo trabajamos</h2>
        <p>Pocos clientes a la vez. Implantación rápida (días, no meses). Soporte directo: hablas con quien construye, no con un call center. Sin permanencia.</p>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-navy mb-3">Dónde estamos</h2>
        <p>Lleida (Catalunya, España). Trabajamos remoto con clientes de toda España. Para implantaciones grandes vamos en persona.</p>
      </div>
    </div>
  </section>
  <CTAFinal />
  <WhatsAppFloat />
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/pages/sobre.astro
git commit -m "feat(web): about page"
```

---

### Task 27: /partners

**Files:**
- Create: `apps/web/src/pages/partners.astro`

- [ ] **Step 1: Create `apps/web/src/pages/partners.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import CTAFinal from '../components/sections/CTAFinal.astro';
import WhatsAppFloat from '../components/sections/WhatsAppFloat.astro';

const benefits = [
  { icon: '💰', title: 'Comisión recurrente', desc: '20% del MRR de cada cliente que traes, durante toda la vida del contrato.' },
  { icon: '🛠️', title: 'Implantación compartida', desc: 'Tú llevas la relación; nosotros la parte técnica. O al revés. Tú decides.' },
  { icon: '🏷️', title: 'White-label opcional', desc: 'Para integradores que quieran vender bajo su propia marca, con TriaClaw motor.' },
  { icon: '📚', title: 'Formación incluida', desc: 'Sesiones técnicas y comerciales para tu equipo. Material y demos listas.' },
];
---
<Base title="Partners · TriaClaw" description="Programa de partners e integradores. Vende, implanta o integra TriaClaw con tu propio sello.">
  <section class="py-20 gradient-brand text-white">
    <div class="mx-auto max-w-[1200px] px-8">
      <span class="inline-block px-3.5 py-1.5 bg-cyan-brand/12 text-cyan-brand rounded-full text-xs font-semibold tracking-wide mb-3">Para integradores y consultoras</span>
      <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">Vende e implanta TriaClaw a tus clientes.</h1>
      <p class="text-lg text-white/85 max-w-2xl mb-8">Programa de partners para consultoras locales, integradores SIP/CRM y agencias. Comisión recurrente, white-label opcional, soporte directo.</p>
    </div>
  </section>
  <section class="py-20">
    <div class="mx-auto max-w-[1200px] px-8">
      <h2 class="text-3xl font-extrabold text-navy tracking-tight mb-10 text-center">Qué ofrecemos a partners</h2>
      <div class="grid md:grid-cols-2 gap-5">
        {benefits.map((b) => (
          <div class="bg-white border border-line rounded-2xl p-7 flex gap-4">
            <div class="text-3xl">{b.icon}</div>
            <div>
              <h3 class="text-lg font-bold text-navy mb-2">{b.title}</h3>
              <p class="text-[14px] text-muted leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  <section class="py-16 bg-[#fafbfd]">
    <div class="mx-auto max-w-3xl px-8 text-center">
      <h2 class="text-3xl font-extrabold text-navy tracking-tight mb-4">¿Quieres ser partner?</h2>
      <p class="text-lg text-muted mb-6">Cuéntanos brevemente quién eres y a quién vendes. Te respondemos en 48 h.</p>
      <a href="/contacto?topic=partner" class="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-lg">Solicitar info partner →</a>
    </div>
  </section>
  <CTAFinal />
  <WhatsAppFloat />
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/pages/partners.astro
git commit -m "feat(web): partners page"
```

---

### Task 28: /contacto (page only — form island in Sprint F)

**Files:**
- Create: `apps/web/src/pages/contacto.astro`

- [ ] **Step 1: Create `apps/web/src/pages/contacto.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import WhatsAppFloat from '../components/sections/WhatsAppFloat.astro';

const wa = `https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER}`;
const calendly = import.meta.env.PUBLIC_CALENDLY_URL;
---
<Base title="Contacto · TriaClaw" description="Habla con TriaClaw por WhatsApp, formulario o reservando una demo.">
  <section class="py-20">
    <div class="mx-auto max-w-[1100px] px-8 grid md:grid-cols-2 gap-12">
      <div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-4">Hablemos.</h1>
        <p class="text-lg text-muted leading-relaxed mb-8">15 minutos por WhatsApp suelen bastar para entender si TriaClaw encaja con tu pyme. Sin compromiso.</p>
        <div class="space-y-5">
          <a href={wa} class="flex items-start gap-4 p-5 border border-line rounded-2xl hover:-translate-y-0.5 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-whatsapp text-white flex items-center justify-center text-xl">💬</div>
            <div><div class="font-bold text-navy">WhatsApp</div><div class="text-[14px] text-muted">+34 665 95 41 08 — la vía más rápida</div></div>
          </a>
          <a href="mailto:hola@triaclaw.com" class="flex items-start gap-4 p-5 border border-line rounded-2xl hover:-translate-y-0.5 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center text-xl">✉️</div>
            <div><div class="font-bold text-navy">Email</div><div class="text-[14px] text-muted">hola@triaclaw.com</div></div>
          </a>
          {calendly && (
            <a href={calendly} class="flex items-start gap-4 p-5 border border-line rounded-2xl hover:-translate-y-0.5 hover:shadow-md transition">
              <div class="w-12 h-12 rounded-xl bg-cyan-brand text-navy flex items-center justify-center text-xl">📅</div>
              <div><div class="font-bold text-navy">Reservar demo</div><div class="text-[14px] text-muted">20 min en tu calendario</div></div>
            </a>
          )}
        </div>
      </div>
      <div id="form" class="bg-white border border-line rounded-2xl p-8 shadow-sm">
        <h2 class="text-xl font-bold text-navy mb-1">Formulario</h2>
        <p class="text-[14px] text-muted mb-6">Te contestamos en menos de 24 h laborables.</p>
        <div id="contact-form-island"><!-- ContactForm island mounted here in Task 30 --></div>
      </div>
    </div>
  </section>
  <WhatsAppFloat />
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/pages/contacto.astro
git commit -m "feat(web): contact page (form island wired in Sprint F)"
```

---

### Task 29: Legal pages (aviso, privacidad, cookies)

**Files:**
- Create: `apps/web/src/pages/legal/aviso.astro`
- Create: `apps/web/src/pages/legal/privacidad.astro`
- Create: `apps/web/src/pages/legal/cookies.astro`

- [ ] **Step 1: Create `apps/web/src/pages/legal/aviso.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
---
<Base title="Aviso legal · TriaClaw">
  <article class="py-16">
    <div class="mx-auto max-w-3xl px-8 prose prose-slate">
      <h1 class="text-4xl font-extrabold text-navy mb-6">Aviso legal</h1>
      <p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información, se informa de los datos identificativos del responsable del sitio web triaclaw.com.</p>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Titular</h2>
      <ul>
        <li><strong>Razón social:</strong> [PLACEHOLDER — confirmar razón social fiscal de iReparo]</li>
        <li><strong>NIF/CIF:</strong> [PLACEHOLDER — NIF iReparo]</li>
        <li><strong>Domicilio:</strong> [PLACEHOLDER — domicilio fiscal iReparo, Lleida]</li>
        <li><strong>Email:</strong> hola@triaclaw.com</li>
        <li><strong>Teléfono:</strong> +34 665 95 41 08</li>
      </ul>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Marca</h2>
      <p>TriaClaw es una marca y línea de servicio comercializada por el titular indicado.</p>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Condiciones de uso</h2>
      <p>El acceso a este sitio web atribuye la condición de usuario y supone la aceptación de las condiciones de uso descritas en este aviso. Queda prohibida la utilización del sitio con fines ilícitos o lesivos contra el titular o terceros.</p>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Propiedad intelectual</h2>
      <p>Todos los contenidos del sitio (textos, imágenes, código, marcas) son titularidad del responsable salvo indicación contraria. Su reproducción sin autorización expresa queda prohibida.</p>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Legislación aplicable</h2>
      <p>Este aviso se rige por la legislación española y los tribunales competentes serán los de Lleida.</p>
      <p class="text-sm text-muted mt-10">Última actualización: 6 de mayo de 2026.</p>
    </div>
  </article>
</Base>
```

- [ ] **Step 2: Create `apps/web/src/pages/legal/privacidad.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
---
<Base title="Política de privacidad · TriaClaw">
  <article class="py-16">
    <div class="mx-auto max-w-3xl px-8 prose prose-slate">
      <h1 class="text-4xl font-extrabold text-navy mb-6">Política de privacidad</h1>
      <p>Esta política describe cómo tratamos los datos personales recogidos a través de triaclaw.com de acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).</p>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Responsable</h2>
      <p>[PLACEHOLDER — datos identificativos de iReparo, los mismos del Aviso legal].</p>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Finalidades</h2>
      <ul>
        <li>Atender consultas enviadas a través del formulario de contacto.</li>
        <li>Gestionar la relación comercial con clientes y partners.</li>
        <li>Enviar comunicaciones operativas relativas al servicio contratado.</li>
      </ul>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Base jurídica</h2>
      <p>Consentimiento del interesado al enviar el formulario, ejecución del contrato cuando exista relación comercial, e interés legítimo para responder consultas.</p>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Conservación</h2>
      <p>Conservaremos los datos durante el tiempo necesario para atender la consulta o ejecutar el servicio. Posteriormente se conservarán bloqueados durante los plazos legales aplicables.</p>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Destinatarios</h2>
      <p>Para el envío de emails transaccionales utilizamos Resend (proveedor europeo). Para alojamiento utilizamos Vercel. No cedemos datos a terceros fuera de estos encargados.</p>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Derechos</h2>
      <p>Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, portabilidad y limitación escribiendo a hola@triaclaw.com. Tienes derecho a presentar reclamación ante la AEPD si consideras que el tratamiento no se ajusta a la normativa.</p>
      <p class="text-sm text-muted mt-10">Última actualización: 6 de mayo de 2026.</p>
    </div>
  </article>
</Base>
```

- [ ] **Step 3: Create `apps/web/src/pages/legal/cookies.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
---
<Base title="Política de cookies · TriaClaw">
  <article class="py-16">
    <div class="mx-auto max-w-3xl px-8 prose prose-slate">
      <h1 class="text-4xl font-extrabold text-navy mb-6">Política de cookies</h1>
      <p>triaclaw.com utiliza únicamente cookies técnicas estrictamente necesarias para el funcionamiento del sitio. No utilizamos cookies analíticas no esenciales ni de publicidad.</p>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Cookies utilizadas</h2>
      <ul>
        <li><strong>Locale:</strong> recuerda el idioma seleccionado (ES/CA).</li>
        <li><strong>Cookies de Vercel Analytics:</strong> analítica privacy-friendly sin identificación personal, exenta de consentimiento conforme a la guía AEPD 2023.</li>
      </ul>
      <h2 class="text-2xl font-bold text-navy mt-8 mb-3">Cookies de terceros</h2>
      <p>Si en el futuro embebemos Calendly u otra herramienta que use cookies no esenciales, esta página se actualizará y aparecerá un banner de consentimiento.</p>
      <p class="text-sm text-muted mt-10">Última actualización: 6 de mayo de 2026.</p>
    </div>
  </article>
</Base>
```

- [ ] **Step 4: Build and commit**

```bash
pnpm --filter web build
git add apps/web/src/pages/legal
git commit -m "feat(web): legal pages with rgpd-compliant templates"
```

---

## Sprint F — Forms & integrations

### Task 30: Contact schema (Zod) — TDD

**Files:**
- Create: `apps/web/src/lib/contact-schema.ts`
- Create: `apps/web/src/lib/contact-schema.test.ts`

- [ ] **Step 1: Install Zod**

```bash
pnpm --filter web add zod
```

- [ ] **Step 2: Write failing test `apps/web/src/lib/contact-schema.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { contactSchema } from './contact-schema';

describe('contactSchema', () => {
  const valid = {
    name: 'Edgar',
    email: 'edgar@example.com',
    company: 'iReparo',
    phone: '+34665954108',
    pillar: 'centralita',
    message: 'Hola, me interesa la centralita.',
    consent: true,
    turnstileToken: 'tok_abc',
    honeypot: '',
  };

  it('passes with valid data', () => {
    const r = contactSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it('rejects empty name', () => {
    const r = contactSchema.safeParse({ ...valid, name: '' });
    expect(r.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const r = contactSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(r.success).toBe(false);
  });

  it('rejects when consent is false', () => {
    const r = contactSchema.safeParse({ ...valid, consent: false });
    expect(r.success).toBe(false);
  });

  it('rejects when honeypot has value (bot)', () => {
    const r = contactSchema.safeParse({ ...valid, honeypot: 'oops' });
    expect(r.success).toBe(false);
  });

  it('accepts message at minimum length', () => {
    const r = contactSchema.safeParse({ ...valid, message: 'Hola TriaClaw' });
    expect(r.success).toBe(true);
  });

  it('rejects message under 10 chars', () => {
    const r = contactSchema.safeParse({ ...valid, message: 'corto' });
    expect(r.success).toBe(false);
  });

  it('accepts unknown pillar value as fallback', () => {
    const r = contactSchema.safeParse({ ...valid, pillar: 'general' });
    expect(r.success).toBe(true);
  });
});
```

- [ ] **Step 3: Run test → expect failure**

```bash
pnpm --filter web test
```

Expected: `Cannot find module './contact-schema'`.

- [ ] **Step 4: Implement `apps/web/src/lib/contact-schema.ts`**

```ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Nombre demasiado corto').max(100),
  email: z.string().trim().email('Email no válido').max(200),
  company: z.string().trim().max(120).optional().default(''),
  phone: z.string().trim().max(40).optional().default(''),
  pillar: z.enum(['centralita', 'agents', 'crm', 'general', 'partner']).default('general'),
  message: z.string().trim().min(10, 'Cuéntanos un poco más').max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: 'Acepta la política para continuar' }) }),
  turnstileToken: z.string().min(1, 'Verificación anti-spam pendiente'),
  honeypot: z.string().max(0, 'spam'),
});

export type ContactInput = z.infer<typeof contactSchema>;
```

- [ ] **Step 5: Run test → expect pass**

```bash
pnpm --filter web test
```

Expected: 8 tests pass.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib/contact-schema.ts apps/web/src/lib/contact-schema.test.ts apps/web/package.json pnpm-lock.yaml
git commit -m "feat(web): contact zod schema with tests"
```

---

### Task 31: Mailer module — TDD

**Files:**
- Create: `apps/web/src/lib/mailer.ts`
- Create: `apps/web/src/lib/mailer.test.ts`

- [ ] **Step 1: Install Resend**

```bash
pnpm --filter web add resend
```

- [ ] **Step 2: Write failing test `apps/web/src/lib/mailer.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest';

const sendMock = vi.fn().mockResolvedValue({ data: { id: 'msg_1' }, error: null });
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}));

import { sendContactEmail } from './mailer';

describe('sendContactEmail', () => {
  it('builds an email and calls Resend.send', async () => {
    sendMock.mockClear();
    const r = await sendContactEmail({
      apiKey: 'k', to: 'hola@triaclaw.com',
      input: {
        name: 'Edgar', email: 'e@e.com', company: 'iReparo', phone: '+34',
        pillar: 'centralita', message: 'Hola', consent: true, turnstileToken: 't', honeypot: '',
      },
    });
    expect(r.ok).toBe(true);
    expect(sendMock).toHaveBeenCalledOnce();
    const call = sendMock.mock.calls[0][0];
    expect(call.to).toEqual(['hola@triaclaw.com']);
    expect(call.from).toMatch(/triaclaw\.com/);
    expect(call.replyTo).toBe('e@e.com');
    expect(call.subject).toContain('centralita');
    expect(call.html).toContain('Edgar');
  });

  it('returns error when Resend fails', async () => {
    sendMock.mockClear();
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'boom' } });
    const r = await sendContactEmail({
      apiKey: 'k', to: 'hola@triaclaw.com',
      input: { name: 'X', email: 'x@x.com', company: '', phone: '', pillar: 'general', message: 'a'.repeat(15), consent: true, turnstileToken: 't', honeypot: '' },
    });
    expect(r.ok).toBe(false);
  });
});
```

- [ ] **Step 3: Run failing test**

```bash
pnpm --filter web test
```

Expected: `Cannot find module './mailer'`.

- [ ] **Step 4: Implement `apps/web/src/lib/mailer.ts`**

```ts
import { Resend } from 'resend';
import type { ContactInput } from './contact-schema';

interface Args {
  apiKey: string;
  to: string;
  input: ContactInput;
}

export async function sendContactEmail({ apiKey, to, input }: Args): Promise<{ ok: boolean; error?: string }> {
  const resend = new Resend(apiKey);
  const subject = `Lead web · ${input.pillar} · ${input.name}`;
  const html = `
<h2>Nuevo lead desde triaclaw.com</h2>
<table cellpadding="6">
  <tr><td><b>Nombre</b></td><td>${escapeHtml(input.name)}</td></tr>
  <tr><td><b>Email</b></td><td>${escapeHtml(input.email)}</td></tr>
  <tr><td><b>Empresa</b></td><td>${escapeHtml(input.company || '—')}</td></tr>
  <tr><td><b>Teléfono</b></td><td>${escapeHtml(input.phone || '—')}</td></tr>
  <tr><td><b>Pilar</b></td><td>${escapeHtml(input.pillar)}</td></tr>
</table>
<h3>Mensaje</h3>
<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(input.message)}</pre>
`;
  const { error } = await resend.emails.send({
    from: 'TriaClaw <noreply@triaclaw.com>',
    to: [to],
    replyTo: input.email,
    subject,
    html,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
```

- [ ] **Step 5: Run test → expect pass**

```bash
pnpm --filter web test
```

Expected: 10 tests pass total (8 schema + 2 mailer).

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib/mailer.ts apps/web/src/lib/mailer.test.ts apps/web/package.json pnpm-lock.yaml
git commit -m "feat(web): mailer module with resend"
```

---

### Task 32: Turnstile verifier and `/api/contact` endpoint — TDD

**Files:**
- Create: `apps/web/src/lib/turnstile.ts`
- Create: `apps/web/src/lib/turnstile.test.ts`
- Create: `apps/web/src/pages/api/contact.ts`

- [ ] **Step 1: Write failing test `apps/web/src/lib/turnstile.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { verifyTurnstile } from './turnstile';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe('verifyTurnstile', () => {
  it('returns true when Cloudflare says success', async () => {
    fetchMock.mockResolvedValue({ json: async () => ({ success: true }) });
    expect(await verifyTurnstile('secret', 'token', '1.1.1.1')).toBe(true);
  });

  it('returns false when Cloudflare says failure', async () => {
    fetchMock.mockResolvedValue({ json: async () => ({ success: false }) });
    expect(await verifyTurnstile('secret', 'token', '1.1.1.1')).toBe(false);
  });

  it('returns false on network error', async () => {
    fetchMock.mockRejectedValue(new Error('network'));
    expect(await verifyTurnstile('secret', 'token', '1.1.1.1')).toBe(false);
  });
});
```

- [ ] **Step 2: Run failing test**

```bash
pnpm --filter web test
```

- [ ] **Step 3: Implement `apps/web/src/lib/turnstile.ts`**

```ts
const ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const res = await fetch(ENDPOINT, { method: 'POST', body });
    const data = (await res.json()) as { success: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run tests → all pass**

```bash
pnpm --filter web test
```

Expected: 13 tests pass.

- [ ] **Step 5: Implement `apps/web/src/pages/api/contact.ts`**

```ts
import type { APIRoute } from 'astro';
import { contactSchema } from '../../lib/contact-schema';
import { verifyTurnstile } from '../../lib/turnstile';
import { sendContactEmail } from '../../lib/mailer';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError(400, 'invalid_json');
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(400, 'invalid_input', parsed.error.flatten());
  }
  const data = parsed.data;

  const turnstileSecret = import.meta.env.TURNSTILE_SECRET;
  if (!turnstileSecret) return jsonError(500, 'config_missing');
  const turnstileOk = await verifyTurnstile(turnstileSecret, data.turnstileToken, clientAddress ?? '');
  if (!turnstileOk) return jsonError(400, 'turnstile_failed');

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_EMAIL_TO;
  if (!apiKey || !to) return jsonError(500, 'config_missing');

  const result = await sendContactEmail({ apiKey, to, input: data });
  if (!result.ok) return jsonError(502, 'mailer_failed');

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

function jsonError(status: number, code: string, details?: unknown) {
  return new Response(JSON.stringify({ ok: false, code, details }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
```

- [ ] **Step 6: Build to ensure SSR endpoint compiles**

```bash
pnpm --filter web build
```

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/lib/turnstile.ts apps/web/src/lib/turnstile.test.ts apps/web/src/pages/api/contact.ts
git commit -m "feat(web): turnstile verifier and contact api endpoint"
```

---

### Task 33: ContactForm Solid island + wire to /contacto

**Files:**
- Create: `apps/web/src/components/forms/ContactForm.tsx`
- Modify: `apps/web/src/pages/contacto.astro`

- [ ] **Step 1: Create `apps/web/src/components/forms/ContactForm.tsx`**

```tsx
import { createSignal, onMount, Show } from 'solid-js';

declare global {
  interface Window { turnstile?: { render: (sel: string, opts: { sitekey: string; callback: (token: string) => void }) => string } }
}

interface Props { siteKey: string }

export default function ContactForm(props: Props) {
  const [token, setToken] = createSignal('');
  const [status, setStatus] = createSignal<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = createSignal('');

  onMount(() => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    s.defer = true;
    s.onload = () => {
      window.turnstile?.render('#cf-turnstile', { sitekey: props.siteKey, callback: setToken });
    };
    document.head.appendChild(s);
  });

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      company: String(fd.get('company') || ''),
      phone: String(fd.get('phone') || ''),
      pillar: String(fd.get('pillar') || 'general'),
      message: String(fd.get('message') || ''),
      consent: fd.get('consent') === 'on',
      turnstileToken: token(),
      honeypot: String(fd.get('website') || ''),
    };
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        setStatus('ok');
        form.reset();
      } else {
        const body = await r.json().catch(() => ({}));
        setStatus('error');
        setErrorMsg(body.code || 'request_failed');
      }
    } catch {
      setStatus('error');
      setErrorMsg('network');
    }
  }

  const inputBase = 'w-full bg-white border border-line rounded-lg px-3.5 py-2.5 text-sm focus:border-cyan-brand outline-none';
  const labelBase = 'block text-[13px] font-semibold text-navy mb-1.5';

  return (
    <Show
      when={status() !== 'ok'}
      fallback={
        <div class="bg-cyan-brand/10 border border-cyan-brand text-navy rounded-lg p-4 text-[14px]">
          ¡Recibido! Te contestamos en menos de 24 h laborables.
        </div>
      }
    >
      <form onSubmit={onSubmit} class="space-y-4" novalidate>
        <input name="website" type="text" tabIndex={-1} autocomplete="off" class="hidden" aria-hidden="true" />
        <label class="block"><span class={labelBase}>Nombre*</span><input class={inputBase} name="name" required /></label>
        <label class="block"><span class={labelBase}>Email*</span><input class={inputBase} type="email" name="email" required /></label>
        <div class="grid grid-cols-2 gap-3">
          <label class="block"><span class={labelBase}>Empresa</span><input class={inputBase} name="company" /></label>
          <label class="block"><span class={labelBase}>Teléfono</span><input class={inputBase} name="phone" /></label>
        </div>
        <label class="block"><span class={labelBase}>Sobre qué quieres hablar</span>
          <select class={inputBase} name="pillar">
            <option value="general">No estoy seguro</option>
            <option value="centralita">Centralita</option>
            <option value="agents">Agents & Bots</option>
            <option value="crm">CRM</option>
            <option value="partner">Programa partner</option>
          </select>
        </label>
        <label class="block"><span class={labelBase}>Mensaje*</span><textarea class={inputBase} name="message" rows={4} required></textarea></label>
        <label class="flex items-start gap-2 text-[13px] text-muted">
          <input type="checkbox" name="consent" required class="mt-1" />
          <span>He leído la <a class="text-navy underline" href="/legal/privacidad">política de privacidad</a> y acepto el tratamiento de mis datos para recibir respuesta.</span>
        </label>
        <div id="cf-turnstile"></div>
        <button type="submit" disabled={status() === 'loading' || !token()} class="w-full bg-navy text-white font-semibold rounded-lg py-3 disabled:opacity-50">
          {status() === 'loading' ? 'Enviando…' : 'Enviar'}
        </button>
        <Show when={status() === 'error'}>
          <p class="text-sm text-red-600">No se pudo enviar ({errorMsg()}). Prueba por WhatsApp o email.</p>
        </Show>
      </form>
    </Show>
  );
}
```

- [ ] **Step 2: Wire the island in `apps/web/src/pages/contacto.astro`**

Replace the placeholder `<div id="contact-form-island">` with:

```astro
<ContactForm client:load siteKey={import.meta.env.PUBLIC_TURNSTILE_SITE_KEY} />
```

And add the import at the top of the frontmatter:

```astro
import ContactForm from '../components/forms/ContactForm.tsx';
```

- [ ] **Step 3: Build and run dev to manually test the form (without real Turnstile keys: skip submission)**

```bash
pnpm --filter web build
pnpm dev
```

Open `/contacto`, see form rendered. Without Turnstile keys configured locally, the submit button stays disabled — that is expected.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/forms apps/web/src/pages/contacto.astro
git commit -m "feat(web): contact form solid island wired to api"
```

---

## Sprint G — SEO & polish

### Task 34: Sitemap and robots

**Files:**
- Modify: `apps/web/astro.config.mjs` (sitemap already integrated in Task 4)
- Create: `apps/web/public/robots.txt`

- [ ] **Step 1: Verify sitemap config in `astro.config.mjs` includes `i18n`**

Replace the `sitemap()` integration call with:

```js
sitemap({
  i18n: {
    defaultLocale: 'es',
    locales: { es: 'es-ES', ca: 'ca-ES' },
  },
}),
```

- [ ] **Step 2: Create `apps/web/public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://triaclaw.com/sitemap-index.xml
```

- [ ] **Step 3: Build and verify**

```bash
pnpm --filter web build
```

Expected: `dist/sitemap-index.xml` and `dist/sitemap-0.xml` generated. `robots.txt` copied to `dist/`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/astro.config.mjs apps/web/public/robots.txt
git commit -m "feat(web): sitemap with i18n + robots"
```

---

### Task 35: JSON-LD Organization

**Files:**
- Create: `apps/web/src/components/layout/JsonLd.astro`
- Modify: `apps/web/src/layouts/Base.astro`

- [ ] **Step 1: Create `JsonLd.astro`**

```astro
---
const data = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TriaClaw',
  url: 'https://triaclaw.com',
  logo: 'https://triaclaw.com/logo.png',
  email: 'hola@triaclaw.com',
  telephone: '+34665954108',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lleida',
    addressRegion: 'Catalunya',
    addressCountry: 'ES',
  },
  sameAs: [],
};
---
<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

- [ ] **Step 2: Add `<JsonLd />` to `Base.astro` `<head>`**

In `apps/web/src/layouts/Base.astro`, just before `</head>`:

```astro
<JsonLd />
```

And import at top of frontmatter:

```astro
import JsonLd from '../components/layout/JsonLd.astro';
```

- [ ] **Step 3: Build and view-source `dist/index.html` to confirm JSON-LD present**

```bash
pnpm --filter web build
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/layout/JsonLd.astro apps/web/src/layouts/Base.astro
git commit -m "feat(web): json-ld organization schema"
```

---

### Task 36: Favicon, OG image, logo placeholders

**Files:**
- Create: `apps/web/public/favicon.svg` (replace minimal Astro one)
- Create: `apps/web/public/logo.png` (real logo from user)
- Create: `apps/web/public/og-default.png`
- Create: `apps/web/public/logos/ireparo.svg`
- Create: `apps/web/public/logos/falcon.svg`
- Create: `apps/web/public/logos/ilercasa.svg`

- [ ] **Step 1: Copy existing TriaClaw logo to `apps/web/public/logo.png`**

```bash
cp "C:/Users/Edgar/Documents/triaclaw_logo_opcion_6_robot.png" "C:/Users/Edgar/TriaClaw-Solutions/apps/web/public/logo.png"
```

- [ ] **Step 2: Create `apps/web/public/favicon.svg` (mark + cyan accent)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#0F2A5C"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="52" height="52" rx="14" fill="url(#g)"/>
  <circle cx="24" cy="32" r="4" fill="#fff"/>
  <circle cx="40" cy="32" r="4" fill="#fff"/>
  <line x1="32" y1="6" x2="32" y2="14" stroke="#22D3EE" stroke-width="3"/>
  <circle cx="32" cy="6" r="3" fill="#22D3EE"/>
</svg>
```

- [ ] **Step 3: Create OG default — placeholder SVG that we render to PNG later**

For v1, ship a simple SVG as `og-default.png` is required as PNG. Use the favicon at 1200x630 generated by an image script:

Add `apps/web/scripts/build-og.mjs`:

```js
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const svg = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#0F2A5C"/>
      <stop offset="0.5" stop-color="#1E40AF"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="80" y="280" font-family="sans-serif" font-weight="800" font-size="86" fill="#fff">TriaClaw</text>
  <text x="80" y="370" font-family="sans-serif" font-weight="300" font-size="48" fill="#cffafe">Centralita · Agents · CRM</text>
  <text x="80" y="540" font-family="sans-serif" font-size="28" fill="#fff" opacity="0.7">triaclaw.com</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync('apps/web/public/og-default.png', png);
console.log('OG written');
```

Install sharp and run:

```bash
pnpm --filter web add -D sharp
node apps/web/scripts/build-og.mjs
```

- [ ] **Step 4: Create simple text-based SVG logos for clients in `apps/web/public/logos/`**

`ireparo.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><text x="100" y="40" font-family="sans-serif" font-weight="800" font-size="32" text-anchor="middle" fill="#0F2A5C">iReparo</text></svg>
```

`falcon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><text x="100" y="40" font-family="sans-serif" font-style="italic" font-weight="700" font-size="28" text-anchor="middle" fill="#0F2A5C">Falcon Cat</text></svg>
```

`ilercasa.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><text x="100" y="40" font-family="sans-serif" font-weight="800" font-size="30" text-anchor="middle" fill="#0F2A5C">Ilercasa</text></svg>
```

(These are placeholders until the real client logos are received and dropped in.)

- [ ] **Step 5: Commit**

```bash
git add apps/web/public apps/web/scripts apps/web/package.json pnpm-lock.yaml
git commit -m "feat(web): favicon, og image, client logo placeholders"
```

---

### Task 37: Lighthouse + a11y polish pass

**Files:** none new — just verifications and small fixes.

- [ ] **Step 1: Run production preview**

```bash
pnpm --filter web build
pnpm --filter web preview
```

- [ ] **Step 2: Run Lighthouse mobile on `/`, `/centralita`, `/contacto`**

Open Chrome DevTools → Lighthouse → Mobile → Performance + Accessibility + Best Practices + SEO.

Target: Performance ≥ 95, Accessibility ≥ 95, SEO = 100.

- [ ] **Step 3: Fix any failures inline**

Likely fixes (apply only if Lighthouse flags them):
- Add `loading="lazy"` to non-hero images.
- Add `alt=""` to decorative SVGs (or `aria-hidden="true"`).
- Replace any `<a>` without text with one that has `aria-label`.
- Add `font-display: swap` if Geist isn't already swapping.

- [ ] **Step 4: Re-run Lighthouse to confirm**

- [ ] **Step 5: Commit any fixes**

```bash
git add apps/web
git commit -m "perf(web): lighthouse polish pass"
```

---

## Sprint H — Català translation

### Task 38: Mirror page tree under `/ca/`

**Files:**
- Create: `apps/web/src/pages/ca/index.astro`
- Create: `apps/web/src/pages/ca/centralita.astro`
- Create: `apps/web/src/pages/ca/agents.astro`
- Create: `apps/web/src/pages/ca/crm.astro`
- Create: `apps/web/src/pages/ca/precios.astro`
- Create: `apps/web/src/pages/ca/sobre.astro`
- Create: `apps/web/src/pages/ca/partners.astro`
- Create: `apps/web/src/pages/ca/contacto.astro`
- Create: `apps/web/src/pages/ca/casos/index.astro`
- Create: `apps/web/src/pages/ca/casos/[slug].astro`
- Create: `apps/web/src/pages/ca/legal/aviso.astro`
- Create: `apps/web/src/pages/ca/legal/privacidad.astro`
- Create: `apps/web/src/pages/ca/legal/cookies.astro`

- [ ] **Step 1: For each ES page, create the CA equivalent**

The components already pick up locale from URL (`getLocaleFromUrl`), so the CA pages can simply import the same sections. The ES strings inside literal text are the only thing that needs translating. For brevity, the simplest pattern: each `/ca/foo.astro` re-uses the same component composition as `/foo.astro` and overrides hard-coded strings via Astro props or local consts.

Example for `apps/web/src/pages/ca/index.astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import Hero from '../../components/sections/Hero.astro';
import LogoBar from '../../components/sections/LogoBar.astro';
import Pillars from '../../components/sections/Pillars.astro';
import ConnectedFlow from '../../components/sections/ConnectedFlow.astro';
import FeaturedCase from '../../components/sections/FeaturedCase.astro';
import PricingTeaser from '../../components/sections/PricingTeaser.astro';
import Testimonials from '../../components/sections/Testimonials.astro';
import CTAFinal from '../../components/sections/CTAFinal.astro';
import WhatsAppFloat from '../../components/sections/WhatsAppFloat.astro';
---
<Base title="TriaClaw · Tria el teu agent" description="Centraleta, bots i CRM integrats de fàbrica.">
  <Hero />
  <LogoBar />
  <Pillars />
  <ConnectedFlow />
  <FeaturedCase />
  <PricingTeaser />
  <Testimonials />
  <CTAFinal />
  <WhatsAppFloat />
</Base>
```

(Sections already use `t(locale, ...)` for headings/leads where i18n was applied; for components that still have hard-coded ES strings — Pillars, ConnectedFlow, FeaturedCase, Testimonials, CTAFinal — add a `lang` prop and switch on it, OR move the strings into `i18n/{es,ca}.json` and use `t()`. Pick one approach consistently.)

**Concrete rule for the agent executing:** for each section component that contains literal Spanish strings, either:
1. Move those strings to `i18n/es.json` and add the català version to `i18n/ca.json`, then use `t(locale, '<key>')` in the component, OR
2. Accept a `lang` prop and inline a small `lang === 'ca' ? '…' : '…'` ternary.

Choose option 1 for sections with ≥3 strings; option 2 otherwise.

- [ ] **Step 2: Build and verify the locale picker swaps URL prefix**

```bash
pnpm --filter web build
pnpm --filter web preview
```

Visit `/ca/`. Header nav links use `/ca/...`. ES toggle goes to `/`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/pages/ca apps/web/src/i18n apps/web/src/components
git commit -m "feat(web): català translation under /ca prefix"
```

---

### Task 39: Native català review pass

**Files:** modify any `i18n/ca.json` keys flagged by review.

- [ ] **Step 1: Read full `apps/web/src/i18n/ca.json` aloud**

Verify natural català (not direct word-by-word translation from castellano). Common pitfalls: false friends, gendered articles, verbal agreement.

- [ ] **Step 2: If a native català speaker is available, ask for a 15-minute review pass**

Apply corrections and update the JSON.

- [ ] **Step 3: Run dev and recheck `/ca/` pages**

```bash
pnpm dev
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/i18n/ca.json
git commit -m "i18n(ca): native review pass"
```

---

### Task 40: hreflang on every page

**Files:**
- Modify: `apps/web/src/layouts/Base.astro`

- [ ] **Step 1: Add hreflang link tags in `Base.astro` `<head>`**

Insert before `<JsonLd />`:

```astro
{(() => {
  const path = Astro.url.pathname.replace(/^\/ca\//, '/').replace(/^\/ca$/, '/');
  const esUrl = new URL(path, import.meta.env.PUBLIC_SITE_URL).toString();
  const caUrl = new URL(`/ca${path === '/' ? '' : path}`, import.meta.env.PUBLIC_SITE_URL).toString();
  return (
    <>
      <link rel="alternate" hreflang="es-ES" href={esUrl} />
      <link rel="alternate" hreflang="ca-ES" href={caUrl} />
      <link rel="alternate" hreflang="x-default" href={esUrl} />
    </>
  );
})()}
```

- [ ] **Step 2: Build and view-source one ES page and one CA page to confirm hreflang pairs are correct**

```bash
pnpm --filter web build
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/layouts/Base.astro
git commit -m "seo(web): hreflang for es and ca"
```

---

## Sprint I — Deploy & DNS

### Task 41: Vercel link and project config

**Files:** no repo changes; this is a Vercel CLI flow. Document commands and outcomes.

- [ ] **Step 1: Install Vercel CLI globally if not present**

```bash
pnpm add -g vercel
```

- [ ] **Step 2: Link the repo to a Vercel project**

```bash
cd C:/Users/Edgar/TriaClaw-Solutions/apps/web
vercel link
```

Choose the team scope, choose `Create new project`, name it `triaclaw`. When asked about root directory, accept the current `apps/web`.

- [ ] **Step 3: Configure env vars in Vercel dashboard**

Navigate to Project → Settings → Environment Variables. Add for **Production** and **Preview**:

```
RESEND_API_KEY=<resend prod key>
CONTACT_EMAIL_TO=hola@triaclaw.com
TURNSTILE_SECRET=<cf turnstile secret>
PUBLIC_TURNSTILE_SITE_KEY=<cf turnstile site key>
PUBLIC_WHATSAPP_NUMBER=34665954108
PUBLIC_CALENDLY_URL=
PUBLIC_SITE_URL=https://triaclaw.com
```

- [ ] **Step 4: Trigger a preview deploy from CLI to validate the project compiles in Vercel**

```bash
vercel
```

Expected: a preview URL like `triaclaw-<hash>.vercel.app`.

- [ ] **Step 5: Open the preview URL and smoke-test home + one pillar + /contacto**

---

### Task 42: Custom domain + Nominalia DNS

**Files:** none — DNS panel work.

- [ ] **Step 1: In Vercel, add custom domains**

Project → Settings → Domains → Add `triaclaw.com` and `www.triaclaw.com`.

Vercel shows the required DNS records. Copy them.

- [ ] **Step 2: In Nominalia control panel, edit DNS for `triaclaw.com`**

Replace the default records with:

- `A` apex `@` → `76.76.21.21` (or whatever IP Vercel returns)
- `CNAME` `www` → `cname.vercel-dns.com`

If Nominalia ships hosting with the domain, ensure DNS is set to "personalizados" (custom) so the hosting's records do not override these.

- [ ] **Step 3: Wait for DNS propagation (5–60 min)**

Verify with:

```bash
nslookup triaclaw.com
nslookup www.triaclaw.com
```

Expected: both resolve to Vercel.

- [ ] **Step 4: In Vercel, verify the domains turn green and SSL is issued**

---

### Task 43: Resend domain verification + buzón email

**Files:** none — Resend dashboard + Nominalia DNS.

- [ ] **Step 1: In Resend dashboard, add `triaclaw.com` as a sending domain**

Resend gives you a set of TXT/CNAME records (DKIM, SPF, return-path).

- [ ] **Step 2: Add those records in Nominalia DNS**

- [ ] **Step 3: Wait for verification, then in Resend the domain turns "Verified"**

- [ ] **Step 4: Create the `hola@triaclaw.com` mailbox**

Either in Nominalia (if their domain plan includes email) or via Hostinger Email plan if you prefer to consolidate. Add the corresponding `MX` records in Nominalia DNS.

- [ ] **Step 5: Send a real submission from the live form**

Visit `https://triaclaw.com/contacto`, fill the form, submit. Check that `hola@triaclaw.com` receives the email.

---

### Task 44: Smoke test and pre-go-live checklist

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Run the full pre-go-live checklist from the spec**

Verify each item:
- Razón social, NIF, domicilio fiscal en `/legal/aviso` (no PLACEHOLDER).
- Logos clientes presentes en `/public/logos/`.
- Métricas reales en caso iReparo (sustituidas — o validadas como aceptables).
- Testimonios validados.
- Pricing definitivo.
- Buzón `hola@triaclaw.com` recibe.
- Resend dominio verificado.
- DNS y SSL OK.
- Lighthouse mobile ≥ 95.
- WCAG AA verificado (axe DevTools).
- Traducción CA revisada.

- [ ] **Step 2: Replace `README.md` with a useful README**

```markdown
# TriaClaw Solutions

Marketing site for TriaClaw — centralita virtual, agents/bots y CRMs verticales unificados.

## Stack

- Astro 5 · Tailwind 4 · Solid · TypeScript · Geist
- Vercel (hosting) · Nominalia (DNS) · Resend (transactional email) · Cloudflare Turnstile

## Local dev

```bash
pnpm install
cp apps/web/.env.example apps/web/.env
pnpm dev
```

## Deploy

`main` → production via Vercel. PR branches → preview deploys.

## Docs

- [Spec](docs/superpowers/specs/2026-05-06-triaclaw-website-design.md)
- [Implementation plan](docs/superpowers/plans/2026-05-06-triaclaw-website-implementation.md)
```

- [ ] **Step 3: Commit and push**

```bash
git add README.md
git commit -m "docs: project readme"
git push origin main
```

- [ ] **Step 4: Tag the go-live**

```bash
git tag -a v1.0.0 -m "TriaClaw site go-live"
git push origin v1.0.0
```

---

## Self-review (post-plan check)

- [x] **Spec coverage:** every section of the spec has at least one task.
  - § 4 Sitemap → Tasks 8 (header/footer nav), 19 (home wiring), 20–28 (pages).
  - § 5 Layout home → Tasks 12–19.
  - § 6 Sistema diseño → Tasks 3, 9–11.
  - § 7 Arquitectura → Tasks 1–7.
  - § 8 Deploy → Tasks 41–44.
  - § 9 Pricing → Tasks 17, 20–22, 25.
  - § 10 Casos → Tasks 23, 24.
  - § 11 Legal → Task 29.
  - § 12 SEO → Tasks 34, 35, 40.
  - § 13 Performance → Task 37.
  - § 14 A11y → Task 37.
  - § 15 Roadmap → matches Sprint A–I.
  - § 16 Out-of-scope → no tasks (correct).
  - § 17 Pre-go-live checklist → Task 44.
- [x] **Placeholder scan:** the only "PLACEHOLDER" references are in `legal/aviso.astro` and `legal/privacidad.astro` for fiscal data that the spec explicitly defers to before-go-live confirmation. These are explicit in the pre-go-live checklist. Other steps contain real code.
- [x] **Type consistency:** `ContactInput` from `contact-schema.ts` is consumed correctly in `mailer.ts` and `api/contact.ts`. `Locale` type is exported from `i18n/index.ts` and used consistently. `pillar` enum aligned across schema, form select, and email subject.

---

## Execution handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-06-triaclaw-website-implementation.md`.** Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

2. **Inline Execution** — Execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

**Which approach?**
