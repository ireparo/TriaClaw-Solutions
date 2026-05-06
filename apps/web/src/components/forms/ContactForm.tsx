import { createSignal, onMount, Show } from 'solid-js';

declare global {
  interface Window {
    turnstile?: {
      render: (sel: string, opts: { sitekey: string; callback: (token: string) => void }) => string;
    };
  }
}

interface Props {
  siteKey: string;
}

export default function ContactForm(props: Props) {
  const [token, setToken] = createSignal('');
  const [status, setStatus] = createSignal<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = createSignal('');

  onMount(() => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    s.defer = true;
    s.onload = () => {
      window.turnstile?.render('#cf-turnstile', { sitekey: props.siteKey, callback: setToken });
    };
    document.head.appendChild(s);
  });

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      company: String(fd.get('company') || ''),
      phone: String(fd.get('phone') || ''),
      pillar: String(fd.get('pillar') || 'general'),
      message: String(fd.get('message') || ''),
      consent: fd.get('consent') === 'on',
      turnstileToken: token(),
      honeypot: String(fd.get('website') || ''),
    };
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        setStatus('ok');
        form.reset();
      } else {
        const body = await r.json().catch(() => ({}));
        setStatus('error');
        setErrorMsg(body.code || 'request_failed');
      }
    } catch {
      setStatus('error');
      setErrorMsg('network');
    }
  }

  const inputBase =
    'w-full bg-white border border-line rounded-lg px-3.5 py-2.5 text-sm focus:border-cyan-brand outline-none';
  const labelBase = 'block text-[13px] font-semibold text-navy mb-1.5';

  return (
    <Show
      when={status() !== 'ok'}
      fallback={
        <div class="bg-cyan-brand/10 border border-cyan-brand text-navy rounded-lg p-4 text-[14px]">
          ¡Recibido! Te contestamos en menos de 24 h laborables.
        </div>
      }
    >
      <form onSubmit={onSubmit} class="space-y-4" novalidate>
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autocomplete="off"
          class="hidden"
          aria-hidden="true"
        />
        <label class="block">
          <span class={labelBase}>Nombre*</span>
          <input class={inputBase} name="name" required />
        </label>
        <label class="block">
          <span class={labelBase}>Email*</span>
          <input class={inputBase} type="email" name="email" required />
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label class="block">
            <span class={labelBase}>Empresa</span>
            <input class={inputBase} name="company" />
          </label>
          <label class="block">
            <span class={labelBase}>Teléfono</span>
            <input class={inputBase} name="phone" />
          </label>
        </div>
        <label class="block">
          <span class={labelBase}>Sobre qué quieres hablar</span>
          <select class={inputBase} name="pillar">
            <option value="general">No estoy seguro</option>
            <option value="centralita">Centralita</option>
            <option value="agents">Agents & Bots</option>
            <option value="crm">CRM</option>
            <option value="partner">Programa partner</option>
          </select>
        </label>
        <label class="block">
          <span class={labelBase}>Mensaje*</span>
          <textarea class={inputBase} name="message" rows={4} required></textarea>
        </label>
        <label class="flex items-start gap-2 text-[13px] text-muted">
          <input type="checkbox" name="consent" required class="mt-1" />
          <span>
            He leído la{' '}
            <a class="text-navy underline" href="/legal/privacidad">
              política de privacidad
            </a>{' '}
            y acepto el tratamiento de mis datos para recibir respuesta.
          </span>
        </label>
        <div id="cf-turnstile"></div>
        <button
          type="submit"
          disabled={status() === 'loading' || !token()}
          class="w-full bg-navy text-white font-semibold rounded-lg py-3 disabled:opacity-50"
        >
          {status() === 'loading' ? 'Enviando…' : 'Enviar'}
        </button>
        <Show when={status() === 'error'}>
          <p class="text-sm text-red-600">
            No se pudo enviar ({errorMsg()}). Prueba por WhatsApp o email.
          </p>
        </Show>
      </form>
    </Show>
  );
}
