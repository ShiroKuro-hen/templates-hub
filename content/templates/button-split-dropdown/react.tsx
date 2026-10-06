import { useRef, useState, type KeyboardEvent } from 'react';

type Option = { label: string; hint: string };

// Requiere React 19 (atributos nativos popover / popoverTarget).
export function SplitButton({ options, onAction }: { options: Option[]; onAction?: (label: string) => void }) {
  const [label, setLabel] = useState(options[0].label);
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const items = () => [...(menu.current?.querySelectorAll('button') ?? [])];

  function place() {
    const r = wrap.current!.getBoundingClientRect();
    Object.assign(menu.current!.style, { left: `${r.left}px`, top: `${r.bottom + 10}px` });
  }
  function onKey(e: KeyboardEvent) {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLButtonElement);
    const to = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: list.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    list[(to + list.length) % list.length].focus();
  }
  function pick(o: Option) {
    setLabel(o.label);
    menu.current?.hidePopover();
    onAction?.(o.label);
  }

  return (
    <>
      <div className="split" ref={wrap}>
        <button type="button" id="main" onClick={() => onAction?.(label)}>{label}</button>
        <button type="button" id="caret" popoverTarget="menu" aria-haspopup="menu" aria-expanded={open}
                aria-label="Más opciones de publicación" onClick={place}>▾</button>
      </div>
      <div id="menu" popover="auto" role="menu" ref={menu} onKeyDown={onKey}
           onToggle={(e) => {
             const o = (e.nativeEvent as ToggleEvent).newState === 'open';
             setOpen(o);
             if (o) items()[0]?.focus();
           }}>
        {options.map((o) => (
          <button key={o.label} role="menuitem" onClick={() => pick(o)}>
            {o.label}<small>{o.hint}</small>
          </button>
        ))}
      </div>
    </>
  );
}
// CSS: copia las reglas .split / #main / #caret / #menu de la pestaña HTML + CSS.
