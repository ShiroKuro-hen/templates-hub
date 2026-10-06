import { useRef, useState } from 'react';

type Rx = { e: string; n: number; me: boolean };
const EMOJIS = ['👍', '❤️', '🎉', '🚀', '👀', '✅', '😄', '🙌'];
const DATA: Rx[] = [{ e: '👍', n: 12, me: true }, { e: '🎉', n: 7, me: false }, { e: '🚀', n: 3, me: false }];

export function ReactionsBar({ author = 'Marina Quiroga', time = '10:32' }: { author?: string; time?: string }) {
  const [rx, setRx] = useState<Rx[]>(DATA);
  const [status, setStatus] = useState('');
  const add = useRef<HTMLDetailsElement>(null);

  const toggle = (e: string) => {
    const cur = rx.find((r) => r.e === e) ?? { e, n: 0, me: false };
    const next = { ...cur, me: !cur.me, n: cur.n + (cur.me ? -1 : 1) };
    setStatus(`Reacción ${e} ${next.me ? 'añadida' : 'quitada'}`);
    setRx(rx.some((r) => r.e === e)
      ? rx.map((r) => (r.e === e ? next : r)).filter((r) => r.n > 0)
      : [...rx, next]);
  };

  return (
    <article className="msg">
      <span className="av" aria-hidden="true">{author.split(' ').map((w) => w[0]).join('')}</span>
      <div className="body">
        <header><strong>{author}</strong><time>{time}</time></header>
        <p>Lanzamos la versión 3.2 con las correcciones de accesibilidad. Gracias a todo el equipo.</p>
        <div className="bar" role="group" aria-label="Reacciones al mensaje">
          {rx.map((r) => (
            <button key={r.e} type="button" aria-pressed={r.me}
              aria-label={`${r.e}, ${r.n} ${r.n === 1 ? 'reacción' : 'reacciones'}`} onClick={() => toggle(r.e)}>
              <span aria-hidden="true">{r.e}</span><b aria-hidden="true">{r.n}</b>
            </button>
          ))}
          <details ref={add} onKeyDown={(e) => { if (e.key === 'Escape') add.current!.open = false; }}>
            <summary aria-label="Añadir reacción">+</summary>
            <div className="pick" role="group" aria-label="Elegir emoji">
              {EMOJIS.map((e) => (
                <button key={e} type="button" aria-label={`Reaccionar con ${e}`}
                  onClick={() => { toggle(e); add.current!.open = false; }}>{e}</button>
              ))}
            </div>
          </details>
        </div>
        <p className="sr" role="status">{status}</p>
      </div>
    </article>
  );
}

// CSS: copia las reglas .msg, .av, .bar, summary, details y .pick de la pestaña HTML + CSS.
