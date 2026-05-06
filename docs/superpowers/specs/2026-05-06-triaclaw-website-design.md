# TriaClaw Website — Design Spec

- **Date:** 2026-05-06
- **Owner:** Edgar (iReparo)
- **Repo:** [ireparo/TriaClaw-Solutions](https://github.com/ireparo/TriaClaw-Solutions)
- **Domain:** triaclaw.com (registrado en Nominalia)
- **Status:** Approved — ready for implementation plan

## 1. Resumen

TriaClaw.com es la web corporativa que unifica los servicios que iReparo ya construye (centralita virtual, agentes/bots IA, CRMs verticales) bajo una misma marca y discurso. La tesis del producto es la **integración entre los tres pilares**: una llamada se convierte en ficha CRM, un WhatsApp en ticket, un bot agenda en el calendario de la centralita — sin Zapier, sin pegar APIs.

La web es **marketing + lead-gen** en fase 1 (no área cliente). Tiene dos puertas: pyme local (España, ES + CA) y partners/integradores. La parte logueada (`app.triaclaw.com`) queda fuera del alcance de esta spec y se construirá como proyecto separado cuando convenga.

## 2. Objetivos

1. Posicionar TriaClaw como marca paraguas de los servicios de iReparo, con identidad propia.
2. Captar leads de pymes y autónomos por **WhatsApp**, **formulario** y, cuando exista, **Calendly**.
3. Demostrar credibilidad con **casos reales**: iReparo, Falcon Cat, Ilercasa, comercializadora de energía (anónimo).
4. Servir de puerta de entrada para **partners** que quieran revender o integrar TriaClaw.
5. Estar lista para crecer: i18n preparado para inglés, monorepo preparado para `apps/app`.

## 3. Audiencia y proposición

- **Audiencia A (foco principal):** pymes y autónomos en Catalunya y España — taller, asesoría, inmobiliaria, energía. Tono cercano, ejemplos reales, sin jerga corporate.
- **Audiencia B (segundaria):** integradores y partners. Sección `/partners` específica. Sin docs API públicas en fase 1.

**Tagline (T1):** *"Tria el teu agent. Centralita, bots i CRM que parlen entre ells."*
**Versión castellano:** *"Elige tu agente. Centralita, bots y CRM que hablan entre ellos."*

**Tono:** profesional cercano, directo, sin jerga corporativa. Tutea ("te ayudamos"), frases cortas, claim concreto en lugar de promesas vacías. Pyme local: ejemplos reales (taller, asesoría, energía), no "transformación digital". Developer-friendly cuando toca, sin volverse Silicon Valley.

## 4. Sitemap e IA

```
triaclaw.com
│
├─ /                              Home
│
├─ /centralita                    Pilar 1
├─ /agents                        Pilar 2
├─ /crm                           Pilar 3
│
├─ /precios                       Tabla unificada
├─ /casos                         Index
│   └─ /casos/[slug]              Caso extendido
├─ /partners                      Programa de partners
├─ /sobre                         Equipo / misión
├─ /contacto                      WhatsApp + form + Calendly (cuando exista)
│
├─ /legal/aviso-legal
├─ /legal/privacidad
├─ /legal/cookies
│
└─ /ca/...                        Mismo árbol bajo prefijo català
```

**Decisiones clave:**

- Castellano = ruta sin prefijo (`triaclaw.com/centralita`); català = `/ca/centralita`.
- Selector ES/CA en el header, persistencia con cookie/localStorage.
- Tres pilares al mismo nivel jerárquico (no anidados bajo `/productos`) — refuerza que son tres puertas iguales.
- `/precios` además de los planes en cada pilar — el cliente puede comparar rápido.
- `/partners` separado de `/sobre` (público distinto, copy distinto).

**Header:** logo · `Centralita · Agents · CRM | Precios · Casos | Partners · Contacto` · selector ES/CA · CTA "WhatsApp".

**Footer:** 4 columnas (Producto · Empresa · Legal · Contacto) + repetición del logo + "Una marca de iReparo".

## 5. Layout del Home

9 bloques verticales, en este orden:

1. **Header** — logo + nav + ES/CA + CTA WhatsApp.
2. **Hero** — gradient navy→royal→cyan + tagline T1 (CA) + lead castellano + 2 CTAs (WhatsApp / Pedir demo) + meta-bullets ("Sin permanencia · Setup en 7 días · RGPD-compliant") + robot SVG con pulse.
3. **Banda de logos** (`LogoBar`) — iReparo · Falcon Cat · Ilercasa · "Comercializadora energía".
4. **Tres pilares** (`Pillars`) — 3 cards con borde superior coloreado (Navy / Cyan / Teal según esquema B) + ícono + título + descripción + 3 bullets + link "Ver →".
5. **Tres productos que hablan entre ellos** (`ConnectedFlow`) — bloque oscuro con flow de 4 nodos: Llamada entrante → Bot pre-cualifica → Lead en CRM → Humano cierra.
6. **Caso destacado iReparo** (`FeaturedCase`) — quote + texto + 3 métricas (`-78%` perdidas, `+34%` leads cualificados, `3h/día` menos admin) + arte mockup dashboard + link a caso completo.
7. **Pricing teaser** — eyebrow + título + lead + 3 chips (Centralita 29 €, Agents 49 €, CRM 39 €/usuario) + CTA tabla completa.
8. **Testimonios** — grid de 3 quotes (placeholders, redactados como borrador, validados con cliente antes del go-live).
9. **CTA final** + **Footer** + **botón WhatsApp flotante**.

## 6. Sistema de diseño

### 6.1 Paleta

| Token | Hex | Uso |
|---|---|---|
| `--navy` | `#0F2A5C` | Color de marca primario, headings, botón principal, pilar Centralita |
| `--navy-2` | `#1E40AF` | Step intermedio del gradient |
| `--cyan` | `#22D3EE` | Acento de marca, CTAs sobre fondo oscuro, pilar Agents |
| `--teal` | `#14B8A6` | Pilar CRM |
| `--whatsapp` | `#25D366` | Botón WhatsApp (color marca WA) |
| `--bg` | `#F8FAFC` | Fondo de secciones intercaladas |
| `--ink` | `#0F172A` | Texto primario |
| `--muted` | `#475569` | Texto secundario |
| `--line` | `#E2E8F0` | Bordes |
| `--gradient-brand` | `linear-gradient(135deg, var(--navy), var(--cyan))` | Hero, CTA final, marca |

### 6.2 Tipografía

- **Display + Body:** Geist Sans (300/400/500/600/700/800), vía `@vercel/font` o paquete `geist`.
- **Mono:** Geist Mono (cuando toque snippets, ej. en `/partners`).
- Una sola familia → menos JS de fonts, mejor LCP.

### 6.3 Tokens base

- **Espaciado:** múltiplos de 4 (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96).
- **Radios:** 4 / 8 / 12 / 16. Cards = 12. Pildoras/chips = 999.
- **Sombras:** 3 niveles con tinte navy (`rgba(15,42,92,…)`):
  - sm: `0 1px 2px rgba(15,42,92,.06)`
  - md: `0 4px 12px rgba(15,42,92,.08)`
  - lg: `0 12px 32px rgba(15,42,92,.14)`

### 6.4 Componentes

| Componente | Variantes |
|---|---|
| `Button` | `primary-navy`, `primary-cyan`, `outline`, `ghost`, `whatsapp` |
| `Card` | `default`, `pillar-navy`, `pillar-cyan`, `pillar-teal` |
| `PricingCard` | `default`, `highlighted` (con borde cyan + badge "RECOMENDADO"), `dark` (custom) |
| `Testimonial` | quote + avatar + nombre + cargo |
| `FAQ` | accordion (1 abierto a la vez) |
| `Input`, `Textarea`, `Checkbox` | base + estados focus/error |
| `LangSwitch` | toggle ES/CA |
| `LogoBar` | banda de logos clientes |
| `ConnectedFlow` | flow horizontal con nodos + flechas |
| `Metric` | número grande + label |
| `WhatsAppFloat` | botón flotante esquina inferior derecha |

## 7. Arquitectura técnica

### 7.1 Stack

- **Framework:** Astro 5 + Tailwind 4.
- **Adapter:** `@astrojs/vercel` (SSR para `/api/contact`, resto estático).
- **Componentes interactivos (islas):** Solid (`@astrojs/solid-js`) — bundle más pequeño que React, suficiente para los formularios y toggles. Solo se hidrata lo que lo necesita.
- **i18n:** Astro 5 nativo (`i18n.routing`). Default `es`, locale extra `ca` bajo `/ca/...`. Estructura preparada para añadir `en` sin reescribir.
- **Contenido (casos, testimonios, FAQs):** Markdown + Content Collections (type-safe).
- **CMS:** ninguno en v1. Si crece → Decap CMS.

### 7.2 Estructura de carpetas

```
TriaClaw-Solutions/
├─ apps/
│  └─ web/
│     ├─ astro.config.mjs
│     ├─ tailwind.config.mjs
│     ├─ src/
│     │  ├─ components/
│     │  │  ├─ layout/        # Header, Footer, LangSwitch, Container
│     │  │  ├─ ui/            # Button, Card, Input, Accordion, PricingCard, Testimonial, FAQ
│     │  │  ├─ sections/      # Hero, LogoBar, Pillars, ConnectedFlow, FeaturedCase,
│     │  │  │                 # PricingTeaser, Testimonials, CTAFinal
│     │  │  └─ forms/         # ContactForm (island)
│     │  ├─ content/
│     │  │  ├─ cases/         # iReparo.md, falcon.md, ilercasa.md, energia.md
│     │  │  └─ testimonials/  # JSON
│     │  ├─ i18n/
│     │  │  ├─ es.json
│     │  │  └─ ca.json
│     │  ├─ pages/
│     │  │  ├─ index.astro
│     │  │  ├─ centralita.astro
│     │  │  ├─ agents.astro
│     │  │  ├─ crm.astro
│     │  │  ├─ precios.astro
│     │  │  ├─ casos/index.astro
│     │  │  ├─ casos/[slug].astro
│     │  │  ├─ partners.astro
│     │  │  ├─ sobre.astro
│     │  │  ├─ contacto.astro
│     │  │  ├─ legal/aviso.astro
│     │  │  ├─ legal/privacidad.astro
│     │  │  ├─ legal/cookies.astro
│     │  │  ├─ api/contact.ts
│     │  │  └─ ca/...
│     │  ├─ lib/
│     │  │  ├─ seo.ts
│     │  │  ├─ analytics.ts
│     │  │  └─ mailer.ts
│     │  └─ styles/global.css
│     └─ public/
│        ├─ logo.svg
│        ├─ logo.png
│        ├─ og-default.png
│        └─ favicon/...
│
├─ docs/
│  └─ superpowers/specs/2026-05-06-triaclaw-website-design.md
├─ .gitignore
├─ .nvmrc                  # Node 20
├─ package.json
├─ pnpm-workspace.yaml     # apps/*
├─ vercel.json
└─ README.md
```

### 7.3 Integraciones

| Pieza | Servicio | Notas |
|---|---|---|
| Email transaccional (formulario) | Resend (gratis hasta 3k/mes) | Verificar dominio `triaclaw.com` con DKIM/SPF/DMARC en Nominalia DNS |
| Anti-spam | Cloudflare Turnstile | Sin cookies, RGPD-friendly |
| WhatsApp | Link `wa.me` | Número `34665954108`, sin SDK |
| Calendly | Embed | URL en `PUBLIC_CALENDLY_URL`. Si vacía → CTA oculto. *Pendiente crear cuenta Cal.com.* |
| Analytics | Vercel Analytics | Privacy-friendly. Opcional Plausible si crece. |
| SEO | `@astrojs/sitemap` + JSON-LD Organization + OG por página | Sitemap incluye locales |
| Imágenes | `astro:assets` | WebP/AVIF |
| Cookies | Banner solo si añadimos Calendly o tracking no esencial | En v1 sin Calendly: no banner |

### 7.4 Variables de entorno

```
RESEND_API_KEY=...
CONTACT_EMAIL_TO=hola@triaclaw.com
TURNSTILE_SECRET=...
PUBLIC_TURNSTILE_SITE_KEY=...
PUBLIC_WHATSAPP_NUMBER=34665954108
PUBLIC_CALENDLY_URL=
```

### 7.5 Endpoint `/api/contact`

- Método: POST.
- Validación server-side: nombre, email, mensaje, consentimiento RGPD.
- Honeypot + Turnstile.
- Rate-limit por IP (50/h).
- Envía email vía Resend a `hola@triaclaw.com` desde `noreply@triaclaw.com`.
- Responde JSON `{ ok: true }` o error con código.

## 8. Deploy y operación

### 8.1 Proveedor

**Vercel** (plan Hobby, gratis). Nominalia solo como registrador y DNS.

### 8.2 Setup inicial

1. `vercel link` desde `apps/web/`. Root: `apps/web`. Framework: Astro.
2. Añadir dominios `triaclaw.com` + `www.triaclaw.com` en Vercel.
3. En Nominalia DNS:
   - `A` apex `@` → IP de Vercel.
   - `CNAME` `www` → `cname.vercel-dns.com`.
   - Si Nominalia incluye hosting por defecto, asegurarse de que sus registros DNS no machaquen los nuevos (en su panel hay que poner DNS "personalizados" en lugar de los del hosting Nominalia).
4. Crear buzón `hola@triaclaw.com` (Nominalia o Hostinger Email). Configurar `MX` en Nominalia DNS.
5. Cuenta Resend → verificar dominio (DKIM/SPF/DMARC en Nominalia).
6. Cloudflare Turnstile → claves a env vars de Vercel.

### 8.3 Pipeline

- `git push origin main` → producción.
- Cada PR → preview deploy con URL única.
- Sin estado propio (sin DB en v1).

### 8.4 Operación

| Acción | Cómo |
|---|---|
| Cambiar copy | Editar archivo MD/Astro → push |
| Añadir caso | `src/content/cases/<slug>.md` |
| Añadir testimonio | `src/content/testimonials/index.json` |
| Cambiar precios | Editar archivo de pricing |
| Ver leads | `hola@triaclaw.com` (form) o WhatsApp `665954108` |
| Ver tráfico | Vercel Analytics |

### 8.5 Coste estimado v1

| Servicio | Plan | €/mes |
|---|---|---|
| Vercel Hobby | gratis | 0 |
| Nominalia (renovación dominio) | anual ~12 €/año | ~1 |
| Email buzón Nominalia | depende del plan | 0–3 |
| Resend | gratis hasta 3k/mes | 0 |
| Turnstile | gratis | 0 |
| **Total** | | **~1–4 €/mes** |

## 9. Pricing orientativo (placeholder en la web, validar antes del go-live)

| Pilar | Plan entrada | Plan pro | Custom |
|---|---|---|---|
| Centralita | desde 29 €/mes (1 número, IVR básico, 2 ext.) | desde 89 €/mes (multi-ext., grabación, panel) | a medida |
| Agents/Bots | desde 49 €/mes (1 bot WhatsApp con plantillas) | desde 149 €/mes (agente IA + integración CRM) | a medida |
| CRM | desde 39 €/usuario/mes (vertical estándar) | a medida (vertical custom: SAT, energía, inmo) | a medida |

**Bonificaciones:** combinando 2 pilares → −15%. Setup incluido en planes Pro. IVA no incluido.

## 10. Casos a usar en `/casos`

| Cliente | Uso permitido | Pilar(es) | Notas |
|---|---|---|---|
| iReparo | Logo + nombre, **caso destacado** | Centralita + Agents + CRM SAT | Pieza estrella, métricas reales a confirmar (placeholders -78% / +34% / 3 h) |
| Falcon Cat | Logo + nombre | CRM gestión proyectos | Testimonio borrador a validar con cliente |
| Ilercasa Asesoria | Logo + nombre | CRM inmobiliaria + asesoría | Testimonio borrador a validar |
| Comercializadora energía | **Anónimo** ("una comercializadora de luz/gas") | CRM Energía | Sin logo. Si el cliente real autoriza después, se actualiza |

**No se usa:** Lo Porró Carrincló, Mis Tesoros (fuera del scope de TriaClaw como producto).

**Testimonios:** redacto borradores en placeholder, se validan con cada cliente antes del go-live.

## 11. Datos legales y contacto

- **Entidad responsable:** iReparo (TriaClaw es marca/línea de servicio). *Razón social fiscal completa, NIF y domicilio: a confirmar antes del go-live.*
- **Email contacto:** `hola@triaclaw.com` (crear buzón en Nominalia).
- **WhatsApp:** `+34 665 95 41 08`.
- **Calendly:** pendiente de crear cuenta (Cal.com). Botón demo oculto hasta que exista URL.
- **RGPD:** templates de aviso legal / privacidad / cookies con datos de iReparo. Banner cookies solo si se añade Calendly o tracking no esencial; en v1 con solo Vercel Analytics no hace falta.

## 12. SEO

- Sitemap XML automático con i18n (`@astrojs/sitemap`).
- `robots.txt` permitiendo todo.
- `<title>` y `<meta description>` por página, hreflang ES/CA.
- Open Graph image por defecto + por caso.
- JSON-LD `Organization` con iReparo + URL + sameAs (LinkedIn, etc., cuando existan).
- URLs estables y semánticas.

## 13. Performance targets

- LCP < 2.0 s en conexión Slow 4G simulada (Lighthouse mobile).
- CLS < 0.05.
- TBT < 100 ms.
- Lighthouse Performance ≥ 95 en mobile.
- Bundle JS first-load < 60 KB gzipped (gracias a Astro y Solid).

## 14. Accesibilidad

- WCAG 2.1 AA como objetivo.
- Contraste verificado en todos los pares (navy/cyan están al límite — usar navy oscuro sobre fondos claros, cyan solo como acento, no como texto sobre blanco).
- Navegación 100% por teclado.
- ARIA labels en botones de icono (WhatsApp, lang switch).
- Skip link al main.
- Focus visible.

## 15. Roadmap

### Fase 1 — MVP marketing site (this spec)

| Sprint | Contenido | Estimado |
|---|---|---|
| A | Foundation: scaffold Astro, tokens, layout, UI base | ~1 día |
| B | Home (todas las secciones) | ~1 día |
| C | Páginas pilar (Centralita, Agents, CRM) | ~1 día |
| D | Páginas secundarias (precios, casos, sobre, partners, contacto, legal) | ~0,5 día |
| E | Forms + integraciones (Resend, Turnstile, WhatsApp) | ~0,5 día |
| F | SEO, OG, sitemap, polish, audit | ~0,5 día |
| G | Traducción CA | ~0,5 día |
| H | Deploy + DNS + smoke test | ~0,5 día |
| **Total** | | **~5–6 días** |

### Fase 2 — Después del go-live

- Recoger feedback de 3-5 personas, iterar.
- Activar Calendly (`PUBLIC_CALENDLY_URL`).
- Casos extendidos Falcon y Ilercasa con métricas reales.
- Activar locale `en` cuando el tráfico lo justifique.
- `apps/app` Next.js en `app.triaclaw.com` (otra spec).
- Si abre API pública → `/developers` con docs (Starlight Astro).

## 16. Out of scope (explícito)

- Área cliente / login / facturación → `app.triaclaw.com` futuro, otra spec.
- API pública con docs `/developers` → fase 2.
- Blog / SEO content → fase 2 si se justifica.
- E-commerce o checkout self-service → no.
- Inglés → preparado en código, sin copy en v1.
- Lo Porró Carrincló y Mis Tesoros como casos → fuera.

## 17. Pre-go-live checklist

- [ ] Razón social, NIF y domicilio fiscal de iReparo en Aviso legal.
- [ ] Logos de iReparo, Falcon Cat e Ilercasa en `/public/logos/`.
- [ ] Métricas reales del caso iReparo confirmadas (placeholders sustituidos).
- [ ] Testimonios validados por cada cliente.
- [ ] Pricing definitivo confirmado.
- [ ] Buzón `hola@triaclaw.com` creado y testeado.
- [ ] Resend dominio verificado, email del form llega a destino.
- [ ] DNS Nominalia verificado, SSL activo en `triaclaw.com` y `www.triaclaw.com`.
- [ ] Lighthouse mobile ≥ 95.
- [ ] WCAG AA verificado.
- [ ] Traducción CA revisada por hablante nativo.
