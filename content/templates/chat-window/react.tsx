import { useEffect, useRef, useState, type FormEvent } from 'react';

type Msg = { from: 'me' | 'them'; text: string; time: string };
const DATA: Msg[] = [
  { from: 'them', text: 'Hola, ya subí el informe de incidencias de septiembre.', time: '09:41' },
  { from: 'them', text: '¿Puedes revisar la sección de tiempos de respuesta antes del comité?', time: '09:41' },
  { from: 'me', text: 'Claro, lo reviso esta mañana.', time: '09:44' },
  { from: 'them', text: 'Gracias. El comité empieza a las 12:00.', time: '09:45' },
];

export function ChatWindow({ contact = 'Lucía Ortega', initials = 'LO' }: { contact?: string; initials?: string }) {
  const [msgs, setMsgs] = useState<Msg[]>(DATA);
  const [text, setText] = useState('');
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [msgs]);

  // Agrupa mensajes seguidos del mismo remitente
  const groups = msgs.reduce<Msg[][]>((acc, m) => {
    const last = acc[acc.length - 1];
    if (last && last[0].from === m.from) last.push(m); else acc.push([m]);
    return acc;
  }, []);

  const send = (e?: FormEvent) => {
    e?.preventDefault();
    const v = text.trim(); if (!v) return;
    const time = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    setMsgs((m) => [...m, { from: 'me', text: v, time }]);
    setText('');
  };

  return (
    <section className="chat" aria-label={`Chat con ${contact}`}>
      <header className="head">
        <span className="av" aria-hidden="true">{initials}</span>
        <div><strong>{contact}</strong><small><i className="dot" />En línea</small></div>
      </header>
      <div className="log" ref={log} role="log" aria-live="polite" tabIndex={0}>
        <p className="day">Hoy</p>
        {groups.map((g, i) => (
          <div key={i} className={`group ${g[0].from}`}>
            {g[0].from === 'them' && <span className="av sm" aria-hidden="true">{initials}</span>}
            <div className="stack">
              {g.map((m, j) => <p key={j} className="msg">{m.text}</p>)}
              <time>{g[g.length - 1].time}</time>
            </div>
          </div>
        ))}
      </div>
      <form className="compose" onSubmit={send}>
        <label className="sr" htmlFor="txt">Mensaje para {contact}</label>
        <textarea id="txt" rows={1} placeholder="Escribe un mensaje" aria-describedby="hint" value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button type="submit">Enviar</button>
      </form>
      <p className="hint" id="hint">Enter envía. Mayús + Enter añade una línea.</p>
    </section>
  );
}

// CSS: copia las reglas .chat, .head, .av, .log, .group, .msg, .compose y .hint de la pestaña HTML + CSS.
