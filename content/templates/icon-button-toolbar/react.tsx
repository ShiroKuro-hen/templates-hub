import { useRef, useState, type KeyboardEvent } from 'react';

type Tool = { id: string; label: string; d: string };

const TOOLS: Tool[] = [
  { id: 'b', label: 'Negrita', d: 'M7 4h6a4 4 0 0 1 0 8H7zM7 12h7a4 4 0 0 1 0 8H7z' },
  { id: 'i', label: 'Cursiva', d: 'M10 4h8M6 20h8M15 4l-6 16' },
  { id: 'u', label: 'Subrayado', d: 'M7 4v7a5 5 0 0 0 10 0V4M5 21h14' },
  { id: 'c', label: 'Código', d: 'M8 7l-5 5 5 5M16 7l5 5-5 5' },
  { id: 'l', label: 'Enlace', d: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1' },
];

export function IconToolbar({ tools = TOOLS, onChange }: { tools?: Tool[]; onChange?: (active: string[]) => void }) {
  const [active, setActive] = useState<string[]>([]);
  const [focus, setFocus] = useState(0); // tabindex itinerante
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (id: string) => {
    const next = active.includes(id) ? active.filter((a) => a !== id) : [...active, id];
    setActive(next);
    onChange?.(next);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const n = tools.length;
    const to = { ArrowRight: focus + 1, ArrowLeft: focus - 1, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    const i = (to + n) % n;
    setFocus(i);
    refs.current[i]?.focus();
  };

  return (
    <div role="toolbar" aria-label="Formato de texto" className="toolbar" onKeyDown={onKeyDown}>
      {tools.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => { refs.current[i] = el; }}
          type="button"
          aria-label={t.label}
          data-tip={t.label}
          aria-pressed={active.includes(t.id)}
          tabIndex={i === focus ? 0 : -1}
          onClick={() => { setFocus(i); toggle(t.id); }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={t.d} /></svg>
        </button>
      ))}
    </div>
  );
}
// CSS: copia las reglas [role=toolbar] / button / button[aria-pressed=true] / button::after (tooltip) / svg de la pestaña HTML + CSS.
