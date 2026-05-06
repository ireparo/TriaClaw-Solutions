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
