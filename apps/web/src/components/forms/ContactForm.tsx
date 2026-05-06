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

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    'border-radius': '12px',
    padding: '12px 14px',
    'font-size': '14px',
    color: 'var(--ink)',
    'font-family': 'var(--font-sans)',
    outline: 'none',
  };
  const labelStyle = {
    display: 'block',
    'font-size': '11px',
    'text-transform': 'uppercase',
    'letter-spacing': '0.12em',
    color: 'var(--dim)',
    'font-weight': '600',
    'margin-bottom': '6px',
    'font-family': 'var(--font-mono)',
  };

  return (
    <Show
      when={status() !== 'ok'}
      fallback={
        <div
          class="rounded-lg p-4 text-[14px]"
          style={{
            background: 'rgba(34,211,238,0.1)',
            border: '1px solid rgba(34,211,238,0.4)',
            color: 'var(--soft-cyan)',
          }}
        >
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
          <span style={labelStyle}>Nombre*</span>
          <input style={inputStyle} name="name" required />
        </label>
        <label class="block">
          <span style={labelStyle}>Email*</span>
          <input style={inputStyle} type="email" name="email" required />
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label class="block">
            <span style={labelStyle}>Empresa</span>
            <input style={inputStyle} name="company" />
          </label>
          <label class="block">
            <span style={labelStyle}>Teléfono</span>
            <input style={inputStyle} name="phone" />
          </label>
        </div>
        <label class="block">
          <span style={labelStyle}>Sobre qué quieres hablar</span>
          <select style={inputStyle} name="pillar">
            <option value="general">No estoy seguro</option>
            <option value="centralita">Centralita</option>
            <option value="agents">Agents & Bots</option>
            <option value="crm">CRM</option>
            <option value="partner">Programa partner</option>
          </select>
        </label>
        <label class="block">
          <span style={labelStyle}>Mensaje*</span>
          <textarea style={inputStyle} name="message" rows={4} required></textarea>
        </label>
        <label
          class="flex items-start gap-2 text-[13px]"
          style={{ color: 'var(--muted)' }}
        >
          <input type="checkbox" name="consent" required class="mt-1" />
          <span>
            He leído la{' '}
            <a
              href="/legal/privacidad"
              style={{ color: 'var(--neon-cyan)', 'text-decoration': 'underline' }}
            >
              política de privacidad
            </a>{' '}
            y acepto el tratamiento de mis datos para recibir respuesta.
          </span>
        </label>
        <div id="cf-turnstile"></div>
        <button
          type="submit"
          disabled={status() === 'loading' || !token()}
          class="w-full font-semibold rounded-xl py-3 disabled:opacity-50 transition"
          style={{
            background: 'var(--grad-button)',
            color: '#0b0a1f',
            'font-size': '15px',
            'box-shadow': '0 0 30px -8px rgba(34,211,238,0.5)',
          }}
        >
          {status() === 'loading' ? 'Enviando…' : 'Enviar'}
        </button>
        <Show when={status() === 'error'}>
          <p class="text-sm" style={{ color: '#fb7185' }}>
            No se pudo enviar ({errorMsg()}). Prueba por WhatsApp o email.
          </p>
        </Show>
      </form>
    </Show>
  );
}
