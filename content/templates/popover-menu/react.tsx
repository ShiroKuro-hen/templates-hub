import { useId, useRef, useState, type KeyboardEvent } from 'react';

export type MenuAction = { label: string; danger?: boolean; onSelect: () => void };

export function PopoverMenu({ label, actions }: { label: string; actions: MenuAction[] }) {
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const items = () => [...(menu.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])];

  const onToggle = (e: React.SyntheticEvent<HTMLDivElement> & { nativeEvent: ToggleEvent }) => {
    const isOpen = e.nativeEvent.newState === 'open';
    setOpen(isOpen);
    if (!isOpen || !btn.current || !menu.current) return;
    const r = btn.current.getBoundingClientRect();
    menu.current.style.top = `${r.bottom + 6}px`;
    menu.current.style.left = `${r.left}px`;
    items()[0]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const l = items(), i = l.indexOf(document.activeElement as HTMLElement);
    const next = { ArrowDown: l[(i + 1) % l.length], ArrowUp: l[(i - 1 + l.length) % l.length], Home: l[0], End: l[l.length - 1] }[e.key];
    if (next) { e.preventDefault(); next.focus(); }
  };

  return (
    <>
      <button ref={btn} type="button" className="btn" popovertarget={id} aria-haspopup="menu" aria-expanded={open}>
        {label} ▾
      </button>
      <div ref={menu} id={id} popover="auto" role="menu" aria-label={label} onToggle={onToggle} onKeyDown={onKeyDown}>
        {actions.map((a) => (
          <button key={a.label} role="menuitem" className={a.danger ? 'danger' : undefined}
                  popovertarget={id} popovertargetaction="hide" onClick={a.onSelect}>
            {a.label}
          </button>
        ))}
      </div>
    </>
  );
}

// Requiere @types/react >= 19 (atributos popover). Uso: <PopoverMenu label="Opciones" actions={[{ label: 'Duplicar', onSelect }]} />
// CSS: copia los tokens :root y las reglas .btn / [popover] / [role="menuitem"] / .danger de la pestaña HTML + CSS.
