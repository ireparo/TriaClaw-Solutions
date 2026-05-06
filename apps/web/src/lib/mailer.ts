import { Resend } from 'resend';
import type { ContactInput } from './contact-schema';

interface Args {
  apiKey: string;
  to: string;
  input: ContactInput;
}

export async function sendContactEmail({
  apiKey,
  to,
  input,
}: Args): Promise<{ ok: boolean; error?: string }> {
  const resend = new Resend(apiKey);
  const subject = `Lead web · ${input.pillar} · ${input.name}`;
  const html = `
<h2>Nuevo lead desde triaclaw.com</h2>
<table cellpadding="6">
  <tr><td><b>Nombre</b></td><td>${escapeHtml(input.name)}</td></tr>
  <tr><td><b>Email</b></td><td>${escapeHtml(input.email)}</td></tr>
  <tr><td><b>Empresa</b></td><td>${escapeHtml(input.company || '—')}</td></tr>
  <tr><td><b>Teléfono</b></td><td>${escapeHtml(input.phone || '—')}</td></tr>
  <tr><td><b>Pilar</b></td><td>${escapeHtml(input.pillar)}</td></tr>
</table>
<h3>Mensaje</h3>
<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(input.message)}</pre>
`;
  const { error } = await resend.emails.send({
    from: 'TriaClaw <noreply@triaclaw.com>',
    to: [to],
    replyTo: input.email,
    subject,
    html,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}
