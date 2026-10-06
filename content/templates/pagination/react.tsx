import { useState } from 'react';

type Props = { total?: number; perPage?: number; count?: number; initial?: number; onChange?: (page: number) => void };

function pageList(p: number, total: number): (number | '…')[] {
  const nums = [...new Set([1, p - 1, p, p + 1, total])].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  let last = 0;
  for (const n of nums) {
    if (n - last === 2) out.push(last + 1);
    else if (n - last > 2) out.push('…');
    out.push(n);
    last = n;
  }
  return out;
}

export function Pagination({ total = 12, perPage = 10, count = 120, initial = 4, onChange }: Props) {
  const [page, setPage] = useState(initial);
  const go = (p: number) => {
    const n = Math.min(total, Math.max(1, p));
    setPage(n);
    onChange?.(n);
  };

  return (
    <>
      <p className="status" aria-live="polite">
        Mostrando {(page - 1) * perPage + 1}–{Math.min(page * perPage, count)} de {count} resultados
      </p>
      <nav className="pager" aria-label="Paginación">
        <button className="pg" type="button" aria-label="Página anterior" aria-disabled={page === 1} onClick={() => go(page - 1)}>
          ← <span className="txt">Anterior</span>
        </button>
        <ul>
          {pageList(page, total).map((n, i) =>
            n === '…' ? (
              <li key={`gap-${i}`} className="gap" aria-hidden="true">…</li>
            ) : (
              <li key={n}>
                <button className="pg" type="button" aria-label={`Página ${n}`} aria-current={n === page ? 'page' : undefined} onClick={() => go(n)}>
                  {n}
                </button>
              </li>
            ),
          )}
        </ul>
        <button className="pg" type="button" aria-label="Página siguiente" aria-disabled={page === total} onClick={() => go(page + 1)}>
          <span className="txt">Siguiente</span> →
        </button>
      </nav>
    </>
  );
}
// CSS: copia las reglas .status / .pager / .pg / .gap / .txt (y su @media max-width:520px) de la pestaña HTML + CSS.
// Nota: al pulsar un número se re-renderiza la lista; si quieres conservar el foco usa key estable por página (ya lo hace aquí).
