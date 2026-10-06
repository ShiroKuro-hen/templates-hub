import { useEffect, useRef, useState, type FormEvent } from 'react';

type Status = 'sent' | 'delivered' | 'read';
type Msg = { id: number; me: boolean; text: string; status?: Status };
const LABEL: Record<Status, string> = { sent: 'Enviado', delivered: 'Entregado', read: 'Leído' };
const REPLIES = ['Recibido, gracias.', 'Perfecto, lo reviso ahora.', 'Listo, te confirmo en unos minutos.'];

function Check({ s }: { s: Status }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d={s === 'sent' ? 'M3 8.5l3.5 3.5L13 5' : 'M1 8.5l3.5 3.5L11 5M7.5 11.5l.5.5L15 5'} />
    </svg>
  );
}

export function TypingIndicator() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 1, me: false, text: '¿Pudiste revisar el informe de septiembre?' },
    { id: 2, me: true, text: 'Sí, te lo devuelvo con comentarios hoy.', status: 'read' },
  ]);
  const [typers, setTypers] = useState(0);
  const [text, setText] = useState('');
  const log = useRef<HTMLOListElement>(null);
  const id = useRef(10);

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [msgs, typers]);

  const setStatus = (mid: number, status: Status) => setMsgs((l) => l.map((m) => (m.id === mid ? { ...m, status } : m)));

  const send = (e: FormEvent) => {
    e.preventDefault();
    const v = text.trim(); if (!v) return;
    const mid = id.current++;
    setMsgs((l) => [...l, { id: mid, me: true, text: v, status: 'sent' }]); setText('');
    setTimeout(() => setStatus(mid, 'delivered'), 900);
    setTimeout(() => { setStatus(mid, 'read'); setTypers((t) => t + 1); }, 1900);
    setTimeout(() => {
      setTypers((t) => t - 1);
      setMsgs((l) => [...l, { id: id.current++, me: false, text: REPLIES[mid % REPLIES.length] }]);
    }, 4200);
  };

  return (
    <section className="chat" aria-label="Conversación con Lucía Ortega">
      <ol className="log" ref={log} role="log" aria-live="polite" tabIndex={0}>
        {msgs.map((m) => (
          <li key={m.id} className={m.me ? 'me' : undefined}>
            <p>{m.text}</p>
            {m.status && <span className="st" data-s={m.status}><Check s={m.status} />{LABEL[m.status]}</span>}
          </li>
        ))}
        <li className="typing" hidden={typers === 0}>
          <p className="dots" aria-hidden="true"><i /><i /><i /></p>
          <span className="sr" role="status">{typers > 0 ? 'Lucía está escribiendo' : ''}</span>
        </li>
      </ol>
      <form onSubmit={send}>
        <label className="sr" htmlFor="m">Mensaje</label>
        <input id="m" autoComplete="off" placeholder="Escribe un mensaje" value={text} onChange={(e) => setText(e.target.value)} required />
        <button type="submit">Enviar</button>
      </form>
    </section>
  );
}

// CSS: copia las reglas .chat, .log, .st, .typing, .dots y @keyframes b de la pestaña HTML + CSS.
