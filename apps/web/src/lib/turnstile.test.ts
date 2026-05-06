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
