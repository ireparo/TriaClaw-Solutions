import es from './es.json';
import ca from './ca.json';

export type Locale = 'es' | 'ca';
export const locales: Locale[] = ['es', 'ca'];
export const defaultLocale: Locale = 'es';

const dictionaries: Record<Locale, unknown> = { es, ca };

function resolve(locale: Locale, key: string): unknown {
  const parts = key.split('.');
  let cur: unknown = dictionaries[locale];
  for (const p of parts) {
    if (typeof cur !== 'object' || cur === null || !(p in cur)) return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

export function t(locale: Locale, key: string): string {
  const cur = resolve(locale, key);
  return typeof cur === 'string' ? cur : key;
}

export function tList(locale: Locale, key: string): string[] {
  const cur = resolve(locale, key);
  if (Array.isArray(cur) && cur.every((v) => typeof v === 'string')) {
    return cur as string[];
  }
  return [];
}

export function getLocaleFromUrl(url: URL): Locale {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return seg === 'ca' ? 'ca' : 'es';
}

export function localizedHref(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  // Strip any pre-existing locale prefix so we never double-prefix
  const stripped = clean.replace(/^\/(es|ca)(?=\/|$)/, '') || '/';
  return locale === 'es' ? stripped : `/ca${stripped === '/' ? '' : stripped}`;
}
