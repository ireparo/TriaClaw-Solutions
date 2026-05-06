# TriaClaw Solutions

Marketing site para **TriaClaw** — centralita virtual, agentes/bots IA y CRMs verticales unificados bajo una misma plataforma. Una marca de iReparo.

## Stack

- **Astro 6** + **Tailwind 4** + **Solid** (islas interactivas) + TypeScript
- **Geist** fonts (`@fontsource-variable/geist` + `geist-mono`)
- **Vercel** (hosting + edge + analytics) · **Nominalia** (DNS)
- **Resend** (email transaccional) · **Cloudflare Turnstile** (anti-spam)
- **Vitest** (28 tests pasando)
- ES default + CA en `/ca/...` (i18n nativo Astro)

## Estructura

```
TriaClaw-Solutions/
├─ apps/
│  └─ web/                       # marketing site (Astro)
│     ├─ src/
│     │  ├─ components/          # layout/, ui/, sections/, forms/
│     │  ├─ content/cases/       # casos en Markdown
│     │  ├─ i18n/                # es.json + ca.json + helpers
│     │  ├─ layouts/Base.astro
│     │  ├─ lib/                 # contact-schema, mailer, turnstile
│     │  ├─ pages/               # ES en raíz, CA bajo /ca/
│     │  └─ styles/global.css
│     ├─ scripts/build-og.mjs    # regenera OG default
│     ├─ public/                 # favicon, logos, og
│     └─ vercel.json             # security headers
└─ docs/
   └─ superpowers/
      ├─ specs/2026-05-06-triaclaw-website-design.md
      └─ plans/2026-05-06-triaclaw-website-implementation.md
```

## Local dev

Requiere Node 22+ y pnpm 9+ (corepack lo gestiona). En PCs sin pnpm directo:

```bash
corepack pnpm install
cp apps/web/.env.example apps/web/.env   # primer arranque
corepack pnpm --filter web dev           # http://localhost:4321 (o 4322)
```

Lint + tests:

```bash
corepack pnpm --filter web exec astro check   # type-check
corepack pnpm --filter web test               # vitest run
```

Build local nota: el adaptador Vercel necesita symlinks. En Windows requiere "Developer Mode" activado o admin. Sin eso, el build local falla en el último paso (la web compila igual; CI/Vercel funciona). Para verificar tipo y tests usa `astro check` y `test`.

## Deploy

Producción en Vercel a `main`. Cada PR → preview deploy automático.

Pasos completos en [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Documentación

- [Spec del producto](docs/superpowers/specs/2026-05-06-triaclaw-website-design.md)
- [Plan de implementación](docs/superpowers/plans/2026-05-06-triaclaw-website-implementation.md)
- [Pasada de revisión CA pendiente](docs/ca-review-pending.md)
- [Guía de deploy](docs/DEPLOY.md)
