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
    <div class="border border-line rounded-2xl bg-white max-w-[640px]">
      <For each={props.items}>
        {(item, i) => {
          const isOpen = () => open() === i();
          return (
            <div class={i() === 0 ? '' : 'border-t border-line'}>
              <button
                type="button"
                class="w-full flex items-center justify-between px-6 py-5 text-left"
                aria-expanded={isOpen()}
                aria-controls={`faq-panel-${i()}`}
                onClick={() => setOpen(isOpen() ? null : i())}
              >
                <span class="font-semibold text-navy text-[14px]">{item.q}</span>
                <span class="text-muted text-lg">{isOpen() ? '−' : '+'}</span>
              </button>
              <div
                id={`faq-panel-${i()}`}
                hidden={!isOpen()}
                class="px-6 pb-5 text-[13.5px] text-muted leading-relaxed"
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
