# Català review — pending native pass

> **Status:** Initial CA translation written by a non-native speaker. Functional and grammatically reasonable but needs a real català speaker to polish before go-live. Listed below are the spots flagged as low-confidence during translation. Anything else native review catches is also welcome.

## Where to find the strings

- Dictionary: `apps/web/src/i18n/ca.json` (most copy used by section components).
- Pillar pages CA: `apps/web/src/pages/ca/{centralita,agents,crm}.astro` (inline features + plans).
- Secondary pages CA: `apps/web/src/pages/ca/{precios,sobre,partners,contacto}.astro`.
- Legal CA: `apps/web/src/pages/ca/legal/{aviso,privacidad,cookies}.astro`.
- Cases markdown stays in ES for now (out of scope of Sprint H).

## Specific items flagged for review

1. **`pillars.lead`** — "Comença per un. Combina els tres i rebaixa un 15%…" — *"rebaixa un 15%" sounds Spanish-y. Native may prefer "rebaixa'l un 15%" or "amb un 15% de descompte".*
2. **`connected.lead`** — "sense que se't refredi cap lead" works but reads awkward; *"sense que cap lead se't refredi" might be more natural word order.*
3. **`case_featured.body`** — *"L'equip deixa de fer de centraleta" — same idiom as ES; not 100% sure it's idiomatic CA.*
4. **`pricing_teaser.note` + PillarPlans note** — translated "Setup" as "Posada en marxa" everywhere; *might be too literal — natives often keep "setup" as anglicism in startup CA copy.*
5. **`testimonials.quote2`** — "Hem passat de tenir tasques disperses en mil fulls d'Excel" — *"fulls d'Excel" vs "fulls de càlcul".*
6. **`cta_final.title_l1`** — "Llest perquè la teva pime…" — *"Llest" is masculine; for inclusive copy native might prefer "A punt perquè…" or rephrase entirely.*
7. **`hero.title` / `hero.subtitle`** — already "Tria el teu agent" / "Centralita…" from prior commits (this is the brand wordmark, intentional).
8. **`ca/centralita.astro` features** — "Encamina a l'extensió correcta" — *"encaminar" works but native may prefer "deriva" / "passa".*
9. **`ca/centralita.astro` lead** — used `Acomiada't` for "Despídete"; *might read formal/literary.*
10. **`ca/crm.astro` lead** — "Aquí entres, l'obres i ja sap com treballes" — *direct from ES, sounds slightly Spanish-cadenced.*
11. **Legal pages** — translated literally with idiom adjustments, but legal CA tends to follow specific Generalitat templates; *native lawyer review recommended* (already flagged in original ES with `[PLACEHOLDER]` markers for fiscal data).
12. **`partners.astro` benefit titles** — "White-label opcional" anglicism kept; *native may translate to "marca blanca".*

## Suggested workflow for the reviewer

1. Open the live preview at `pnpm dev` (or Vercel preview) and navigate `/ca/`, `/ca/centralita`, `/ca/agents`, `/ca/crm`, `/ca/precios`, `/ca/sobre`, `/ca/partners`, `/ca/casos`, `/ca/legal/aviso`, etc.
2. Note any awkward phrasing.
3. For dictionary keys (`ca.json`), edit the JSON directly.
4. For inline page strings (e.g., pillar features in `ca/centralita.astro`), edit the `.astro` files directly.
5. Run `corepack pnpm --filter web test` after changes — should still be 28/28.
6. Commit with message `i18n(ca): native review pass`.
