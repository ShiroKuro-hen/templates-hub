import { useState, type FormEvent } from 'react';

type C = { id: number; author: string; time: string; text: string; own?: boolean; replies: C[] };
const DATA: C[] = [
  { id: 1, author: 'Irene Molina', time: 'hace 2 h', own: true, replies: [
    { id: 2, author: 'Javier Ramos', time: 'hace 1 h', replies: [],
      text: 'Lo reviso hoy. ¿Mantenemos el límite de 5.000 mensajes por segundo?' },
  ], text: 'Subí la versión 2 del documento de arquitectura. Necesito revisión del apartado de colas antes del jueves.' },
];
const ini = (n: string) => n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const count = (l: C[]): number => l.reduce((s, c) => s + 1 + count(c.replies), 0);
const patch = (l: C[], id: number, fn: (c: C) => C): C[] =>
  l.map((c) => (c.id === id ? fn(c) : { ...c, replies: patch(c.replies, id, fn) }));

type EP = { label: string; value?: string; cta: string; focus?: boolean; onOk: (v: string) => void; onClose: () => void };
function Editor({ label, value = '', cta, focus = true, onOk, onClose }: EP) {
  const [v, setV] = useState(value);
  const submit = (e: FormEvent) => { e.preventDefault(); if (v.trim()) { onOk(v.trim()); onClose(); } };
  return (
    <form className="ed" onSubmit={submit} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <label className="sr">{label}</label>
      <textarea rows={2} value={v} onChange={(e) => setV(e.target.value)} autoFocus={focus} required />
      <div className="row"><button className="pri">{cta}</button><button type="button" onClick={onClose}>Cancelar</button></div>
    </form>
  );
}

function Comment({ c, edit, reply }: { c: C; edit: (id: number, t: string) => void; reply: (id: number, t: string) => void }) {
  const [mode, setMode] = useState<'' | 'reply' | 'edit'>('');
  return (
    <li className="c">
      <article className="item">
        <span className="av" aria-hidden="true">{ini(c.author)}</span>
        <div className="body">
          <header><strong>{c.author}</strong><time>{c.time}</time></header>
          {mode === 'edit'
            ? <Editor label="Editar comentario" value={c.text} cta="Guardar cambios" onOk={(t) => edit(c.id, t)} onClose={() => setMode('')} />
            : <p className="txt">{c.text}</p>}
          <div className="acts">
            <button type="button" onClick={() => setMode('reply')}>Responder</button>
            {c.own && <button type="button" onClick={() => setMode('edit')}>Editar</button>}
          </div>
        </div>
      </article>
      {mode === 'reply' && <Editor label={`Responder a ${c.author}`} cta="Responder" onOk={(t) => reply(c.id, t)} onClose={() => setMode('')} />}
      <ul className="replies">
        {c.replies.map((r) => <Comment key={r.id} c={r} edit={edit} reply={reply} />)}
      </ul>
    </li>
  );
}

export function CommentThread() {
  const [list, setList] = useState<C[]>(DATA);
  const [next, setNext] = useState(10);
  const mk = (text: string): C => ({ id: next, author: 'Tú', time: 'ahora', text, own: true, replies: [] });
  const reply = (id: number, t: string) => { setList(patch(list, id, (c) => ({ ...c, replies: [...c.replies, mk(t)] }))); setNext(next + 1); };
  const edit = (id: number, t: string) => setList(patch(list, id, (c) => ({ ...c, text: t })));
  return (
    <section className="th" aria-labelledby="h">
      <h2 id="h">Comentarios <span>({count(list)})</span></h2>
      <ul>{list.map((c) => <Comment key={c.id} c={c} edit={edit} reply={reply} />)}</ul>
      <div className="new">
        <Editor key={next} focus={false} label="Nuevo comentario" cta="Comentar" onClose={() => {}} onOk={(t) => { setList([...list, mk(t)]); setNext(next + 1); }} />
      </div>
    </section>
  );
}

// CSS: copia las reglas .th, .item, .av, .body, .replies, .acts, .ed y button de la pestaña HTML + CSS.
