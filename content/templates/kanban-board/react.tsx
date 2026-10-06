import { useEffect, useRef, useState } from 'react';

type Card = { id: number; t: string; tag: string; c: number };
const COLS = ['Por hacer', 'En curso', 'Hecho'];
const DATA: Card[] = [
  { id: 1, t: 'Revisar contrato de Atlas', tag: 'Legal', c: 0 },
  { id: 2, t: 'Corregir error de login', tag: 'Bug', c: 0 },
  { id: 3, t: 'Diseñar panel de informes', tag: 'Diseño', c: 1 },
  { id: 4, t: 'Migrar base de datos', tag: 'Infra', c: 2 },
];
const Icon = ({ d }: { d: string }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
);

export function KanbanBoard({ initial = DATA }: { initial?: Card[] }) {
  const [cards, setCards] = useState(initial);
  const [msg, setMsg] = useState('');
  const [moved, setMoved] = useState<{ id: number; d: number } | null>(null);
  const board = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moved || !board.current) return;
    const q = (s: string) => board.current!.querySelector<HTMLButtonElement>(s);
    (q(`[data-id="${moved.id}"][data-d="${moved.d}"]:not(:disabled)`) ?? q(`[data-id="${moved.id}"]:not(:disabled)`))?.focus();
  }, [moved, cards]);

  const move = (k: Card, d: number) => {
    setCards(cards.map((x) => (x.id === k.id ? { ...x, c: x.c + d } : x)));
    setMsg(`${k.t} movida a ${COLS[k.c + d]}.`);
    setMoved({ id: k.id, d });
  };

  return (
    <>
      <div className="board" ref={board}>
        {COLS.map((name, i) => {
          const list = cards.filter((k) => k.c === i);
          return (
            <section key={name} className="col" data-i={i} aria-labelledby={`h${i}`}>
              <h2 id={`h${i}`}>{name}<span className="n" aria-label={`${list.length} tarjetas`}>{list.length}</span></h2>
              <ul>
                {list.length === 0 && <li className="empty">Sin tarjetas. Mueve una aquí.</li>}
                {list.map((k) => (
                  <li key={k.id} className="card">
                    <p>{k.t}</p>
                    <div className="row">
                      <span className={k.tag === 'Bug' ? 'tag bug' : 'tag'}>{k.tag}</span>
                      <button type="button" data-id={k.id} data-d={-1} disabled={i === 0}
                        aria-label={`Mover ${k.t} a ${COLS[i - 1] ?? ''}`} onClick={() => move(k, -1)}><Icon d="M10 3 5 8l5 5" /></button>
                      <button type="button" data-id={k.id} data-d={1} disabled={i === COLS.length - 1}
                        aria-label={`Mover ${k.t} a ${COLS[i + 1] ?? ''}`} onClick={() => move(k, 1)}><Icon d="M6 3l5 5-5 5" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <p className="sr" role="status">{msg}</p>
    </>
  );
}

// CSS: copia las reglas .board, .col, .n, ul, .card, .row, .tag, .empty y .sr de la pestaña HTML + CSS.
