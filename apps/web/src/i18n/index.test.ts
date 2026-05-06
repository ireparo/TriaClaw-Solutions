import { describe, it, expect } from 'vitest';
import { t, tList, getLocaleFromUrl, localizedHref } from './index';

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

  it('resolves deep nested keys via t()', () => {
    expect(t('es', 'hero.cta_whatsapp')).toBe('Hablar por WhatsApp');
    expect(t('ca', 'hero.cta_whatsapp')).toBe('Parla per WhatsApp');
  });

  describe('tList()', () => {
    it('returns the array when leaf is an array of strings', () => {
      expect(tList('es', 'hero.meta')).toEqual([
        'Sin permanencia',
        'Setup en 7 días',
        'RGPD-compliant',
      ]);
    });

    it('returns [] when key is missing', () => {
      expect(tList('es', 'does.not.exist')).toEqual([]);
    });

    it('returns [] when leaf is a string (wrong type)', () => {
      expect(tList('es', 'nav.centralita')).toEqual([]);
    });
  });

  describe('localizedHref()', () => {
    it("returns path unchanged for 'es' locale", () => {
      expect(localizedHref('es', '/centralita')).toBe('/centralita');
    });

    it("prefixes with /ca for 'ca' locale", () => {
      expect(localizedHref('ca', '/centralita')).toBe('/ca/centralita');
    });

    it("returns /ca for 'ca' locale at root", () => {
      expect(localizedHref('ca', '/')).toBe('/ca');
    });

    it("normalizes already-prefixed /ca path for 'ca' locale", () => {
      expect(localizedHref('ca', '/ca/centralita')).toBe('/ca/centralita');
    });

    it("strips /ca prefix for 'es' locale", () => {
      expect(localizedHref('es', '/ca/centralita')).toBe('/centralita');
    });
  });

  describe('getLocaleFromUrl() guards', () => {
    it("treats /ca with no trailing slash as 'ca'", () => {
      expect(getLocaleFromUrl(new URL('https://triaclaw.com/ca'))).toBe('ca');
    });

    it('does not false-positive on /cat/foo (different prefix)', () => {
      expect(getLocaleFromUrl(new URL('https://triaclaw.com/cat/foo'))).toBe('es');
    });
  });
});
