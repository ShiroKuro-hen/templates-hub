import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

type Props = { label: string; options: string[]; value: string; onChange: (v: string) => void; hint?: string };

export function DropdownSelect({ label, options, value, onChange, hint }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(Math.max(0, options.indexOf(value)));
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const move = (i: number) => setActive(Math.max(0, Math.min(options.length - 1, i)));
  const choose = (i: number) => { onChange(options[i]); setActive(i); setOpen(false); };

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const k = e.key;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(k)) { e.preventDefault(); setOpen(true); }
      return;
    }
    const moves: Record<string, number> = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: options.length - 1 };
    if (k in moves) { e.preventDefault(); move(moves[k]); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); choose(active); }
    else if (k === 'Escape') setOpen(false);
    else if (k === 'Tab') choose(active);
    else if (k.length === 1) {
      for (let s = 1; s <= options.length; s++) {
        const j = (active + s) % options.length;
        if (options[j].toLowerCase().startsWith(k.toLowerCase())) { move(j); break; }
      }
    }
  }

  return (
    <div className="field">
      <label id={`${id}-l`}>{label}</label>
      <div className="select">
        <div className="combo" role="combobox" tabIndex={0} aria-labelledby={`${id}-l`} aria-haspopup="listbox"
             aria-controls={`${id}-lb`} aria-expanded={open} aria-describedby={hint ? `${id}-h` : undefined}
             aria-activedescendant={open ? `${id}-o${active}` : undefined}
             onKeyDown={onKeyDown} onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}>
          <span>{value}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </div>
        <ul ref={listRef} className="list" id={`${id}-lb`} role="listbox" aria-labelledby={`${id}-l`} tabIndex={-1}
            hidden={!open} onMouseDown={(e) => e.preventDefault()}>
          {options.map((o, i) => (
            <li key={o} id={`${id}-o${i}`} role="option" aria-selected={o === value}
                className={i === active ? 'active' : undefined} onClick={() => choose(i)}>{o}</li>
          ))}
        </ul>
      </div>
      {hint && <p className="hint" id={`${id}-h`}>{hint}</p>}
    </div>
  );
}

// CSS: copia las reglas .field, label, .select, .combo, .list, [role=option] y .hint de la pestaña HTML + CSS.
