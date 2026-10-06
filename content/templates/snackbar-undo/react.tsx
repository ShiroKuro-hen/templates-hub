import { useEffect, useState, type CSSProperties } from 'react';

type Item = { id: number; name: string; size: string };
const INITIAL: Item[] = [
  { id: 1, name: 'propuesta-v3.pdf', size: '2,4 MB' },
  { id: 2, name: 'logo-final.svg', size: '18 KB' },
  { id: 3, name: 'presupuesto-q4.xlsx', size: '96 KB' },
];
type Pending = { item: Item; index: number };

export function FileListUndo({ initial = INITIAL, ms = 6000 }: { initial?: Item[]; ms?: number }) {
  const [items, setItems] = useState(initial);
  const [pending, setPending] = useState<Pending | null>(null);
  const [left, setLeft] = useState(ms / 1000);

  useEffect(() => {
    if (!pending) return;
    setLeft(ms / 1000);
    const tick = setInterval(() => setLeft((s) => s - 1), 1000);
    const end = setTimeout(() => setPending(null), ms);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setPending(null);
    document.addEventListener('keydown', esc);
    return () => { clearInterval(tick); clearTimeout(end); document.removeEventListener('keydown', esc); };
  }, [pending, ms]);

  const remove = (item: Item) => {
    setPending({ item, index: items.indexOf(item) });
    setItems(items.filter((i) => i !== item));
  };
  const undo = () => {
    if (!pending) return;
    const next = [...items];
    next.splice(pending.index, 0, pending.item);
    setItems(next);
    setPending(null);
  };

  return (
    <>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            <span>{i.name}</span><small>{i.size}</small>
            <button type="button" className="del" onClick={() => remove(i)}>Eliminar</button>
          </li>
        ))}
      </ul>
      {items.length === 0 && !pending && <p className="empty">No quedan archivos. Sube uno nuevo para empezar.</p>}
      {pending && (
        <div className="snack" role="status" style={{ '--ms': `${ms}ms` } as CSSProperties}>
          <p>«{pending.item.name}» eliminado</p>
          <button type="button" autoFocus onClick={undo}>Deshacer ({left})</button>
        </div>
      )}
    </>
  );
}
// CSS: copia las reglas ul / li / .del / .empty / .snack / .snack p / .snack button / .snack::after y @keyframes up / drain de la pestaña HTML + CSS.
