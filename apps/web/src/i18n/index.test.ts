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
