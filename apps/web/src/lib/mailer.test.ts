import { describe, it, expect, vi } from 'vitest';

const sendMock = vi.fn().mockResolvedValue({ data: { id: 'msg_1' }, error: null });
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: sendMock } };
  }),
}));

import { sendContactEmail } from './mailer';

describe('sendContactEmail', () => {
  it('builds an email and calls Resend.send', async () => {
    sendMock.mockClear();
    const r = await sendContactEmail({
      apiKey: 'k',
      to: 'hola@triaclaw.com',
      input: {
        name: 'Edgar',
        email: 'e@e.com',
        company: 'iReparo',
        phone: '+34',
        pillar: 'centralita',
        message: 'Hola',
        consent: true,
        turnstileToken: 't',
        honeypot: '',
      },
    });
    expect(r.ok).toBe(true);
    expect(sendMock).toHaveBeenCalledOnce();
    const call = sendMock.mock.calls[0][0];
    expect(call.to).toEqual(['hola@triaclaw.com']);
    expect(call.from).toMatch(/triaclaw\.com/);
    expect(call.replyTo).toBe('e@e.com');
    expect(call.subject).toContain('centralita');
    expect(call.html).toContain('Edgar');
  });

  it('returns error when Resend fails', async () => {
    sendMock.mockClear();
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'boom' } });
    const r = await sendContactEmail({
      apiKey: 'k',
      to: 'hola@triaclaw.com',
      input: {
        name: 'X',
        email: 'x@x.com',
        company: '',
        phone: '',
        pillar: 'general',
        message: 'a'.repeat(15),
        consent: true,
        turnstileToken: 't',
        honeypot: '',
      },
    });
    expect(r.ok).toBe(false);
  });
});
