# Deploy guide — TriaClaw

Pasos para llevar la web de `feat/scaffold-mvp` a producción en `https://triaclaw.com`.

## 0. Pre-requisitos

- Cuenta Vercel (free tier suficiente para v1).
- Acceso al panel de Nominalia con `triaclaw.com`.
- Cuenta Resend (gratis hasta 3.000 emails/mes).
- Cuenta Cloudflare (Turnstile es gratis).
- Buzón `hola@triaclaw.com` (lo creamos en Step 4).

## 1. Vercel project

### 1.1 Linkar el repo

Desde tu PC, instalar Vercel CLI y linkar:

```bash
npm i -g vercel
cd C:/Users/Edgar/TriaClaw-Solutions
vercel link
```

Cuando pregunte:
- **Set up project?** → yes
- **Which scope?** → tu cuenta personal o team
- **Link to existing?** → no
- **Project name?** → `triaclaw`
- **Directory?** → `apps/web` (importante)
- **Detected framework?** → Astro (auto-detectado)
- **Override settings?** → no

Esto crea `apps/web/.vercel/project.json` con el ID del proyecto. Está en `.gitignore`, no se commitea.

### 1.2 Conectar GitHub para auto-deploy

En el dashboard Vercel del proyecto recién creado:
- Settings → Git → Connect → elegir el repo `ireparo/TriaClaw-Solutions`.
- Production branch: `main`.
- Preview branches: todos (default).

Ahora cada push a `main` despliega producción, cada PR despliega preview.

### 1.3 Variables de entorno

En Vercel dashboard → Project → Settings → Environment Variables. Añadir para **Production** y **Preview** (las marcas `PUBLIC_` son las que el browser ve):

| Key | Valor |
|---|---|
| `RESEND_API_KEY` | (obtenerlo en Step 3.1) |
| `CONTACT_EMAIL_TO` | `hola@triaclaw.com` |
| `TURNSTILE_SECRET` | (obtenerlo en Step 5.1) |
| `PUBLIC_TURNSTILE_SITE_KEY` | (obtenerlo en Step 5.1) |
| `PUBLIC_WHATSAPP_NUMBER` | `34665954108` |
| `PUBLIC_CALENDLY_URL` | (vacío hasta crear cuenta Cal.com) |
| `PUBLIC_SITE_URL` | `https://triaclaw.com` |

### 1.4 Primer deploy

Una vez linkado y con las env vars, hacer un primer deploy desde la rama actual para verificar:

```bash
cd C:/Users/Edgar/TriaClaw-Solutions/apps/web
vercel --prod
```

Esto despliega manualmente. Si funciona, ya tienes la URL de Vercel (algo tipo `triaclaw-xyz.vercel.app`). Apuntar el dominio custom es Step 2.

## 2. Custom domain + Nominalia DNS

### 2.1 Añadir dominios en Vercel

Dashboard → Project → Settings → Domains:
- Añadir `triaclaw.com` (apex).
- Añadir `www.triaclaw.com`.

Vercel mostrará los registros DNS que tienes que crear. Suele ser:
- `A` apex `@` → `76.76.21.21`
- `CNAME` `www` → `cname.vercel-dns.com`

### 2.2 Configurar DNS en Nominalia

En el panel Nominalia para `triaclaw.com` → DNS → DNS personalizados (no usar el hosting incluido si lo hay):

- `A` `@` → `76.76.21.21` (TTL default)
- `CNAME` `www` → `cname.vercel-dns.com`

**Importante:** si Nominalia incluye hosting por defecto, asegúrate de que sus registros DNS NO machaquen estos. Pon DNS "personalizados" en lugar de los del hosting.

Esperar 5-60 min de propagación. Comprobar:

```bash
nslookup triaclaw.com
nslookup www.triaclaw.com
```

Cuando ambos resuelvan a IPs de Vercel, en el dashboard Vercel los dominios se marcan en verde y SSL se provisiona automáticamente con Let's Encrypt.

## 3. Resend

### 3.1 Crear cuenta + obtener API key

- Crear cuenta en https://resend.com.
- API Keys → crear una con permiso "Sending access".
- Copiar el valor `re_...` y meterlo en Vercel env var `RESEND_API_KEY`.

### 3.2 Verificar dominio para envío

Resend → Domains → Add Domain → `triaclaw.com`.

Resend te da varios registros DNS (DKIM, SPF, return-path). Hay que añadirlos todos en Nominalia DNS. Cuando los detecta, marca el dominio como Verified.

## 4. Buzón de email

### 4.1 Crear `hola@triaclaw.com`

Opciones:
- **Nominalia hosting** (si tu plan lo incluye) → crear el buzón desde su panel.
- **Hostinger Email** (~3€/mes) → si quieres consolidar con tus otros dominios.
- **Google Workspace** o **Zoho** si quieres "más serio".

### 4.2 Apuntar `MX` en Nominalia DNS

Nominalia DNS → añadir los registros `MX` que te dé el proveedor del buzón (depende de cuál elijas).

### 4.3 Verificar que recibes

Enviar un correo de prueba a `hola@triaclaw.com` desde otra cuenta. Si llega, listo.

## 5. Cloudflare Turnstile (anti-spam)

### 5.1 Crear site

- Cuenta gratis en https://dash.cloudflare.com.
- Turnstile → Add Site → "TriaClaw".
- Domains: `triaclaw.com`, `www.triaclaw.com`.
- Widget Mode: **Managed** (recomendado).
- Copiar:
  - **Site Key** → Vercel env var `PUBLIC_TURNSTILE_SITE_KEY`.
  - **Secret Key** → Vercel env var `TURNSTILE_SECRET`.

### 5.2 Re-deploy

Tras meter las claves, re-deploy desde Vercel (Settings → Deployments → 3-dots del último → Redeploy) para que las env vars se apliquen.

## 6. Smoke test pre-go-live

Una vez todo arriba en `https://triaclaw.com`:

- [ ] Cargar `/`, `/centralita`, `/agents`, `/crm`, `/precios`, `/casos`, `/casos/ireparo`, `/sobre`, `/partners`, `/contacto`, `/legal/{aviso,privacidad,cookies}`.
- [ ] Mismo bajo `/ca/...` en català.
- [ ] Click toggle ES/CA en header → URL cambia, página persiste, copy traducido.
- [ ] Click WhatsApp button → abre `wa.me/34665954108?...`.
- [ ] Probar formulario en `/contacto`:
  - Sin Turnstile: botón disabled.
  - Con Turnstile resuelto + datos válidos: éxito + email recibido en `hola@triaclaw.com`.
  - Datos inválidos (email mal): error UX visible.
- [ ] Sitemap accesible: `https://triaclaw.com/sitemap-index.xml`.
- [ ] `robots.txt` accesible: `https://triaclaw.com/robots.txt`.
- [ ] Lighthouse mobile: Performance ≥ 95, A11y ≥ 95, SEO = 100.
- [ ] Verificar OG: pegar URL en https://www.opengraph.xyz/ y comprobar que muestra título + descripción + og-default.png.

## 7. Pre-go-live checklist (datos pendientes)

Antes de anunciar la web, rellenar:

- [ ] Razón social fiscal de iReparo en `apps/web/src/pages/legal/aviso.astro` y `privacidad.astro` (sustituir todos los `[PLACEHOLDER]`).
- [ ] Métricas reales del caso iReparo (ahora `-78% / +34% / 3 h/día` son orientativos).
- [ ] Testimonios validados con cada cliente (ahora son borrador).
- [ ] Logos cliente reales en `apps/web/public/logos/` (ahora son SVG con texto placeholder).
- [ ] Pasada de revisión CA con hablante nativo (ver `docs/ca-review-pending.md`).
- [ ] Buzón `hola@triaclaw.com` operativo y monitorizado.

## 8. Operación día a día

- **Cambiar copy** → editar archivo Astro o JSON i18n → push → Vercel desplegará.
- **Añadir caso** → crear `apps/web/src/content/cases/<slug>.md` con frontmatter + body → push.
- **Añadir testimonio** → editar `i18n/{es,ca}.json` clave `testimonials.*` → push.
- **Cambiar precios** → editar pillar pages o `precios.astro` → push.
- **Ver leads** → bandeja de `hola@triaclaw.com` (form) o WhatsApp 665 95 41 08.
- **Ver tráfico** → Vercel Analytics dashboard.

## 9. Coste estimado v1

| Servicio | Plan | €/mes |
|---|---|---|
| Vercel Hobby | gratis | 0 |
| Nominalia (renovación dominio anual) | ~12 €/año | ~1 |
| Buzón email (Hostinger / similar) | depende | 0–3 |
| Resend | gratis hasta 3k/mes | 0 |
| Turnstile | gratis | 0 |
| **Total** | | **~1–4 €/mes** |

Si pasas a Vercel Pro (analytics avanzado, password preview): +20€/mes.

## 10. Roadmap post-go-live

- Crear cuenta Cal.com → meter URL en `PUBLIC_CALENDLY_URL` → activa el botón "Reservar demo" automáticamente.
- Pasada de copy real con métricas reales del caso iReparo.
- Más casos extendidos (Falcon Cat, Ilercasa).
- Activar locale `en` cuando haya tráfico que lo justifique (i18n ya preparado).
- `apps/app` Next.js en `app.triaclaw.com` (área cliente, login, panel) — proyecto Vercel separado.
