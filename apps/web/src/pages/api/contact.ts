import type { APIRoute } from 'astro';
import { contactSchema } from '../../lib/contact-schema';
import { verifyTurnstile } from '../../lib/turnstile';
import { sendContactEmail } from '../../lib/mailer';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError(400, 'invalid_json');
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(400, 'invalid_input', parsed.error.issues);
  }
  const data = parsed.data;

  const turnstileSecret = import.meta.env.TURNSTILE_SECRET;
  if (!turnstileSecret) return jsonError(500, 'config_missing');
  const turnstileOk = await verifyTurnstile(
    turnstileSecret,
    data.turnstileToken,
    clientAddress ?? '',
  );
  if (!turnstileOk) return jsonError(400, 'turnstile_failed');

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_EMAIL_TO;
  if (!apiKey || !to) return jsonError(500, 'config_missing');

  const result = await sendContactEmail({ apiKey, to, input: data });
  if (!result.ok) return jsonError(502, 'mailer_failed');

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

function jsonError(status: number, code: string, details?: unknown) {
  return new Response(JSON.stringify({ ok: false, code, details }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
