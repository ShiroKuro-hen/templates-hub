import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';

type Command = { id: string; label: string; group: string; shortcut?: string; run: () => void };
const norm = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

export function CommandPalette({ commands }: { commands: Command[] }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const matches = useMemo(() => commands.filter((c) => norm(c.label).includes(norm(query.trim()))), [commands, query]);
  const groups = [...new Set(matches.map((c) => c.group))];
  const results = groups.flatMap((g) => matches.filter((c) => c.group === g)); // mismo orden que en pantalla
  const current = results[active];

  const open = () => { setQuery(''); setActive(0); dlg.current?.showModal(); };
  const run = (c: Command) => { dlg.current?.close(); c.run(); };

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg.current?.open ? dlg.current.close() : open(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => { if (current) document.getElementById(current.id)?.scrollIntoView({ block: 'nearest' }); }, [current]);

  const onKeyDown = (e: KeyboardEvent) => {
    const n = results.length;
    if (!n) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((active + 1) % n); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((active - 1 + n) % n); }
    if (e.key === 'Enter' && current) { e.preventDefault(); run(current); }
  };

  return (
    <>
      <button type="button" className="trigger" aria-haspopup="dialog" onClick={open}>
        <span>Buscar comandos</span><kbd>Ctrl K</kbd>
      </button>
      <dialog ref={dlg} aria-label="Paleta de comandos" onClick={(e) => e.target === dlg.current && dlg.current.close()}>
        <div className="search">
          <input role="combobox" aria-expanded="true" aria-controls="list" aria-autocomplete="list" autoComplete="off"
                 aria-activedescendant={current?.id} placeholder="Escribe un comando o busca" value={query}
                 onChange={(e) => { setQuery(e.target.value); setActive(0); }} onKeyDown={onKeyDown} />
        </div>
        <ul className="list" id="list" role="listbox" aria-label="Comandos">
          {groups.map((g, i) => (
            <li role="presentation" key={g}>
              <div className="group-label" id={`g-${i}`}>{g}</div>
              <ul role="group" aria-labelledby={`g-${i}`}>
                {results.filter((c) => c.group === g).map((c) => (
                  <li key={c.id} id={c.id} role="option" aria-selected={c === current}
                      onClick={() => run(c)} onMouseMove={() => setActive(results.indexOf(c))}>
                    {c.label} {c.shortcut && <kbd>{c.shortcut}</kbd>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {!results.length && <p className="empty">Sin resultados para «<b>{query}</b>». Prueba con otra palabra.</p>}
        <div className="foot" aria-hidden="true"><span><kbd>↑</kbd> <kbd>↓</kbd> moverse</span><span><kbd>Enter</kbd> ejecutar</span><span><kbd>Esc</kbd> cerrar</span></div>
      </dialog>
    </>
  );
}

// CSS: copia las reglas kbd, .trigger, dialog, .search, .list, .group-label, [role=option], .empty y .foot de la pestaña HTML + CSS.
