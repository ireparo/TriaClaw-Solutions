import { createSignal, For } from 'solid-js';

interface QA {
  q: string;
  a: string;
}
interface Props {
  items: QA[];
}

export default function Faq(props: Props) {
  const [open, setOpen] = createSignal<number | null>(0);
  return (
    <div
      class="glass max-w-[640px]"
      style={{
        'border-radius': 'var(--r-lg)',
        overflow: 'hidden',
      }}
    >
      <For each={props.items}>
        {(item, i) => {
          const isOpen = () => open() === i();
          return (
            <div
              style={{
                'border-top': i() === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <button
                type="button"
                class="w-full flex items-center justify-between px-6 py-5 text-left transition"
                style={{
                  background: isOpen() ? 'rgba(167,139,250,0.06)' : 'transparent',
                  cursor: 'pointer',
                }}
                aria-expanded={isOpen()}
                aria-controls={`faq-panel-${i()}`}
                onClick={() => setOpen(isOpen() ? null : i())}
              >
                <span
                  class="font-semibold text-[14px]"
                  style={{ color: 'var(--ink)' }}
                >
                  {item.q}
                </span>
                <span
                  class="text-lg"
                  style={{
                    color: isOpen() ? 'var(--neon-cyan)' : 'var(--dim)',
                    'font-family': 'var(--font-mono)',
                  }}
                >
                  {isOpen() ? '−' : '+'}
                </span>
              </button>
              <div
                id={`faq-panel-${i()}`}
                hidden={!isOpen()}
                class="px-6 pb-5 text-[13.5px] leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                {item.a}
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}
