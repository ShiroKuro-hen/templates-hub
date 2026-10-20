import { KeyboardEvent, useLayoutEffect, useRef, useState } from 'react';

type Item = { id: string; name: string };
type Target = { id: string; dir: 'up' | 'down' };

const ITEMS: Item[] = [
  { id: 'pagos', name: 'Incidencia en pagos' },
  { id: 'tls', name: 'Renovar certificado TLS' },
  { id: 'accesos', name: 'Revisar accesos de proveedores' },
  { id: 'bd', name: 'Migrar base de datos de clientes' },
  { id: 'informe', name: 'Preparar informe mensual' },
];

export function ReorderListFlip() {
  const [items, setItems] = useState(ITEMS);
  const [manual, setManual] = useState<Item[] | null>(null);
  const [live, setLive] = useState('');
  const stage = useRef<HTMLElement>(null);
  const rows = useRef(new Map<string, HTMLLIElement>());
  const tops = useRef(new Map<string, number>());
  const focusNext = useRef<Target | null>(null);

  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const css = getComputedStyle(el);
    const duration = parseFloat(css.getPropertyValue('--dur')) * 1000;
    const easing = css.getPropertyValue('--ease');
    for (const [id, row] of rows.current) {
      const prev = tops.current.get(id);
      const dy = prev === undefined ? 0 : prev - row.getBoundingClientRect().top;
      if (dy) row.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration, easing });
    }
    const target = focusNext.current;
    if (target) {
      rows.current.get(target.id)?.querySelector<HTMLButtonElement>(`[data-dir=${target.dir}]`)?.focus();
      focusNext.current = null;
    }
  }, [items]);

  function remember() {
    tops.current = new Map([...rows.current].map(([id, row]) => [id, row.getBoundingClientRect().top]));
  }

  function move(id: string, delta: number) {
    const from = items.findIndex((it) => it.id === id), to = from + delta;
    const name = items[from].name;
    if (to < 0 || to >= items.length) {
      setLive(`${name} ya está ${delta < 0 ? 'al principio' : 'al final'} de la lista.`);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    remember();
    focusNext.current = { id, dir: delta < 0 ? 'up' : 'down' };
    setItems(next);
    setLive(`${name}: posición ${to + 1} de ${items.length}.`);
  }

  function toggleSort() {
    remember();
    if (manual) {
      setItems(manual);
      setManual(null);
      setLive('Orden de prioridad restaurado.');
    } else {
      setManual(items);
      setItems([...items].sort((a, b) => a.name.localeCompare(b.name, 'es')));
      setLive('Lista ordenada de la A a la Z.');
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLLIElement>, id: string) {
    const delta = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
    if (!e.altKey || delta === 0) return;
    e.preventDefault();
    move(id, delta);
  }

  return (
    <section className="stage" ref={stage} aria-labelledby="ttl">
      <div className="head">
        <div>
          <h1 id="ttl">Prioridades del sprint</h1>
          <p className="lead">Usa Subir y Bajar, o Alt + flechas sobre una fila.</p>
        </div>
        <button type="button" className="sort" aria-pressed={manual !== null} onClick={toggleSort}>Ordenar A–Z</button>
      </div>
      <ol className="list">
        {items.map((it, k) => (
          <li
            key={it.id}
            ref={(el) => {
              if (el) rows.current.set(it.id, el);
              else rows.current.delete(it.id);
            }}
            className="row"
            tabIndex={0}
            onKeyDown={(e) => onKeyDown(e, it.id)}
          >
            <span className="pos">{k + 1}</span>
            <span className="name">{it.name}</span>
            <span className="acts">
              <button type="button" className="mv" data-dir="up" aria-label={`Subir: ${it.name}`} onClick={() => move(it.id, -1)}>Subir</button>
              <button type="button" className="mv" data-dir="down" aria-label={`Bajar: ${it.name}`} onClick={() => move(it.id, 1)}>Bajar</button>
            </span>
          </li>
        ))}
      </ol>
      <p className="live" aria-live="polite">{live}</p>
    </section>
  );
}
