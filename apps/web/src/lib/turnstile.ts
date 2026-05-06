const ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const res = await fetch(ENDPOINT, { method: 'POST', body });
    const data = (await res.json()) as { success: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}
