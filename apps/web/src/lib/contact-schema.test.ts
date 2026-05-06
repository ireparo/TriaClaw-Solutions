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
